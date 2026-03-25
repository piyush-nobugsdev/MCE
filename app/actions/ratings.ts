'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function rateUser(
  applicationId: string,
  rating: number,
  tags: string[],       // multi-select tags e.g. ['Reliable', 'Fair pay']
  comment: string,      // free-text comment
  type: 'farmer_to_worker' | 'worker_to_farmer'
) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // 1. Fetch application to get job_id and parties
  const { data: application, error: appError } = await supabase
    .from('applications')
    .select(`
      id,
      job_id,
      worker_id,
      status,
      farmer_rated_worker,
      worker_rated_farmer,
      jobs!inner ( farmer_id )
    `)
    .eq('id', applicationId)
    .maybeSingle()

  if (appError) return { error: appError.message }
  if (!application) return { error: 'Application not found' }

  // Gate: both sides must have confirmed completion in the system
  if (application.status !== 'completed') {
    return { error: 'Job must be fully marked as completed by both farmer and worker before leaving a review' }
  }

  const job = Array.isArray(application.jobs) ? application.jobs[0] : application.jobs
  if (!job) return { error: 'Job not found' }

  // Prevent double-rating
  if (type === 'farmer_to_worker' && application.farmer_rated_worker) {
    return { error: 'Worker already rated' }
  }
  if (type === 'worker_to_farmer' && application.worker_rated_farmer) {
    return { error: 'Farmer already rated' }
  }

  // Resolve ratee identity (the user_id associated with the worker or farmer record)
  let rateeId: string
  if (type === 'farmer_to_worker') {
    const { data: worker } = await supabase.from('workers').select('user_id').eq('id', application.worker_id).maybeSingle()
    if (!worker) return { error: 'Worker not found' }
    rateeId = worker.user_id
  } else {
    const { data: farmer } = await supabase.from('farmers').select('user_id').eq('id', job.farmer_id).maybeSingle()
    if (!farmer) return { error: 'Farmer not found' }
    rateeId = farmer.user_id
  }

  // Prevent self-rating
  if (user.id === rateeId) return { error: 'Cannot rate yourself' }

  // 2. Insert into the improved 'reviews' table
  // Replaced JSON serialization with proper column insertion
  const { error: ratingError } = await supabase
    .from('reviews')
    .insert({
      job_id: application.job_id,
      reviewer_id: user.id,
      reviewee_id: rateeId,
      rating: Number(rating),
      comment,
      tags,
      type,
    })

  if (ratingError) return { error: ratingError.message }

  // 3. Mark the application as rated on the caller's side
  const updateData = type === 'farmer_to_worker'
    ? { farmer_rated_worker: true }
    : { worker_rated_farmer: true }

  await supabase.from('applications').update(updateData).eq('id', applicationId)

  // 4. Update the aggregate rating manually (as a fallback for triggers)
  const { data: allReviews } = await supabase
    .from('reviews')
    .select('rating')
    .eq('reviewee_id', rateeId)
    .eq('type', type)

  if (allReviews && allReviews.length > 0) {
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
    const rounded = Math.round(avgRating * 10) / 10 // Round to 1 decimal place

    if (type === 'farmer_to_worker') {
      await supabase.from('workers').update({ rating: rounded }).eq('user_id', rateeId)
    } else {
      await supabase.from('farmers').update({ rating: rounded }).eq('user_id', rateeId)
    }
  }

  revalidatePath('/farmer/applications')
  revalidatePath('/farmer/dashboard')
  revalidatePath('/worker/applications')
  revalidatePath('/worker/dashboard')
  revalidatePath(`/worker/jobs/${application.job_id}`)
  return { success: true }
}

/** Fetches reviews received by a user (the ratee) */
export async function getReceivedReviews(userId: string, type: 'farmer_to_worker' | 'worker_to_farmer') {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      id, rating, comment, tags, created_at,
      reviewer:reviewer_id (
        first_name:profiles!profiles_user_id_fkey(first_name)
      )
    `)
    .eq('reviewee_id', userId)
    .eq('type', type)
    .order('created_at', { ascending: false })

  if (error) return { error: error.message }
  return { reviews: data }
}

/** Fetch rating summary: { average: 4.6, count: 18 } */
export async function getRatingSummary(userId: string, type: 'farmer_to_worker' | 'worker_to_farmer') {
  const supabase = await createClient()
  const { data, count, error } = await supabase
    .from('reviews')
    .select('rating', { count: 'exact' })
    .eq('reviewee_id', userId)
    .eq('type', type)

  if (error) return { error: error.message }

  const total = data?.length || 0
  if (total === 0) return { average: 0, count: 0 }

  const avg = data!.reduce((sum, r) => sum + r.rating, 0) / total
  return { average: Math.round(avg * 10) / 10, count: count || total }
}
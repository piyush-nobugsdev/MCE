'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function rateUser(
  applicationId: string,
  rating: number,
  feedback: string,
  type: 'farmer_to_worker' | 'worker_to_farmer'
) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

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

  const job = Array.isArray(application.jobs) ? application.jobs[0] : application.jobs
  if (!job) return { error: 'Job not found' }

  // Check haven't already rated
  if (type === 'farmer_to_worker' && application.farmer_rated_worker) {
    return { error: 'Worker already rated' }
  }
  if (type === 'worker_to_farmer' && application.worker_rated_farmer) {
    return { error: 'Farmer already rated' }
  }

  const raterId = user.id
  let rateeId;
  
  if (type === 'farmer_to_worker') {
    const { data: worker } = await supabase.from('workers').select('user_id').eq('id', application.worker_id).maybeSingle()
    if (!worker) return { error: 'Worker not found' }
    rateeId = worker.user_id
  } else {
    const { data: farmer } = await supabase.from('farmers').select('user_id').eq('id', job.farmer_id).maybeSingle()
    if (!farmer) return { error: 'Farmer not found' }
    rateeId = farmer.user_id
  }

  const { error: ratingError } = await supabase
    .from('ratings')
    .insert({
      rater_id: raterId,
      ratee_id: rateeId,
      rating: Number(rating),
      feedback,
      type
    })

  if (ratingError) return { error: ratingError.message }

  const updateData = type === 'farmer_to_worker' 
    ? { farmer_rated_worker: true }
    : { worker_rated_farmer: true }

  await supabase
    .from('applications')
    .update(updateData)
    .eq('id', applicationId)

  revalidatePath('/farmer/applications')
  revalidatePath('/worker/applications')
  return { success: true }
}
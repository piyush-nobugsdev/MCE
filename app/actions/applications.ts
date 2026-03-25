'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Haversine formula to calculate distance between two points
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

export async function getFarmerApplications() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: farmer } = await supabase
    .from('farmers')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!farmer) return { error: 'Farmer profile not found' }

  const { data, error } = await supabase
    .from('applications')
    .select(`
      id, status, applied_at, worker_code, farmer_rated_worker,
      jobs!inner(id, title, location, status),
      workers!inner(rating, total_jobs_completed, skills, home_location, first_name, last_name)
    `)
    .eq('jobs.farmer_id', farmer.id)
    .order('applied_at', { ascending: false })

  if (error) return { error: error.message }

  // Calculate distances and format data
  const applications = data.map((app: any) => {
    let distance = null
    if (app.jobs.location && app.workers.home_location) {
      const jobLat = app.jobs.location.lat || app.jobs.location.latitude
      const jobLng = app.jobs.location.lng || app.jobs.location.longitude
      const workerLat = app.workers.home_location.lat
      const workerLng = app.workers.home_location.lng

      if (jobLat && jobLng && workerLat && workerLng) {
        distance = calculateDistance(jobLat, jobLng, workerLat, workerLng)
      }
    }

    return {
      id: app.id,
      status: app.status,
      applied_at: app.applied_at,
      worker_code: app.worker_code,
      worker_first_name: app.workers.first_name,
      worker_last_name: app.workers.last_name || '',
      job_title: app.jobs.title,
      job_status: app.jobs.status,
      worker_rating: app.workers.rating,
      worker_completed_jobs: app.workers.total_jobs_completed,
      worker_skills: app.workers.skills,
      distance: distance ? Math.round(distance * 10) / 10 : null, // Round to 1 decimal
      farmer_rated_worker: app.farmer_rated_worker
    }
  })

  return { applications }
}

export async function getWorkerApplications() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: worker } = await supabase
    .from('workers')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!worker) return { error: 'Worker profile not found' }

  const { data, error } = await supabase
    .from('applications')
    .select(`
      id, status, applied_at, worker_rated_farmer,
      jobs!inner(id, title, location, status, farmer_code, wage_amount, farmers(first_name, village))
    `)
    .eq('worker_id', worker.id)
    .order('applied_at', { ascending: false })

  if (error) return { error: error.message }

  const applications = data.map((app: any) => ({
    id: app.id,
    status: app.status,
    applied_at: app.applied_at,
    worker_rated_farmer: app.worker_rated_farmer,
    job_id: app.jobs.id,
    job_title: app.jobs.title,
    job_location: app.jobs.location,
    job_wage: app.jobs.wage_amount,
    job_status: app.jobs.status,
    farmer_code: app.jobs.farmer_code,
    farmer_first_name: app.jobs.farmers?.first_name ?? '',
    farmer_farm_name: app.jobs.farmers?.village ?? '',
  }))

  return { applications }
}

export async function updateApplicationStatus(applicationId: string, status: 'accepted' | 'rejected') {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // Get the application to verify ownership
  const { data: application } = await supabase
    .from('applications')
    .select('job_id, jobs!inner(farmer_id)')
    .eq('id', applicationId)
    .maybeSingle()

  if (!application) return { error: 'Application not found' }

  // Verify the farmer owns this job
  const { data: farmer } = await supabase
    .from('farmers')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle()

  const job = Array.isArray(application.jobs) ? application.jobs[0] : application.jobs;

  if (!farmer || !job || job.farmer_id !== farmer.id) {
    return { error: 'Unauthorized' }
  }

  // Update application status
  const { error: updateError } = await supabase
    .from('applications')
    .update({ status })
    .eq('id', applicationId)

  if (updateError) return { error: updateError.message }

  // If accepting, check if job is now full and close it
  if (status === 'accepted') {
      const { data: jobData } = await supabase
        .from('jobs')
        .select('id, workers_needed')
        .eq('id', application.job_id)
        .maybeSingle()

      if (jobData) {
        const { count: acceptedCount } = await supabase
          .from('applications')
          .select('*', { count: 'exact', head: true })
          .eq('job_id', jobData.id)
          .eq('status', 'accepted')

      if (acceptedCount !== null && acceptedCount >= jobData.workers_needed) {
        await supabase
          .from('jobs')
          .update({ status: 'closed' })
          .eq('id', jobData.id)
      }
    }
  }

  revalidatePath('/farmer/applications')
  revalidatePath('/worker/applications')
  return { success: true }
}
'use server'

import { createClient } from '@/lib/supabase/server'

// Haversine formula to calculate distance between two coordinates in km
function getDistanceKm(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) *
    Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export async function getWorkerWithJobs(filters?: {
  category?: string
  max_distance?: number
  min_wage?: number
  wage_type?: string
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // Get worker profile with location
  const { data: worker, error: workerError } = await supabase
    .from('workers')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (workerError || !worker) return { error: 'Worker profile not found' }

  // Get all open jobs with farmer info
  let query = supabase
    .from('jobs')
    .select(`
      *,
      farmers (
        id,
        full_name,
        village,
        district,
        state,
        rating
      ),
      applications (count)
    `)
    .eq('status', 'open')
    .order('created_at', { ascending: false })

  if (filters?.category) {
    query = query.eq('category', filters.category)
  }
  if (filters?.wage_type) {
    query = query.eq('wage_type', filters.wage_type)
  }
  if (filters?.min_wage) {
    query = query.gte('wage_amount', filters.min_wage)
  }

  const { data: jobs, error: jobsError } = await query

  if (jobsError) return { error: jobsError.message }

  // Get worker's applied job ids
  const { data: applications } = await supabase
    .from('applications')
    .select('job_id')
    .eq('worker_id', worker.id)

  const appliedJobIds = new Set(applications?.map((a) => a.job_id) || [])

  // Calculate distance for each job and attach
  const workerLat = worker.home_location?.lat ?? 0
  const workerLng = worker.home_location?.lng ?? 0

  const jobsWithDistance = jobs
    ?.map((job) => {
      const jobLat = job.location?.lat ?? 0
      const jobLng = job.location?.lng ?? 0
      const distance_km = getDistanceKm(workerLat, workerLng, jobLat, jobLng)

      return {
        ...job,
        distance_km: Math.round(distance_km * 10) / 10,
        has_applied: appliedJobIds.has(job.id),
      }
    })
    .filter((job) => {
      if (filters?.max_distance && filters.max_distance > 0) {
        return job.distance_km <= filters.max_distance
      }
      return true
    })
    .sort((a, b) => a.distance_km - b.distance_km) // nearest first

  return { worker, jobs: jobsWithDistance ?? [] }
}

export async function getWorkerApplications() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: worker } = await supabase
    .from('workers')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!worker) return { error: 'Worker profile not found' }

  const { data, error } = await supabase
    .from('applications')
    .select(`
      *,
      jobs (
        id,
        title,
        category,
        wage_amount,
        wage_type,
        date_range,
        location,
        farmers (
          full_name,
          village,
          rating
        )
      )
    `)
    .eq('worker_id', worker.id)
    .order('applied_at', { ascending: false })

  if (error) return { error: error.message }

  return { applications: data }
}
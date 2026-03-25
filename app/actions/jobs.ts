'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createJob(data: {
  title: string
  description: string
  location_name: string
  latitude: string | number
  longitude: string | number
  category: string
  workers_needed: string | number
  wage_amount: string | number
  wage_type: string
  start_date: string
  end_date: string
  start_time?: string
  end_time?: string
  is_negotiable?: boolean
  meals_provided?: boolean
  transport_provided?: boolean
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: farmer, error: farmerError } = await supabase
    .from('farmers')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!farmer) return { error: 'Farmer profile not found' }

  // Generate farmer code for attendance
  const farmer_code = Math.random().toString(36).substring(2, 8).toUpperCase()

const { data: job, error } = await supabase
  .from('jobs')
  .insert({
    farmer_id: farmer.id,
    title: data.title,
    description: data.description,
    category: data.category,
    workers_needed: Number(data.workers_needed),  // force parse
    wage_amount: Number(data.wage_amount),         // same issue here
    wage_type: data.wage_type,
    is_negotiable: data.is_negotiable ?? false,
    meals_provided: data.meals_provided ?? false,
    transport_provided: data.transport_provided ?? false,
    start_time: data.start_time ?? null,
    end_time: data.end_time ?? null,
    location: {
      lat: Number(data.latitude),
      lng: Number(data.longitude),
      name: data.location_name,
    },
    date_range: {
      start_date: data.start_date,
      end_date: data.end_date,
    },
    farmer_code,
    status: 'open',
  })
    .select()
    .single()


  if (error) return { error: error.message }

  revalidatePath('/farmer/dashboard')
  redirect('/farmer/dashboard')
}

export async function getJobs(filters?: {
  category?: string
  status?: string
}) {
  const supabase = await createClient()

  let query = supabase.from('jobs').select(`
    *,
    farmers (
      id,
      full_name,
      village,
      district,
      state,
      rating
    )
  `)

  if (filters?.category) {
    query = query.eq('category', filters.category)
  }
  if (filters?.status) {
    query = query.eq('status', filters.status)
  }

  const { data, error } = await query.order('created_at', { ascending: false })


  if (error) return { error: error.message }

  return { jobs: data }
}

export async function getFarmerJobs() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: farmer } = await supabase
    .from('farmers')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!farmer) return { error: 'Farmer profile not found' }

  const { data, error } = await supabase
    .from('jobs')
    .select(`
      *,
      applications (count)
    `)
    .eq('farmer_id', farmer.id)
    .order('created_at', { ascending: false })

  if (error) return { error: error.message }

  return { jobs: data }
}

export async function applyToJob(jobId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: worker } = await supabase
    .from('workers')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!worker) return { error: 'Worker profile not found' }

  // Generate unique worker code for anonymous attendance
  const worker_code = 'WRK-' + Math.random().toString(36).substring(2, 6).toUpperCase()

  const { data: application, error } = await supabase
    .from('applications')  // fixed: was job_applications
    .insert({
      job_id: jobId,
      worker_id: worker.id,
      worker_code,
      status: 'pending',
    })
    .select()
    .single()


  if (error) return { error: error.message }

  revalidatePath('/worker/applications')
  return { application }
}

export async function updateJobStatus(
  jobId: string,
  status: 'open' | 'in_progress' | 'completed' | 'cancelled'
) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('jobs')
    .update({ status })
    .eq('id', jobId)

  if (error) return { error: error.message }

  revalidatePath('/farmer/dashboard')
  return { success: true }
}
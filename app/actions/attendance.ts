'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function recordAttendance(data: {
  job_id: string
  application_id: string
  attendance_confirmed_worker?: boolean
  attendance_confirmed_farmer?: boolean
}) {
  const supabase = await createClient()

  const { data: attendance, error } = await supabase
    .from('attendance')
    .insert({
      ...data,
      confirmed_at: data.attendance_confirmed_worker && data.attendance_confirmed_farmer ? new Date().toISOString() : null
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/farmer/dashboard')
  revalidatePath('/worker/dashboard')
  return { attendance }
}

export async function confirmAttendance(attendanceId: string, role: 'farmer' | 'worker') {
  const supabase = await createClient()

  const update: any = {}
  if (role === 'farmer') update.attendance_confirmed_farmer = true
  else update.attendance_confirmed_worker = true

  // If both are confirmed, set confirmed_at
  const { data: current } = await supabase.from('attendance').select('*').eq('id', attendanceId).single()
  
  if (current) {
    const willBeConfirmed = (role === 'farmer' && current.attendance_confirmed_worker) || 
                          (role === 'worker' && current.attendance_confirmed_farmer)
    if (willBeConfirmed) update.confirmed_at = new Date().toISOString()
  }

  const { error } = await supabase
    .from('attendance')
    .update(update)
    .eq('id', attendanceId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/farmer/dashboard')
  revalidatePath('/worker/dashboard')
  return { success: true }
}

export async function getAttendance(jobId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('attendance')
    .select('*')
    .eq('job_id', jobId)
    .order('created_at', { ascending: false })

  if (error) {
    return { error: error.message }
  }

  return { attendance: data }
}

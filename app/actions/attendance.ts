'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function recordAttendance(data: {
  job_id: string
  worker_id: string
  date: string
  hours_worked: number
}) {
  const supabase = await createClient()

  const { data: attendance, error } = await supabase
    .from('attendance')
    .insert(data)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/farmer/dashboard')
  return { attendance }
}

export async function confirmAttendance(attendanceId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('attendance')
    .update({ confirmed_by_farmer: true })
    .eq('id', attendanceId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/farmer/dashboard')
  return { success: true }
}

export async function getAttendance(jobId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('attendance')
    .select('*')
    .eq('job_id', jobId)
    .order('date', { ascending: false })

  if (error) {
    return { error: error.message }
  }

  return { attendance: data }
}

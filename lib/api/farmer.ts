import { createClient } from '@/lib/supabase/client'
import { Farmer, Job } from '@/lib/types'

export async function getFarmerProfile(userId: string): Promise<Farmer | null> {
  const supabase = createClient()
  const { data } = await supabase
    .from('farmers')
    .select('*')
    .eq('user_id', userId)
    .single()
  return data
}

export async function getFarmerJobs(farmerId: string): Promise<Job[]> {
  const supabase = createClient()
  const { data } = await supabase
    .from('jobs')
    .select('*')
    .eq('farmer_id', farmerId)
    .order('created_at', { ascending: false })
  return data || []
}

export async function findFarmerByUserId(userId: string): Promise<Farmer | null> {
    const supabase = createClient()
    const { data } = await supabase
      .from('farmers')
      .select('*')
      .eq('user_id', userId)
      .single()
    return data
}

export async function getFarmerFarms(farmerId: string) {
  const supabase = createClient()
  const { data } = await supabase
    .from('farms')
    .select('*')
    .eq('farmer_id', farmerId)
    .order('created_at', { ascending: false })
  return data || []
}

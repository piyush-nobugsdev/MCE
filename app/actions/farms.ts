'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createFarm(data: {
  farm_nickname: string
  area_name: string
  district: string
  state: string
  specific_directions: string
  latitude: number
  longitude: number
  is_current_location: boolean
  address: string
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: farmer } = await supabase
    .from('farmers')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!farmer) return { error: 'Farmer profile not found' }

  const { data: farm, error } = await supabase
    .from('farms')
    .insert({
      farmer_id: farmer.id,
      nickname: data.farm_nickname,
      area_name: data.area_name,
      district: data.district,
      state: data.state,
      specific_directions: data.specific_directions,
      location: {
        lat: data.latitude,
        lng: data.longitude,
        address: data.address,
      },
      is_current_location: data.is_current_location,
    })
    .select()
    .single()

  if (error) return { error: error.message }

  revalidatePath('/farmer/dashboard')
  return { farm }
}

export async function getFarms() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: farmer } = await supabase
    .from('farmers')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!farmer) return { error: 'Farmer profile not found' }

  const { data: farms, error } = await supabase
    .from('farms')
    .select('*')
    .eq('farmer_id', farmer.id)
    .order('created_at', { ascending: false })

  if (error) return { error: error.message }

  return { farms }
}

'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function signUpWithPhone(phone: string) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithOtp({
    phone,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function verifyOtp(phone: string, token: string) {
  const supabase = await createClient()

  const { error } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: 'sms',
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  return { success: true }
}
export async function signUpAsRole(
  role: 'farmer' | 'worker',
  data: Record<string, string>
) {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Support both firstName+lastName and legacy name field
  const full_name = data.firstName && data.lastName
    ? `${data.firstName.trim()} ${data.lastName.trim()}`
    : data.name ?? ''

  const { error: userError } = await supabase.from('users').upsert({
    id: user.id,
    auth_provider: user.app_metadata?.provider ?? 'phone',
    phone: data.mobile ?? user.phone ?? null,
  })

  if (userError) {
    return { error: userError.message }
  }

  if (role === 'farmer') {
    const { error } = await supabase.from('farmers').upsert({
      user_id: user.id,
      first_name: data.firstName?.trim() ?? full_name.split(' ')[0],
      last_name:  (data.lastName?.trim() ?? full_name.split(' ').slice(1).join(' ')) || '',
      village: data.village,
      district: data.district,
      state: data.state,
      farm_location: {
        lat: parseFloat(data.latitude),
        lng: parseFloat(data.longitude),
      },
    }, { onConflict: 'user_id' })

    if (error) {
      return { error: error.message }
    }

  } else {
    const { error } = await supabase.from('workers').upsert({
      user_id: user.id,
      first_name: data.firstName?.trim() ?? full_name.split(' ')[0],
      last_name:  (data.lastName?.trim() ?? full_name.split(' ').slice(1).join(' ')) || '',
      village: data.village,
      district: data.district,
      state: data.state,
      home_location: {
        lat: parseFloat(data.latitude),
        lng: parseFloat(data.longitude),
      },
      age: data.age ? parseInt(data.age) : null,
      experience: data.experience ? parseInt(data.experience) : null,
      skills: data.skills?.split(',').map((s) => s.trim()).filter(Boolean) ?? [],
      travel_distance_preference: parseInt(data.travel_distance ?? '10'),
    }, { onConflict: 'user_id' })

    if (error) {
      return { error: error.message }
    }
  }

  revalidatePath('/', 'layout')
  redirect(role === 'farmer' ? '/farmer/dashboard' : '/worker/dashboard')
}
export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}
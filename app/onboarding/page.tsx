import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import OnboardingClient from './_components/OnboardingClient'

export default async function OnboardingPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()

  console.log('onboarding page user:', user?.id)

  // If no session at all, send back to auth
  if (!user) {
    redirect('/auth/role-selection')
  }

  // If they already have a profile, send to dashboard
  const { data: farmer } = await supabase
    .from('farmers')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (farmer) redirect('/farmer/dashboard')

  const { data: worker } = await supabase
    .from('workers')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (worker) redirect('/worker/dashboard')

  // Has session, no profile yet — show onboarding form
  return <OnboardingClient />
}
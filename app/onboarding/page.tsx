import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import OnboardingClient from './_components/OnboardingClient'

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: { role?: string }
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  console.log('onboarding page user:', user?.id)

  // If no session at all, send back to auth
  if (!user) {
    redirect('/auth/role-selection')
  }

  // If they already have a profile, send to the correct dashboard
  const { data: farmer } = await supabase
    .from('farmers')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle()
  if (farmer) redirect('/farmer/dashboard')

  const { data: worker } = await supabase
    .from('workers')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle()
  if (worker) redirect('/worker/dashboard')

  // Has session, no profile yet — pass role hint to the client so it can
  // redirect to the correct signup form (query param takes priority over
  // whatever was stored in localStorage, which OnboardingClient handles).
  return <OnboardingClient initialRole={searchParams.role} />
}
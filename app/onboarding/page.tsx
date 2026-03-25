import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import OnboardingClient from './_components/OnboardingClient'

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>
}) {
  const { role } = await searchParams

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  console.log('onboarding page user:', user?.id)

  if (!user) {
    redirect('/auth/role-selection')
  }

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

  return <OnboardingClient initialRole={role} />
}
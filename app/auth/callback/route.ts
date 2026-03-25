import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(`${origin}/auth/role-selection?error=no_code`)
  }

  const supabase = await createClient()

  // Exchange OAuth code for session
  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

  if (exchangeError) {
    console.error('Exchange error:', exchangeError)
    return NextResponse.redirect(`${origin}/auth/role-selection?error=exchange_failed`)
  }

  // Get logged in user
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    return NextResponse.redirect(`${origin}/auth/role-selection?error=no_user`)
  }

  // Check if user row exists
  const { data: userRow } = await supabase
    .from('users')
    .select('id')
    .eq('id', user.id)
    .single()

  if (!userRow) {
    // Brand new user — send to onboarding
    return NextResponse.redirect(`${origin}/onboarding`)
  }

  // User row exists — check if they completed farmer or worker profile
  const { data: farmer } = await supabase
    .from('farmers')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (farmer) {
    return NextResponse.redirect(`${origin}/dashboard/farmer`)
  }

  const { data: worker } = await supabase
    .from('workers')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (worker) {
    return NextResponse.redirect(`${origin}/dashboard/worker`)
  }

  // User row exists but no farmer/worker profile yet
  // They got interrupted during onboarding
  return NextResponse.redirect(`${origin}/onboarding`)
}
'use client'

import { Suspense, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function OnboardingContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const checkProfile = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth/role-selection')
        return
      }

      // Check if profile already exists
      const { data: farmer } = await supabase.from('farmers').select('id').eq('user_id', user.id).maybeSingle()
      if (farmer) {
        router.push('/farmer/dashboard')
        return
      }

      const { data: worker } = await supabase.from('workers').select('id').eq('user_id', user.id).maybeSingle()
      if (worker) {
        router.push('/worker/dashboard')
        return
      }

      // Determine role — priority: query param > localStorage
      const queryRole = searchParams.get('role')
      const storageRole = localStorage.getItem('pending_role')
      const role = queryRole || storageRole

      if (role === 'farmer') {
        router.push('/auth/farmer/signup')
      } else if (role === 'worker') {
        router.push('/auth/worker/signup')
      } else {
        router.push('/auth/role-selection')
      }
    }

    checkProfile()
  }, [searchParams, router])

  return <div>Loading...</div>
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OnboardingContent />
    </Suspense>
  )
}
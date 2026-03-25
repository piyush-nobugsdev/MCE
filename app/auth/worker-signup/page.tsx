'use client'

import { createClient } from '@/lib/supabase/client'

export default function WorkerAuthPage() {
  const handleGoogle = async () => {
    localStorage.setItem('pending_role', 'worker')
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: { prompt: 'select_account' }
      }
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold text-green-700">Sign in as Farmer</h1>
        <button
          onClick={handleGoogle}
          className="bg-white border border-gray-300 px-6 py-3 rounded-lg flex items-center gap-3 hover:bg-gray-50"
        >
          <img src="/google-icon.svg" className="w-5 h-5" />
          Continue with Google
        </button>
      </div>
    </div>
  )
}
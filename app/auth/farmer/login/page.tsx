'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Phone, ArrowRight, Loader2, Sprout } from 'lucide-react'

export default function FarmerLoginPage() {
  const router = useRouter()
  const [mobile, setMobile] = useState('+91 ')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [sendingOtp, setSendingOtp] = useState(false)
  const [verifying, setVerifying] = useState(false)

  const normalizePhone = (m: string) => {
    const clean = m.replace(/\s+/g, '')
    return clean.startsWith('+') ? clean : `+91${clean}`
  }

  const handleSendOtp = async () => {
    if (!mobile.trim()) return toast.error('Please enter your mobile number')
    setSendingOtp(true)
    // MOCK: simulate OTP send delay
    await new Promise(r => setTimeout(r, 800))
    setSendingOtp(false)
    setOtpSent(true)
    toast.success('OTP sent! (use 123456 for testing)')
  }

  const handleLogin = async () => {
    if (!otp.trim()) return toast.error('Please enter the OTP')
    setVerifying(true)
    await new Promise(r => setTimeout(r, 600))
    // MOCK: accept 123456 as valid OTP
    if (otp !== '123456') {
      setVerifying(false)
      return toast.error('Invalid OTP. Use 123456 for testing.')
    }
    // No real session in mock mode — go to signup
    router.push('/auth/farmer/signup')
  }

  const handleGoogle = async () => {
    localStorage.setItem('pending_role', 'farmer')
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: { prompt: 'select_account' },
      },
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-600 shadow-lg mb-4">
            <Sprout className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-gray-500 mt-1">Sign in to your <span className="text-emerald-600 font-semibold">Farmer</span> account</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-emerald-100 border border-emerald-50 p-8">

          {/* Mobile + OTP */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="farmer-mobile"
                    type="tel"
                    placeholder="+91 99999 99999"
                    value={mobile}
                    onChange={e => {
                      const val = e.target.value
                      if (val.startsWith('+91 ')) {
                        setMobile(val)
                      } else if (val.startsWith('+91')) {
                        setMobile('+91 ' + val.slice(3))
                      } else {
                        setMobile('+91 ' + val.replace(/^\+?91?\s*/, ''))
                      }
                    }}
                    disabled={otpSent}
                    className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-400 transition"
                  />
                </div>
                <button
                  onClick={handleSendOtp}
                  disabled={sendingOtp || otpSent}
                  className="px-4 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white text-sm font-semibold rounded-xl transition whitespace-nowrap flex items-center gap-1"
                >
                  {sendingOtp ? <Loader2 className="w-4 h-4 animate-spin" /> : otpSent ? '✓ Sent' : 'Get OTP'}
                </button>
              </div>
            </div>

            {/* OTP Field — slides in */}
            {otpSent && (
              <div className="animate-in slide-in-from-top-2 duration-300">
                <label className="block text-sm font-medium text-gray-700 mb-2">Enter OTP</label>
                <div className="flex gap-2">
                  <input
                    id="farmer-otp"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="6-digit OTP"
                    value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm tracking-widest font-mono focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
                  />
                  <button
                    onClick={() => { setOtpSent(false); setOtp(''); setMobile('') }}
                    className="px-3 py-3 text-xs text-gray-500 hover:text-gray-700 border border-gray-200 rounded-xl transition"
                  >
                    Change
                  </button>
                </div>
              </div>
            )}

            {/* Login Button */}
            <button
              id="farmer-login-btn"
              onClick={handleLogin}
              disabled={!otpSent || verifying}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-200 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition flex items-center justify-center gap-2"
            >
              {verifying ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Verifying...</>
              ) : (
                <>Login <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400 font-medium">or continue with</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* Google Button */}
          <button
            id="farmer-google-btn"
            onClick={handleGoogle}
            className="w-full py-3 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-semibold rounded-xl transition flex items-center justify-center gap-3 shadow-sm"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          {/* Sign up link */}
          <p className="text-center text-sm text-gray-500 mt-6">
            New here?{' '}
            <Link href="/auth/farmer/signup" className="text-emerald-600 hover:text-emerald-700 font-semibold">
              Create an account
            </Link>
          </p>
        </div>

        {/* Back */}
        <p className="text-center text-sm text-gray-400 mt-6">
          <Link href="/auth/role-selection" className="hover:text-gray-600 transition">
            ← Back to role selection
          </Link>
        </p>
      </div>
    </div>
  )
}

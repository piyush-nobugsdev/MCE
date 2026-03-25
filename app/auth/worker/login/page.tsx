'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Phone, ArrowRight, Loader2, HardHat } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function WorkerLoginPage() {
  const router = useRouter()
  const [mobile, setMobile] = useState('+91 ')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [sendingOtp, setSendingOtp] = useState(false)
  const [verifying, setVerifying] = useState(false)

  const handlePhoneChange = (val: string) => {
    if (val.startsWith('+91 ')) {
      setMobile(val)
    } else if (val.startsWith('+91')) {
      setMobile('+91 ' + val.slice(3))
    } else {
      setMobile('+91 ' + val.replace(/^\+?91?\s*/, ''))
    }
  }

  const handleSendOtp = async () => {
    if (mobile.length < 14) return toast.error('Please enter a valid mobile number')
    setSendingOtp(true)
    await new Promise(r => setTimeout(r, 1000))
    setSendingOtp(false)
    setOtpSent(true)
    toast.success('OTP sent! Use 123456 for testing.')
  }

  const handleLogin = async () => {
    if (otp.length !== 6) return toast.error('Please enter 6-digit OTP')
    setVerifying(true)
    await new Promise(r => setTimeout(r, 800))
    if (otp !== '123456') {
      setVerifying(false)
      return toast.error('Invalid OTP. Use 123456.')
    }
    // Success: check if user exists (mock simplified)
    router.push('/worker/dashboard')
  }

  const handleGoogle = async () => {
    localStorage.setItem('pending_role', 'worker')
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-[2.5rem] bg-blue-600 shadow-2xl shadow-blue-200 mb-8 group hover:scale-110 transition-transform duration-500">
            <HardHat className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">Worker Login</h1>
          <p className="text-lg text-gray-500 mt-2 font-medium uppercase tracking-widest">Sign in to find farm work</p>
        </div>

        {/* Login Card */}
        <Card className="border-0 shadow-2xl shadow-blue-100 rounded-[3rem] overflow-hidden bg-white/80 backdrop-blur-xl">
          <CardContent className="pt-12 pb-12 px-10">
            <div className="space-y-8">
              {/* Mobile Input */}
              <div className="space-y-3">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] px-1">Mobile Number</label>
                <div className="relative group">
                  <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="tel"
                    placeholder="+91 00000 00000"
                    value={mobile}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    disabled={otpSent || sendingOtp}
                    className="w-full pl-14 pr-6 py-6 border-2 border-gray-50 rounded-[2rem] text-2xl font-black focus:outline-none focus:ring-8 focus:ring-blue-100 focus:border-blue-400 transition-all disabled:opacity-50"
                  />
                </div>
              </div>

              {/* OTP Section */}
              {otpSent && (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-4 duration-500">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] px-1">Enter 6-Digit OTP</label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="0 0 0 0 0 0"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-6 py-6 border-2 border-gray-50 rounded-[2rem] text-3xl font-black text-center tracking-[0.5em] focus:outline-none focus:ring-8 focus:ring-blue-100 focus:border-blue-400 transition-all"
                  />
                </div>
              )}

              {/* Action Buttons */}
              {!otpSent ? (
                <Button 
                  onClick={handleSendOtp}
                  disabled={sendingOtp}
                  className="w-full bg-blue-600 hover:bg-blue-700 h-20 rounded-[2rem] text-2xl font-black uppercase tracking-widest shadow-2xl shadow-blue-200 transition-all active:scale-95"
                >
                  {sendingOtp ? <Loader2 className="w-8 h-8 animate-spin" /> : 'Send OTP'}
                </Button>
              ) : (
                <Button 
                  onClick={handleLogin}
                  disabled={verifying}
                  className="w-full bg-blue-600 hover:bg-blue-700 h-20 rounded-[2rem] text-2xl font-black uppercase tracking-widest shadow-2xl shadow-blue-200 transition-all active:scale-95"
                >
                  {verifying ? <Loader2 className="w-8 h-8 animate-spin" /> : 'Login Now'}
                </Button>
              )}

              {/* Reset/Change Link */}
              {otpSent && !verifying && (
                <button 
                  onClick={() => { setOtpSent(false); setOtp('') }}
                  className="w-full text-center text-sm font-bold text-gray-400 uppercase tracking-widest hover:text-blue-600 transition-colors"
                >
                  Change Mobile Number
                </button>
              )}

              {/* Divider */}
              <div className="flex items-center gap-4 py-2">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">OR</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>

              {/* Google Button */}
              <Button
                variant="outline"
                onClick={handleGoogle}
                className="w-full h-16 rounded-2xl border-2 border-gray-100 hover:bg-gray-50 flex items-center justify-center gap-4 text-lg font-bold text-gray-600 transition-all"
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer Links */}
        <div className="mt-12 text-center space-y-6">
          <p className="text-lg text-gray-500 font-medium uppercase tracking-wide">
            New here?{' '}
            <Link href="/auth/worker/signup" className="text-blue-600 font-black decoration-2 underline-offset-8 hover:underline">
              Create Account
            </Link>
          </p>
          <Link href="/auth/role-selection" className="block text-sm font-bold text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-colors">
            ← Back to Role Selection
          </Link>
        </div>
      </div>
    </div>
  )
}

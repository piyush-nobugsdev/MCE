'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Phone, Loader2, Sprout } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useLanguage } from '@/lib/i18n/context'

export default function FarmerLoginPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [mobile, setMobile] = useState('+91 ')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [sendingOtp, setSendingOtp] = useState(false)
  const [verifying, setVerifying] = useState(false)

  const handlePhoneChange = (val: string) => {
    if (val.startsWith('+91 ')) setMobile(val)
    else if (val.startsWith('+91')) setMobile('+91 ' + val.slice(3))
    else setMobile('+91 ' + val.replace(/^\+?91?\s*/, ''))
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
    router.push('/farmer/dashboard')
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
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-green-600 shadow-lg shadow-green-100 mb-6">
            <Sprout className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 leading-tight">{t('farmer_login')}</h1>
          <p className="text-gray-500 mt-2 font-medium">{t('find_workers')}</p>
        </div>

        {/* Login Card */}
        <Card className="border border-gray-100 shadow-sm rounded-3xl overflow-hidden bg-white">
          <CardContent className="pt-10 pb-10 px-8">
            <div className="space-y-6">
              {/* Mobile Input */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">{t('mobile_number')}</label>
                <div className="relative group">
                  <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                  <input
                    type="tel"
                    placeholder="+91 00000 00000"
                    value={mobile}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    disabled={otpSent || sendingOtp}
                    className="w-full pl-12 pr-6 py-4 border border-gray-100 rounded-xl text-xl font-bold focus:outline-none focus:ring-4 focus:ring-green-50 focus:border-green-400 transition-all disabled:opacity-50"
                  />
                </div>
              </div>

              {/* OTP Section */}
              {otpSent && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="block text-sm font-bold text-gray-700">{t('enter_otp')}</label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="0 0 0 0 0 0"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-6 py-4 border border-gray-100 rounded-xl text-2xl font-bold text-center tracking-[0.3em] focus:outline-none focus:ring-4 focus:ring-green-50 focus:border-green-400 transition-all"
                  />
                </div>
              )}

              {/* Action Buttons */}
              {!otpSent ? (
                <Button 
                  onClick={handleSendOtp}
                  disabled={sendingOtp}
                  className="w-full h-16 bg-green-600 hover:bg-green-700 rounded-xl text-lg font-bold text-white shadow-md shadow-green-50"
                >
                  {sendingOtp ? <Loader2 className="w-6 h-6 animate-spin" /> : t('send_otp')}
                </Button>
              ) : (
                <Button 
                  onClick={handleLogin}
                  disabled={verifying}
                  className="w-full h-16 bg-green-600 hover:bg-green-700 rounded-xl text-lg font-bold text-white shadow-md shadow-green-50"
                >
                  {verifying ? <Loader2 className="w-6 h-6 animate-spin" /> : t('login_now')}
                </Button>
              )}

              {/* Google Button */}
              <div className="flex items-center gap-4 py-2">
                <div className="flex-1 h-px bg-gray-50" />
                <span className="text-[10px] font-bold text-gray-300 uppercase">OR</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>

              <Button
                variant="outline"
                onClick={handleGoogle}
                className="w-full h-14 rounded-xl border border-gray-100 hover:bg-gray-50 flex items-center justify-center gap-3 text-sm font-bold text-gray-600 transition-all"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer Links */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 font-medium">
            {t('create_account')}?{' '}
            <Link href="/auth/farmer/signup" className="text-green-600 font-bold hover:underline">
              {t('register')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

function Button({ children, variant = 'primary', className = '', ...props }: any) {
  const variants: any = {
    primary: 'bg-black text-white hover:bg-gray-900 shadow-md',
    outline: 'bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 shadow-sm',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-50',
  }
  return (
    <button className={`flex items-center justify-center font-bold transition-all active:scale-95 ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}

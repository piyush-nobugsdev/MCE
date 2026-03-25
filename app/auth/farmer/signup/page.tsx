'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { signUpAsRole } from '@/app/actions/auth'
import { toast } from 'sonner'
import { Loader2, MapPin, Phone, CheckCircle2, XCircle, Sprout } from 'lucide-react'

type OtpStatus = 'idle' | 'sent' | 'verifying' | 'verified' | 'failed'

export default function FarmerSignupPage() {
  const [loading, setLoading] = useState(false)
  const [otpStatus, setOtpStatus] = useState<OtpStatus>('idle')
  const [sendingOtp, setSendingOtp] = useState(false)
  const [otpPopup, setOtpPopup] = useState<'success' | 'fail' | null>(null)

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    mobile: '+91 ',
    otp: '',
    village: '',
    district: '',
    state: '',
    latitude: '',
    longitude: '',
  })

  const set = (field: string, val: string) =>
    setForm(prev => ({ ...prev, [field]: val }))

  const normalizePhone = (m: string) => {
    const clean = m.replace(/\s+/g, '')
    return clean.startsWith('+') ? clean : `+91${clean}`
  }

  const handleSendOtp = async () => {
    if (!form.mobile.trim()) return toast.error('Enter your mobile number')
    setSendingOtp(true)
    // MOCK: simulate OTP send
    await new Promise(r => setTimeout(r, 800))
    setSendingOtp(false)
    setOtpStatus('sent')
    toast.success('OTP sent! (use 123456 for testing)')
  }

  const handleVerifyOtp = async () => {
    if (!form.otp.trim()) return toast.error('Enter the OTP')
    setOtpStatus('verifying')
    await new Promise(r => setTimeout(r, 600))
    // MOCK: accept 123456
    if (form.otp !== '123456') {
      setOtpStatus('failed')
      setOtpPopup('fail')
      setTimeout(() => setOtpPopup(null), 3000)
    } else {
      setOtpStatus('verified')
      setOtpPopup('success')
      setTimeout(() => setOtpPopup(null), 3000)
    }
  }

  const handleGetLocation = () => {
    if (!navigator.geolocation) return toast.error('Geolocation not supported')
    navigator.geolocation.getCurrentPosition(
      pos => {
        set('latitude', pos.coords.latitude.toFixed(6))
        set('longitude', pos.coords.longitude.toFixed(6))
        toast.success('Location captured!')
      },
      () => toast.error('Could not get location')
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otpStatus !== 'verified') return toast.error('Please verify your mobile number first')
    if (!form.firstName || !form.lastName) return toast.error('Please enter your full name')
    setLoading(true)
    const result = await signUpAsRole('farmer', {
      firstName: form.firstName,
      lastName: form.lastName,
      mobile: normalizePhone(form.mobile),
      village: form.village,
      district: form.district,
      state: form.state,
      latitude: form.latitude || '0',
      longitude: form.longitude || '0',
    })
    if (result?.error) {
      toast.error(result.error)
      setLoading(false)
    }
    // server action handles redirect
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-100 flex items-center justify-center p-4 py-10">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-600 shadow-lg mb-4">
            <Sprout className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Create Farmer Profile</h1>
          <p className="text-gray-500 mt-1">Join the farm work marketplace</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-emerald-100 border border-emerald-50 p-8 space-y-5">

          {/* Name row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
              <input
                id="farmer-first-name"
                type="text"
                placeholder="Ravi"
                value={form.firstName}
                onChange={e => set('firstName', e.target.value)}
                required
                className="w-full px-3 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
              <input
                id="farmer-last-name"
                type="text"
                placeholder="Kumar"
                value={form.lastName}
                onChange={e => set('lastName', e.target.value)}
                required
                className="w-full px-3 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Mobile */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Mobile Number <span className="text-red-500">*</span></label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="farmer-signup-mobile"
                  type="tel"
                  placeholder="+91 99999 99999"
                  value={form.mobile}
                  onChange={e => {
                    const val = e.target.value
                    let newVal = val
                    if (val.startsWith('+91 ')) {
                      newVal = val
                    } else if (val.startsWith('+91')) {
                      newVal = '+91 ' + val.slice(3)
                    } else {
                      newVal = '+91 ' + val.replace(/^\+?91?\s*/, '')
                    }
                    set('mobile', newVal)
                  }}
                  disabled={otpStatus === 'verified'}
                  className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent disabled:bg-gray-50 transition"
                />
              </div>
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={sendingOtp || otpStatus === 'verified' || otpStatus === 'sent'}
                className="px-4 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white text-sm font-semibold rounded-xl transition whitespace-nowrap"
              >
                {sendingOtp ? <Loader2 className="w-4 h-4 animate-spin" /> : otpStatus === 'verified' ? '✓ Verified' : 'Get OTP'}
              </button>
            </div>
          </div>

          {/* OTP Verify */}
          {(otpStatus === 'sent' || otpStatus === 'verifying' || otpStatus === 'failed') && (
            <div className="animate-in slide-in-from-top-2 duration-300">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Enter OTP</label>
              <div className="flex gap-2">
                <input
                  id="farmer-signup-otp"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="6-digit OTP"
                  value={form.otp}
                  onChange={e => set('otp', e.target.value.replace(/\D/g, ''))}
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm tracking-widest font-mono focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
                />
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={otpStatus === 'verifying'}
                  className="px-4 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white text-sm font-semibold rounded-xl transition"
                >
                  {otpStatus === 'verifying' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify'}
                </button>
              </div>
            </div>
          )}

          {/* OTP Verified badge */}
          {otpStatus === 'verified' && (
            <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2.5 rounded-xl text-sm font-medium">
              <CheckCircle2 className="w-4 h-4" />
              Mobile number verified!
            </div>
          )}

          {/* Village */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Village / Town</label>
            <input
              id="farmer-village"
              type="text"
              placeholder="Your village or town"
              value={form.village}
              onChange={e => set('village', e.target.value)}
              required
              className="w-full px-3 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
            />
          </div>

          {/* District + State */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">District</label>
              <input
                id="farmer-district"
                type="text"
                placeholder="District"
                value={form.district}
                onChange={e => set('district', e.target.value)}
                required
                className="w-full px-3 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">State</label>
              <input
                id="farmer-state"
                type="text"
                placeholder="State"
                value={form.state}
                onChange={e => set('state', e.target.value)}
                required
                className="w-full px-3 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Lat / Lng */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Farm Location</label>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <input
                id="farmer-lat"
                type="number"
                step="0.000001"
                placeholder="Latitude"
                value={form.latitude}
                onChange={e => set('latitude', e.target.value)}
                className="w-full px-3 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition font-mono"
              />
              <input
                id="farmer-lng"
                type="number"
                step="0.000001"
                placeholder="Longitude"
                value={form.longitude}
                onChange={e => set('longitude', e.target.value)}
                className="w-full px-3 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition font-mono"
              />
            </div>
            <button
              type="button"
              onClick={handleGetLocation}
              className="w-full py-2.5 border border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 font-medium rounded-xl text-sm transition flex items-center justify-center gap-2"
            >
              <MapPin className="w-4 h-4" /> Get My Location
            </button>
          </div>

          {/* Create Profile */}
          <form onSubmit={handleSubmit}>
            <button
              id="farmer-create-profile-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white font-bold rounded-xl transition flex items-center justify-center gap-2 text-base"
            >
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Creating Profile...</> : 'Create Farmer Profile'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* Google */}
          <button
            type="button"
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

          <p className="text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link href="/auth/farmer/login" className="text-emerald-600 hover:text-emerald-700 font-semibold">
              Back to Login
            </Link>
          </p>
        </div>

        {/* OTP Popup Overlay */}
        {otpPopup && (
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl text-white font-semibold text-base animate-in zoom-in-95 duration-200 ${otpPopup === 'success' ? 'bg-emerald-600' : 'bg-red-500'}`}>
              {otpPopup === 'success'
                ? <><CheckCircle2 className="w-5 h-5" /> Mobile Verified Successfully!</>
                : <><XCircle className="w-5 h-5" /> Verification Failed. Try again.</>}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

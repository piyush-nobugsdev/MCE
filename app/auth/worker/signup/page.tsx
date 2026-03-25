'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { signUpAsRole } from '@/app/actions/auth'
import { toast } from 'sonner'
import { Loader2, MapPin, Phone, CheckCircle2, XCircle, HardHat } from 'lucide-react'

type OtpStatus = 'idle' | 'sent' | 'verifying' | 'verified' | 'failed'

export default function WorkerSignupPage() {
  const [loading, setLoading] = useState(false)
  const [otpStatus, setOtpStatus] = useState<OtpStatus>('idle')
  const [sendingOtp, setSendingOtp] = useState(false)
  const [otpPopup, setOtpPopup] = useState<'success' | 'fail' | null>(null)

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    mobile: '+91 ',
    otp: '',
    age: '',
    experience: '',
    village: '',
    district: '',
    state: '',
    latitude: '',
    longitude: '',
    skills: '',
    travel_distance: '10',
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
    await new Promise(r => setTimeout(r, 800))
    setSendingOtp(false)
    setOtpStatus('sent')
    toast.success('OTP sent! (use 123456 for testing)')
  }

  const handleVerifyOtp = async () => {
    if (!form.otp.trim()) return toast.error('Enter the OTP')
    setOtpStatus('verifying')
    await new Promise(r => setTimeout(r, 600))
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
    const result = await signUpAsRole('worker', {
      firstName: form.firstName,
      lastName: form.lastName,
      mobile: normalizePhone(form.mobile),
      village: form.village,
      district: form.district,
      state: form.state,
      latitude: form.latitude || '0',
      longitude: form.longitude || '0',
      experience: form.experience,
      age: form.age,
      skills: form.skills,
      travel_distance: form.travel_distance,
    })
    if (result?.error) {
      toast.error(result.error)
      setLoading(false)
    }
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
    <div className="min-h-screen bg-white flex items-center justify-center p-6 py-10">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-blue-600 shadow-lg shadow-blue-100 mb-6">
            <HardHat className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 leading-tight">Create Worker Profile</h1>
          <p className="text-gray-500 mt-2 font-medium">Find the best farm jobs near you</p>
        </div>

        {/* Form Area */}
        <div className="space-y-6">

          {/* Name Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">First Name</label>
              <input
                type="text"
                placeholder="Ramesh"
                value={form.firstName}
                onChange={e => set('firstName', e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-100 rounded-xl text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-400 placeholder:text-gray-300 transition"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Last Name</label>
              <input
                type="text"
                placeholder="Singh"
                value={form.lastName}
                onChange={e => set('lastName', e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-100 rounded-xl text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-400 placeholder:text-gray-300 transition"
              />
            </div>
          </div>

          {/* Age & Exp Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Your Age</label>
              <input
                type="number"
                placeholder="25"
                value={form.age}
                onChange={e => set('age', e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-100 rounded-xl font-bold focus:outline-none focus:ring-4 focus:ring-blue-50 transition"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Years of Experience</label>
              <input
                type="number"
                placeholder="5"
                value={form.experience}
                onChange={e => set('experience', e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-100 rounded-xl font-bold focus:outline-none focus:ring-4 focus:ring-blue-50 transition"
              />
            </div>
          </div>

          {/* Mobile Section */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Mobile Number</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                <input
                  type="tel"
                  placeholder="+91 00000 00000"
                  value={form.mobile}
                  onChange={e => {
                    const val = e.target.value
                    let newVal = val
                    if (val.startsWith('+91 ')) newVal = val
                    else if (val.startsWith('+91')) newVal = '+91 ' + val.slice(3)
                    else newVal = '+91 ' + val.replace(/^\+?91?\s*/, '')
                    set('mobile', newVal)
                  }}
                  disabled={otpStatus === 'verified'}
                  className="w-full pl-10 pr-4 py-3 border border-gray-100 rounded-xl text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-400 disabled:opacity-50 transition"
                />
              </div>
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={sendingOtp || otpStatus === 'verified' || otpStatus === 'sent'}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-bold rounded-xl transition shadow-md shadow-blue-50 whitespace-nowrap"
              >
                {sendingOtp ? <Loader2 className="w-5 h-5 animate-spin" /> : otpStatus === 'verified' ? '✓' : 'Get OTP'}
              </button>
            </div>
          </div>

          {/* OTP Input */}
          {(otpStatus === 'sent' || otpStatus === 'verifying' || otpStatus === 'failed') && (
            <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
              <label className="text-sm font-bold text-gray-700">Enter 6-digit OTP</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="000000"
                  value={form.otp}
                  onChange={e => set('otp', e.target.value.replace(/\D/g, ''))}
                  className="flex-1 px-4 py-3 border border-gray-100 rounded-xl text-2xl font-mono font-bold text-center tracking-widest focus:outline-none focus:ring-4 focus:ring-blue-50 transition"
                />
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={otpStatus === 'verifying'}
                  className="px-6 py-3 bg-black text-white text-sm font-bold rounded-xl transition hover:bg-gray-900"
                >
                  {otpStatus === 'verifying' ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify'}
                </button>
              </div>
            </div>
          )}

          {otpStatus === 'verified' && (
            <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-4 py-3 rounded-xl text-sm font-bold border border-blue-100 animate-in fade-in duration-500">
              <CheckCircle2 className="w-4 h-4" /> Phone verified!
            </div>
          )}

          {/* Location Area */}
          <div className="space-y-4 pt-4 border-t border-gray-50">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 text-center block">Home Address</label>
              <input
                type="text"
                placeholder="Village Name"
                value={form.village}
                onChange={e => set('village', e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-100 rounded-xl text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-50 transition"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="District"
                value={form.district}
                onChange={e => set('district', e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-100 rounded-xl font-bold focus:outline-none focus:ring-4 focus:ring-blue-50 transition"
              />
              <input
                type="text"
                placeholder="State"
                value={form.state}
                onChange={e => set('state', e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-100 rounded-xl font-bold focus:outline-none focus:ring-4 focus:ring-blue-50 transition"
              />
            </div>
            <button
              type="button"
              onClick={handleGetLocation}
              className="w-full py-3 border border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 font-bold rounded-xl text-sm transition flex items-center justify-center gap-2"
            >
              <MapPin className="w-4 h-4" /> Auto-detect Location
            </button>
          </div>

          {/* Skills Area */}
          <div className="pt-4 border-t border-gray-50 space-y-2">
             <label className="text-sm font-bold text-gray-700">Your Skills (e.g., Sowing, Harvesting)</label>
             <textarea
                placeholder="What work can you do?"
                value={form.skills}
                onChange={e => set('skills', e.target.value)}
                rows={2}
                className="w-full px-4 py-3 border border-gray-100 rounded-xl font-bold focus:outline-none focus:ring-4 focus:ring-blue-50 transition resize-none"
             />
          </div>

          {/* Submit */}
          <form onSubmit={handleSubmit} className="pt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-2xl transition shadow-lg shadow-blue-100 text-lg"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : 'Finish & Find Work'}
            </button>
          </form>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-50"></div></div>
            <div className="relative flex justify-center text-[10px] font-bold uppercase"><span className="bg-white px-3 text-gray-300">Or use google</span></div>
          </div>

          <button
            type="button"
            onClick={handleGoogle}
            className="w-full py-3.5 bg-white hover:bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-600 transition flex items-center justify-center gap-3 shadow-sm"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>

          <p className="text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link href="/auth/worker/login" className="text-blue-600 font-bold hover:underline">
              Login
            </Link>
          </p>
        </div>

        {/* Popups */}
        {otpPopup && (
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
            <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-xl text-white font-bold text-sm animate-in slide-in-from-bottom-5 duration-300 ${otpPopup === 'success' ? 'bg-blue-600' : 'bg-red-500'}`}>
              {otpPopup === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
              {otpPopup === 'success' ? 'Mobile Verified!' : 'Wrong OTP. Try again.'}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

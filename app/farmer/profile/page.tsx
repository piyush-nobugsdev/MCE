'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { FarmerNavbar } from '../components/navbar'
import { Card, CardContent } from '@/components/ui/card'
import { LogOut, Star, Sprout, Briefcase, Globe, Edit3, MapPin, Phone, User as UserIcon } from 'lucide-react'
import { signOut } from '@/app/actions/auth'
import { useLanguage } from '@/lib/i18n/context'
import Link from 'next/link'

export default function FarmerProfilePage() {
  const { t } = useLanguage()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    const fetchProfile = async () => {
      const supabase = createClient()
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user && isMounted) {
          const { data } = await supabase
            .from('farmers')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle()
          
          if (isMounted) {
            setProfile({ ...data, phone: user.phone })
          }
        }
      } catch (error) {
        console.error('Profile fetch error:', error)
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    fetchProfile()
    return () => { isMounted = false }
  }, [])

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/auth/role-selection'
  }

  if (loading) return <div className="p-10 text-center font-bold text-gray-400">Loading profile...</div>
  
  if (!profile) return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <p className="text-xl font-bold text-gray-900 mb-4">Profile not found</p>
      <button onClick={() => window.location.href = '/auth/role-selection'} className="px-8 py-4 bg-green-600 text-white font-bold rounded-xl">Go to Login</button>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      <FarmerNavbar />
      
      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold text-gray-900 leading-tight">{t('profile')}</h1>
            <p className="text-lg text-gray-500 font-medium italic">Your personal and farm details</p>
          </div>
          <Button variant="outline" className="h-14 px-8 rounded-xl text-sm font-bold border border-gray-100 bg-white hover:bg-gray-50 flex items-center gap-2">
             <Edit3 className="w-5 h-5" /> Edit Details
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Avatar & Quick Actions */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="border border-gray-100 shadow-sm rounded-3xl bg-white overflow-hidden text-center relative">
              <div className="h-24 bg-green-600 w-full mb-12" />
              <div className="absolute top-10 left-1/2 -translate-x-1/2 w-24 h-24 rounded-2xl bg-white p-1.5 shadow-lg">
                 <div className="w-full h-full bg-green-50 rounded-xl flex items-center justify-center">
                    <Sprout className="w-12 h-12 text-green-600" />
                 </div>
              </div>
              <CardContent className="pb-10 px-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">{profile.first_name}</h2>
                <p className="text-sm font-medium text-gray-400 mb-8 flex items-center justify-center gap-1.5">
                   <MapPin className="w-4 h-4 text-green-600" /> {profile.district}, {profile.state}
                </p>
                
                <div className="flex justify-center gap-3 mb-8">
                   <div className="px-4 py-2 bg-green-100 text-green-700 text-xs font-bold rounded-lg">Farmer</div>
                   <div className="px-4 py-2 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-lg flex items-center gap-1.5">
                      <Star className="w-4 h-4 fill-yellow-500" /> {profile.rating?.toFixed(1) || '0.0'}
                   </div>
                </div>

                <div className="space-y-3">
                  <Link href="/settings/language">
                    <Button variant="outline" className="w-full h-12 rounded-xl text-xs font-bold border border-gray-50 hover:bg-gray-50 flex items-center justify-center gap-2">
                       <Globe className="w-4 h-4 text-blue-600" /> {t('language')}
                    </Button>
                  </Link>
                  <Button onClick={handleSignOut} variant="ghost" className="w-full h-12 rounded-xl text-xs font-bold text-red-500 hover:bg-red-50 flex items-center justify-center gap-2">
                     <LogOut className="w-4 h-4" /> {t('sign_out')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Detailed Info & Stats */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Info Section */}
            <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm">
               <div className="space-y-10">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                     <UserIcon className="w-4 h-4 text-green-600" /> Basic Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                     <div className="space-y-1.5">
                        <p className="text-xs font-bold text-gray-300 uppercase">First Name</p>
                        <p className="text-xl font-bold text-gray-900">{profile.first_name}</p>
                     </div>
                     <div className="space-y-1.5">
                        <p className="text-xs font-bold text-gray-300 uppercase">Last Name</p>
                        <p className="text-xl font-bold text-gray-900">{profile.last_name}</p>
                     </div>
                     <div className="space-y-1.5">
                        <p className="text-xs font-bold text-gray-300 uppercase">Phone</p>
                        <p className="text-xl font-bold text-gray-900 flex items-center gap-2">
                           {profile.phone || 'Not provided'}
                        </p>
                     </div>
                     <div className="space-y-1.5">
                        <p className="text-xs font-bold text-gray-300 uppercase">Farm Name</p>
                         <p className="text-xl font-bold text-gray-900">{profile.village}</p>
                     </div>
                     <div className="md:col-span-2 space-y-1.5">
                        <p className="text-xs font-bold text-gray-300 uppercase">Full Address</p>
                        <p className="text-xl font-bold text-gray-900 border-l-4 border-green-500 pl-4 py-1">
                           {profile.village}, {profile.district}, {profile.state}
                        </p>
                     </div>
                  </div>
               </div>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
                  <div>
                     <p className="text-xs font-bold text-gray-400 mb-1 uppercase tracking-widest">Jobs Posted</p>
                     <p className="text-4xl font-bold text-gray-900">{profile.total_jobs_posted || 0}</p>
                  </div>
                  <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center">
                     <Briefcase className="w-7 h-7 text-green-600" />
                  </div>
               </div>
               <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
                  <div>
                     <p className="text-xs font-bold text-gray-400 mb-1 uppercase tracking-widest">Average Rating</p>
                     <p className="text-4xl font-bold text-gray-900">{profile.rating?.toFixed(1) || '0.0'}</p>
                  </div>
                  <div className="w-14 h-14 bg-yellow-50 rounded-2xl flex items-center justify-center">
                     <Star className="w-7 h-7 text-yellow-500 fill-yellow-500" />
                  </div>
               </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  )
}

function Button({ children, variant = 'primary', className = '', ...props }: any) {
  const variants: any = {
    primary: 'bg-black text-white hover:bg-gray-900',
    outline: 'bg-white text-gray-900 border border-gray-200 hover:bg-gray-50',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-50',
  }
  return (
    <button className={`flex items-center justify-center font-bold transition-all active:scale-95 ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}

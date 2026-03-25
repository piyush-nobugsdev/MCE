'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { WorkerNavbar } from '../components/navbar'
import { Card, CardContent } from '@/components/ui/card'
import { LogOut, Star, User as UserIcon, Briefcase, Globe, Edit3, MapPin, Phone, Award } from 'lucide-react'
import { signOut } from '@/app/actions/auth'
import { useLanguage } from '@/lib/i18n/context'
import Link from 'next/link'

export default function WorkerProfilePage() {
  const { t } = useLanguage()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('workers')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle()
        setProfile({ ...data, phone: user.phone })
      }
      setLoading(false)
    }
    fetchProfile()
  }, [])

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/auth/role-selection'
  }

  if (loading) return <div className="p-10 text-center font-bold text-gray-400">Loading profile...</div>
  
  if (!profile) return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <p className="text-xl font-bold text-gray-900 mb-4">Profile not found</p>
      <button onClick={() => window.location.href = '/auth/role-selection'} className="px-8 py-4 bg-blue-600 text-white font-bold rounded-xl">Go to Login</button>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      <WorkerNavbar />
      
      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold text-gray-900 leading-tight">{t('profile')}</h1>
            <p className="text-lg text-gray-500 font-medium italic">Manage your work history and details</p>
          </div>
          <Button variant="outline" className="h-14 px-8 rounded-xl text-sm font-bold border border-gray-100 bg-white hover:bg-gray-50 flex items-center gap-2">
             <Edit3 className="w-5 h-5" /> Edit Bio
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Avatar & Quick Actions */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="border border-gray-100 shadow-sm rounded-3xl bg-white overflow-hidden text-center relative">
              <div className="h-24 bg-blue-600 w-full mb-12" />
              <div className="absolute top-10 left-1/2 -translate-x-1/2 w-24 h-24 rounded-2xl bg-white p-1.5 shadow-lg">
                 <div className="w-full h-full bg-blue-50 rounded-xl flex items-center justify-center">
                    <UserIcon className="w-12 h-12 text-blue-600" />
                 </div>
              </div>
              <CardContent className="pb-10 px-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">{profile.first_name}</h2>
                <div className="flex items-center justify-center gap-2 mb-8">
                   <div className="px-4 py-1.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-lg tracking-widest uppercase">Worker</div>
                   <div className="px-4 py-1.5 bg-yellow-100 text-yellow-700 text-[10px] font-bold rounded-lg flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-yellow-500" /> {profile.rating?.toFixed(1) || '0.0'}
                   </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-8">
                   <div className="bg-gray-50 p-4 rounded-2xl text-center">
                      <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Age</p>
                      <p className="text-lg font-bold text-gray-900">{profile.age} Yrs</p>
                   </div>
                   <div className="bg-gray-50 p-4 rounded-2xl text-center">
                      <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Exp</p>
                      <p className="text-lg font-bold text-gray-900">{profile.experience} Yrs</p>
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
            
            {/* Professional Info */}
            <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm">
               <div className="space-y-10">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                     <Award className="w-4 h-4 text-blue-600" /> Professional Details
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
                        <p className="text-xs font-bold text-gray-300 uppercase">Mobile Number</p>
                        <p className="text-xl font-bold text-gray-900 flex items-center gap-2 text-blue-600 font-mono">
                           {profile.phone || 'Not provided'}
                        </p>
                     </div>
                     <div className="space-y-1.5">
                        <p className="text-xs font-bold text-gray-300 uppercase">Travel Limit</p>
                        <p className="text-xl font-bold text-gray-900">Within {profile.travel_distance_preference || 10} KM</p>
                     </div>
                     <div className="md:col-span-2 space-y-1.5">
                        <p className="text-xs font-bold text-gray-300 uppercase">Home Address</p>
                        <p className="text-xl font-bold text-gray-900 border-l-4 border-blue-500 pl-4 py-1">
                           {profile.village}, {profile.district}
                        </p>
                     </div>
                  </div>

                  <div className="pt-8 border-t border-gray-50">
                     <p className="text-xs font-bold text-gray-300 uppercase mb-4 tracking-widest">Your Skills</p>
                     <div className="flex flex-wrap gap-2.5">
                        {profile.skills?.length > 0 ? profile.skills.map((skill: string) => (
                           <span key={skill} className="px-5 py-2.5 bg-blue-50 text-blue-700 font-bold text-sm rounded-xl border border-blue-100">
                             {skill}
                           </span>
                        )) : <p className="text-gray-300 font-bold italic">No skills added yet</p>}
                     </div>
                  </div>
               </div>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
                  <div>
                     <p className="text-xs font-bold text-gray-400 mb-1 uppercase tracking-widest">Tasks Done</p>
                     <p className="text-4xl font-bold text-gray-900">{profile.total_jobs_completed || 0}</p>
                  </div>
                  <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center">
                     <Briefcase className="w-7 h-7 text-blue-600" />
                  </div>
               </div>
               <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
                  <div>
                     <p className="text-xs font-bold text-gray-400 mb-1 uppercase tracking-widest">My Rating</p>
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

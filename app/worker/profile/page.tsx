'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { WorkerNavbar } from '../components/navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { User, MapPin, LogOut, CheckCircle2, Star, Briefcase } from 'lucide-react'
import { signOut } from '@/app/actions/auth'
import { toast } from 'sonner'

export default function WorkerProfilePage() {
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
        setProfile(data)
      }
      setLoading(false)
    }
    fetchProfile()
  }, [])

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/auth/role-selection'
  }

  if (loading) return <div className="p-10 text-center font-black uppercase tracking-widest text-gray-400">Loading Profile...</div>
  
  if (!profile) return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <p className="text-xl font-black text-gray-900 uppercase tracking-tight mb-4">Profile Not Found</p>
      <button onClick={() => window.location.href = '/auth/role-selection'} className="px-8 py-4 bg-blue-600 text-white font-black uppercase rounded-2xl">Go to Login</button>
    </div>
  )

  return (
    <div className="min-h-screen bg-blue-50/30 font-sans">
      <WorkerNavbar />
      
      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-5xl font-black text-gray-900 uppercase tracking-tight">Worker Profile</h1>
          <p className="text-xl text-gray-400 mt-2 font-medium uppercase tracking-widest leading-loose">Manage your professional identity</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-0 shadow-2xl shadow-blue-100 rounded-[3rem] overflow-hidden bg-white">
              <CardContent className="pt-12 pb-10 px-8 text-center">
                <div className="inline-flex items-center justify-center w-32 h-32 rounded-[2.5rem] bg-blue-600 shadow-2xl shadow-blue-200 mb-8">
                  <User className="w-16 h-16 text-white" />
                </div>
                <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight mb-2">{profile.first_name}</h2>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">{profile.district}, {profile.state}</p>
                
                <div className="flex flex-col gap-3">
                  <div className="flex justify-center gap-2">
                    <span className="px-5 py-2.5 bg-blue-50 text-blue-700 text-xs font-black rounded-xl uppercase tracking-widest">Worker</span>
                    <span className="px-5 py-2.5 bg-yellow-50 text-yellow-700 text-xs font-black rounded-xl uppercase tracking-widest">★ {profile.rating?.toFixed(1) || '0.0'}</span>
                  </div>
                  <div className="flex justify-center gap-2">
                    {profile.age && <span className="px-5 py-2.5 bg-gray-50 text-gray-700 text-xs font-black rounded-xl uppercase tracking-widest">{profile.age} Years</span>}
                    {profile.experience !== null && <span className="px-5 py-2.5 bg-gray-50 text-gray-700 text-xs font-black rounded-xl uppercase tracking-widest">{profile.experience}Y Exp</span>}
                  </div>
                </div>
              </CardContent>
            </Card>

            <button 
              onClick={handleSignOut}
              className="w-full py-6 bg-red-50 hover:bg-red-100 text-red-600 rounded-[2rem] transition-all font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg shadow-red-100"
            >
              <LogOut className="w-6 h-6 stroke-[3]" /> Sign Out
            </button>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-0 shadow-2xl shadow-blue-100 rounded-[3rem] overflow-hidden bg-white">
              <CardHeader className="bg-blue-50/50 px-10 py-8 border-b border-blue-100">
                <CardTitle className="text-xl font-black text-blue-900 uppercase tracking-widest flex items-center gap-3">
                  <Briefcase className="w-6 h-6 text-blue-600" /> Professional Bio
                </CardTitle>
              </CardHeader>
              <CardContent className="p-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Village / Town</p>
                    <p className="text-xl font-bold text-gray-900 uppercase">{profile.village}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Travel Preference</p>
                    <p className="text-xl font-bold text-gray-900 uppercase">{profile.travel_distance_preference || 10} KM</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Skills & Expertise</p>
                  <div className="flex flex-wrap gap-3">
                    {profile.skills?.length > 0 ? profile.skills.map((skill: string) => (
                      <span key={skill} className="px-6 py-3 bg-blue-50 text-blue-700 font-black text-xs uppercase tracking-widest rounded-2xl border-2 border-blue-100/50">
                        {skill}
                      </span>
                    )) : <p className="text-gray-400 italic font-medium">No skills listed</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-blue-50 border-2 border-blue-50 flex flex-col items-center text-center group hover:bg-blue-600 transition-colors duration-500">
                <CheckCircle2 className="w-10 h-10 text-blue-600 mb-4 group-hover:text-white transition-colors" />
                <p className="text-4xl font-black text-gray-900 mb-1 group-hover:text-white transition-colors">{profile.total_jobs_completed || 0}</p>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] group-hover:text-blue-100 transition-colors">Jobs Completed</p>
              </div>
              <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-blue-50 border-2 border-blue-50 flex flex-col items-center text-center group hover:bg-blue-600 transition-colors duration-500">
                <Star className="w-10 h-10 text-yellow-500 mb-4 group-hover:text-white transition-colors" />
                <p className="text-4xl font-black text-gray-900 mb-1 group-hover:text-white transition-colors">{profile.rating?.toFixed(1) || '0.0'}</p>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] group-hover:text-blue-100 transition-colors">Worker Rating</p>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { FarmerNavbar } from '../components/navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { User, MapPin, LogOut, CheckCircle2, Star, Sprout, Briefcase } from 'lucide-react'
import { signOut } from '@/app/actions/auth'

export default function FarmerProfilePage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('farmers')
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
      <button onClick={() => window.location.href = '/auth/role-selection'} className="px-8 py-4 bg-green-600 text-white font-black uppercase rounded-2xl">Go to Login</button>
    </div>
  )

  return (
    <div className="min-h-screen bg-green-50/30 font-sans">
      <FarmerNavbar />
      
      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-5xl font-black text-gray-900 uppercase tracking-tight">Farmer Profile</h1>
          <p className="text-xl text-gray-400 mt-2 font-medium uppercase tracking-widest leading-loose">Manage your agricultural workforce</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-0 shadow-2xl shadow-green-100 rounded-[3rem] overflow-hidden bg-white">
              <CardContent className="pt-12 pb-10 px-8 text-center">
                <div className="inline-flex items-center justify-center w-32 h-32 rounded-[2.5rem] bg-green-600 shadow-2xl shadow-green-200 mb-8">
                  <Sprout className="w-16 h-16 text-white" />
                </div>
                <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight mb-2">{profile.first_name}</h2>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">{profile.district}, {profile.state}</p>
                
                <div className="flex flex-col gap-3">
                  <div className="flex justify-center gap-2">
                    <span className="px-5 py-2.5 bg-green-50 text-green-700 text-xs font-black rounded-xl uppercase tracking-widest">Farmer</span>
                    <span className="px-5 py-2.5 bg-yellow-50 text-yellow-700 text-xs font-black rounded-xl uppercase tracking-widest">★ {profile.rating?.toFixed(1) || '0.0'}</span>
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
            <Card className="border-0 shadow-2xl shadow-green-100 rounded-[3rem] overflow-hidden bg-white">
              <CardHeader className="bg-green-50/50 px-10 py-8 border-b border-green-100">
                <CardTitle className="text-xl font-black text-green-900 uppercase tracking-widest flex items-center gap-3">
                  <Briefcase className="w-6 h-6 text-green-600" /> Farm Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Village / Town</p>
                    <p className="text-xl font-bold text-gray-900 uppercase">{profile.village}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">District</p>
                    <p className="text-xl font-bold text-gray-900 uppercase">{profile.district}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">State</p>
                    <p className="text-xl font-bold text-gray-900 uppercase">{profile.state}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-green-50 border-2 border-green-50 flex flex-col items-center text-center group hover:bg-green-600 transition-colors duration-500">
                <CheckCircle2 className="w-10 h-10 text-green-600 mb-4 group-hover:text-white transition-colors" />
                <p className="text-4xl font-black text-gray-900 mb-1 group-hover:text-white transition-colors">0</p>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] group-hover:text-green-100 transition-colors">Jobs Posted</p>
              </div>
              <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-green-50 border-2 border-green-50 flex flex-col items-center text-center group hover:bg-green-600 transition-colors duration-500">
                <Star className="w-10 h-10 text-yellow-500 mb-4 group-hover:text-white transition-colors" />
                <p className="text-4xl font-black text-gray-900 mb-1 group-hover:text-white transition-colors">{profile.rating?.toFixed(1) || '0.0'}</p>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] group-hover:text-green-100 transition-colors">Farm Rating</p>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}

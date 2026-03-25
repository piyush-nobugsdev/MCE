'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { WorkerNavbar } from '../components/navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { User, MapPin, Wrench, LogOut, CheckCircle2, Star } from 'lucide-react'
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
    toast.success('Signed out')
  }

  if (loading) return <div className="p-10 text-center">Loading profile...</div>
  if (!profile) return <div className="p-10 text-center text-red-500">Profile not found. Please log in again.</div>

  return (
    <div className="min-h-screen bg-blue-50/30">
      <WorkerNavbar />
      
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          {/* Avatar side */}
          <div className="w-full md:w-1/3 text-center">
            <div className="relative inline-block">
              <div className="w-32 h-32 rounded-3xl bg-blue-600 flex items-center justify-center text-white shadow-2xl shadow-blue-200 mb-4">
                <User className="w-16 h-16" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{profile.first_name} {profile.last_name}</h2>
            <p className="text-blue-600 font-semibold mb-6 italic opacity-75">Registered Worker</p>
            
            <button 
              onClick={handleSignOut}
              className="w-full py-3 bg-white hover:bg-red-50 text-red-600 border border-red-100 rounded-2xl transition font-semibold flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>

          {/* Details side */}
          <div className="flex-1 space-y-6">
            <Card className="rounded-3xl border-0 shadow-xl shadow-blue-100/50">
              <CardHeader className="border-b border-blue-50 pb-4">
                <CardTitle className="text-lg flex items-center gap-2 text-blue-900">
                  <User className="w-5 h-5 text-blue-600" /> Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">First Name</p>
                    <p className="text-gray-900 font-medium">{profile.first_name}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Last Name</p>
                    <p className="text-gray-900 font-medium">{profile.last_name}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Village / Town</p>
                  <p className="text-gray-900 font-medium">{profile.village}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">District</p>
                    <p className="text-gray-900 font-medium">{profile.district}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">State</p>
                    <p className="text-gray-900 font-medium">{profile.state}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card className="rounded-3xl border-0 shadow-xl shadow-blue-100/50">
              <CardHeader className="border-b border-blue-50 pb-4">
                <CardTitle className="text-lg flex items-center gap-2 text-blue-900">
                  <Star className="w-5 h-5 text-blue-600" /> Professional Skills
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex flex-wrap gap-2">
                  {profile.skills && profile.skills.length > 0 ? (
                    profile.skills.map((skill: string) => (
                      <span key={skill} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium border border-blue-100">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-gray-400 italic">No skills added yet.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-3xl shadow-xl shadow-blue-100/50 border border-blue-50">
                <CheckCircle2 className="w-6 h-6 text-blue-600 mb-3" />
                <p className="text-2xl font-bold text-gray-900">{profile.total_jobs_completed || 0}</p>
                <p className="text-xs font-semibold text-gray-400 uppercase">Jobs Completed</p>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-xl shadow-blue-100/50 border border-blue-50">
                <MapPin className="w-6 h-6 text-blue-600 mb-3" />
                <p className="text-lg font-bold text-gray-900">{profile.travel_distance_preference || 0} km</p>
                <p className="text-xs font-semibold text-gray-400 uppercase">Preferred Range</p>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}

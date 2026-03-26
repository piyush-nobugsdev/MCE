'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { FarmerNavbar } from '../components/navbar'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Farmer, Job } from '@/lib/types'
import { WeatherWidget } from '@/components/farmer/WeatherWidget'
import { useLanguage } from '@/lib/i18n/context'
import { findFarmerByUserId, getFarmerJobs } from '@/lib/api/farmer'
import { DashboardStats } from './components/DashboardStats'
import { QuickActions } from './components/QuickActions'
import { RecentJobsList } from './components/RecentJobsList'

export default function FarmerDashboard() {
  const [farmer, setFarmer] = useState<Farmer | null>(null)
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
         window.location.href = '/auth/role-selection'
         return
      }

      const farmerData = await findFarmerByUserId(user.id)
      if (farmerData) {
        setFarmer(farmerData)
        const jobsData = await getFarmerJobs(farmerData.id)
        setJobs(jobsData)
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  const { t } = useLanguage()

  if (loading) return <div className="p-10 text-center text-gray-400 font-bold uppercase tracking-widest animate-pulse">{t('loading_profile')}</div>
  
  if (!farmer) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-red-500 font-bold uppercase tracking-tighter">{t('profile_not_found')}</p>
    </div>
  )

  const activeJobsCount = jobs.filter((j) => j.status === 'open').length
  const completedJobsCount = jobs.filter((j) => j.status === 'completed').length

  return (
    <div className="min-h-screen bg-gray-50/50 font-sans pb-10">
      <FarmerNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase leading-none">{t('dashboard')}</h1>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">{t('welcome_back')}, {farmer.first_name} {farmer.last_name}</p>
          </div>
          <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-gray-200 shadow-sm">
             <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <Plus className="w-5 h-5 text-green-600" />
             </div>
             <Link href="/farmer/jobs/new" className="text-xs font-bold text-gray-900 uppercase tracking-widest pr-4 hover:text-green-600 transition-colors">
                {t('add_new')}
             </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Area (8/12) */}
          <div className="lg:col-span-8 space-y-10">
            <DashboardStats 
              activeJobs={activeJobsCount} 
              completedJobs={completedJobsCount} 
              rating={farmer.rating} 
            />
            
            <div className="space-y-4">
               <h2 className="text-xs font-bold text-gray-400 uppercase tracking-[0.3em] ml-1">Services & Management</h2>
               <QuickActions />
            </div>

            <RecentJobsList jobs={jobs} />
          </div>

          {/* Sidebar Area (4/12) */}
          <div className="lg:col-span-4 space-y-8">
            <WeatherWidget 
              lat={farmer.farm_location?.lat || 0} 
              lng={farmer.farm_location?.lng || 0} 
            />
            
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
               <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest">{t('upcoming_schedule')}</h3>
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
               </div>
               <div className="bg-gray-50/50 p-8 rounded-xl text-center border border-dashed border-gray-200">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">{t('no_activities_today')}</p>
               </div>
            </div>

            <div className="bg-gradient-to-br from-green-600 to-green-700 p-8 rounded-2xl text-white shadow-lg shadow-green-100/50 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-110 transition-transform" />
               <h4 className="text-xs font-black uppercase tracking-[0.3em] opacity-60 mb-2">Support Portal</h4>
               <p className="text-lg font-bold leading-tight mb-6">Need expert advice or immediate help with your farm?</p>
               <Link href="/farmer/sahyog-kendra">
                  <Button className="w-full bg-white text-green-700 hover:bg-green-50 rounded-xl font-black uppercase tracking-widest text-[10px] h-12">
                    Open Sahyog Kendra
                  </Button>
               </Link>
            </div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100;300;400;500;700;900&display=swap');
        body { font-family: 'Outfit', sans-serif; }
      `}</style>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { FarmerNavbar } from '../components/navbar'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Farmer, Job } from '@/lib/types'
import { WeatherWidget } from '@/components/farmer/WeatherWidget'
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

  if (loading) return <div className="p-10 text-center text-gray-400 font-bold uppercase tracking-widest animate-pulse">Loading Profile...</div>
  
  if (!farmer) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-red-500 font-bold uppercase tracking-tighter">Profile not found. Please log in again.</p>
    </div>
  )

  const activeJobsCount = jobs.filter((j) => j.status === 'open').length
  const completedJobsCount = jobs.filter((j) => j.status === 'completed').length

  return (
    <div className="min-h-screen bg-gray-50/50 font-sans pb-10">
      <FarmerNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase leading-none">Dashboard</h1>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Welcome back, {farmer.first_name} {farmer.last_name}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Area (8/12) */}
          <div className="lg:col-span-8 space-y-10">
            <DashboardStats 
              activeJobs={activeJobsCount} 
              completedJobs={completedJobsCount} 
              rating={farmer.rating} 
            />
            
            <QuickActions />

            <RecentJobsList jobs={jobs} />
          </div>

          {/* Sidebar Area (4/12) */}
          <div className="lg:col-span-4 space-y-8">
            <WeatherWidget lat={0} lng={0} />
            
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 space-y-4">
               <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Upcoming Schedule</h3>
               <div className="bg-gray-50 p-6 rounded-2xl text-center">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">No activities scheduled for today</p>
               </div>
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

'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FarmerNavbar } from '../components/navbar'
import Link from 'next/link'
import { Plus, Briefcase, Users, Star, IndianRupee, ChevronRight } from 'lucide-react'
import { Farmer, Job } from '@/lib/types'
import { useLanguage } from '@/lib/i18n/context'

export default function FarmerDashboard() {
  const { t } = useLanguage()
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

      const { data: farmerData } = await supabase
        .from('farmers')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (farmerData) {
        setFarmer(farmerData)
        const { data: jobsData } = await supabase
          .from('jobs')
          .select('*')
          .eq('farmer_id', farmerData.id)
          .order('created_at', { ascending: false })
        if (jobsData) setJobs(jobsData)
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  if (loading) return <div className="p-10 text-center text-gray-400 font-bold">Loading...</div>
  
  if (!farmer) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-red-500 font-bold">Profile not found. Please log in again.</p>
    </div>
  )

  const activeJobs = jobs.filter((j) => j.status === 'open').length
  const completedJobs = jobs.filter((j) => j.status === 'completed').length

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      <FarmerNavbar />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 leading-tight">
            Welcome back, <span className="text-green-600">{farmer.full_name}!</span>
          </h1>
          <p className="text-lg text-gray-500 mt-1 font-medium italic">Manage your farm and help workers find jobs</p>
        </div>

        {/* Stats Section - Simple & Clear */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-400 mb-1">{t('active_jobs')}</p>
              <p className="text-4xl font-bold text-gray-900">{activeJobs}</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-400 mb-1">{t('completed_jobs')}</p>
              <p className="text-4xl font-bold text-gray-900">{completedJobs}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-400 mb-1">Your Rating</p>
              <p className="text-4xl font-bold text-gray-900">{farmer.rating.toFixed(1)}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
            </div>
          </div>
        </div>

        {/* Action Grid - Big & Obvious Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <Link href="/farmer/jobs/new">
            <Button className="w-full h-24 bg-green-600 hover:bg-green-700 rounded-3xl shadow-lg shadow-green-100 text-white flex items-center justify-between px-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Plus className="w-6 h-6 text-white stroke-[3]" />
                </div>
                <span className="text-xl font-bold">{t('post_job')}</span>
              </div>
              <ChevronRight className="w-6 h-6 opacity-30" />
            </Button>
          </Link>

          <Link href="/farmer/applications">
            <Button variant="outline" className="w-full h-24 rounded-3xl border-2 border-gray-100 bg-white hover:bg-gray-50 flex items-center justify-between px-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-xl font-bold text-gray-900">{t('applications')}</span>
              </div>
              <ChevronRight className="w-6 h-6 opacity-10 text-gray-900" />
            </Button>
          </Link>
        </div>

        {/* List Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
             <h2 className="text-2xl font-bold text-gray-900">{t('recent_jobs')}</h2>
             <Link href="/farmer/jobs" className="text-sm font-bold text-green-600 hover:underline">See All</Link>
          </div>

          {jobs.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center">
               <p className="text-gray-300 font-bold">No jobs posted yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {jobs.slice(0, 4).map((job) => (
                <Link key={job.id} href={`/farmer/jobs/${job.id}`}>
                  <div className="bg-white p-6 rounded-3xl border border-gray-100 hover:border-green-200 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                          job.status === 'open' ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'
                        }`}>
                          {job.status === 'open' ? 'Live' : 'Closed'}
                        </span>
                        <span className="text-xs font-bold text-gray-400">📍 {typeof job.location === 'string' ? job.location : job.location?.name}</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                    </div>
                    <div className="flex items-center justify-between md:justify-end gap-10">
                      <div className="text-right">
                        <p className="text-xs font-bold text-gray-400 mb-0.5">Pay Rate</p>
                        <p className="text-lg font-bold text-green-600 flex items-center gap-1">
                          <IndianRupee className="w-4 h-4" /> {job.wage_amount} <span className="text-xs text-gray-400">/ Day</span>
                        </p>
                      </div>
                      <ChevronRight className="w-6 h-6 text-gray-200" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}


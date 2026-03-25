'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FarmerNavbar } from '../components/navbar'
import Link from 'next/link'
import { Plus, Briefcase, Users, Star, IndianRupee, ChevronRight, MapPin } from 'lucide-react'
import { Farmer, Job } from '@/lib/types'
import { useLanguage } from '@/lib/i18n/context'
import { getReceivedReviews, getRatingSummary } from '@/app/actions/ratings'

export default function FarmerDashboard() {
  const { t } = useLanguage()
  const [farmer, setFarmer] = useState<Farmer | null>(null)
  const [jobs, setJobs] = useState<Job[]>([])
  const [reviews, setReviews] = useState<any[]>([])
  const [ratingSummary, setRatingSummary] = useState({ average: 0, count: 0 })
  const [loading, setLoading] = useState(true)

  const refreshReviews = useCallback(async (userId: string) => {
    const [reviewsResult, summaryResult] = await Promise.all([
      getReceivedReviews(userId, 'worker_to_farmer'),
      getRatingSummary(userId, 'worker_to_farmer')
    ])
    if (reviewsResult.reviews) setReviews(reviewsResult.reviews)
    if (summaryResult.count !== undefined) setRatingSummary(summaryResult as any)
  }, [])

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
        
        await refreshReviews(user.id)
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
            Welcome back, <span className="text-green-600">{farmer.first_name || farmer.full_name}!</span>
          </h1>
          <p className="text-lg text-gray-500 mt-1 font-medium italic">Manage your farm and help workers find jobs</p>
        </div>

        {/* Stats Section */}
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
              <p className="text-4xl font-bold text-gray-900 flex items-center gap-2">
                {ratingSummary.average.toFixed(1)} <span className="text-xl text-gray-200 font-medium">({ratingSummary.count})</span>
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
            </div>
          </div>
        </div>

        {/* Action Grid */}
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

          <Link href="/farmer/farms">
            <Button variant="outline" className="w-full h-24 rounded-3xl border-2 border-gray-100 bg-white hover:bg-gray-50 flex items-center justify-between px-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-xl font-bold text-gray-900">Manage My Farms</span>
              </div>
              <ChevronRight className="w-6 h-6 opacity-10 text-gray-900" />
            </Button>
          </Link>
        </div>

        {/* Recent Reviews - NEW! */}
        {reviews.length > 0 && (
          <div className="mb-16 space-y-6">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-2xl font-bold text-gray-900">Worker Feedback</h2>
              <div className="flex items-center gap-1 text-sm font-bold text-yellow-600">
                <Star className="w-4 h-4 fill-yellow-500" /> {ratingSummary.average.toFixed(1)}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.slice(0, 4).map((review) => (
                <Card key={review.id} className="border border-gray-100 bg-white/50 rounded-3xl overflow-hidden shadow-sm">
                  <CardContent className="p-8 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className={`w-3.5 h-3.5 ${s <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-100 fill-gray-100'}`} />
                        ))}
                      </div>
                      <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{new Date(review.created_at).toLocaleDateString()}</p>
                    </div>
                    {review.comment && (
                      <p className="text-lg font-medium text-gray-700 leading-relaxed italic">
                        "{review.comment}"
                      </p>
                    )}
                    {review.tags && review.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {review.tags.map((tag: string) => (
                            <span key={tag} className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black uppercase rounded-lg">
                              {tag}
                            </span>
                          ))}
                        </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Recent Jobs List */}
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

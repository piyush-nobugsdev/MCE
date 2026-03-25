'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { WorkerNavbar } from '../components/navbar'
import Link from 'next/link'
import { Briefcase, Star, IndianRupee, ChevronRight, Search, DollarSign, CheckCheck, MessageSquare, Quote } from 'lucide-react'
import { Worker, Job, WorkerApplicationDetails } from '@/lib/types'
import { useLanguage } from '@/lib/i18n/context'
import { getWorkerApplications, markCompletion } from '@/app/actions/applications'
import { getReceivedReviews, getRatingSummary } from '@/app/actions/ratings'
import { toast } from 'sonner'
import { RatingModal } from '@/components/rating-modal'

export default function WorkerDashboard() {
  const { t } = useLanguage()
  const [worker, setWorker] = useState<Worker | null>(null)
  const [jobs, setJobs] = useState<Job[]>([])
  const [applications, setApplications] = useState<WorkerApplicationDetails[]>([])
  const [reviews, setReviews] = useState<any[]>([])
  const [ratingSummary, setRatingSummary] = useState({ average: 0, count: 0 })
  const [loading, setLoading] = useState(true)
  const [completingId, setCompletingId] = useState<string | null>(null)
  const [ratingModal, setRatingModal] = useState<{
    applicationId: string
    farmerName: string
  } | null>(null)

  const supabaseRef = { current: createClient() }

  const fetchWorkerProfile = useCallback(async (userId: string) => {
    const { data } = await supabaseRef.current
      .from('workers')
      .select('*')
      .eq('user_id', userId)
      .single()
    if (data) setWorker(data)
  }, [])

  const refreshApplications = useCallback(async () => {
    const result = await getWorkerApplications()
    if (result.applications) setApplications(result.applications as WorkerApplicationDetails[])
  }, [])

  const refreshReviews = useCallback(async (userId: string) => {
    const [reviewsResult, summaryResult] = await Promise.all([
      getReceivedReviews(userId, 'farmer_to_worker'),
      getRatingSummary(userId, 'farmer_to_worker')
    ])
    if (reviewsResult.reviews) setReviews(reviewsResult.reviews)
    if (summaryResult.count !== undefined) setRatingSummary(summaryResult as any)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/auth/role-selection'; return }

      const { data: workerData } = await supabase
        .from('workers').select('*').eq('user_id', user.id).single()

      if (workerData) {
        setWorker(workerData)
        const { data: jobsData } = await supabase
          .from('jobs').select('*').eq('status', 'open').order('created_at', { ascending: false })
        if (jobsData) setJobs(jobsData)
        
        await Promise.all([
          refreshApplications(),
          refreshReviews(user.id)
        ])
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  const handleMarkComplete = async (applicationId: string) => {
    setCompletingId(applicationId)
    const result = await markCompletion(applicationId, 'worker')
    setCompletingId(null)
    if (result.error) toast.error(result.error)
    else {
      toast.success(result.fullyCompleted ? 'Job fully completed! Both parties confirmed.' : 'Your completion confirmed. Waiting for farmer.')
      await refreshApplications()
    }
  }

  const handleRatingSuccess = async () => {
    setRatingModal(null)
    // Re-fetch applications (to update worker_rated_farmer flag)
    await refreshApplications()
    // Re-fetch the worker's own profile and his reviews/summary
    const { data: { user } } = await supabaseRef.current.auth.getUser()
    if (user) {
      await Promise.all([
        fetchWorkerProfile(user.id),
        refreshReviews(user.id)
      ])
    }
    toast.success('Your rating has been submitted successfully!')
  }

  if (loading) return <div className="p-10 text-center text-gray-400 font-bold">Loading...</div>
  if (!worker) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-red-500 font-bold">Profile not found. Please log in again.</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      <WorkerNavbar />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 leading-tight">
            Hello, <span className="text-blue-600">{worker.first_name}!</span>
          </h1>
          <p className="text-lg text-gray-500 mt-1 font-medium italic">Find the best farm jobs near you</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-400 mb-1">{t('applied_jobs')}</p>
              <p className="text-4xl font-bold text-gray-900">{applications.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-400 mb-1">{t('earnings')}</p>
              <p className="text-3xl font-bold text-green-600 flex items-center gap-1">
                <IndianRupee className="w-6 h-6" /> {worker.total_earned || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-400 mb-1">Your Rating</p>
              <p className="text-4xl font-bold text-gray-900 flex items-center gap-2">
                {ratingSummary.average.toFixed(1)} <span className="text-xl text-gray-300 font-medium">({ratingSummary.count})</span>
              </p>
              <p className="text-xs text-gray-300 font-bold mt-1 uppercase tracking-widest">{worker.total_jobs_completed} jobs completed</p>
            </div>
            <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
            </div>
          </div>
        </div>

        {/* Find Jobs CTA */}
        <div className="mb-16">
          <Link href="/worker/jobs">
            <Button className="w-full h-24 bg-blue-600 hover:bg-blue-700 rounded-3xl shadow-lg shadow-blue-100 text-white flex items-center justify-between px-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Search className="w-6 h-6 text-white stroke-[3]" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-blue-100 mb-0.5">Nearby Work</p>
                  <span className="text-xl font-bold">{t('find_job')}</span>
                </div>
              </div>
              <ChevronRight className="w-6 h-6 opacity-30" />
            </Button>
          </Link>
        </div>

        {/* Recent Reviews - NEW! */}
        {reviews.length > 0 && (
          <div className="mb-16 space-y-6">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-2xl font-bold text-gray-900">What Farmers say about you</h2>
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
                            <span key={tag} className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase rounded-lg">
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

        {/* Applications */}
        {applications.length > 0 && (
          <div className="space-y-6 mb-16">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-2xl font-bold text-gray-900">Your Recent Applications</h2>
              <Link href="/worker/applications" className="text-sm font-bold text-blue-600 hover:underline">See All</Link>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {applications.slice(0, 4).map((app) => {
                const isFullyCompleted = app.status === 'completed'
                const farmerConfirmed = (app as any).farmer_completed && !(app as any).worker_completed

                return (
                  <div key={app.id} className="bg-white p-6 rounded-3xl border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                          isFullyCompleted ? 'bg-purple-50 text-purple-700' :
                          farmerConfirmed ? 'bg-orange-50 text-orange-700' :
                          app.status === 'accepted' ? 'bg-green-50 text-green-700' :
                          app.status === 'pending' ? 'bg-yellow-50 text-yellow-700' :
                          'bg-red-50 text-red-700'
                        }`}>
                          {isFullyCompleted ? '✓ Completed' :
                           farmerConfirmed ? '👆 Farmer Confirmed' :
                           app.status}
                        </span>
                        {app.status === 'accepted' && !isFullyCompleted && (
                          <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                            Code: {app.farmer_code}
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">{app.job_title}</h3>
                    </div>

                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="text-right">
                        <p className="text-xs font-bold text-gray-400 mb-0.5">Pay Rate</p>
                        <p className="text-lg font-bold text-green-600 flex items-center gap-1">
                          <IndianRupee className="w-4 h-4" /> {app.job_wage}
                        </p>
                      </div>

                      {app.status === 'accepted' && !(app as any).worker_completed && (
                        <Button
                          onClick={() => handleMarkComplete(app.id)}
                          disabled={completingId === app.id}
                          className="h-10 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-bold"
                        >
                          <CheckCheck className="w-4 h-4 mr-2" />
                          {completingId === app.id ? 'Confirming...' : 'Mark Complete'}
                        </Button>
                      )}

                      {isFullyCompleted && !app.worker_rated_farmer && (
                        <Button
                          onClick={() => setRatingModal({ applicationId: app.id, farmerName: app.farmer_first_name })}
                          className="h-10 bg-yellow-500 hover:bg-yellow-600 rounded-xl text-sm font-bold"
                        >
                          <Star className="w-4 h-4 mr-2 fill-white" /> Rate Farmer
                        </Button>
                      )}

                      {isFullyCompleted && app.worker_rated_farmer && (
                        <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-2 rounded-xl">✓ Rated</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Available Jobs */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-2xl font-bold text-gray-900">{t('available_work')}</h2>
            <Link href="/worker/jobs" className="text-sm font-bold text-blue-600 hover:underline">See All</Link>
          </div>

          {jobs.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center">
              <p className="text-gray-300 font-bold">Searching for new jobs...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {jobs.slice(0, 4).map((job) => (
                <Link key={job.id} href={`/worker/jobs/${job.id}`}>
                  <div className="bg-white p-6 rounded-3xl border border-gray-100 hover:border-blue-200 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-700">Available</span>
                        <span className="text-xs font-bold text-gray-400">📍 {typeof job.location === 'string' ? job.location : job.location?.name}</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                    </div>
                    <div className="flex items-center justify-between md:justify-end gap-10">
                      <div className="text-right">
                        <p className="text-xs font-bold text-gray-400 mb-0.5">Daily Pay</p>
                        <p className="text-lg font-bold text-green-600 flex items-center gap-1">
                          <IndianRupee className="w-4 h-4" /> {job.wage_amount}
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

      {/* Rating Modal */}
      {ratingModal && (
        <RatingModal
          applicationId={ratingModal.applicationId}
          rateeDisplayName={ratingModal.farmerName}
          type="worker_to_farmer"
          onSuccess={handleRatingSuccess}
          onClose={() => setRatingModal(null)}
        />
      )}
    </div>
  )
}

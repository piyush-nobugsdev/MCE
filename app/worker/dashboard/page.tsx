'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { WorkerNavbar } from '../components/navbar'
import Link from 'next/link'
import { Plus, Briefcase, Users, Star, IndianRupee, ChevronRight, Search, DollarSign } from 'lucide-react'
import { Worker, Job, WorkerApplicationDetails } from '@/lib/types'
import { useLanguage } from '@/lib/i18n/context'
import { getWorkerApplications } from '@/app/actions/applications'
import { rateUser } from '@/app/actions/ratings'
import { toast } from 'sonner'

export default function WorkerDashboard() {
  const { t } = useLanguage()
  const [worker, setWorker] = useState<Worker | null>(null)
  const [jobs, setJobs] = useState<Job[]>([])
  const [applications, setApplications] = useState<WorkerApplicationDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [ratingModal, setRatingModal] = useState<{
    open: boolean
    jobId: string
    farmerCode: string
  } | null>(null)
  const [rating, setRating] = useState(5)
  const [feedback, setFeedback] = useState('')
  const [ratingLoading, setRatingLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        window.location.href = '/auth/role-selection'
        return
      }

      const { data: workerData } = await supabase
        .from('workers')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (workerData) {
        setWorker(workerData)
        
        // Fetch open jobs
        const { data: jobsData } = await supabase
          .from('jobs')
          .select('*')
          .eq('status', 'open')
          .order('created_at', { ascending: false })
        if (jobsData) setJobs(jobsData)

        // Fetch applications
        const appsResult = await getWorkerApplications()
        if (appsResult.applications) {
          setApplications(appsResult.applications)
        }
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  const handleRateFarmer = async () => {
    if (!ratingModal) return

    setRatingLoading(true)
    const result = await rateUser(ratingModal.jobId, rating, feedback, 'worker_to_farmer')
    setRatingLoading(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Farmer rated successfully!')
      setRatingModal(null)
      setRating(5)
      setFeedback('')
      // Refresh applications
      const appsResult = await getWorkerApplications()
      if (appsResult.applications) {
        setApplications(appsResult.applications)
      }
    }
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

        {/* Stats Section - Simple & Clear */}
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
              <p className="text-4xl font-bold text-gray-900">{worker.rating.toFixed(1)}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
            </div>
          </div>
        </div>

        {/* Action Button - Big & Obvious Buttons */}
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

        {/* Applied Jobs Section */}
        {applications.length > 0 && (
          <div className="space-y-6 mb-16">
            <div className="flex items-center justify-between px-2">
               <h2 className="text-2xl font-bold text-gray-900">Your Applications</h2>
               <Link href="/worker/applications" className="text-sm font-bold text-blue-600 hover:underline">See All</Link>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {applications.slice(0, 4).map((app) => (
                <div key={app.id} className="bg-white p-6 rounded-3xl border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                        app.job_status === 'completed' && app.status === 'accepted' ? 'bg-purple-50 text-purple-700' :
                        app.status === 'pending' ? 'bg-yellow-50 text-yellow-700' :
                        app.status === 'accepted' ? 'bg-green-50 text-green-700' :
                        'bg-red-50 text-red-700'
                      }`}>
                        {app.job_status === 'completed' && app.status === 'accepted' ? 'Job Completed' : app.status}
                      </span>
                      {app.status === 'accepted' ? (
                        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                          Farmer Code: {app.farmer_code}
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-gray-400">📍 {typeof app.job_location === 'string' ? app.job_location : app.job_location?.name}</span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{app.job_title}</h3>
                  </div>
                  <div className="flex items-center justify-between md:justify-end gap-10">
                    <div className="text-right">
                      <p className="text-xs font-bold text-gray-400 mb-0.5">Pay Rate</p>
                      <p className="text-lg font-bold text-green-600 flex items-center gap-1">
                        <IndianRupee className="w-4 h-4" /> {app.job_wage}
                      </p>
                    </div>

                    {app.status === 'accepted' && app.job_status === 'completed' && !app.worker_rated_farmer && (
                      <Button
                        onClick={() => setRatingModal({ open: true, jobId: app.job_id, farmerCode: app.farmer_code })}
                        className="h-10 bg-yellow-600 hover:bg-yellow-700 rounded-xl text-sm font-bold"
                      >
                        <Star className="w-4 h-4 mr-2" />
                        Rate
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* List Section */}
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
      {mounted && ratingModal?.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900">Rate Farmer</h3>
                  <p className="text-gray-500 mt-2">Farmer Code: <span className="font-bold text-green-600">{ratingModal.farmerCode}</span></p>
                </div>

                {/* Star Rating */}
                <div className="space-y-3">
                  <p className="text-sm font-bold text-gray-700">Rating</p>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        className="text-3xl"
                      >
                        <Star className={`w-8 h-8 ${star <= rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Feedback */}
                <div className="space-y-3">
                  <p className="text-sm font-bold text-gray-700">Feedback</p>
                  <select
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl"
                  >
                    <option value="">Select feedback...</option>
                    <option value="Good pay">Good pay</option>
                    <option value="Fair treatment">Fair treatment</option>
                    <option value="Clear instructions">Clear instructions</option>
                    <option value="Delayed payment">Delayed payment</option>
                    <option value="Poor conditions">Poor conditions</option>
                  </select>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button
                    onClick={() => setRatingModal(null)}
                    variant="outline"
                    className="flex-1"
                    disabled={ratingLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleRateFarmer}
                    className="flex-1 bg-yellow-600 hover:bg-yellow-700"
                    disabled={ratingLoading}
                  >
                    {ratingLoading ? "Rating..." : "Submit Rating"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}


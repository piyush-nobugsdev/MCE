'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Briefcase, Star, IndianRupee, ChevronRight, Search, DollarSign, CheckCheck } from 'lucide-react'
import { Worker, Job, WorkerApplicationDetails } from '@/lib/types'
import { useLanguage } from '@/lib/i18n/context'
import { markCompletion } from '@/app/actions/applications'
import { toast } from 'sonner'
import { RatingModal } from '@/components/rating-modal'
import { useRouter } from 'next/navigation'

interface Props {
  worker: Worker
  jobs: Job[]
  applications: WorkerApplicationDetails[]
  reviews: any[]
  ratingSummary: { average: number; count: number }
}

export function WorkerDashboardClient({ worker, jobs, applications, reviews, ratingSummary }: Props) {
  const { t } = useLanguage()
  const router = useRouter()
  const [completingId, setCompletingId] = useState<string | null>(null)
  const [ratingModal, setRatingModal] = useState<{
    applicationId: string
    farmerName: string
  } | null>(null)

  const handleMarkComplete = async (applicationId: string) => {
    setCompletingId(applicationId)
    const result = await markCompletion(applicationId, 'worker')
    setCompletingId(null)
    if (result.error) toast.error(result.error)
    else {
      toast.success(result.fullyCompleted ? 'Job fully completed! Both parties confirmed.' : 'Your completion confirmed. Waiting for farmer.')
      router.refresh()
    }
  }

  const handleRatingSuccess = async () => {
    setRatingModal(null)
    router.refresh()
    toast.success('Your rating has been submitted successfully!')
  }

  return (
    <div className="space-y-12">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{t('applied_jobs')}</p>
            <p className="text-4xl font-black text-gray-900 tracking-tighter">{applications.length}</p>
          </div>
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
            <Briefcase className="w-6 h-6 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{t('earnings')}</p>
            <p className="text-3xl font-black text-green-600 flex items-center gap-1 tracking-tighter">
              <IndianRupee className="w-5 h-5" /> {worker.total_earned || 0}
            </p>
          </div>
          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between transition-all hover:shadow-md group">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Your Rating</p>
            <p className="text-4xl font-black text-gray-900 flex items-center gap-2 tracking-tighter">
              {ratingSummary.average.toFixed(1)} <span className="text-xl text-gray-300 font-medium">({ratingSummary.count})</span>
            </p>
            <p className="text-[8px] text-gray-400 font-bold mt-1 uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">{worker.total_jobs_completed} jobs completed</p>
          </div>
          <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
          </div>
        </div>
      </div>

      {/* Find Jobs CTA */}
      <Link href="/worker/jobs" className="block group">
        <div className="w-full h-24 bg-blue-600 hover:bg-blue-700 rounded-3xl shadow-lg shadow-blue-100/50 text-white flex items-center justify-between px-8 transition-all">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
              <Search className="w-6 h-6 text-white stroke-[3]" />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black text-blue-100 mb-0.5 uppercase tracking-widest">{t('available_work')}</p>
              <span className="text-xl font-black uppercase tracking-tight">{t('find_job')}</span>
            </div>
          </div>
          <ChevronRight className="w-6 h-6 opacity-30 group-hover:translate-x-1 group-hover:opacity-70 transition-all" />
        </div>
      </Link>

      {/* Recent Reviews */}
      {reviews.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-sm font-black text-gray-900 uppercase tracking-[0.2em]">Worker Feedback</h2>
            <div className="flex items-center gap-1 text-[10px] font-black text-yellow-600 uppercase tracking-widest mr-2 cursor-help border-b-2 border-yellow-100">
              <Star className="w-3.5 h-3.5 fill-yellow-500" /> {ratingSummary.average.toFixed(1)} Summary
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.slice(0, 4).map((review) => (
              <Card key={review.id} className="border border-gray-100 bg-white/50 rounded-3xl overflow-hidden shadow-sm hover:border-gray-300 transition-all">
                <CardContent className="p-8 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={`w-3 h-3 ${s <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-100 fill-gray-100'}`} />
                      ))}
                    </div>
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest opacity-40">{new Date(review.created_at).toLocaleDateString()}</p>
                  </div>
                  {review.comment && (
                    <p className="text-lg font-medium text-gray-700 leading-relaxed italic opacity-80">
                      "{review.comment}"
                    </p>
                  )}
                  {review.tags && review.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {review.tags.map((tag: string) => (
                        <span key={tag} className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase rounded-lg border border-blue-100/50">
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

      {/* Recent Applications */}
      {applications.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-sm font-black text-gray-900 uppercase tracking-[0.2em]">{t('your_applications')}</h2>
            <Link href="/worker/applications" className="text-[10px] font-black text-blue-600 hover:text-blue-700 uppercase tracking-widest transition-colors">{t('see_all')}</Link>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {applications.slice(0, 4).map((app) => {
              const isFullyCompleted = app.status === 'completed'
              const farmerConfirmed = (app as any).farmer_completed && !(app as any).worker_completed

              return (
                <div key={app.id} className="bg-white p-6 rounded-3xl border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm hover:border-blue-100 transition-all">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className={`px-4 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                        isFullyCompleted ? 'bg-purple-50 text-purple-700' :
                        farmerConfirmed ? 'bg-orange-50 text-orange-700' :
                        app.status === 'accepted' ? 'bg-green-50 text-green-700' :
                        app.status === 'pending' ? 'bg-yellow-50 text-yellow-700' :
                        'bg-red-50 text-red-700'
                      }`}>
                        {isFullyCompleted ? '✓ ' + t('job_completed') :
                         farmerConfirmed ? '👆 Farmer Confirmed' :
                         app.status}
                      </span>
                      {app.status === 'accepted' && !isFullyCompleted && (
                        <span className="text-[10px] font-black text-green-600 bg-green-50 px-3 py-1 rounded-xl border border-green-100 uppercase tracking-widest">
                          Code: {app.farmer_code}
                        </span>
                      )}
                      {app.status !== 'accepted' && (
                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">📍 {typeof app.job_location === 'string' ? app.job_location : app.job_location?.name}</span>
                      )}
                    </div>
                    <h3 className="text-xl font-black uppercase tracking-tight text-gray-900 leading-none">{app.job_title}</h3>
                  </div>

                  <div className="flex items-center gap-4 flex-wrap border-t md:border-t-0 pt-4 md:pt-0">
                    <div className="text-right">
                      <p className="text-[8px] font-black text-gray-400 mb-1.5 uppercase tracking-widest">{t('pay_rate')}</p>
                      <p className="text-lg font-black text-green-600 flex items-center gap-1.5 leading-none">
                        <IndianRupee className="w-4 h-4" /> {app.job_wage}
                      </p>
                    </div>

                    {app.status === 'accepted' && !(app as any).worker_completed && (
                      <Button
                        onClick={() => handleMarkComplete(app.id)}
                        disabled={completingId === app.id}
                        className="h-12 bg-blue-600 hover:bg-blue-700 rounded-xl text-[10px] font-black uppercase tracking-widest px-6"
                      >
                        <CheckCheck className="w-4 h-4 mr-2" />
                        {completingId === app.id ? 'Confirming...' : 'Mark Complete'}
                      </Button>
                    )}

                    {isFullyCompleted && !app.worker_rated_farmer && (
                      <Button
                        onClick={() => setRatingModal({ applicationId: app.id, farmerName: app.farmer_first_name })}
                        className="h-12 bg-yellow-500 hover:bg-yellow-600 rounded-xl text-[10px] font-black uppercase tracking-widest px-6"
                      >
                        <Star className="w-4 h-4 mr-2 fill-white" /> Rate Farmer
                      </Button>
                    )}

                    {isFullyCompleted && app.worker_rated_farmer && (
                      <div className="text-[10px] font-black text-green-600 bg-green-50 px-4 py-3 rounded-xl border border-green-100 uppercase tracking-widest">✓ Rated</div>
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
          <h2 className="text-sm font-black text-gray-900 uppercase tracking-[0.2em]">{t('available_work')}</h2>
          <Link href="/worker/jobs" className="text-[10px] font-black text-blue-600 hover:text-blue-700 uppercase tracking-widest transition-colors">{t('see_all')}</Link>
        </div>

        {jobs.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-gray-100 border-dashed text-center">
            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{t('searching_jobs')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {jobs.slice(0, 4).map((job) => (
              <Link key={job.id} href={`/worker/jobs/${job.id}`} className="group">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 hover:border-gray-400 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest bg-blue-50 text-blue-700 border border-blue-100/50">{t('available')}</span>
                      <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">📍 {typeof job.location === 'string' ? job.location : job.location?.name}</span>
                    </div>
                    <h3 className="text-xl font-black uppercase tracking-tight text-gray-900 leading-none group-hover:text-blue-600 transition-colors">{job.title}</h3>
                  </div>
                  <div className="flex items-center justify-between md:justify-end gap-10 border-t md:border-t-0 pt-4 md:pt-0">
                    <div className="text-right">
                      <p className="text-[8px] font-black text-gray-400 mb-1.5 uppercase tracking-widest">{t('daily_pay')}</p>
                      <p className="text-lg font-black text-green-600 flex items-center gap-1.5 leading-none shadow-green-50">
                        <IndianRupee className="w-4 h-4" /> {job.wage_amount}
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                      <ChevronRight className="w-4 h-4 text-gray-200 group-hover:text-white transition-all transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

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

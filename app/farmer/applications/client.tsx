'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, XCircle, Clock, MapPin, Star, Briefcase, Tag, CheckCheck } from 'lucide-react'
import { ApplicationWithDetails } from '@/lib/types'
import { useLanguage } from '@/lib/i18n/context'
import { toast } from 'sonner'
import { updateApplicationStatus, markCompletion } from '@/app/actions/applications'
import { RatingModal } from '@/components/rating-modal'
import { useRouter } from 'next/navigation'

interface Props {
  applications: ApplicationWithDetails[]
}

function getCompletionStatus(app: ApplicationWithDetails) {
  if (app.status === 'completed') return 'completed'
  if (app.farmer_completed && !app.worker_completed) return 'pending_worker'
  if (!app.farmer_completed && app.worker_completed) return 'pending_farmer'
  return null
}

export function FarmerApplicationsClient({ applications }: Props) {
  const { t } = useLanguage()
  const router = useRouter()
  const [completingId, setCompletingId] = useState<string | null>(null)
  const [ratingModal, setRatingModal] = useState<{
    applicationId: string
    workerName: string
  } | null>(null)

  const updateStatus = async (applicationId: string, status: 'accepted' | 'rejected') => {
    const result = await updateApplicationStatus(applicationId, status)
    if (result.error) toast.error(result.error)
    else {
      toast.success(`Application ${status} successfully!`)
      router.refresh()
    }
  }

  const handleMarkComplete = async (applicationId: string) => {
    setCompletingId(applicationId)
    const result = await markCompletion(applicationId, 'farmer')
    setCompletingId(null)
    if (result.error) {
      toast.error(result.error)
    } else if (result.fullyCompleted) {
      toast.success('Job marked as fully completed! Both parties have confirmed.')
      router.refresh()
    } else {
      toast.success('Your completion confirmed. Waiting for worker to confirm.')
      router.refresh()
    }
  }

  const applicationsByJob = applications.reduce((acc, app) => {
    if (!acc[app.job_title]) acc[app.job_title] = []
    acc[app.job_title].push(app)
    return acc
  }, {} as Record<string, ApplicationWithDetails[]>)

  if (applications.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm text-center py-24">
        <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Clock className="w-10 h-10 text-gray-200" />
        </div>
        <p className="text-xl font-bold text-gray-400">{t('no_applications')}</p>
        <p className="text-sm text-gray-300 mt-2 font-medium">{t('apply_prompt')}</p>
      </div>
    )
  }

  return (
    <div className="space-y-12">
      {Object.entries(applicationsByJob).map(([jobTitle, jobApplications]) => (
        <div key={jobTitle} className="space-y-6">
          <div className="flex items-center gap-4 px-2">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 leading-tight uppercase tracking-tight">{jobTitle}</h2>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{jobApplications.length} application{jobApplications.length !== 1 ? 's' : ''}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {jobApplications.map((app) => {
              const completionStatus = getCompletionStatus(app)
              const isFullyCompleted = app.status === 'completed'

              return (
                <Card key={app.id} className="border border-gray-100 shadow-sm rounded-3xl overflow-hidden bg-white hover:border-blue-200 transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">

                      {/* Worker Identity */}
                      <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center shadow-inner">
                          <span className="text-4xl font-black text-blue-600">{app.worker_first_name?.[0]?.toUpperCase()}</span>
                        </div>
                        <div className="space-y-2">
                          <p className="text-xs font-bold text-blue-400 uppercase tracking-widest">Worker</p>
                          <p className="text-2xl font-bold text-gray-900">{app.worker_first_name}</p>
                          <p className="text-sm text-gray-500 uppercase font-black tracking-tighter opacity-20">Applied {new Date(app.applied_at).toLocaleDateString()}</p>
                        </div>
                      </div>

                      {/* Worker Stats */}
                      <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="text-center space-y-1">
                          <div className="flex items-center justify-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="text-lg font-bold text-gray-900">{app.worker_rating?.toFixed(1) || '0.0'}</span>
                          </div>
                          <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Rating</p>
                        </div>
                        <div className="text-center space-y-1">
                          <div className="flex items-center justify-center gap-1">
                            <Briefcase className="w-4 h-4 text-green-600" />
                            <span className="text-lg font-bold text-gray-900">{app.worker_completed_jobs}</span>
                          </div>
                          <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Jobs Done</p>
                        </div>
                        <div className="text-center space-y-1">
                          <div className="flex items-center justify-center gap-1">
                            <MapPin className="w-4 h-4 text-red-500" />
                            <span className="text-lg font-bold text-gray-900">{app.distance ? `${app.distance}km` : '--'}</span>
                          </div>
                          <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Distance</p>
                        </div>
                        <div className="text-center space-y-1">
                          <div className="flex items-center justify-center gap-1">
                            <Tag className="w-4 h-4 text-purple-500" />
                            <span className="text-lg font-bold text-gray-900">{app.worker_skills?.length || 0}</span>
                          </div>
                          <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Skills</p>
                        </div>
                      </div>

                      {/* Status & Actions */}
                      <div className="flex flex-col gap-3 min-w-[220px]">
                        <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-center border ${
                          isFullyCompleted ? 'bg-purple-50 text-purple-700 border-purple-100' :
                          completionStatus === 'pending_worker' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                          completionStatus === 'pending_farmer' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                          app.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' :
                          app.status === 'accepted' ? 'bg-green-50 text-green-700 border-green-100' :
                          'bg-red-50 text-red-700 border-red-100'
                        }`}>
                          {isFullyCompleted ? '✓ Completed' :
                           completionStatus === 'pending_worker' ? '⏳ Waiting for Worker' :
                           completionStatus === 'pending_farmer' ? '👆 Worker Confirmed' :
                           app.status}
                        </div>

                        {app.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button
                              onClick={() => updateStatus(app.id, 'accepted')}
                              className="flex-1 h-11 bg-green-600 hover:bg-green-700 rounded-xl text-[10px] font-black uppercase tracking-widest"
                            >
                              <CheckCircle2 className="w-4 h-4 mr-1" /> Accept
                            </Button>
                            <Button
                              onClick={() => updateStatus(app.id, 'rejected')}
                              variant="outline"
                              className="flex-1 h-11 rounded-xl border-red-200 text-red-600 hover:bg-red-50 text-[10px] font-black uppercase tracking-widest"
                            >
                              <XCircle className="w-4 h-4 mr-1" /> Reject
                            </Button>
                          </div>
                        )}

                        {app.status === 'accepted' && !app.farmer_completed && (
                          <Button
                            onClick={() => handleMarkComplete(app.id)}
                            disabled={completingId === app.id}
                            className="w-full h-11 bg-blue-600 hover:bg-blue-700 rounded-xl text-[10px] font-black uppercase tracking-widest"
                          >
                            <CheckCheck className="w-4 h-4 mr-2" />
                            {completingId === app.id ? 'Confirming...' : 'Mark as Complete'}
                          </Button>
                        )}

                        {isFullyCompleted && !app.farmer_rated_worker && (
                          <Button
                            onClick={() => setRatingModal({ applicationId: app.id, workerName: app.worker_first_name })}
                            className="w-full h-11 bg-yellow-600 hover:bg-yellow-700 rounded-xl text-[10px] font-black uppercase tracking-widest"
                          >
                            <Star className="w-4 h-4 mr-2" /> Rate Worker
                          </Button>
                        )}

                        {isFullyCompleted && app.farmer_rated_worker && (
                          <div className="text-center text-[10px] font-black text-green-600 bg-green-50 px-3 py-3 rounded-xl border border-green-100 uppercase tracking-widest">
                            ✓ Worker Rated
                          </div>
                        )}
                      </div>

                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      ))}

      {ratingModal && (
        <RatingModal
          applicationId={ratingModal.applicationId}
          rateeDisplayName={ratingModal.workerName}
          type="farmer_to_worker"
          onSuccess={() => {
            setRatingModal(null)
            router.refresh()
          }}
          onClose={() => setRatingModal(null)}
        />
      )}
    </div>
  )
}

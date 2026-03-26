'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FarmerNavbar } from '@/app/farmer/components/navbar'
import { CheckCircle2, XCircle, Clock, MapPin, Star, Briefcase, Users, Tag, CheckCheck } from 'lucide-react'
import { ApplicationWithDetails } from '@/lib/types'
import { useLanguage } from '@/lib/i18n/context'
import { toast } from 'sonner'
import { getFarmerApplications, updateApplicationStatus, markCompletion } from '@/app/actions/applications'
import { RatingModal } from '@/components/rating-modal'

export const dynamic = 'force-dynamic'

/** Derive a human-readable completion status for a given application from the farmer's POV. */
function getCompletionStatus(app: ApplicationWithDetails) {
  if (app.status === 'completed') return 'completed'
  if (app.farmer_completed && !app.worker_completed) return 'pending_worker'
  if (!app.farmer_completed && app.worker_completed) return 'pending_farmer'
  return null // active / not yet in completion flow
}

export default function ApplicationsPage() {
  const { t } = useLanguage()
  const [applications, setApplications] = useState<ApplicationWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [completingId, setCompletingId] = useState<string | null>(null)
  const [ratingModal, setRatingModal] = useState<{
    applicationId: string
    workerName: string
  } | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const refresh = async () => {
    const result = await getFarmerApplications()
    if (result.applications) setApplications(result.applications)
  }

  useEffect(() => {
    let isMounted = true
    const fetchApplications = async () => {
      const result = await getFarmerApplications()
      if (isMounted) {
        if (result.error) toast.error(result.error)
        else setApplications(result.applications || [])
        setLoading(false)
      }
    }
    fetchApplications()
    return () => { isMounted = false }
  }, [])

  const updateStatus = async (applicationId: string, status: 'accepted' | 'rejected') => {
    const result = await updateApplicationStatus(applicationId, status)
    if (result.error) toast.error(result.error)
    else {
      toast.success(`Application ${status} successfully!`)
      await refresh()
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
      await refresh()
    } else {
      toast.success('Your completion confirmed. Waiting for worker to confirm.')
      await refresh()
    }
  }



  // Group applications by job title
  const applicationsByJob = applications.reduce((acc, app) => {
    if (!acc[app.job_title]) acc[app.job_title] = []
    acc[app.job_title].push(app)
    return acc
  }, {} as Record<string, ApplicationWithDetails[]>)

  if (loading) return <div className="flex items-center justify-center min-h-screen font-bold text-gray-400">{t('loading_applications')}</div>

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      <FarmerNavbar />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 leading-tight">
            {t('applications')}
          </h1>
          <p className="text-lg text-gray-500 mt-1 font-medium italic">
            {t('applications_subtitle')}
          </p>
        </div>

        {Object.keys(applicationsByJob).length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm text-center py-24">
            <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Clock className="w-10 h-10 text-gray-200" />
            </div>
            <p className="text-xl font-bold text-gray-400">{t('no_applications')}</p>
            <p className="text-sm text-gray-300 mt-2 font-medium">{t('apply_prompt')}</p>
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(applicationsByJob).map(([jobTitle, jobApplications]) => (
              <div key={jobTitle} className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{jobTitle}</h2>
                    <p className="text-sm text-gray-500">{jobApplications.length} application{jobApplications.length !== 1 ? 's' : ''}</p>
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
                                <p className="text-sm text-gray-500">Applied {new Date(app.applied_at).toLocaleDateString()}</p>
                              </div>
                            </div>

                            {/* Worker Stats */}
                            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-6">
                              <div className="text-center space-y-1">
                                <div className="flex items-center justify-center gap-1">
                                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                  <span className="text-lg font-bold text-gray-900">{app.worker_rating?.toFixed(1) || '0.0'}</span>
                                </div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Rating</p>
                              </div>
                              <div className="text-center space-y-1">
                                <div className="flex items-center justify-center gap-1">
                                  <Briefcase className="w-4 h-4 text-green-600" />
                                  <span className="text-lg font-bold text-gray-900">{app.worker_completed_jobs}</span>
                                </div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Jobs Done</p>
                              </div>
                              <div className="text-center space-y-1">
                                <div className="flex items-center justify-center gap-1">
                                  <MapPin className="w-4 h-4 text-red-500" />
                                  <span className="text-lg font-bold text-gray-900">{app.distance ? `${app.distance}km` : '--'}</span>
                                </div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Distance</p>
                              </div>
                              <div className="text-center space-y-1">
                                <div className="flex items-center justify-center gap-1">
                                  <Tag className="w-4 h-4 text-purple-500" />
                                  <span className="text-lg font-bold text-gray-900">{app.worker_skills?.length || 0}</span>
                                </div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Skills</p>
                              </div>
                            </div>

                            {/* Skills Tags */}
                            <div className="flex-1 space-y-3">
                              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Skills</p>
                              <div className="flex flex-wrap gap-2">
                                {app.worker_skills?.slice(0, 4).map((skill, index) => (
                                  <span key={index} className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-bold rounded-lg border border-purple-100">
                                    {skill}
                                  </span>
                                )) || <span className="text-sm text-gray-400 italic">No skills listed</span>}
                              </div>
                            </div>

                            {/* Status & Actions */}
                            <div className="flex flex-col gap-3 min-w-[220px]">
                              {/* Status Badge */}
                              <div className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest text-center border ${
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

                              {/* Accept / Reject */}
                              {app.status === 'pending' && (
                                <div className="flex gap-2">
                                  <Button
                                    onClick={() => updateStatus(app.id, 'accepted')}
                                    className="flex-1 h-11 bg-green-600 hover:bg-green-700 rounded-xl text-sm font-bold"
                                  >
                                    <CheckCircle2 className="w-4 h-4 mr-1" /> Accept
                                  </Button>
                                  <Button
                                    onClick={() => updateStatus(app.id, 'rejected')}
                                    variant="outline"
                                    className="flex-1 h-11 rounded-xl border-red-200 text-red-600 hover:bg-red-50"
                                  >
                                    <XCircle className="w-4 h-4 mr-1" /> Reject
                                  </Button>
                                </div>
                              )}

                              {/* Mark Complete — only for accepted, farmer not yet confirmed */}
                              {app.status === 'accepted' && !app.farmer_completed && (
                                <Button
                                  onClick={() => handleMarkComplete(app.id)}
                                  disabled={completingId === app.id}
                                  className="w-full h-11 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-bold"
                                >
                                  <CheckCheck className="w-4 h-4 mr-2" />
                                  {completingId === app.id ? 'Confirming...' : 'Mark as Complete'}
                                </Button>
                              )}

                              {/* Rate Worker — only after both sides confirmed */}
                              {isFullyCompleted && !app.farmer_rated_worker && (
                                <Button
                                  onClick={() => setRatingModal({ applicationId: app.id, workerName: app.worker_first_name })}
                                  className="w-full h-11 bg-yellow-600 hover:bg-yellow-700 rounded-xl text-sm font-bold"
                                >
                                  <Star className="w-4 h-4 mr-2" /> Rate Worker
                                </Button>
                              )}

                              {isFullyCompleted && app.farmer_rated_worker && (
                                <div className="text-center text-xs font-bold text-green-600 bg-green-50 px-3 py-2 rounded-xl border border-green-100">
                                  ✓ Worker Rated
                                </div>
                              )}

                              {app.status === 'accepted' && !isFullyCompleted && app.farmer_completed && (
                                <p className="text-center text-xs text-gray-400 font-medium">
                                  Waiting for worker to confirm completion
                                </p>
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
          </div>
        )}
      </main>

      {/* Rating Modal */}
      {mounted && ratingModal && (
        <RatingModal
          applicationId={ratingModal.applicationId}
          rateeDisplayName={ratingModal.workerName}
          type="farmer_to_worker"
          onSuccess={() => {
            setRatingModal(null)
            refresh()
          }}
          onClose={() => setRatingModal(null)}
        />
      )}
    </div>
  )
}
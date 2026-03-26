'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FarmerNavbar } from '@/app/farmer/components/navbar'
import { CheckCircle2, XCircle, Clock, MapPin, Star, Briefcase, Users, Tag, MessageSquare } from 'lucide-react'
import { ApplicationWithDetails } from '@/lib/types'
import { useLanguage } from '@/lib/i18n/context'
import { toast } from 'sonner'
import { getFarmerApplications, updateApplicationStatus } from '@/app/actions/applications'
import { rateUser } from '@/app/actions/ratings'

export const dynamic = 'force-dynamic'

export default function ApplicationsPage() {
  const { t } = useLanguage()
  const [applications, setApplications] = useState<ApplicationWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [ratingModal, setRatingModal] = useState<{
    open: boolean
    applicationId: string
    workerCode: string
  } | null>(null)
  const [rating, setRating] = useState(5)
  const [feedback, setFeedback] = useState('')
  const [ratingLoading, setRatingLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    let isMounted = true
    const fetchApplications = async () => {
      const result = await getFarmerApplications()
      if (isMounted) {
        if (result.error) {
          toast.error(result.error)
        } else {
          setApplications(result.applications || [])
        }
        setLoading(false)
      }
    }
    fetchApplications()
    return () => { isMounted = false }
  }, [])

  const updateStatus = async (applicationId: string, status: 'accepted' | 'rejected') => {
    const result = await updateApplicationStatus(applicationId, status)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success(`Application ${status} successfully!`)
      // Refresh applications
      const refreshResult = await getFarmerApplications()
      if (refreshResult.applications) {
        setApplications(refreshResult.applications)
      }
    }
  }

  const handleRateWorker = async () => {
    if (!ratingModal) return

    setRatingLoading(true)
    const result = await rateUser(ratingModal.applicationId, rating, feedback, 'farmer_to_worker')
    setRatingLoading(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Worker rated successfully!')
      setRatingModal(null)
      setRating(5)
      setFeedback('')
      // Refresh applications
      const refreshResult = await getFarmerApplications()
      if (refreshResult.applications) {
        setApplications(refreshResult.applications)
      }
    }
  }

  // Group applications by job
  const applicationsByJob = applications.reduce((acc, app) => {
    if (!acc[app.job_title]) {
      acc[app.job_title] = []
    }
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
                  {jobApplications.map((app) => (
                    <Card key={app.id} className="border border-gray-100 shadow-sm rounded-3xl overflow-hidden bg-white hover:border-blue-200 transition-all duration-300">
                      <CardContent className="p-8">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">

                          {/* Worker Identity */}
                          <div className="flex items-center gap-6">
                            <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center shadow-inner">
                              <span className="text-4xl font-black text-blue-600">{app.worker_first_name?.[0]?.toUpperCase()}</span>
                            </div>
                            <div className="space-y-2">
                              <p className="text-xs font-bold text-blue-400 uppercase tracking-widest">Worker Name</p>
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
                              )) || (
                                <span className="text-sm text-gray-400 italic">No skills listed</span>
                              )}
                            </div>
                          </div>

                          {/* Status & Actions */}
                          <div className="flex flex-col gap-4 min-w-[200px]">
                            <div className={`px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest text-center border ${
                              app.job_status === 'completed' && app.status === 'accepted' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                              app.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' :
                              app.status === 'accepted' ? 'bg-green-50 text-green-700 border-green-100' :
                              'bg-red-50 text-red-700 border-red-100'
                            }`}>
                              {app.job_status === 'completed' && app.status === 'accepted' ? 'Job Completed' : app.status}
                            </div>

                            {app.status === 'pending' && app.job_status !== 'completed' && (
                              <div className="flex gap-3">
                                <Button
                                  onClick={() => updateStatus(app.id, 'accepted')}
                                  className="flex-1 h-12 bg-green-600 hover:bg-green-700 rounded-xl text-sm font-bold"
                                >
                                  <CheckCircle2 className="w-4 h-4 mr-2" />
                                  Accept
                                </Button>
                                <Button
                                  onClick={() => updateStatus(app.id, 'rejected')}
                                  variant="outline"
                                  className="flex-1 h-12 rounded-xl border-red-200 text-red-600 hover:bg-red-50"
                                >
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Reject
                                </Button>
                              </div>
                            )}

                            {app.status === 'accepted' && app.job_status === 'completed' && !app.farmer_rated_worker && (
                              <Button
                                onClick={() => setRatingModal({ open: true, applicationId: app.id, workerCode: app.worker_first_name || app.worker_code })}
                                className="w-full h-12 bg-yellow-600 hover:bg-yellow-700 rounded-xl text-sm font-bold"
                              >
                                <Star className="w-4 h-4 mr-2" />
                                Rate Worker
                              </Button>
                            )}
                            
                            {app.status === 'accepted' && app.job_status !== 'completed' && (
                              <div className="text-center text-xs font-bold text-gray-400 mt-2">
                                Job active. Rating unlocks after completion.
                              </div>
                            )}
                          </div>

                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Rating Modal */}
      {mounted && ratingModal?.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900">Rate Worker</h3>
                  <p className="text-gray-500 mt-2">Worker Name: <span className="font-bold text-blue-600">{ratingModal.workerCode}</span></p>
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
                    <option value="Punctual">Punctual</option>
                    <option value="Hard working">Hard working</option>
                    <option value="Skilled">Skilled</option>
                    <option value="Did not show">Did not show</option>
                    <option value="Poor work">Poor work</option>
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
                    onClick={handleRateWorker}
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
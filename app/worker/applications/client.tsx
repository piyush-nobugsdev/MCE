'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Clock, MapPin, IndianRupee, ChevronRight, AlertCircle, Star, CheckCheck } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/context'
import { toast } from 'sonner'
import Link from 'next/link'
import { markCompletion } from '@/app/actions/applications'
import { useRouter } from 'next/navigation'
import { RatingModal } from '@/components/rating-modal'

interface ApplicationWithDetails {
  id: string
  status: string
  job_id: string
  job_title: string
  farmer_first_name: string
  farmer_farm_name: string
  applied_at: string
  job_wage: number
  worker_rated_farmer?: boolean
  job_location?: any
  job_status?: string
  farmer_code?: string
  farmer_completed?: boolean
  worker_completed?: boolean
}

interface Props {
  applications: ApplicationWithDetails[]
  error?: string
}

/** Returns the completion status label and style from the worker's POV */
function getCompletionLabel(app: ApplicationWithDetails) {
  if (app.status === 'completed') return { label: '✓ Completed', cls: 'bg-purple-50 text-purple-700 border-purple-100' }
  if (app.worker_completed && !app.farmer_completed) return { label: '⏳ Waiting for Farmer', cls: 'bg-blue-50 text-blue-700 border-blue-100' }
  if (!app.worker_completed && app.farmer_completed) return { label: '👆 Farmer Confirmed', cls: 'bg-orange-50 text-orange-700 border-orange-100' }
  if (app.status === 'accepted') return { label: 'Accepted', cls: 'bg-green-50 text-green-700 border-green-100' }
  if (app.status === 'pending') return { label: 'Pending', cls: 'bg-yellow-50 text-yellow-700 border-yellow-100' }
  return { label: app.status, cls: 'bg-red-50 text-red-700 border-red-100' }
}

export function WorkerApplicationsClient({ applications, error }: Props) {
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
    if (result.error) {
      toast.error(result.error)
    } else if (result.fullyCompleted) {
      toast.success('Job fully completed! Both parties have confirmed.')
      router.refresh()
    } else {
      toast.success('Your completion confirmed. Waiting for farmer to confirm.')
      router.refresh()
    }
  }

  if (error) {
    return (
      <main className="max-w-7xl mx-auto px-6 py-12">
        <Card className="border-0 shadow-2xl shadow-gray-100 rounded-[3.5rem] bg-white/80">
          <CardContent className="text-center py-32">
            <p className="text-2xl font-black text-red-400 uppercase tracking-[0.2em]">{error}</p>
          </CardContent>
        </Card>
      </main>
    )
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-16">
        <h1 className="text-6xl font-black text-gray-900 tracking-tight uppercase">
          {t('applied_jobs')}
        </h1>
        <p className="text-xl text-gray-400 mt-2 font-medium uppercase tracking-widest leading-loose">
          Track the status of your work requests
        </p>
      </div>

      {applications.length === 0 ? (
        <Card className="border-0 shadow-2xl shadow-gray-100 rounded-[3.5rem] bg-white/80">
          <CardContent className="text-center py-32">
            <div className="w-32 h-32 bg-gray-50 rounded-[3rem] flex items-center justify-center mx-auto mb-10">
              <AlertCircle className="w-16 h-16 text-gray-100" />
            </div>
            <p className="text-2xl font-black text-gray-300 uppercase tracking-[0.2em] mb-10">No applications sent yet</p>
            <Link href="/worker/jobs">
              <Button className="bg-blue-600 hover:bg-blue-700 h-16 px-12 rounded-2xl text-lg font-black uppercase tracking-widest transition-all">
                Find Jobs to Apply
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {applications.map((app) => {
            const { label, cls } = getCompletionLabel(app)
            const isFullyCompleted = app.status === 'completed'

            return (
              <Card key={app.id} className="border-0 shadow-2xl shadow-blue-50/30 rounded-[3rem] overflow-hidden bg-white/80 backdrop-blur-sm group hover:scale-[1.01] transition-all duration-500">
                <CardContent className="p-10 md:p-12">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">

                    <div className="flex-1 space-y-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-4">
                          <span className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 ${cls}`}>
                            {label}
                          </span>
                          <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest flex items-center gap-2">
                            <Clock className="w-3 h-3" /> {new Date(app.applied_at).toLocaleDateString()}
                          </span>
                        </div>
                        <h3 className="text-4xl font-black text-gray-900 uppercase tracking-tight group-hover:text-blue-600 transition-colors">
                          {app.job_title}
                        </h3>
                      </div>

                      <div className="flex flex-wrap gap-10">
                        <div className="space-y-2">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Employer</p>
                          <p className="text-xl font-bold text-gray-700 uppercase">{app.farmer_first_name}</p>
                          <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">{app.farmer_farm_name}</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Expected Income</p>
                          <p className="text-xl font-black text-green-600 flex items-center gap-1">
                            <IndianRupee className="w-5 h-5" />
                            {app.job_wage} <span className="text-xs text-gray-400 font-bold">/ DAY</span>
                          </p>
                        </div>
                        {app.status === 'accepted' && app.job_location && (
                          <div className="space-y-2 w-full mt-4 bg-green-50/50 p-4 rounded-2xl border border-green-100">
                            <p className="text-[10px] font-black text-green-600 uppercase tracking-[0.2em] flex items-center gap-2">
                              <MapPin className="w-3 h-3" /> Job Location &amp; Farmer Code
                            </p>
                            <p className="text-sm font-bold text-green-900 uppercase">
                              {typeof app.job_location === 'string' ? app.job_location : app.job_location.name || 'Check Map'}
                            </p>
                            <p className="text-xl font-bold bg-white px-3 py-1 mt-2 inline-block rounded-lg text-green-800 border border-green-200">
                              Code: {app.farmer_code}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-4 min-w-[220px]">
                      <Link href={`/worker/jobs/${app.job_id}`} className="w-full">
                        <Button className="w-full h-16 px-8 bg-black hover:bg-gray-900 text-white rounded-2xl text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg">
                          {t('view_details')} <ChevronRight className="w-5 h-5" />
                        </Button>
                      </Link>

                      {/* Mark Complete — only if accepted and worker hasn't confirmed yet */}
                      {app.status === 'accepted' && !app.worker_completed && (
                        <Button
                          onClick={() => handleMarkComplete(app.id)}
                          disabled={completingId === app.id}
                          className="w-full h-16 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg"
                        >
                          <CheckCheck className="w-5 h-5" />
                          {completingId === app.id ? 'Confirming...' : 'Mark Complete'}
                        </Button>
                      )}

                      {/* Rate Farmer — only after mutual completion */}
                      {isFullyCompleted && !app.worker_rated_farmer && (
                        <Button
                          onClick={() => setRatingModal({ applicationId: app.id, farmerName: app.farmer_first_name })}
                          className="w-full h-16 px-8 bg-yellow-600 hover:bg-yellow-700 text-white rounded-2xl text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg"
                        >
                          <Star className="w-5 h-5" /> Rate Farmer
                        </Button>
                      )}

                      {isFullyCompleted && app.worker_rated_farmer && (
                        <div className="text-center text-xs font-bold text-green-600 bg-green-50 px-3 py-3 rounded-2xl border border-green-100">
                          ✓ Farmer Rated
                        </div>
                      )}
                    </div>

                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Rating Modal */}
      {ratingModal && (
        <RatingModal
          applicationId={ratingModal.applicationId}
          rateeDisplayName={ratingModal.farmerName}
          type="worker_to_farmer"
          onSuccess={() => {
            setRatingModal(null)
            router.refresh()
          }}
          onClose={() => setRatingModal(null)}
        />
      )}
    </main>
  )
}

'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Clock, MapPin, IndianRupee, ChevronRight, XCircle, AlertCircle, Star } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/context'
import { toast } from 'sonner'
import Link from 'next/link'
import { rateUser } from '@/app/actions/ratings'
import { useRouter } from 'next/navigation'

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
}

interface Props {
  applications: ApplicationWithDetails[]
  error?: string
}

export function WorkerApplicationsClient({ applications: initialApplications, error }: Props) {
  const { t } = useLanguage()
  const router = useRouter()
  const [applications] = useState<ApplicationWithDetails[]>(initialApplications)
  const [ratingModal, setRatingModal] = useState<{
    open: boolean
    applicationId: string
    farmerName: string
  } | null>(null)
  const [rating, setRating] = useState(5)
  const [feedback, setFeedback] = useState('')
  const [ratingLoading, setRatingLoading] = useState(false)

  const handleRateFarmer = async () => {
    if (!ratingModal) return

    setRatingLoading(true)
    const result = await rateUser(ratingModal.applicationId, rating, feedback, 'worker_to_farmer')
    setRatingLoading(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Farmer rated successfully!')
      setRatingModal(null)
      setRating(5)
      setFeedback('')
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
          {applications.map((app) => (
            <Card key={app.id} className="border-0 shadow-2xl shadow-blue-50/30 rounded-[3rem] overflow-hidden bg-white/80 backdrop-blur-sm group hover:scale-[1.01] transition-all duration-500">
              <CardContent className="p-10 md:p-12">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">

                  <div className="flex-1 space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-4">
                         <span className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 ${
                           app.job_status === 'completed' && app.status === 'accepted' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                           app.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' :
                           app.status === 'accepted' ? 'bg-green-50 text-green-700 border-green-100' :
                           'bg-red-50 text-red-700 border-red-100'
                         }`}>
                           {app.job_status === 'completed' && app.status === 'accepted' ? 'Job Completed' : app.status}
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

                  <div className="flex flex-col gap-4 min-w-[200px]">
                     <Link href={`/worker/jobs/${app.job_id}`} className="w-full">
                       <Button className="w-full h-16 px-8 bg-black hover:bg-gray-900 text-white rounded-2xl text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg">
                         {t('view_details')} <ChevronRight className="w-5 h-5" />
                       </Button>
                     </Link>

                     {app.status === 'accepted' && app.job_status === 'completed' && !app.worker_rated_farmer && (
                       <Button
                         onClick={() => setRatingModal({ open: true, applicationId: app.job_id, farmerName: app.farmer_first_name })}
                         className="w-full h-16 px-8 bg-yellow-600 hover:bg-yellow-700 text-white rounded-2xl text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg"
                       >
                         <Star className="w-5 h-5" /> Rate Farmer
                       </Button>
                     )}
                  </div>

                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Rating Modal */}
      {ratingModal?.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900">Rate Farmer</h3>
                  <p className="text-gray-500 mt-2">Farmer: <span className="font-bold text-green-600">{ratingModal.farmerName}</span></p>
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
                    <option value="Reliable">Reliable</option>
                    <option value="Fair pay">Fair pay</option>
                    <option value="Good communication">Good communication</option>
                    <option value="Poor conditions">Poor conditions</option>
                    <option value="Unreliable">Unreliable</option>
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
    </main>
  )
}

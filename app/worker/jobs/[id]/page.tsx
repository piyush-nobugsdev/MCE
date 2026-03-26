'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { applyToJob } from '@/app/actions/jobs'
import { markCompletion } from '@/app/actions/applications'
import { RatingModal } from '@/components/rating-modal'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { WorkerNavbar } from '@/app/worker/components/navbar'
import { toast } from 'sonner'
import {
  MapPin, IndianRupee, Users, Calendar, ChevronLeft, ChevronRight,
  Sparkles, Star, CheckCircle2, Loader2, MessageSquare, CheckCheck,
  Clock, AlertCircle
} from 'lucide-react'
import { Job, Farmer } from '@/lib/types'
import { useLanguage } from '@/lib/i18n/context'

interface ApplicationState {
  id: string
  status: string          // pending | accepted | rejected | completed
  farmer_completed: boolean
  worker_completed: boolean
  worker_rated_farmer: boolean
}

export default function JobDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { t } = useLanguage()
  const jobId = params.id as string

  const [job, setJob] = useState<Job | null>(null)
  const [farmer, setFarmer] = useState<Farmer | null>(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [completing, setCompleting] = useState(false)

  // Full application state — null means the worker hasn't applied yet
  const [application, setApplication] = useState<ApplicationState | null>(null)

  // Rating modal state
  const [showRatingModal, setShowRatingModal] = useState(false)

  const fetchData = async () => {
    const supabase = createClient()
    try {
      const { data: { user } } = await supabase.auth.getUser()

      // Fetch job details
      const { data: jobData } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .maybeSingle()

      if (!jobData) return

      setJob(jobData)

      // Fetch farmer
      const { data: farmerData } = await supabase
        .from('farmers')
        .select('*')
        .eq('id', jobData.farmer_id)
        .maybeSingle()
      if (farmerData) setFarmer(farmerData)

      // Fetch full application state
      if (user) {
        const { data: worker } = await supabase
          .from('workers')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle()

        if (worker) {
          const { data: app } = await supabase
            .from('applications')
            .select('id, status, farmer_completed, worker_completed, worker_rated_farmer')
            .eq('worker_id', worker.id)
            .eq('job_id', jobId)
            .maybeSingle()

          if (app) {
            setApplication({
              id: app.id,
              status: app.status,
              farmer_completed: app.farmer_completed ?? false,
              worker_completed: app.worker_completed ?? false,
              worker_rated_farmer: app.worker_rated_farmer ?? false,
            })
          }
        }
      }
    } catch (err) {
      console.error('Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [jobId])

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault()
    setApplying(true)
    const result = await applyToJob(jobId, message)
    if (result.error) {
      toast.error(result.error)
      setApplying(false)
    } else {
      toast.success(`Applied! Your code is ${result.worker_code} — save this for attendance`)
      setApplying(false)
      await fetchData() // Refresh application state
    }
  }

  const handleMarkComplete = async () => {
    if (!application) return
    setCompleting(true)
    const result = await markCompletion(application.id, 'worker')
    setCompleting(false)
    if (result.error) {
      toast.error(result.error)
    } else if (result.fullyCompleted) {
      toast.success('Job fully completed! Both parties confirmed. You can now rate the farmer.')
      await fetchData()
    } else {
      toast.success('Your completion confirmed. Waiting for farmer to confirm.')
      await fetchData()
    }
  }



  if (loading) return <div className="flex items-center justify-center min-h-screen font-black uppercase text-gray-400">Loading details...</div>
  if (!job) return <div className="flex items-center justify-center min-h-screen text-red-500 font-black uppercase">Job Not Found</div>

  // Derive completion state
  const isFullyCompleted = application?.status === 'completed'
  const isPendingCompletion = application?.status === 'accepted' && (application.farmer_completed || application.worker_completed)

  // ─── Action Panel: what shows in the right column ────────────────────────────
  const ActionPanel = () => {
    // 1. Never applied — show apply form
    if (!application) {
      return (
        <Card className="border-0 shadow-2xl shadow-blue-100 rounded-[3.5rem] bg-white p-10 space-y-8">
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Apply Today</h3>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">Submit your interest to the farmer</p>
          </div>
          <form onSubmit={handleApply} className="space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-300 uppercase tracking-widest pl-2">Personal Message (Optional)</label>
              <div className="relative">
                <MessageSquare className="absolute left-6 top-6 w-5 h-5 text-gray-300" />
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g. I have 5 years experience in paddy harvesting..."
                  className="w-full pl-16 pr-6 py-6 border-2 border-gray-50 rounded-[2rem] text-sm font-medium focus:ring-8 focus:ring-blue-50 focus:border-blue-400 transition-all min-h-[140px] resize-none"
                  disabled={applying}
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={applying}
              className="w-full h-24 bg-blue-600 hover:bg-blue-700 rounded-[2rem] text-xl font-black uppercase tracking-widest shadow-2xl shadow-blue-100 transition-all active:scale-95 group"
            >
              {applying ? <Loader2 className="w-8 h-8 animate-spin" /> : (
                <div className="flex items-center gap-3">
                  {t('apply')} <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </div>
              )}
            </Button>
          </form>
          <div className="px-6 py-4 bg-gray-50 rounded-2xl flex items-center gap-4">
            <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Verified Work Opportunity</p>
          </div>
        </Card>
      )
    }

    // 2. Pending — waiting for farmer to accept
    if (application.status === 'pending') {
      return (
        <Card className="border-0 shadow-2xl shadow-yellow-100 rounded-[3.5rem] bg-yellow-50 p-12 text-center overflow-hidden relative">
          <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-yellow-100 rounded-full blur-3xl" />
          <Clock className="w-20 h-20 text-yellow-400 mx-auto mb-8" />
          <h3 className="text-2xl font-black uppercase tracking-tight text-yellow-800 mb-3">Application Sent</h3>
          <p className="text-yellow-700/70 font-bold uppercase text-xs tracking-widest leading-loose">
            The farmer is reviewing your application. You will be notified when accepted.
          </p>
        </Card>
      )
    }

    // 3. Rejected
    if (application.status === 'rejected') {
      return (
        <Card className="border-0 shadow-2xl shadow-red-100 rounded-[3.5rem] bg-red-50 p-12 text-center">
          <AlertCircle className="w-20 h-20 text-red-300 mx-auto mb-8" />
          <h3 className="text-2xl font-black uppercase tracking-tight text-red-600 mb-3">Not Selected</h3>
          <p className="text-red-400 font-bold uppercase text-xs tracking-widest leading-loose">
            The farmer selected another worker for this job.
          </p>
        </Card>
      )
    }

    // 4. Accepted — active job
    if (application.status === 'accepted') {
      const farmerDone = application.farmer_completed
      const workerDone = application.worker_completed

      return (
        <div className="space-y-6">
          {/* Status Card */}
          <Card className={`border-0 shadow-2xl rounded-[3.5rem] p-10 text-center overflow-hidden relative ${
            farmerDone && !workerDone
              ? 'shadow-orange-100 bg-orange-50'
              : workerDone && !farmerDone
              ? 'shadow-blue-100 bg-blue-50'
              : 'shadow-green-100 bg-green-600'
          }`}>
            <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/10 rounded-full blur-3xl" />

            {!farmerDone && !workerDone && (
              <>
                <CheckCircle2 className="w-20 h-20 text-white mx-auto mb-6" />
                <h3 className="text-2xl font-black uppercase tracking-tight text-white mb-2">You're Hired!</h3>
                <p className="text-white/70 font-black uppercase text-xs tracking-widest leading-loose">
                  Farmer Code: <span className="text-white text-sm">{job.farmer_code}</span>
                </p>
                <p className="text-white/50 font-bold uppercase text-[10px] tracking-widest mt-2">
                  Use this code to confirm attendance on the job site
                </p>
              </>
            )}

            {workerDone && !farmerDone && (
              <>
                <Clock className="w-20 h-20 text-blue-400 mx-auto mb-6" />
                <h3 className="text-2xl font-black uppercase tracking-tight text-blue-800 mb-2">⏳ Waiting for Farmer</h3>
                <p className="text-blue-600/70 font-bold uppercase text-xs tracking-widest leading-loose">
                  You confirmed completion. Waiting for the farmer to confirm.
                </p>
              </>
            )}

            {farmerDone && !workerDone && (
              <>
                <AlertCircle className="w-20 h-20 text-orange-400 mx-auto mb-6" />
                <h3 className="text-2xl font-black uppercase tracking-tight text-orange-800 mb-2">Farmer Confirmed</h3>
                <p className="text-orange-600/70 font-bold uppercase text-xs tracking-widest leading-loose">
                  The farmer marked this job complete. Please confirm your side.
                </p>
              </>
            )}
          </Card>

          {/* Mark as Complete Button */}
          {!workerDone && (
            <Button
              onClick={handleMarkComplete}
              disabled={completing}
              className="w-full h-20 bg-blue-600 hover:bg-blue-700 rounded-[2rem] text-lg font-black uppercase tracking-widest shadow-2xl shadow-blue-100 transition-all active:scale-95"
            >
              {completing ? (
                <Loader2 className="w-7 h-7 animate-spin" />
              ) : (
                <div className="flex items-center gap-3">
                  <CheckCheck className="w-6 h-6" />
                  Mark as Complete
                </div>
              )}
            </Button>
          )}

          {workerDone && (
            <div className="flex items-center justify-center gap-3 px-6 py-4 bg-blue-50 rounded-2xl border border-blue-100">
              <CheckCheck className="w-5 h-5 text-blue-500" />
              <p className="text-xs font-black text-blue-600 uppercase tracking-widest">You confirmed completion</p>
            </div>
          )}
        </div>
      )
    }

    // 5. Fully Completed — both sides confirmed
    if (isFullyCompleted) {
      return (
        <div className="space-y-6">
          <Card className="border-0 shadow-2xl shadow-purple-100 rounded-[3.5rem] bg-purple-600 p-12 text-center overflow-hidden relative">
            <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            <CheckCheck className="w-20 h-20 text-white mx-auto mb-6" />
            <h3 className="text-2xl font-black uppercase tracking-tight text-white mb-2">Job Completed!</h3>
            <p className="text-white/70 font-bold uppercase text-xs tracking-widest leading-loose">
              Both parties have confirmed. Thank you for your work!
            </p>
          </Card>

          {!application.worker_rated_farmer ? (
            <Button
              onClick={() => setShowRatingModal(true)}
              className="w-full h-20 bg-yellow-500 hover:bg-yellow-600 rounded-[2rem] text-lg font-black uppercase tracking-widest shadow-2xl shadow-yellow-100 transition-all active:scale-95"
            >
              <div className="flex items-center gap-3">
                <Star className="w-6 h-6 fill-white" />
                Rate the Farmer
              </div>
            </Button>
          ) : (
            <div className="flex items-center justify-center gap-3 px-6 py-4 bg-yellow-50 rounded-2xl border border-yellow-100">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <p className="text-xs font-black text-yellow-700 uppercase tracking-widest">Farmer Rated — Thank you!</p>
            </div>
          )}
        </div>
      )
    }

    return null
  }

  return (
    <div className="min-h-screen bg-gray-50/50 font-sans pb-20">
      <WorkerNavbar />

      <main className="max-w-7xl mx-auto px-6 py-12">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 mb-10 text-gray-400 font-black uppercase tracking-widest text-xs hover:text-blue-600 transition-colors group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          {t('back')}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Main Info Column */}
          <div className="lg:col-span-8 space-y-12">

            {/* Header */}
            <div className="space-y-6">
              <div className="flex flex-wrap gap-4">
                <span className="px-6 py-2 bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center gap-2">
                  <Sparkles className="w-3 h-3" /> {t('available_work')}
                </span>
                <span className="px-6 py-2 bg-white text-gray-400 text-[10px] font-black uppercase tracking-widest rounded-xl border border-gray-100 flex items-center gap-2">
                  <Calendar className="w-3 h-3 text-gray-300" /> Posted on {new Date(job.created_at).toLocaleDateString()}
                </span>
                {/* Completion status badge inline in header */}
                {application?.status === 'accepted' && !isFullyCompleted && (
                  <span className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center gap-2 ${
                    isPendingCompletion
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-green-100 text-green-700'
                  }`}>
                    <CheckCircle2 className="w-3 h-3" />
                    {isPendingCompletion ? 'Pending Completion' : 'Active Job'}
                  </span>
                )}
                {isFullyCompleted && (
                  <span className="px-6 py-2 bg-purple-100 text-purple-700 text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center gap-2">
                    <CheckCheck className="w-3 h-3" /> Completed
                  </span>
                )}
              </div>
              <h1 className="text-6xl font-black text-gray-900 uppercase tracking-tight leading-[1.1]">
                {job.title}
              </h1>
            </div>

            {/* Metrics Bar */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 p-10 bg-white rounded-[3rem] shadow-2xl shadow-blue-50/50 border border-gray-100">
              <div className="space-y-2">
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">Daily Wage</p>
                <p className="text-3xl font-black text-green-600 flex items-center gap-1">
                  <IndianRupee className="w-6 h-6" /> {job.wage_amount}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">Duration</p>
                <p className="text-3xl font-black text-gray-900 uppercase">
                  {job.duration_days || 1} Days
                </p>
              </div>
              <div className="space-y-2 hidden md:block">
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">Openings</p>
                <p className="text-3xl font-black text-gray-900 flex items-center gap-1 uppercase">
                  <Users className="w-6 h-6 text-blue-400" /> {job.workers_needed}
                </p>
              </div>
            </div>

            {/* Description Card */}
            <Card className="border-0 shadow-2xl shadow-gray-100 rounded-[3rem] bg-white p-12 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-bl-[5rem] -mr-16 -mt-16" />
              <div className="space-y-8 relative">
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-blue-500" /> Detailed Location
                  </h3>
                  <p className="text-2xl font-black text-gray-900 uppercase">
                    {typeof job.location === 'string' ? job.location : job.location?.name}
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">Work Description</h3>
                  <p className="text-xl font-medium text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {job.description}
                  </p>
                </div>
              </div>
            </Card>

            {/* Farmer Info */}
            {farmer && (
              <Card className="border-0 shadow-2xl shadow-orange-50 rounded-[3rem] bg-orange-50/30 p-12 flex flex-col md:flex-row items-center gap-10">
                <div className="w-24 h-24 rounded-[2.5rem] bg-orange-100 flex items-center justify-center shadow-xl">
                  <Users className="w-12 h-12 text-orange-600" />
                </div>
                <div className="flex-1 text-center md:text-left space-y-2">
                  <p className="text-[10px] font-black text-orange-400 uppercase tracking-[0.3em]">Land Owner / Farmer</p>
                  <h4 className="text-3xl font-black text-gray-900 uppercase">{farmer.first_name}</h4>
                  <div className="flex items-center justify-center md:justify-start gap-4">
                    <div className="px-4 py-2 bg-white rounded-xl text-yellow-600 font-black text-lg flex items-center gap-2 shadow-sm">
                      <Star className="w-5 h-5 fill-yellow-500" /> {farmer.rating.toFixed(1)}
                    </div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{farmer.village}</p>
                  </div>
                </div>
              </Card>
            )}

          </div>

          {/* Action Column */}
          <div className="lg:col-span-4">
            <div className="sticky top-12">
              <ActionPanel />
            </div>
          </div>

        </div>
      </main>

      {/* Rating Modal */}
      {showRatingModal && application && farmer && (
        <RatingModal
          applicationId={application.id}
          rateeDisplayName={farmer.first_name}
          type="worker_to_farmer"
          onSuccess={() => {
            setShowRatingModal(false)
            fetchData()
          }}
          onClose={() => setShowRatingModal(false)}
        />
      )}
    </div>
  )
}
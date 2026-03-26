import { createClient } from '@/lib/supabase/server'
import { WorkerNavbar } from '../components/navbar'
import { getTranslations } from '@/lib/i18n/server'
import { redirect } from 'next/navigation'
import { WorkerDashboardClient } from './client'
import { Suspense } from 'react'
import { StatCardsSkeleton, JobsListSkeleton } from '@/components/skeletons'
import { getReceivedReviews, getRatingSummary } from '@/app/actions/ratings'
import { getWorkerApplications } from '@/app/actions/applications'

export const dynamic = 'force-dynamic'

async function WorkerDashboardContent() {
  const { t } = await getTranslations()
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/auth/role-selection')
  }

  // Fetch worker profile
  const { data: worker } = await supabase
    .from('workers')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!worker) {
    return (
      <div className="bg-white p-24 rounded-3xl border border-gray-100 shadow-sm text-center">
        <p className="text-xl font-bold text-gray-400">{t('profile_not_found')}</p>
      </div>
    )
  }

  // Parallel data fetching
  const [
    { data: jobs },
    applicationsResult,
    reviewsResult,
    summaryResult
  ] = await Promise.all([
    supabase.from('jobs').select('*').eq('status', 'open').order('created_at', { ascending: false }),
    getWorkerApplications(),
    getReceivedReviews(user.id, 'farmer_to_worker'),
    getRatingSummary(user.id, 'farmer_to_worker')
  ])

  return (
    <WorkerDashboardClient
      worker={worker}
      jobs={jobs || []}
      applications={applicationsResult.applications || []}
      reviews={reviewsResult.reviews || []}
      ratingSummary={{
        average: summaryResult.average || 0,
        count: summaryResult.count || 0
      }}
    />
  )
}

export default async function WorkerDashboardPage() {
  const { t } = await getTranslations()

  return (
    <div className="min-h-screen bg-gray-50/50 font-sans pb-20">
      <WorkerNavbar />

      <main className="max-w-7xl mx-auto px-6 py-10">
        
        {/* Header Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase leading-none">{t('dashboard')}</h1>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">{t('welcome_back')}</p>
          </div>
          <div className="p-1 px-4 bg-white/50 rounded-full border border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest shadow-sm">
             Live Updates Enabled
          </div>
        </div>

        <Suspense fallback={
          <div className="space-y-12">
            <StatCardsSkeleton />
            <div className="h-24 w-full bg-gray-100 rounded-3xl animate-pulse" />
            <JobsListSkeleton />
          </div>
        }>
           <WorkerDashboardContent />
        </Suspense>
      </main>
    </div>
  )
}

import { Suspense } from 'react'
import { FarmerNavbar } from '../components/navbar'
import Link from 'next/link'
import { Plus, Star } from 'lucide-react'
import { WeatherWidget } from '@/components/farmer/WeatherWidget'
import { getTranslations } from '@/lib/i18n/server'
import { VoiceJobButton } from '@/components/VoiceJobButton'
import { DashboardStats } from './components/DashboardStats'
import { QuickActions } from './components/QuickActions'
import { RecentJobsList } from './components/RecentJobsList'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { findFarmerByUserId, getFarmerJobs, getFarmerFarms } from '@/lib/api/farmer'
import { getReceivedReviews, getRatingSummary } from '@/app/actions/ratings'
import { Card, CardContent } from '@/components/ui/card'
import { StatCardsSkeleton, JobsListSkeleton } from '@/components/skeletons'

async function FarmerDashboardContent() {
  const { t } = await getTranslations()
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/auth/role-selection')
  }

  const farmerData = await findFarmerByUserId(user.id)
  if (!farmerData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-500 font-bold uppercase tracking-tighter">{t('profile_not_found')}</p>
      </div>
    )
  }

  // Parallel data fetching
  const [jobs, reviewsResult, summaryResult, farms] = await Promise.all([
    getFarmerJobs(farmerData.id),
    getReceivedReviews(user.id, 'worker_to_farmer'),
    getRatingSummary(user.id, 'worker_to_farmer'),
    getFarmerFarms(farmerData.id)
  ])

  const activeJobsCount = jobs.filter((j: any) => j.status === 'open').length
  const completedJobsCount = jobs.filter((j: any) => j.status === 'completed').length
  const ratingSummary = {
     average: summaryResult.average || 0,
     count: summaryResult.count || 0
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Main Area (8/12) */}
      <div className="lg:col-span-8 space-y-10">
        <DashboardStats 
          activeJobs={activeJobsCount} 
          completedJobs={completedJobsCount} 
          rating={ratingSummary.average || (farmerData as any).rating || 0} 
        />
        
        <div className="space-y-4">
           <h2 className="text-xs font-bold text-gray-400 uppercase tracking-[0.3em] ml-1">Quick Post by Voice</h2>
           <VoiceJobButton farms={farms} />
        </div>

        <div className="space-y-4">
           <h2 className="text-xs font-bold text-gray-400 uppercase tracking-[0.3em] ml-1">Services & Management</h2>
           <QuickActions />
        </div>

        {/* Recent Reviews */}
        {reviewsResult.reviews && reviewsResult.reviews.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-[0.3em]">Worker Feedback</h2>
              <div className="flex items-center gap-1 text-sm font-bold text-yellow-600">
                <Star className="w-4 h-4 fill-yellow-500" /> {ratingSummary.average.toFixed(1)}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviewsResult.reviews.slice(0, 4).map((review: any) => (
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
                            <span key={tag} className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black uppercase rounded-lg">
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

        <RecentJobsList jobs={jobs} />
      </div>

      {/* Sidebar Area (4/12) */}
      <div className="lg:col-span-4 space-y-8">
        <WeatherWidget lat={0} lng={0} />
        
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
           <div className="flex items-center justify-between border-b border-gray-50 pb-4">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest">{t('upcoming_schedule')}</h3>
              <div className="w-2 h-2 rounded-full bg-blue-500" />
           </div>
           <div className="bg-gray-50/50 p-8 rounded-xl text-center border border-dashed border-gray-200">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">{t('no_activities_today')}</p>
           </div>
        </div>

        <div className="bg-gradient-to-br from-green-600 to-green-700 p-8 rounded-2xl text-white shadow-lg shadow-green-100/50 relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-110 transition-transform" />
           <h4 className="text-xs font-black uppercase tracking-[0.3em] opacity-60 mb-2">Support Portal</h4>
           <p className="text-lg font-bold leading-tight mb-6">Need expert advice or immediate help with your farm?</p>
           <Link href="/farmer/sahyog-kendra">
              <button className="w-full bg-white text-green-700 hover:bg-green-50 rounded-xl font-black uppercase tracking-widest text-[10px] h-12 transition-colors">
                Open Sahyog Kendra
              </button>
           </Link>
        </div>
      </div>
    </div>
  )
}
export default async function FarmerDashboard() {
  const { t } = await getTranslations()
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/role-selection')

  const farmerData = await findFarmerByUserId(user.id)
  const welcomeName = farmerData?.first_name || ''

  return (
    <div className="min-h-screen bg-gray-50/50 font-sans pb-10">
      <FarmerNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase leading-none">
              {t('welcome_back')}{welcomeName ? `, ${welcomeName}` : ''}
            </h1>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">{t('dashboard')}</p>
          </div>
        </div>

        <Suspense fallback={<div className="space-y-10">
           <StatCardsSkeleton />
           <div className="h-48 w-full bg-gray-100 rounded-2xl animate-pulse" />
           <JobsListSkeleton />
        </div>}>
           <FarmerDashboardContent />
        </Suspense>

      </main>
    </div>
  )
}

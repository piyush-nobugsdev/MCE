import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { WorkerNavbar } from '../components/navbar'
import Link from 'next/link'
import { MapPin, IndianRupee, Clock, ChevronRight, Search } from 'lucide-react'
import { getTranslations } from '@/lib/i18n/server'
import { redirect } from 'next/navigation'

export default async function WorkerJobsPage() {
  const { t } = await getTranslations()
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/auth/role-selection')
  }

  const { data: jobs } = await supabase
    .from('jobs')
    .select('*')
    .eq('status', 'open')
    .order('created_at', { ascending: false })

  const availableJobs = jobs || []

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      <WorkerNavbar />

      <main className="max-w-6xl mx-auto px-6 py-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold text-gray-900 leading-tight">
              {t('available_work')}
            </h1>
            <p className="text-lg text-gray-500 font-medium italic">
              Find the best jobs near you and start earning
            </p>
          </div>
          <div className="flex items-center gap-6 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
             <div className="px-6 text-center border-r border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-0.5">Total Jobs</p>
                <p className="text-2xl font-bold text-blue-600">{availableJobs.length}</p>
             </div>
             <div className="px-6 text-center">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-0.5">Status</p>
                <div className="flex items-center gap-1.5 justify-center">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <p className="text-xl font-bold text-green-600">Live</p>
                </div>
             </div>
          </div>
        </div>

        {availableJobs.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm text-center py-24">
            <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-gray-200" />
            </div>
            <p className="text-xl font-bold text-gray-400">No jobs available right now</p>
            <p className="text-sm text-gray-300 mt-2 font-medium">Check back later for new openings</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {availableJobs.map((job) => (
              <Card key={job.id} className="border border-gray-100 shadow-sm rounded-3xl overflow-hidden bg-white hover:border-blue-200 transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                    
                    {/* Job Info */}
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-3">
                         <span className="px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest bg-blue-50 text-blue-700">
                           New Work
                         </span>
                         <span className="text-xs font-bold text-gray-300 flex items-center gap-1.5 uppercase">
                           <Clock className="w-3.5 h-3.5" /> Posted {new Date(job.created_at).toLocaleDateString()}
                         </span>
                      </div>
                      <h3 className="text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {job.title}
                      </h3>

                      <div className="flex flex-wrap gap-8 items-center pt-2">
                         <div className="space-y-1">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Location</p>
                            <p className="text-lg font-bold flex items-center gap-2 text-gray-700">
                               <MapPin className="w-4 h-4 text-gray-300" />
                               {typeof job.location === 'string' ? job.location : (job.location?.name || 'Local Farm')}
                            </p>
                         </div>
                         <div className="space-y-1">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Daily Pay</p>
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
                                <IndianRupee className="w-4 h-4 text-green-600" />
                              </div>
                              <p className="text-2xl font-bold text-green-600">
                                 {job.wage_amount} <span className="text-xs text-gray-400 font-bold uppercase tracking-widest ml-1">/ day</span>
                              </p>
                            </div>
                         </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-gray-50 md:pl-8">
                       <Link href={`/worker/jobs/${job.id}`} className="w-full" prefetch={true}>
                         <Button className="w-full h-16 px-10 bg-black hover:bg-gray-900 text-white rounded-2xl text-lg font-bold flex items-center justify-center gap-3 shadow-md">
                           {t('view_details')} <ChevronRight className="w-5 h-5" />
                         </Button>
                       </Link>
                    </div>

                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

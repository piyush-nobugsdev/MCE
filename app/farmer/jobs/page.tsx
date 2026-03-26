import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FarmerNavbar } from '../components/navbar'
import Link from 'next/link'
import { Plus, Briefcase, MapPin, IndianRupee, Users, Clock, ChevronRight } from 'lucide-react'
import { getTranslations } from '@/lib/i18n/server'
import { redirect } from 'next/navigation'

export default async function FarmerJobsPage() {
  const { t } = await getTranslations()
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/auth/role-selection')
  }

  const { data: farmer } = await supabase
    .from('farmers')
    .select('id')
    .eq('user_id', user.id)
    .single()

  let jobs: any[] = []
  if (farmer) {
    const { data } = await supabase
      .from('jobs')
      .select('*')
      .eq('farmer_id', farmer.id)
      .order('created_at', { ascending: false })
    if (data) jobs = data
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      <FarmerNavbar />

      <main className="max-w-6xl mx-auto px-6 py-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold text-gray-900 leading-tight">
              {t('tasks')}
            </h1>
            <p className="text-lg text-gray-500 font-medium italic">
              Manage your active and past postings
            </p>
          </div>
          <Link href="/farmer/jobs/new">
            <Button className="h-16 px-8 rounded-2xl text-lg flex items-center gap-3 shadow-lg shadow-green-100 bg-green-600 hover:bg-green-700">
              <Plus className="w-6 h-6 stroke-[3]" />
              {t('post_job')}
            </Button>
          </Link>
        </div>

        {jobs.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm text-center py-24">
            <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Briefcase className="w-10 h-10 text-gray-200" />
            </div>
            <p className="text-xl font-bold text-gray-300">No jobs posted yet</p>
            <Link href="/farmer/jobs/new" className="mt-8 block">
               <span className="text-green-600 font-bold hover:underline cursor-pointer">Create your first job listing &rarr;</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {jobs.map((job) => (
              <Card key={job.id} className="border border-gray-100 shadow-sm rounded-3xl overflow-hidden bg-white hover:border-green-200 transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                    
                    {/* Job Details */}
                    <div className="flex-1 space-y-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                           <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-widest ${
                             job.status === 'open' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 
                             job.status === 'in_progress' ? 'bg-yellow-50 text-yellow-700 border border-yellow-100' : 'bg-green-50 text-green-700 border border-green-100'
                           }`}>
                             {job.status}
                           </span>
                           <span className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                             <Clock className="w-3.5 h-3.5" /> Posted {new Date(job.created_at).toLocaleDateString()}
                           </span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 transition-colors">
                          {job.title}
                        </h3>
                      </div>

                      <div className="flex flex-wrap gap-8 items-center pt-2">
                         <div className="space-y-1">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Location</p>
                            <p className="text-lg font-bold flex items-center gap-2 text-gray-700">
                               <MapPin className="w-4 h-4 text-gray-300" />
                               {typeof job.location === 'string' ? job.location : (job.location?.name || 'Local Farm')}
                            </p>
                         </div>
                         <div className="space-y-1">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Daily Wage</p>
                            <div className="flex items-center gap-2 text-green-600">
                               <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
                                 <IndianRupee className="w-4 h-4" />
                               </div>
                               <p className="text-2xl font-bold">
                                 {job.wage_amount} <span className="text-xs text-gray-400 font-bold">/ day</span>
                               </p>
                            </div>
                         </div>
                         <div className="space-y-1">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Staff needed</p>
                            <p className="text-lg font-bold flex items-center gap-2 text-gray-700">
                               <Users className="w-4 h-4 text-blue-400" />
                               {job.workers_needed} Workers
                            </p>
                         </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-gray-50 lg:pl-10">
                       <Link href={`/farmer/jobs/${job.id}`} className="w-full" prefetch={true}>
                         <Button className="w-full h-16 px-10 bg-black hover:bg-gray-900 text-white rounded-2xl text-lg font-bold flex items-center justify-center gap-3">
                           Manage <ChevronRight className="w-5 h-5" />
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

'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { WorkerNavbar } from '../components/navbar'
import { CheckCircle2, Clock, MapPin, IndianRupee, ChevronRight, XCircle, AlertCircle } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/context'
import Link from 'next/link'

interface ApplicationWithDetails {
  id: string
  status: string
  job_id: string
  job_title: string
  farmer_first_name: string
  farmer_farm_name: string
  applied_at: string
  wage_amount: number
}

export default function WorkerApplicationsPage() {
  const { t } = useLanguage()
  const [applications, setApplications] = useState<ApplicationWithDetails[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchApplications = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: worker } = await supabase
        .from('workers')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (worker) {
        const { data, error } = await supabase
          .from('applications')
          .select(`
            id, status, applied_at, job_id,
            jobs!inner(title, wage_amount, farmer_id, farmers!inner(first_name, farm_name))
          `)
          .eq('worker_id', worker.id)
          .order('applied_at', { ascending: false })

        if (!error && data) {
          const flattened = data.map((app: any) => ({
            id: app.id,
            status: app.status,
            job_id: app.job_id,
            job_title: app.jobs.title,
            wage_amount: app.jobs.wage_amount,
            farmer_first_name: app.jobs.farmers.first_name,
            farmer_farm_name: app.jobs.farmers.farm_name,
            applied_at: app.applied_at
          }))
          setApplications(flattened)
        }
      }
      setLoading(false)
    }
    fetchApplications()
  }, [])

  if (loading) return <div className="flex items-center justify-center min-h-screen font-black uppercase text-gray-400">Loading your applications...</div>

  return (
    <div className="min-h-screen bg-gray-50/50 font-sans pb-20">
      <WorkerNavbar />

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
                             app.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' :
                             app.status === 'accepted' ? 'bg-green-50 text-green-700 border-green-100' :
                             'bg-red-50 text-red-700 border-red-100'
                           }`}>
                             {app.status}
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
                               {app.wage_amount} <span className="text-xs text-gray-400 font-bold">/ DAY</span>
                            </p>
                         </div>
                      </div>
                    </div>

                    <div className="flex items-center">
                       <Link href={`/worker/jobs/${app.job_id}`} className="w-full lg:w-auto">
                         <Button className="w-full lg:w-auto h-20 px-12 bg-black hover:bg-gray-900 text-white rounded-[2rem] text-lg font-black uppercase tracking-widest flex items-center gap-4 shadow-2xl shadow-gray-200 transition-all hover:translate-x-1">
                           {t('view_details')} <ChevronRight className="w-6 h-6" />
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

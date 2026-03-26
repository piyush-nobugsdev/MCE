'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FarmerNavbar } from '../../components/navbar'
import { toast } from 'sonner'
import { MapPin, IndianRupee, Users, Edit3, ChevronLeft, CheckCircle2, Clock, Trash2, User, Star, MoreHorizontal, ExternalLink } from 'lucide-react'
import { Job, ApplicationWithDetails } from '@/lib/types'
import { useLanguage } from '@/lib/i18n/context'

export default function JobManagementPage() {
   const params = useParams()
   const router = useRouter()
   const { t } = useLanguage()
   const jobId = params.id as string

   const [job, setJob] = useState<Job | null>(null)
   const [applications, setApplications] = useState<ApplicationWithDetails[]>([])
   const [loading, setLoading] = useState(true)

   useEffect(() => {
      const fetchData = async () => {
         const supabase = createClient()

         const { data: jobData } = await supabase
            .from('jobs')
            .select('*')
            .eq('id', jobId)
            .single()

         if (jobData) {
            setJob(jobData)
            const { data: appsData } = await supabase
               .from('applications')
               .select(`
            id, status, message, job_id, worker_id, applied_at,
            workers!inner(first_name, age, experience, rating)
          `)
               .eq('job_id', jobId)
               .order('applied_at', { ascending: false })

            if (appsData) {
               const flattened = appsData.map((app: any) => ({
                  id: app.id,
                  status: app.status,
                  message: app.message,
                  job_id: app.job_id,
                  worker_id: app.worker_id,
                  job_title: jobData.title,
                  job_status: jobData.status,
                  applied_at: app.applied_at,
                  worker_first_name: app.workers.first_name,
                  worker_last_name: app.workers.last_name || '',
                  worker_age: app.workers.age,
                  worker_experience: app.workers.experience,
                  worker_rating: app.workers.rating || 5,
                  worker_code: '',
                  worker_completed_jobs: 0,
                  worker_skills: [],
                  distance: null
               }))
               setApplications(flattened as ApplicationWithDetails[])
            }
         }
         setLoading(false)
      }
      fetchData()
   }, [jobId])

   const deleteJob = async () => {
      if (!confirm('Are you sure you want to delete this job posting?')) return
      const supabase = createClient()
      const { error } = await supabase.from('jobs').delete().eq('id', jobId)
      if (error) toast.error('Failed to delete job')
      else {
         toast.success('Job deleted successfully')
         router.push('/farmer/dashboard')
      }
   }

   const updateStatus = async (id: string, status: string) => {
      const supabase = createClient()
      const { error } = await supabase
         .from('applications')
         .update({ status })
         .eq('id', id)

      if (error) {
         toast.error('Failed to update status')
      } else {
         setApplications(prev => prev.map(app => app.id === id ? { ...app, status: status as any } : app))
         toast.success(`Application ${status}!`)
      }
   }

   if (loading) return <div className="flex items-center justify-center min-h-screen font-bold text-gray-400">Loading Job Details...</div>
   if (!job) return <div className="flex items-center justify-center min-h-screen text-red-500 font-bold uppercase">Job Not Found</div>

   return (
      <div className="min-h-screen bg-gray-50 font-sans pb-20">
         <FarmerNavbar />

         <main className="max-w-6xl mx-auto px-6 py-10">
            <button
               onClick={() => router.back()}
               className="inline-flex items-center gap-2 mb-8 text-gray-400 font-bold text-sm hover:text-green-600 transition-colors group"
            >
               <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
               {t('back')}
            </button>

            <section className="mb-16">
               <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10">
                  <div className="space-y-4 flex-1">
                     <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-widest border ${job.status === 'open' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-green-50 text-green-700 border-green-100'
                           }`}>
                           {job.status === 'open' ? 'Open' : job.status}
                        </span>
                        <span className="text-xs font-bold text-gray-300 flex items-center gap-2">
                           <Clock className="w-4 h-4" /> Posted {new Date(job.created_at).toLocaleDateString()}
                        </span>
                     </div>
                     <h1 className="text-4xl font-bold text-gray-900 leading-tight">
                        {job.title}
                     </h1>
                     <div className="flex flex-wrap gap-6">
                        <div className="flex items-center gap-2 text-gray-500 font-bold text-xs uppercase tracking-widest">
                           <MapPin className="w-4 h-4 text-green-600" /> {typeof job.location === 'string' ? job.location : job.location?.name}
                        </div>
                        <div className="flex items-center gap-2 text-gray-500 font-bold text-xs uppercase tracking-widest">
                           <IndianRupee className="w-4 h-4 text-green-600" /> ₹{job.wage_amount} / Day
                        </div>
                     </div>
                  </div>
                  <div className="flex gap-3">
                     <Button variant="outline" className="h-16 px-8 rounded-2xl flex items-center gap-3 active:scale-95 transition-all">
                        <Edit3 className="w-5 h-5" /> Edit
                     </Button>
                     <Button onClick={deleteJob} className="h-16 w-16 bg-red-50 hover:bg-red-100 text-red-600 rounded-2xl transition-all active:scale-95 flex items-center justify-center">
                        <Trash2 className="w-6 h-6" />
                     </Button>
                  </div>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="border border-gray-100 shadow-sm rounded-3xl p-8 bg-white">
                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Applicants</p>
                     <p className="text-4xl font-bold text-gray-900">{applications.length}</p>
                     <div className="h-1 w-full bg-gray-50 rounded-full mt-4 overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full w-[40%]" />
                     </div>
                  </Card>
                  <Card className="border border-gray-100 shadow-sm rounded-3xl p-8 bg-white">
                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Staff Needed</p>
                     <p className="text-4xl font-bold text-gray-900">{job.workers_needed}</p>
                     <Users className="w-6 h-6 text-blue-200 mt-2" />
                  </Card>
               </div>
            </section>

            <section>
               <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                     Applicants Queue <span className="px-3 py-1 bg-gray-900 text-white text-xs rounded-full font-bold">{applications.length}</span>
                  </h2>
               </div>

               {applications.length === 0 ? (
                  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm text-center py-20">
                     <Users className="w-16 h-16 text-gray-100 mx-auto mb-6" />
                     <p className="text-lg font-bold text-gray-300">Waiting for workers to apply...</p>
                  </div>
               ) : (
                  <div className="grid grid-cols-1 gap-6">
                     {applications.map((app) => (
                        <Card key={app.id} className="border border-gray-100 shadow-sm rounded-3xl bg-white hover:border-blue-200 transition-all duration-300 overflow-hidden">
                           <CardContent className="p-8">
                              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">

                                 <div className="flex items-center gap-6 flex-1">
                                    <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center">
                                       <User className="w-8 h-8 text-gray-300" />
                                    </div>
                                    <div>
                                       <h4 className="text-xl font-bold text-gray-900">{app.worker_first_name}</h4>
                                       <div className="flex flex-wrap gap-3 mt-1">
                                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{app.worker_age || '--'} Years</span>
                                          <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest">{app.worker_experience || '0'}Y Exp</span>
                                          <span className="text-[10px] font-bold text-yellow-600 uppercase tracking-widest flex items-center gap-1">
                                             <Star className="w-3 h-3 fill-yellow-500" /> {app.worker_rating?.toFixed(1) || '5.0'}
                                          </span>
                                       </div>
                                    </div>
                                 </div>

                                 <div className="flex-1 lg:border-l lg:border-gray-50 lg:pl-10">
                                    <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-1">Message</p>
                                    <p className="text-sm font-medium text-gray-500 italic">
                                       "{app.message || "I am interested in this work."}"
                                    </p>
                                 </div>

                                 <div className="flex gap-3">
                                    {app.status === 'pending' ? (
                                       <>
                                          <Button
                                             variant="secondary"
                                             className="h-12 px-6 text-xs"
                                             onClick={() => updateStatus(app.id, 'accepted')}
                                          >
                                             Accept
                                          </Button>
                                          <Button
                                             variant="outline"
                                             className="h-12 px-6 text-xs text-red-600"
                                             onClick={() => updateStatus(app.id, 'rejected')}
                                          >
                                             Reject
                                          </Button>
                                       </>
                                    ) : (
                                       <div className={`px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest border ${app.status === 'accepted' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'
                                          }`}>
                                          {app.status}
                                       </div>
                                    )}
                                 </div>

                              </div>
                           </CardContent>
                        </Card>
                     ))}
                  </div>
               )}
            </section>

         </main>
      </div>
   )
}

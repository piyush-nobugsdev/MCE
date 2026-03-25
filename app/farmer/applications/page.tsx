'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FarmerNavbar } from '../components/navbar'
import { CheckCircle2, XCircle, Clock, User, Briefcase, Star, Trash2 } from 'lucide-react'
import { ApplicationWithDetails } from '@/lib/types'
import { useLanguage } from '@/lib/i18n/context'
import { toast } from 'sonner'

export default function ApplicationsPage() {
  const { t } = useLanguage()
  const [applications, setApplications] = useState<ApplicationWithDetails[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchApplications = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('applications')
        .select(`
          id, status, job_id, worker_id,
          jobs!inner(title),
          workers!inner(first_name, age, experience, rating)
        `)
        .order('applied_at', { ascending: false })

      if (error) {
        toast.error('Failed to load applications')
      } else {
        const flattened = data.map((app: any) => ({
          id: app.id,
          status: app.status,
          message: null, // No message column in applications table
          job_id: app.job_id,
          worker_id: app.worker_id,
          job_title: app.jobs.title,
          worker_first_name: app.workers.first_name,
          worker_age: app.workers.age,
          worker_experience: app.workers.experience,
          worker_rating: app.workers.rating
        }))
        setApplications(flattened)
      }
      setLoading(false)
    }
    fetchApplications()
  }, [])

  const updateStatus = async (id: string, status: string) => {
    const supabase = createClient()
    const { error } = await supabase
      .from('applications')
      .update({ status })
      .eq('id', id)
    
    if (error) {
       toast.error('Failed to update status')
    } else {
       setApplications(prev => prev.map(app => app.id === id ? { ...app, status } : app))
       toast.success(`Application ${status}!`)
    }
  }

  if (loading) return <div className="flex items-center justify-center min-h-screen font-bold text-gray-400">Loading Applications...</div>

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      <FarmerNavbar />

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 leading-tight">
            Worker Applications
          </h1>
          <p className="text-lg text-gray-500 mt-1 font-medium italic">
            Review and hire the best workers for your farm
          </p>
        </div>

        {applications.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm text-center py-24">
            <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Clock className="w-10 h-10 text-gray-200" />
            </div>
            <p className="text-xl font-bold text-gray-400">No applications received yet</p>
            <p className="text-sm text-gray-300 mt-2 font-medium">Post a job to start seeing applicants</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {applications.map((app) => (
              <Card key={app.id} className="border border-gray-100 shadow-sm rounded-3xl overflow-hidden bg-white hover:border-blue-200 transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                    
                    {/* Worker Profile Info */}
                    <div className="flex items-start gap-6 flex-1">
                      <div className="w-20 h-20 rounded-2xl bg-blue-50 flex items-center justify-center shadow-inner">
                        <User className="w-10 h-10 text-blue-600" />
                      </div>
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Worker Profile</p>
                          <h3 className="text-2xl font-bold text-gray-900">{app.worker_first_name}</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1 bg-gray-50 text-gray-600 text-xs font-bold rounded-lg border border-gray-100">
                            Age: {app.worker_age || '--'}
                          </span>
                          <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-lg border border-green-100">
                            Exp: {app.worker_experience || '0'} Years
                          </span>
                          <span className="px-3 py-1 bg-yellow-50 text-yellow-700 text-xs font-bold rounded-lg border border-yellow-100 flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-500" /> {app.worker_rating?.toFixed(1) || '5.0'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Job Reference */}
                    <div className="flex-1 lg:border-l lg:border-gray-50 lg:pl-10 space-y-3">
                       <div className="space-y-1">
                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                           <Briefcase className="w-3.5 h-3.5" /> Applied For
                         </p>
                         <h4 className="text-xl font-bold text-gray-700 leading-snug">{app.job_title}</h4>
                       </div>
                       {app.message && (
                         <div className="p-4 bg-gray-50 rounded-2xl border-l-4 border-blue-400 text-sm text-gray-600 font-medium italic">
                           "{app.message}"
                         </div>
                       )}
                    </div>

                    {/* Status & Actions */}
                    <div className="flex flex-col sm:flex-row lg:flex-col gap-4 min-w-[200px]">
                      <div className={`px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest text-center border ${
                        app.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' :
                        app.status === 'accepted' ? 'bg-green-50 text-green-700 border-green-100' :
                        'bg-red-50 text-red-700 border-red-100'
                      }`}>
                        {app.status}
                      </div>

                      {app.status === 'pending' && (
                        <div className="grid grid-cols-2 gap-3">
                          <Button 
                            variant="secondary" 
                            className="h-12 text-xs"
                            onClick={() => updateStatus(app.id, 'accepted')}
                          >
                            Accept
                          </Button>
                          <Button 
                            variant="outline" 
                            className="h-12 text-xs text-red-600 hover:bg-red-50"
                            onClick={() => updateStatus(app.id, 'rejected')}
                          >
                            Reject
                          </Button>
                        </div>
                      )}
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

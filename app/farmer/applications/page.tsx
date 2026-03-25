'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FarmerNavbar } from '../components/navbar'
import { Users } from 'lucide-react'

interface ApplicationWithDetails {
  id: string
  status: string
  message: string | null
  job_id: string
  worker_id: string
  job_title: string
  worker_first_name: string
  worker_age: number | null
  worker_experience: number | null
}

export default function FarmerApplicationsPage() {
  const [applications, setApplications] = useState<ApplicationWithDetails[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchApplications = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        window.location.href = '/auth/role-selection'
        return
      }

      const { data: farmer } = await supabase
        .from('farmers')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (farmer) {
        // Get all jobs from this farmer
        const { data: farmerJobs } = await supabase
          .from('jobs')
          .select('id, title')
          .eq('farmer_id', farmer.id)

        if (farmerJobs && farmerJobs.length > 0) {
          const jobIds = farmerJobs.map((j) => j.id)

          // Get all applications for these jobs
          const { data: appsData } = await supabase
            .from('job_applications')
            .select('*')

          if (appsData) {
            // Filter and enrich with job and worker details
            const applicationsWithDetails = await Promise.all(
              appsData
                .filter((app) => jobIds.includes(app.job_id))
                .map(async (app) => {
                  const jobTitle =
                    farmerJobs.find((j) => j.id === app.job_id)?.title || 'Unknown Job'
                  const { data: workerData } = await supabase
                    .from('workers')
                    .select('first_name, age, experience')
                    .eq('id', app.worker_id)
                    .single()

                  return {
                    ...app,
                    job_title: jobTitle,
                    worker_first_name: workerData?.first_name || 'Worker',
                    worker_age: workerData?.age,
                    worker_experience: workerData?.experience,
                  }
                })
            )

            setApplications(applicationsWithDetails)
          }
        }
      }

      setLoading(false)
    }

    fetchApplications()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <FarmerNavbar />

      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tight">Worker Applications</h1>
          <p className="text-lg text-gray-500 mt-2 font-medium uppercase tracking-wide">Review and hire workers for your farm</p>
        </div>

        {applications.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No applications yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <Card key={app.id} className="hover:shadow-2xl transition-all duration-300 border-0 shadow-lg shadow-gray-200/50 rounded-3xl overflow-hidden group">
                <CardContent className="pt-8 pb-8 px-8">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">{app.worker_first_name}</h3>
                        <div className="flex gap-2">
                          {app.worker_age && (
                            <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg uppercase tracking-wider">{app.worker_age} Years Old</span>
                          )}
                          {app.worker_experience !== null && (
                            <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-lg uppercase tracking-wider">{app.worker_experience}Y EXP</span>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-500 font-medium uppercase text-sm tracking-widest mb-4">Applied for: <span className="text-gray-900">{app.job_title}</span></p>
                      {app.message && (
                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                          <p className="text-gray-700 italic">"{app.message}"</p>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
                      <span
                        className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-center ${
                          app.status === 'pending'
                            ? 'bg-yellow-50 text-yellow-700 border-2 border-yellow-100'
                            : app.status === 'accepted'
                              ? 'bg-green-50 text-green-700 border-2 border-green-100'
                              : 'bg-red-50 text-red-700 border-2 border-red-100'
                        }`}
                      >
                        {app.status}
                      </span>
                      {app.status === 'pending' && (
                        <div className="flex gap-3">
                          <Button className="bg-green-600 hover:bg-green-700 h-14 px-8 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-green-100">
                            Accept
                          </Button>
                          <Button variant="outline" className="h-14 px-8 rounded-2xl text-xs font-black uppercase tracking-widest border-2 border-gray-100 hover:bg-gray-50">
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

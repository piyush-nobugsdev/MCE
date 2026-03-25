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
  worker_name: string
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
        window.location.href = '/auth/phone'
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
                    .select('name')
                    .eq('id', app.worker_id)
                    .single()

                  return {
                    ...app,
                    job_title: jobTitle,
                    worker_name: workerData?.name || 'Unknown Worker',
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

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Job Applications</h1>

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
              <Card key={app.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{app.worker_name}</h3>
                      <p className="text-gray-600 text-sm">Applied for: {app.job_title}</p>
                      {app.message && (
                        <p className="text-gray-700 mt-2 italic">{`"${app.message}"`}</p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium text-center ${
                          app.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : app.status === 'accepted'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {app.status}
                      </span>
                      {app.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            Accept
                          </Button>
                          <Button size="sm" variant="outline">
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

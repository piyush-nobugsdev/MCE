'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { WorkerNavbar } from '../components/navbar'
import { CheckCircle } from 'lucide-react'

interface ApplicationWithDetails {
  id: string
  status: string
  proposed_wage: number | null
  message: string | null
  job_id: string
  job_title: string
  farmer_name: string
  created_at: string
}

export default function WorkerApplicationsPage() {
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

      const { data: worker } = await supabase
        .from('workers')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (worker) {
        const { data: appsData } = await supabase
          .from('applications')
          .select('*')
          .eq('worker_id', worker.id)
          .order('created_at', { ascending: false })

        if (appsData) {
          const appDetails = await Promise.all(
            appsData.map(async (app) => {
              const { data: jobData } = await supabase
                .from('jobs')
                .select('title, farmer_id')
                .eq('id', app.job_id)
                .single()

              let farmerName = 'Unknown Farmer'
              if (jobData) {
                const { data: farmerData } = await supabase
  .from('farmers')
  .select('full_name')    // was: name
  .eq('id', jobData.farmer_id)
  .single()

                farmerName = farmerData?.full_name || 'Unknown Farmer'
              }

              return {
                ...app,
                job_title: jobData?.title || 'Unknown Job',
                farmer_name: farmerName,
              }
            })
          )

          setApplications(appDetails)
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
      <WorkerNavbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Applications</h1>

        {applications.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No applications yet</p>
              <p className="text-gray-600 text-sm">Start applying for jobs to see them here</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <Card key={app.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{app.job_title}</h3>
                      <p className="text-gray-600 text-sm">Farmer: {app.farmer_name}</p>
                      {app.message && (
                        <p className="text-gray-700 mt-2 italic text-sm">{`"${app.message}"`}</p>
                      )}
                      <p className="text-gray-500 text-xs mt-2">
                        Applied on {new Date(app.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium text-center ${
                          app.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : app.status === 'accepted'
                              ? 'bg-green-100 text-green-700'
                              : app.status === 'rejected'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {app.status}
                      </span>
                      {app.status === 'accepted' && (
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          View Job Details
                        </Button>
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

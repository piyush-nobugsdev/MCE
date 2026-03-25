'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { WorkerNavbar } from '../components/navbar'
import Link from 'next/link'
import { Plus, Briefcase, CheckCircle, DollarSign } from 'lucide-react'
import { Worker, Job } from '@/lib/types'

interface JobWithApplicationStatus extends Job {
  has_applied?: boolean
}

export default function WorkerDashboard() {
  const [worker, setWorker] = useState<Worker | null>(null)
  const [recentJobs, setRecentJobs] = useState<JobWithApplicationStatus[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        window.location.href = '/auth/role-selection'
        return
      }

      // Fetch worker profile
      const { data: workerData } = await supabase
        .from('workers')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (workerData) {
        setWorker(workerData)

        // Fetch recent jobs
        const { data: jobsData } = await supabase
          .from('jobs')
          .select('*')
          .eq('status', 'posted')
          .order('created_at', { ascending: false })
          .limit(6)

        if (jobsData) {
          // Check which jobs the worker has applied to
          const { data: applicationsData } = await supabase
            .from('job_applications')
            .select('job_id')
            .eq('worker_id', workerData.id)

          const appliedJobIds = new Set(applicationsData?.map((a) => a.job_id) || [])

          const jobsWithStatus = jobsData.map((job) => ({
            ...job,
            has_applied: appliedJobIds.has(job.id),
          }))

          setRecentJobs(jobsWithStatus)
        }
      }

      setLoading(false)
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  if (!worker) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Worker profile not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <WorkerNavbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome, {worker.full_name}!
          </h1>
          <p className="text-gray-600">Find and apply for farm jobs in your area</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Jobs Applied</CardTitle>
              <Briefcase className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-gray-500">View in applications</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Jobs Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{worker.total_jobs_completed}</div>
              <p className="text-xs text-gray-500">Finished jobs</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rating</CardTitle>
              <DollarSign className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{worker.rating.toFixed(1)}</div>
              <p className="text-xs text-gray-500">Average rating</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Link href="/worker/jobs">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12">
              <Plus className="w-5 h-5 mr-2" />
              Browse All Jobs
            </Button>
          </Link>
          <Link href="/worker/applications">
            <Button variant="outline" className="w-full h-12">
              View My Applications
            </Button>
          </Link>
        </div>

        {/* Recent Job Openings */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Recent Job Openings</h2>
          {recentJobs.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No jobs available at the moment</p>
                <Link href="/worker/jobs">
                  <Button variant="outline">Check All Jobs</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {recentJobs.map((job) => (
                <Card key={job.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{job.title}</h3>
                        <p className="text-sm text-gray-600">
                          {typeof job.location === 'string' ? job.location : job.location?.name || 'Unknown location'}
                        </p>
                        <p className="text-sm text-blue-600 font-medium mt-1">
                          ₹{job.wage_amount}/day
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {job.has_applied ? (
                          <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                            Applied
                          </span>
                        ) : (
                          <Link href={`/worker/jobs/${job.id}`}>
                            <Button className="bg-blue-600 hover:bg-blue-700">
                              View Details
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

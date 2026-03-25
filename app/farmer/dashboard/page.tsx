'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FarmerNavbar } from '../components/navbar'
import Link from 'next/link'
import { Plus, Briefcase, Users, DollarSign } from 'lucide-react'
import { Farmer, Job } from '@/lib/types'

export default function FarmerDashboard() {
  const [farmer, setFarmer] = useState<Farmer | null>(null)
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        window.location.href = '/auth/phone'
        return
      }

      // Fetch farmer profile
      const { data: farmerData } = await supabase
        .from('farmers')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (farmerData) {
        setFarmer(farmerData)

        // Fetch farmer's jobs
        const { data: jobsData } = await supabase
          .from('jobs')
          .select('*')
          .eq('farmer_id', farmerData.id)
          .order('created_at', { ascending: false })

        if (jobsData) {
          setJobs(jobsData)
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

  if (!farmer) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Farmer profile not found</p>
      </div>
    )
  }

  const activeJobs = jobs.filter((j) => j.status === 'posted').length
  const completedJobs = jobs.filter((j) => j.status === 'completed').length

  return (
    <div className="min-h-screen bg-gray-50">
      <FarmerNavbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome, {farmer.name}!
          </h1>
          <p className="text-gray-600">Manage your farm jobs and workers</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeJobs}</div>
              <p className="text-xs text-gray-500">Jobs currently posted</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedJobs}</div>
              <p className="text-xs text-gray-500">Finished jobs</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rating</CardTitle>
              <DollarSign className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{farmer.rating.toFixed(1)}</div>
              <p className="text-xs text-gray-500">Average rating</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Link href="/farmer/jobs/new">
            <Button className="w-full bg-green-600 hover:bg-green-700 h-12">
              <Plus className="w-5 h-5 mr-2" />
              Post New Job
            </Button>
          </Link>
          <Link href="/farmer/applications">
            <Button variant="outline" className="w-full h-12">
              View Applications
            </Button>
          </Link>
        </div>

        {/* Recent Jobs */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Recent Jobs</h2>
          {jobs.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No jobs posted yet</p>
                <Link href="/farmer/jobs/new">
                  <Button className="bg-green-600 hover:bg-green-700">
                    Post Your First Job
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {jobs.slice(0, 5).map((job) => (
                <Card key={job.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-lg">{job.title}</h3>
                        <p className="text-sm text-gray-600">
                          {typeof job.location === 'string' ? job.location : job.location?.name || 'Unknown location'}
                        </p>
                        <p className="text-sm text-green-600 font-medium mt-1">
                          ${job.wage_amount}/day
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            job.status === 'posted'
                              ? 'bg-blue-100 text-blue-700'
                              : job.status === 'in_progress'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {job.status}
                        </span>
                        <Link href={`/farmer/jobs/${job.id}`}>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
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

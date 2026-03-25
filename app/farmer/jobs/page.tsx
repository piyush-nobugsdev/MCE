'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FarmerNavbar } from '../components/navbar'
import Link from 'next/link'
import { Plus, Briefcase } from 'lucide-react'
import { Job } from '@/lib/types'

export default function FarmerJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchJobs = async () => {
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
        const { data: jobsData } = await supabase
          .from('jobs')
          .select('*')
          .eq('farmer_id', farmer.id)
          .order('created_at', { ascending: false })

        if (jobsData) {
          setJobs(jobsData)
        }
      }

      setLoading(false)
    }

    fetchJobs()
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Jobs</h1>
          <Link href="/farmer/jobs/new">
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="w-5 h-5 mr-2" />
              Post New Job
            </Button>
          </Link>
        </div>

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
            {jobs.map((job) => (
              <Card key={job.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold">{job.title}</h3>
                      <p className="text-gray-600 text-sm mt-1">
                        {typeof job.location === 'string' ? job.location : job.location?.name || 'Unknown location'}
                      </p>
                      <p className="text-gray-700 mt-2 line-clamp-2">{job.description}</p>
                      <div className="flex gap-4 mt-4 text-sm">
                        <div>
                          <span className="text-gray-600">Workers Needed:</span>
                          <span className="font-semibold ml-2">{job.workers_needed}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Daily Wage:</span>
                          <span className="font-semibold ml-2 text-green-600">
                            ${job.wage_amount}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium text-center ${
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
                        <Button variant="outline" className="w-full">
                          Manage
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

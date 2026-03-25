'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { WorkerNavbar } from '../components/navbar'
import Link from 'next/link'
import { Briefcase, Search } from 'lucide-react'
import { Job } from '@/lib/types'

export default function WorkerJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchJobs = async () => {
      const supabase = createClient()

      const { data: jobsData } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'posted')
        .order('created_at', { ascending: false })

      if (jobsData) {
        setJobs(jobsData)
        setFilteredJobs(jobsData)
      }

      setLoading(false)
    }

    fetchJobs()
  }, [])

  useEffect(() => {
    let filtered = jobs

    if (searchTerm) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (categoryFilter) {
      filtered = filtered.filter((job) => job.category === categoryFilter)
    }

    setFilteredJobs(filtered)
  }, [searchTerm, categoryFilter, jobs])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  const categories = [...new Set(jobs.map((j) => j.category))]

  return (
    <div className="min-h-screen bg-gray-50">
      <WorkerNavbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Find Jobs</h1>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by job title or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Jobs List */}
        {filteredJobs.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No jobs found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job) => (
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
                          <span className="font-semibold ml-2 text-blue-600">
                            ${job.wage_amount}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700 text-center">
                        {job.category}
                      </span>
                      <Link href={`/worker/jobs/${job.id}`}>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700">
                          Apply Now
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

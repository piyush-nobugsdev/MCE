'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { applyToJob } from '@/app/actions/jobs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { WorkerNavbar } from '../../components/navbar'
import { toast } from 'sonner'
import { MapPin, DollarSign, Users, Calendar } from 'lucide-react'
import { Job, Farmer } from '@/lib/types'

export default function JobDetailPage() {
  const params = useParams()
  const router = useRouter()
  const jobId = params.id as string

  const [job, setJob] = useState<Job | null>(null)
  const [farmer, setFarmer] = useState<Farmer | null>(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [hasApplied, setHasApplied] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      // Fetch job details
      const { data: jobData } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .single()

      if (jobData) {
        setJob(jobData)

        // Fetch farmer details
        const { data: farmerData } = await supabase
          .from('farmers')
          .select('*')
          .eq('id', jobData.farmer_id)
          .single()

        if (farmerData) {
          setFarmer(farmerData)
        }

        // Check if worker has already applied
        if (user) {
          const { data: worker } = await supabase
            .from('workers')
            .select('id')
            .eq('user_id', user.id)
            .single()

          if (worker) {
            const { data: application } = await supabase
              .from('job_applications')
              .select('id')
              .eq('worker_id', worker.id)
              .eq('job_id', jobId)
              .single()

            if (application) {
              setHasApplied(true)
            }
          }
        }
      }

      setLoading(false)
    }

    fetchData()
  }, [jobId])

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault()
    setApplying(true)

    const result = await applyToJob(jobId, message)

    if (result.error) {
      toast.error(result.error)
      setApplying(false)
    } else {
      toast.success('Application submitted successfully!')
      setMessage('')
      setHasApplied(true)
      setApplying(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Job not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <WorkerNavbar />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="mb-6"
        >
          ← Back to Jobs
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl">{job.title}</CardTitle>
                <div className="flex gap-4 mt-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {typeof job.location === 'string' ? job.location : job.location?.name || 'Unknown location'}
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    ${job.wage_amount}/day
                {/* Job Description */}
                <div>
                  <h3 className="font-semibold text-lg mb-2">Job Description</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
                </div>

                {/* Job Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Workers Needed</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Users className="w-5 h-5 text-blue-600" />
                      <span className="text-lg font-semibold">{job.workers_needed}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Job Duration</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="w-5 h-5 text-green-600" />
                      <span className="text-lg font-semibold">
                        {Math.ceil(
                          (new Date(job.end_date).getTime() -
                            new Date(job.start_date).getTime()) /
                            (1000 * 60 * 60 * 24)
                        )}{' '}
                        days
                      </span>
                    </div>
                  </div>
                </div>

                {/* Dates */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Schedule</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">Start Date:</span>
                      <span className="ml-2 font-medium">
                        {new Date(job.start_date).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">End Date:</span>
                      <span className="ml-2 font-medium">
                        {new Date(job.end_date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Farmer Info */}
            {farmer && (
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle className="text-xl">About the Farmer</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-600">Farm Name</label>
                      <p className="font-semibold">{farmer.farm_name}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Farmer Name</label>
                      <p className="font-semibold">{farmer.name}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Location</label>
                      <p className="font-semibold">{farmer.location}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Rating</label>
                      <p className="font-semibold text-yellow-600">
                        {farmer.rating.toFixed(1)} ⭐
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Application Form */}
          <div>
            {hasApplied ? (
              <Card className="sticky top-8">
                <CardContent className="pt-6 text-center">
                  <div className="text-4xl mb-2">✓</div>
                  <h3 className="font-semibold text-lg mb-2">Already Applied</h3>
                  <p className="text-gray-600 text-sm">
                    You've already applied for this job. Check your applications for updates.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>Apply for This Job</CardTitle>
                </CardHeader>

                <CardContent>
                  <form onSubmit={handleApply} className="space-y-4">
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-2">
                        Add a Message (Optional)
                      </label>
                      <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Tell the farmer about your experience or interest in this job..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        rows={4}
                        disabled={applying}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      disabled={applying}
                    >
                      {applying ? 'Submitting...' : 'Apply Now'}
                    </Button>

                    <p className="text-xs text-gray-500 text-center">
                      By applying, you agree to the terms and conditions
                    </p>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

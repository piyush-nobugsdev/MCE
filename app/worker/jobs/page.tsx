'use client'

import { useEffect, useState } from 'react'
import { getWorkerWithJobs } from '@/app/actions/workers'
import { applyToJob } from '@/app/actions/jobs'
import { WorkerNavbar } from '../components/navbar'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { MapPin, Clock, DollarSign, Users, Filter } from 'lucide-react'

interface Job {
  id: string
  title: string
  category: string
  description: string
  wage_amount: number
  wage_type: string
  workers_needed: number
  date_range: { start_date: string; end_date: string }
  location: { lat: number; lng: number; name: string }
  meals_provided: boolean
  transport_provided: boolean
  distance_km: number
  has_applied: boolean
  farmers: {
    full_name: string
    village: string
    rating: number
  }
  applications: { count: number }[]
}

const CATEGORIES = ['All', 'harvesting', 'plowing', 'weeding', 'planting', 'irrigation', 'other']
const DISTANCES = [
  { label: 'Any', value: 0 },
  { label: '5 km', value: 5 },
  { label: '10 km', value: 10 },
  { label: '25 km', value: 25 },
  { label: '50 km', value: 50 },
]

export default function WorkerJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  const [filters, setFilters] = useState({
    category: '',
    max_distance: 0,
    min_wage: 0,
    wage_type: '',
  })

  const fetchJobs = async () => {
    setLoading(true)
    const result = await getWorkerWithJobs({
      category: filters.category || undefined,
      max_distance: filters.max_distance || undefined,
      min_wage: filters.min_wage || undefined,
      wage_type: filters.wage_type || undefined,
    })

    if (result.error) {
      toast.error(result.error)
    } else {
      setJobs(result.jobs as Job[])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  const handleApply = async (jobId: string) => {
    setApplying(jobId)
    const result = await applyToJob(jobId)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success(`Applied! Your code is ${result.application?.worker_code}. Save it!`)
      // Update local state
      setJobs(prev =>
        prev.map(j => j.id === jobId ? { ...j, has_applied: true } : j)
      )
    }
    setApplying(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <WorkerNavbar />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Browse Jobs</h1>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
          </Button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Category */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Category
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setFilters(prev => ({
                          ...prev,
                          category: cat === 'All' ? '' : cat
                        }))}
                        className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                          (cat === 'All' && !filters.category) || filters.category === cat
                            ? 'bg-green-600 text-white border-green-600'
                            : 'bg-white text-gray-600 border-gray-300 hover:border-green-400'
                        }`}
                      >
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Distance */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Max Distance
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {DISTANCES.map((d) => (
                      <button
                        key={d.value}
                        onClick={() => setFilters(prev => ({
                          ...prev,
                          max_distance: d.value
                        }))}
                        className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                          filters.max_distance === d.value
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Min Wage */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Min Wage (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={filters.min_wage || ''}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      min_wage: parseInt(e.target.value) || 0
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {/* Wage Type */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Wage Type
                  </label>
                  <div className="flex gap-2">
                    {['', 'daily', 'hourly', 'piece_rate'].map((type) => (
                      <button
                        key={type}
                        onClick={() => setFilters(prev => ({ ...prev, wage_type: type }))}
                        className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                          filters.wage_type === type
                            ? 'bg-yellow-500 text-white border-yellow-500'
                            : 'bg-white text-gray-600 border-gray-300 hover:border-yellow-400'
                        }`}
                      >
                        {type === '' ? 'Any' : type.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              <div className="flex gap-3 mt-4">
                <Button
                  onClick={fetchJobs}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Apply Filters
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setFilters({ category: '', max_distance: 0, min_wage: 0, wage_type: '' })
                    fetchJobs()
                  }}
                >
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Jobs count */}
        {!loading && (
          <p className="text-sm text-gray-500 mb-4">
            {jobs.length} job{jobs.length !== 1 ? 's' : ''} found
          </p>
        )}

        {/* Jobs List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <Card key={i} className="animate-pulse">
                <CardContent className="pt-6 h-32 bg-gray-100 rounded" />
              </Card>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500">No jobs found. Try adjusting your filters.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <Card key={job.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">

                      {/* Title and category */}
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">{job.title}</h3>
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full capitalize">
                          {job.category}
                        </span>
                      </div>

                      {/* Farmer info — anonymous, no name */}
                      <p className="text-sm text-gray-500 mb-2">
                        ⭐ {job.farmers?.rating?.toFixed(1) ?? '—'} farmer rating
                        · {job.farmers?.village}, 
                      </p>

                      {/* Description */}
                      {job.description && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {job.description}
                        </p>
                      )}

                      {/* Meta pills */}
                      <div className="flex flex-wrap gap-2">
                        <span className="flex items-center gap-1 px-2 py-1 bg-yellow-50 text-yellow-700 text-xs rounded-full">
                          <DollarSign className="w-3 h-3" />
                          ₹{job.wage_amount}/{job.wage_type === 'piece_rate' ? 'task' : job.wage_type}
                        </span>
                        <span className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                          <Users className="w-3 h-3" />
                          {job.workers_needed} workers needed
                        </span>
                        <span className="flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-full">
                          <MapPin className="w-3 h-3" />
                          {job.distance_km} km away
                        </span>
                        {job.date_range?.start_date && (
                          <span className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            <Clock className="w-3 h-3" />
                            {new Date(job.date_range.start_date).toLocaleDateString('en-IN', {
                              day: 'numeric', month: 'short'
                            })}
                            {job.date_range.end_date !== job.date_range.start_date &&
                              ` – ${new Date(job.date_range.end_date).toLocaleDateString('en-IN', {
                                day: 'numeric', month: 'short'
                              })}`
                            }
                          </span>
                        )}
                        {job.meals_provided && (
                          <span className="px-2 py-1 bg-orange-50 text-orange-600 text-xs rounded-full">
                            🍱 Meals
                          </span>
                        )}
                        {job.transport_provided && (
                          <span className="px-2 py-1 bg-indigo-50 text-indigo-600 text-xs rounded-full">
                            🚌 Transport
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Apply button */}
                    <div className="flex-shrink-0">
                      {job.has_applied ? (
                        <span className="px-4 py-2 bg-green-100 text-green-700 text-sm font-medium rounded-lg">
                          ✓ Applied
                        </span>
                      ) : (
                        <Button
                          onClick={() => handleApply(job.id)}
                          disabled={applying === job.id}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {applying === job.id ? 'Applying...' : 'Apply Now'}
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
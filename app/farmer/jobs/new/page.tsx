'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createJob } from '@/app/actions/jobs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FieldGroup, FieldLabel } from '@/components/ui/field'
import { FarmerNavbar } from '../../components/navbar'
import { toast } from 'sonner'
import Link from 'next/link'

export default function NewJobPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
const [formData, setFormData] = useState({
  title: '',
  description: '',
  location_name: '',      // was: location
  latitude: '0',
  longitude: '0',
  category: '',
  workers_needed: '1',    // was: required_workers
  wage_amount: '0',       // was: wage_per_day
  wage_type: 'daily',     // new — add this
  start_date: '',
  end_date: '',
})

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString(),
          }))
          toast.success('Location captured')
        },
        () => toast.error('Could not get location')
      )
    }
  }

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setLoading(true)

  const result = await createJob({
    title: formData.title,
    description: formData.description,
    location_name: formData.location_name,   // fixed
    latitude: parseFloat(formData.latitude),
    longitude: parseFloat(formData.longitude),
    category: formData.category,
    workers_needed: parseInt(formData.workers_needed),  // fixed
    wage_amount: parseFloat(formData.wage_amount),       // fixed
    wage_type: formData.wage_type,                       // new
    start_date: formData.start_date,
    end_date: formData.end_date,
  })

  if (result?.error) {
    toast.error(result.error)
    setLoading(false)
  } else {
    toast.success('Job posted successfully!')
    router.push('/farmer/jobs')
  }
}

  return (
    <div className="min-h-screen bg-gray-50">
      <FarmerNavbar />

      <main className="max-w-3xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Post a New Job</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <FieldGroup>
                <FieldLabel htmlFor="title">Job Title</FieldLabel>
                <Input
                  id="title"
                  name="title"
                  placeholder="e.g., Corn Harvesting"
                  value={formData.title}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              </FieldGroup>

              {/* Description */}
              <FieldGroup>
                <FieldLabel htmlFor="description">Job Description</FieldLabel>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Describe the job details, requirements, and expectations"
                  value={formData.description}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows={5}
                  required
                />
              </FieldGroup>

              {/* Location */}
              <FieldGroup>
                <FieldLabel htmlFor="location">Job Location</FieldLabel>
                <Input
                  id="location"
                  name="location_name"
                  placeholder="City, State"
                  value={formData.location_name}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              </FieldGroup>

              {/* Coordinates */}
              <div className="grid grid-cols-2 gap-4">
                <FieldGroup>
                  <FieldLabel htmlFor="latitude">Latitude</FieldLabel>
                  <Input
                    id="latitude"
                    name="latitude"
                    type="number"
                    step="0.0001"
                    placeholder="0"
                    value={formData.latitude}
                    onChange={handleChange}
                    disabled={loading}
                    required
                  />
                </FieldGroup>
                <FieldGroup>
                  <FieldLabel htmlFor="longitude">Longitude</FieldLabel>
                  <Input
                    id="longitude"
                    name="longitude"
                    type="number"
                    step="0.0001"
                    placeholder="0"
                    value={formData.longitude}
                    onChange={handleChange}
                    disabled={loading}
                    required
                  />
                </FieldGroup>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleGetLocation}
                disabled={loading}
              >
                📍 Get Current Location
              </Button>

              {/* Category */}
              <FieldGroup>
                <FieldLabel htmlFor="category">Job Category</FieldLabel>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">Select a category</option>
                  <option value="harvesting">Harvesting</option>
                  <option value="plowing">Plowing</option>
                  <option value="weeding">Weeding</option>
                  <option value="planting">Planting</option>
                  <option value="irrigation">Irrigation</option>
                  <option value="other">Other</option>
                </select>
              </FieldGroup>

              {/* Workers and Wage */}
              <div className="grid grid-cols-2 gap-4">
                <FieldGroup>
                  <FieldLabel htmlFor="workers_needed">Workers Needed</FieldLabel>
                  <Input
                    id="workers_needed"
                    name="workers_needed"
                    type="number"
                    min="1"
                    placeholder="1"
                    value={formData.workers_needed}
                    onChange={handleChange}
                    disabled={loading}
                    required
                  />
                </FieldGroup>
                <FieldGroup>
                  <FieldLabel htmlFor="wage_amount">Daily Wage ($)</FieldLabel>
                  <Input
                    id="wage_amount"
                    name="wage_amount"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.wage_amount}
                    onChange={handleChange}
                    disabled={loading}
                    required
                  />
                </FieldGroup>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <FieldGroup>
                  <FieldLabel htmlFor="start_date">Start Date</FieldLabel>
                  <Input
                    id="start_date"
                    name="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={handleChange}
                    disabled={loading}
                    required
                  />
                </FieldGroup>
                <FieldGroup>
                  <FieldLabel htmlFor="end_date">End Date</FieldLabel>
                  <Input
                    id="end_date"
                    name="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={handleChange}
                    disabled={loading}
                    required
                  />
                </FieldGroup>
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={loading}
                >
                  {loading ? 'Posting...' : 'Post Job'}
                </Button>
                <Link href="/farmer/jobs" className="flex-1">
                  <Button type="button" variant="outline" className="w-full">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

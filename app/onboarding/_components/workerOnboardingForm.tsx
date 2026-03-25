'use client'

import { useState } from 'react'
import { signUpAsRole } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FieldGroup, FieldLabel } from '@/components/ui/field'
import { toast } from 'sonner'
import Link from 'next/link'

export default function WorkerOnboardingForm() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    village: '',
    district: '',
    state: '',
    latitude: '0',
    longitude: '0',
    skills: '',
    travel_distance: '10',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString(),
          }))
          toast.success('Location captured')
        },
        () => toast.error('Could not get location')
      )
    } else {
      toast.error('Geolocation not supported')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const result = await signUpAsRole('worker', formData)

    if (result?.error) {
      toast.error(result.error)
      setLoading(false)
    }
    // redirect is handled inside signUpAsRole server action
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-blue-700">
            Complete Your Worker Profile
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">

            <FieldGroup>
              <FieldLabel htmlFor="name">Full Name</FieldLabel>
              <Input
                id="name"
                name="name"
                placeholder="Your full name"
                value={formData.name}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </FieldGroup>

            <FieldGroup>
              <FieldLabel htmlFor="village">Village / Town</FieldLabel>
              <Input
                id="village"
                name="village"
                placeholder="Your village or town"
                value={formData.village}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </FieldGroup>

            <FieldGroup>
              <FieldLabel htmlFor="district">District</FieldLabel>
              <Input
                id="district"
                name="district"
                placeholder="Your district"
                value={formData.district}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </FieldGroup>

            <FieldGroup>
              <FieldLabel htmlFor="state">State</FieldLabel>
              <Input
                id="state"
                name="state"
                placeholder="Your state"
                value={formData.state}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </FieldGroup>

            <div className="grid grid-cols-2 gap-2">
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

            <FieldGroup>
              <FieldLabel htmlFor="skills">Skills (comma separated)</FieldLabel>
              <textarea
                id="skills"
                name="skills"
                placeholder="e.g., Sowing, Harvesting, Irrigation"
                value={formData.skills}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </FieldGroup>

            <FieldGroup>
              <FieldLabel htmlFor="travel_distance">
                Max Travel Distance (km)
              </FieldLabel>
              <Input
                id="travel_distance"
                name="travel_distance"
                type="number"
                placeholder="10"
                value={formData.travel_distance}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </FieldGroup>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Creating Profile...' : 'Create Worker Profile'}
            </Button>

            <p className="text-sm text-center text-gray-600">
              <Link href="/auth/role-selection" className="text-blue-600 hover:underline">
                Back to role selection
              </Link>
            </p>

          </form>
        </CardContent>
      </Card>
    </div>
  )
}
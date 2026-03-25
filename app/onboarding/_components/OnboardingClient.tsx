'use client'

import { useEffect, useState } from 'react'
import FarmerOnboardingForm from './farmerOnboardingForm'
import WorkerOnboardingForm from './workerOnboardingForm'

export default function OnboardingClient() {
  const [role, setRole] = useState<string | null>(null)

  useEffect(() => {
    const r = localStorage.getItem('pending_role')
    setRole(r)
  }, [])

  if (!role) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Loading...</p>
    </div>
  )

  return role === 'farmer'
    ? <FarmerOnboardingForm />
    : <WorkerOnboardingForm />
}
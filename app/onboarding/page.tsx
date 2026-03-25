'use client'

import { useEffect, useState } from 'react'
import FarmerOnboardingForm from './_components/farmerOnboardingForm'
import WorkerOnboardingForm from './_components/workerOnboardingForm'

export default function OnboardingPage() {
  const [role, setRole] = useState<string | null>(null)

  useEffect(() => {
    const r = localStorage.getItem('pending_role')
    setRole(r)
  }, [])

  if (!role) return <div>Loading...</div>

  return role === 'farmer' 
    ? <FarmerOnboardingForm /> 
    : <WorkerOnboardingForm />
}
'use client'

import { useEffect, useState } from 'react'

type OnboardingClientProps = {
  initialRole?: string
}

export default function OnboardingClient({ initialRole }: OnboardingClientProps) {
  const [role, setRole] = useState(initialRole ?? '')

  useEffect(() => {
    if (!initialRole) {
      const urlParams = new URLSearchParams(window.location.search)
      const roleParam = urlParams.get('role')
      if (roleParam) setRole(roleParam)
    }
  }, [initialRole])

  return (
    <div>
      <p>Initial role: {role}</p>
    </div>
  )
}
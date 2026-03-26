import { getWorkerApplications } from '@/app/actions/applications'
import { WorkerNavbar } from '../components/navbar'
import { WorkerApplicationsClient } from './client'
import { Suspense } from 'react'
import { ApplicationSkeleton } from '@/components/skeletons'

export const dynamic = 'force-dynamic'

async function WorkerApplicationsList() {
  const result = await getWorkerApplications()
  const applications = result.applications ?? []
  
  return <WorkerApplicationsClient applications={applications as any} error={result.error} />
}

export default async function WorkerApplicationsPage() {
  return (
    <div className="min-h-screen bg-gray-50/50 font-sans pb-20">
      <WorkerNavbar />

      <main className="max-w-7xl mx-auto px-6 py-12">
        <Suspense fallback={<ApplicationSkeleton />}>
           <WorkerApplicationsList />
        </Suspense>
      </main>
    </div>
  )
}
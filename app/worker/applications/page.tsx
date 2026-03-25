import { getWorkerApplications } from '@/app/actions/applications'
import { WorkerNavbar } from '../components/navbar'
import { WorkerApplicationsClient } from './client'

export const dynamic = 'force-dynamic'

export default async function WorkerApplicationsPage() {
  const result = await getWorkerApplications()

  const applications = result.applications ?? []

  return (
    <div className="min-h-screen bg-gray-50/50 font-sans pb-20">
      <WorkerNavbar />
      <WorkerApplicationsClient applications={applications} error={result.error} />
    </div>
  )
}
import { FarmerNavbar } from '@/app/farmer/components/navbar'
import { getFarmerApplications } from '@/app/actions/applications'
import { getTranslations } from '@/lib/i18n/server'
import { FarmerApplicationsClient } from './client'
import { Suspense } from 'react'
import { ApplicationSkeleton } from '@/components/skeletons'

export const dynamic = 'force-dynamic'

async function ApplicationsList() {
  const result = await getFarmerApplications()
  if (result.error) {
    return <div className="p-10 text-center text-red-500 font-bold uppercase tracking-widest">{result.error}</div>
  }
  
  return <FarmerApplicationsClient applications={result.applications || []} />
}

export default async function ApplicationsPage() {
  const { t } = await getTranslations()

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      <FarmerNavbar />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 leading-tight">
            {t('applications')}
          </h1>
          <p className="text-lg text-gray-500 mt-1 font-medium italic">
            {t('applications_subtitle')}
          </p>
        </div>

        <Suspense fallback={<ApplicationSkeleton />}>
           <ApplicationsList />
        </Suspense>
      </main>
    </div>
  )
}
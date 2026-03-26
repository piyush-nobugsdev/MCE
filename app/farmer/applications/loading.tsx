import { ApplicationSkeleton } from '@/components/skeletons'

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      <div className="h-20 bg-white border-b border-gray-100" />
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-10 space-y-3">
          <div className="h-10 w-48 bg-gray-200 rounded-xl animate-pulse" />
          <div className="h-5 w-72 bg-gray-100 rounded-lg animate-pulse" />
        </div>
        <ApplicationSkeleton />
      </main>
    </div>
  )
}

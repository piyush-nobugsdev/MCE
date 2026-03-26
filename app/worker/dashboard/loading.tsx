import { StatCardsSkeleton, JobsListSkeleton } from '@/components/skeletons'

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans pb-20">
      <div className="h-20 bg-white border-b border-gray-100" />
      <main className="max-w-7xl mx-auto px-6 py-10 w-full space-y-12">
        <div className="space-y-3">
          <div className="h-12 w-64 bg-gray-200 rounded-xl animate-pulse" />
          <div className="h-5 w-48 bg-gray-100 rounded-lg animate-pulse" />
        </div>

        <StatCardsSkeleton />

        <div className="h-24 w-full bg-blue-100/50 rounded-3xl animate-pulse" />

        <div className="space-y-6">
           <div className="h-8 w-48 bg-gray-100 rounded ml-2" />
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map(i => <div key={i} className="h-48 bg-white rounded-3xl border border-gray-100 shadow-sm animate-pulse" />)}
           </div>
        </div>

        <JobsListSkeleton />
      </main>
    </div>
  )
}

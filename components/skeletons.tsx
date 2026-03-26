export function StatCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm h-32 animate-pulse" />
      ))}
    </div>
  )
}

export function JobsListSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-6 w-32 bg-gray-100 rounded mb-4 animate-pulse ml-2" />
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-32 bg-white rounded-3xl border border-gray-100 shadow-sm animate-pulse" />
      ))}
    </div>
  )
}

export function ApplicationSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-48 bg-white rounded-[3.5rem] border border-gray-100 shadow-sm animate-pulse flex items-center px-12 gap-10">
           <div className="w-20 h-20 bg-gray-100 rounded-2xl flex-shrink-0" />
           <div className="flex-1 space-y-4">
              <div className="h-4 w-24 bg-gray-100 rounded" />
              <div className="h-10 w-64 bg-gray-200 rounded-xl" />
           </div>
           <div className="w-48 h-16 bg-gray-100 rounded-3xl" />
        </div>
      ))}
    </div>
  )
}

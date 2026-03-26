export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="h-16 bg-white border-b border-gray-100" />
      <main className="max-w-6xl mx-auto px-6 py-10 w-full space-y-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div className="space-y-3">
              <div className="h-10 w-48 bg-gray-200 rounded-xl animate-pulse" />
              <div className="h-4 w-64 bg-gray-100 rounded-lg animate-pulse" />
           </div>
           <div className="h-24 w-64 bg-white rounded-2xl border border-gray-100 shadow-sm animate-pulse" />
        </div>

        <div className="space-y-6">
           {[1, 2, 3].map((i) => (
             <div key={i} className="h-48 bg-white rounded-3xl border border-gray-100 shadow-sm animate-pulse flex items-center px-10">
                <div className="flex-1 space-y-6">
                   <div className="space-y-2">
                       <div className="h-4 w-24 bg-gray-100 rounded" />
                       <div className="h-8 w-64 bg-gray-200 rounded-lg" />
                   </div>
                   <div className="flex gap-10">
                      <div className="h-10 w-32 bg-gray-50 rounded-xl" />
                      <div className="h-10 w-32 bg-gray-50 rounded-xl" />
                   </div>
                </div>
                <div className="h-16 w-32 bg-gray-100 rounded-2xl" />
             </div>
           ))}
        </div>
      </main>
    </div>
  )
}

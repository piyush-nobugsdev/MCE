import { Button } from '@/components/ui/button'
import { Library, ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export function SammanHeader() {
  return (
    <section className="flex flex-col md:flex-row md:items-end justify-between px-2 gap-4">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-100">
            <Library className="w-5 h-5 text-white" />
          </div>
          <span className="text-[10px] font-black text-green-600 bg-green-50 px-3 py-1 rounded-full uppercase tracking-widest">Active Schemes</span>
        </div>
        <h1 className="text-5xl font-black text-gray-900 tracking-tighter uppercase leading-none">
          Samman Kendra
        </h1>
        <p className="text-gray-400 font-bold text-sm uppercase tracking-widest mt-3 max-w-xl">Connecting you with government benefits, subsidies, and growth opportunities</p>
      </div>
      
      <Link href="/farmer/dashboard">
        <Button variant="outline" className="h-12 px-6 rounded-2xl border-gray-100 font-black text-[10px] uppercase tracking-widest text-gray-400 hover:text-green-600 transition-all">
          <ChevronLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Button>
      </Link>
    </section>
  )
}

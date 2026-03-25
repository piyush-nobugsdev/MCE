'use client'

import { useRouter } from 'next/navigation'
import { FarmerNavbar } from '../../components/navbar'
import { Card, CardContent } from '@/components/ui/card'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { FarmForm } from '@/components/farm-form'

export default function AddFarmPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      <FarmerNavbar />

      <main className="max-w-4xl mx-auto px-6 py-10">
        <Link href="/farmer/farms" className="inline-flex items-center gap-2 mb-8 text-gray-400 font-bold hover:text-green-600 transition-all group">
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1" /> Back to My Farms
        </Link>

        <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Register New Farm</h1>
            <p className="text-gray-500 font-medium italic">Save your field details once, use it for every job posting.</p>
        </div>

        <Card className="border-none shadow-xl shadow-gray-100 rounded-[32px] overflow-hidden bg-white">
            <CardContent className="p-10">
                <FarmForm onSuccess={() => router.push('/farmer/farms')} />
            </CardContent>
        </Card>
      </main>
    </div>
  )
}

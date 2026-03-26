'use client'

import { useState } from 'react'
import { schemes, Scheme } from '@/lib/schemes'
import { SchemeCard } from './components/SchemeCard'
import { SchemeModal } from './components/SchemeModal'
import { Button } from '@/components/ui/button'
import { HelpCircle } from 'lucide-react'
import Link from 'next/link'
import { FarmerNavbar } from '../components/navbar'
import { SammanHeader } from './components/SammanHeader'

export default function SammanKendraPage() {
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null)

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      <FarmerNavbar />

      <main className="max-w-5xl mx-auto p-4 space-y-10 pt-10">
        
        <SammanHeader />

        {/* Main Section - Grid Optimized for 2 columns as requested */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">
              Recommended For Your Land
            </h2>
            <div className="h-px bg-gray-100 flex-1 ml-6" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {schemes.map((scheme) => (
              <SchemeCard 
                key={scheme.id} 
                scheme={scheme} 
                onClick={setSelectedScheme} 
              />
            ))}
          </div>
        </section>

        {/* Support Portal Button */}
        <section className="pt-8">
          <Link href="/farmer/sahyog-kendra">
            <Button 
              className="w-full h-20 bg-gray-900 hover:bg-black text-white rounded-xl shadow-sm border border-white/5 flex items-center justify-center gap-4 group transition-all active:scale-[0.98]"
            >
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center group-hover:rotate-6 transition-transform">
                <HelpCircle className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="text-lg font-black uppercase tracking-widest leading-none">Sahyog Kendra</p>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1.5">Community support and assistance</p>
              </div>
            </Button>
          </Link>
        </section>
      </main>

      <SchemeModal 
        scheme={selectedScheme} 
        onClose={() => setSelectedScheme(null)} 
      />

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100;300;400;500;700;900&display=swap');
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        body { font-family: 'Outfit', sans-serif; }
      `}</style>
    </div>
  )
}

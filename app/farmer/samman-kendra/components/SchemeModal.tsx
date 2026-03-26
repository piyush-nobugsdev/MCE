'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { Scheme } from '@/lib/schemes'
import { Button } from '@/components/ui/button'
import { X, ExternalLink, CheckCircle2, ShieldCheck, Wallet, Info, FileText } from 'lucide-react'

interface SchemeModalProps {
  scheme: Scheme | null;
  onClose: () => void;
}

export function SchemeModal({ scheme, onClose }: SchemeModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  if (!scheme) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        ref={modalRef}
        className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 border border-gray-200"
      >
        <button 
          onClick={onClose}
          className="absolute right-6 top-6 z-30 p-2.5 bg-black/20 hover:bg-black/40 text-white rounded-lg transition-all hover:rotate-90 backdrop-blur-md"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Header */}
        <div className="relative h-64 w-full flex-shrink-0">
          <Image
            src={scheme.image}
            alt={scheme.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-8 left-8 right-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex px-3 py-1 bg-green-500/20 backdrop-blur-md border border-green-500/30 text-green-400 text-[10px] font-bold rounded-md uppercase tracking-wider">
                Government Scheme
              </div>
              <h2 className="text-3xl font-black text-white tracking-tight leading-none">{scheme.name}</h2>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-xl flex items-center gap-3">
               <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-white" />
               </div>
               <div>
                  <p className="text-[9px] font-bold text-white/60 uppercase tracking-widest">Benefit</p>
                  <p className="text-lg font-bold text-white leading-none mt-0.5">{scheme.benefit}</p>
               </div>
            </div>
          </div>
        </div>

        <div className="p-8 overflow-y-auto space-y-10 custom-scrollbar">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-7 space-y-8">
              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100">
                    <Info className="w-4 h-4 text-green-600" />
                  </div>
                  <h3 className="text-[10px] font-bold text-gray-900 uppercase tracking-widest">About Scheme</h3>
                </div>
                <p className="text-base text-gray-600 font-medium leading-relaxed">
                  {scheme.description}
                </p>
              </section>

              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  </div>
                  <h3 className="text-[10px] font-bold text-gray-900 uppercase tracking-widest">Application Process</h3>
                </div>
                <ul className="space-y-3">
                  {scheme.steps.map((step, idx) => (
                    <li key={idx} className="flex gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center shadow-sm shrink-0 font-bold text-green-600 text-xs">
                        {idx + 1}
                      </div>
                      <span className="text-gray-700 text-sm font-medium leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-5 space-y-6">
              <section className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-gray-100">
                      <ShieldCheck className="w-4 h-4 text-green-600" />
                    </div>
                    <h3 className="text-[10px] font-bold text-green-800 uppercase tracking-widest">Eligibility</h3>
                  </div>
                  <p className="text-sm text-gray-700 font-medium leading-relaxed">
                    {scheme.eligibility}
                  </p>
                </div>

                <div className="pt-6 border-t border-gray-200 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-gray-100">
                      <FileText className="w-4 h-4 text-blue-600" />
                    </div>
                    <h3 className="text-[10px] font-bold text-blue-800 uppercase tracking-widest">Documents</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['Aadhaar Card', 'Land Records', 'Bank Passbook'].map((doc) => (
                      <span key={doc} className="bg-white px-2.5 py-1 rounded-md text-[9px] font-bold text-gray-500 border border-gray-200 uppercase">
                        {doc}
                      </span>
                    ))}
                  </div>
                </div>
              </section>

              <div className="bg-green-600 p-6 rounded-xl text-white space-y-2 shadow-sm">
                 <p className="text-[9px] font-bold uppercase tracking-widest opacity-70">Need assistance?</p>
                 <p className="text-sm font-medium leading-tight">Visit your nearest Common Service Centre (CSC) for help with the application.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t bg-white flex flex-col sm:flex-row gap-4">
          <Button 
            className="flex-1 bg-green-600 hover:bg-green-700 h-14 rounded-xl text-sm font-bold uppercase tracking-widest shadow-sm transition-all active:scale-[0.98]"
            onClick={() => window.open(scheme.link, '_blank')}
          >
            Apply Online
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
          <Button 
            variant="ghost" 
            className="h-14 px-8 rounded-xl text-gray-400 font-bold uppercase tracking-widest hover:text-gray-900"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #D1D5DB; }
      `}</style>
    </div>
  )
}

'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { Scheme } from '@/lib/schemes'
import { Button } from '@/components/ui/button'
import { X, ExternalLink, CheckCircle2 } from 'lucide-react'

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        ref={modalRef}
        className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
      >
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 z-10 p-2 bg-black/30 hover:bg-black/50 text-white rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative h-48 w-full flex-shrink-0">
          <Image
            src={scheme.image}
            alt={scheme.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute bottom-4 left-6">
            <h2 className="text-2xl font-bold text-white mb-1">{scheme.name}</h2>
            <div className="inline-block px-3 py-1 bg-green-500 text-white text-sm font-bold rounded-full">
              {scheme.benefit}
            </div>
          </div>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          <section>
            <h3 className="text-lg font-bold text-gray-800 mb-2">About Scheme</h3>
            <p className="text-gray-600 leading-relaxed">
              {scheme.description}
            </p>
          </section>

          <section className="bg-green-50 p-4 rounded-xl border border-green-100">
            <h3 className="text-lg font-bold text-green-800 mb-2">Eligibility</h3>
            <p className="text-green-700 font-medium">
              {scheme.eligibility}
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-gray-800 mb-3">How to Apply</h3>
            <ul className="space-y-3">
              {scheme.steps.map((step, idx) => (
                <li key={idx} className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm leading-snug">{step}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="p-6 border-t bg-gray-50 flex gap-3">
          <Button 
            className="flex-1 bg-green-600 hover:bg-green-700 h-12 text-lg font-bold"
            onClick={() => window.open(scheme.link, '_blank')}
          >
            Apply on Official Website
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
          <Button 
            variant="outline" 
            className="h-12 border-gray-300"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}

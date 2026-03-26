'use client'

import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle2, Copy, PartyPopper } from 'lucide-react'
import { toast } from 'sonner'

export function SuccessState({ caseId }: { caseId: string }) {
  const copyCaseId = () => {
    navigator.clipboard.writeText(caseId)
    toast.success('Case ID copied!')
  }

  return (
    <Card className="rounded-[3.5rem] border-0 shadow-2xl shadow-gray-100 overflow-hidden bg-white text-center">
      <CardContent className="p-20 space-y-10">
        <div className="relative inline-block scale-150 mb-10">
           <CheckCircle2 className="w-16 h-16 text-green-500 stroke-[3]" />
           <PartyPopper className="absolute -top-4 -right-4 w-10 h-10 text-orange-400 animate-bounce" />
        </div>

        <div className="space-y-4">
           <h1 className="text-5xl font-black text-gray-900 uppercase tracking-tighter leading-none">Report Filed!</h1>
           <p className="max-w-md mx-auto text-gray-400 font-bold leading-relaxed uppercase tracking-widest text-[11px]">
             We have received your request. Our verification team will reach out shortly for fund allocation.
           </p>
        </div>

        <div className="inline-flex flex-col items-center bg-gray-50 p-10 rounded-[2.5rem] border border-gray-100/50 space-y-4 w-full">
           <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Your Case ID</p>
           <div className="flex items-center gap-6">
              <span className="text-4xl font-black text-gray-900 tracking-tighter uppercase">{caseId}</span>
              <button 
                onClick={copyCaseId}
                className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <Copy className="w-5 h-5 text-green-600" />
              </button>
           </div>
        </div>

        <button 
          onClick={() => window.location.reload()}
          className="text-green-600 font-black uppercase tracking-widest text-[10px] hover:underline"
        >
          &larr; Back to Kendra
        </button>
      </CardContent>
    </Card>
  )
}

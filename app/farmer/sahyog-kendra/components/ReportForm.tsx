'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, Send, ShieldCheck } from 'lucide-react'

interface Props {
  categoryTitle: string
  onSubmit: (aadhaar: string, description: string) => void
  loading: boolean
  script: string
}

export function ReportForm({ categoryTitle, onSubmit, loading, script }: Props) {
  const [aadhaar, setAadhaar] = useState('')
  const [description, setDescription] = useState('')

  return (
    <Card className="rounded-[3rem] border-0 shadow-2xl shadow-gray-100/50 overflow-hidden bg-white/90 backdrop-blur-sm animate-in zoom-in-95 duration-500">
      <CardContent className="p-12 space-y-10">
        <div className="space-y-3">
           <h2 className="text-[10px] font-black text-green-600 uppercase tracking-[0.3em] ml-1">Verified Reporting</h2>
           <h3 className="text-4xl font-black text-gray-900 uppercase tracking-tighter leading-none">{categoryTitle}</h3>
        </div>

        <div className="bg-blue-50/30 p-8 rounded-[2.5rem] border border-blue-100/50 flex items-start gap-5 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-20 h-20 bg-blue-100/20 rounded-full -mr-10 -mt-10 blur-xl" />
           <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-blue-50 shrink-0">
              <span className="text-xl">🤖</span>
           </div>
           <p className="text-[11px] font-bold text-blue-800 leading-relaxed uppercase tracking-[0.15em] mt-1.5 relative z-10">
             {script}
           </p>
        </div>

        <div className="space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-1">Aadhaar Number</label>
            <input 
              type="text" 
              maxLength={12}
              value={aadhaar}
              onChange={(e) => setAadhaar(e.target.value)}
              placeholder="XXXX XXXX XXXX"
              className="w-full h-16 px-8 rounded-2xl bg-gray-50/50 border-2 border-transparent focus:border-green-500/10 focus:bg-white focus:ring-4 focus:ring-green-500/5 text-gray-900 font-bold placeholder:text-gray-300 transition-all duration-300"
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-1">Loss Description</label>
            <textarea 
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please provide details about your loss..."
              className="w-full p-8 rounded-[2rem] bg-gray-50/50 border-2 border-transparent focus:border-green-500/10 focus:bg-white focus:ring-4 focus:ring-green-500/5 text-gray-900 font-bold placeholder:text-gray-300 resize-none transition-all duration-300"
            />
          </div>

          <div className="bg-green-50/50 p-6 rounded-2xl flex items-center gap-5 border border-green-100/50">
             <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <ShieldCheck className="w-5 h-5 text-green-600" />
             </div>
             <p className="text-[10px] font-bold text-green-700 uppercase tracking-[0.15em] opacity-80">Encrypted Submission • Aid Verification Only</p>
          </div>

          <Button 
            onClick={() => onSubmit(aadhaar, description)}
            disabled={loading || !aadhaar || !description}
            className="w-full h-16 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-black uppercase tracking-widest shadow-2xl shadow-green-100 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
              <div className="flex items-center gap-3">
                <span className="tracking-widest">Submit Report</span>
                <Send className="w-5 h-5" />
              </div>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

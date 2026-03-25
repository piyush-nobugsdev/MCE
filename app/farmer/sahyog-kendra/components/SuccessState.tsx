import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface SuccessStateProps {
  caseId: string
}

export function SuccessState({ caseId }: SuccessStateProps) {
  return (
    <div className="py-20 text-center space-y-10">
      <div className="w-32 h-32 bg-green-600 rounded-[3rem] flex items-center justify-center mx-auto shadow-2xl shadow-green-200 animate-bounce">
         <CheckCircle2 className="w-16 h-16 text-white" />
      </div>
      <div className="space-y-4">
         <h2 className="text-5xl font-black text-gray-900 uppercase tracking-tighter">Request Received</h2>
         <p className="text-gray-400 font-medium max-w-md mx-auto leading-relaxed">
            Our team and community partners will review your Aadhaar details and documented proof. We will reach out to you within 24 hours.
         </p>
      </div>
      <div className="flex flex-col items-center gap-6">
         <Link href="/farmer/dashboard">
            <Button className="h-16 px-12 bg-black text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-2xl shadow-gray-200">Return to Dashboard</Button>
         </Link>
         <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">Case ID: {caseId}</p>
      </div>
    </div>
  )
}

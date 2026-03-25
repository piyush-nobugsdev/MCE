import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Camera, MessageSquare } from 'lucide-react'
import { toast } from 'sonner'

interface ReportFormProps {
  categoryTitle: string
  initialDescription: string
  onSubmit: (aadhaar: string, description: string) => void
  loading: boolean
}

export function ReportForm({ categoryTitle, initialDescription, onSubmit, loading }: ReportFormProps) {
  const [aadhaar, setAadhaar] = useState('')
  const [description, setDescription] = useState(initialDescription)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!aadhaar || aadhaar.length < 12) {
      return toast.error('Valid 12-digit Aadhaar required for verification')
    }
    onSubmit(aadhaar, description)
  }

  return (
    <div className="space-y-10">
      <div className="space-y-2">
         <span className="px-4 py-1.5 bg-green-100 text-green-700 text-[10px] font-black uppercase tracking-widest rounded-full">Reporting: {categoryTitle}</span>
         <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Support Verification Form</h2>
      </div>

      <Card className="border-0 shadow-2xl shadow-gray-200/50 rounded-[3rem] bg-white overflow-hidden">
         <CardContent className="p-10 lg:p-12">
            <form onSubmit={handleSubmit} className="space-y-8">
               
               <div className="space-y-3">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-2">Aadhaar Card Number (Verification)</label>
                  <div className="relative">
                     <FileText className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                     <input 
                        type="text" 
                        maxLength={12}
                        value={aadhaar}
                        onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, ''))}
                        placeholder="12-digit number"
                        className="w-full pl-16 pr-8 py-6 bg-gray-50 rounded-[2rem] text-lg font-bold border-2 border-transparent focus:border-green-400 focus:bg-white transition-all outline-none"
                        required
                     />
                  </div>
               </div>

               <div className="space-y-4">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-2">Upload Proof (Geo-tagged Photos & Documents)</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     <button type="button" className="aspect-square bg-gray-50 border-4 border-dashed border-gray-100 rounded-[2rem] flex flex-col items-center justify-center gap-2 hover:bg-green-50 hover:border-green-100 transition-all group">
                        <Camera className="w-6 h-6 text-gray-300 group-hover:text-green-600" />
                        <span className="text-[8px] font-black uppercase text-gray-400">Add Proof</span>
                     </button>
                     <div className="aspect-square bg-gray-100 rounded-[2rem] relative overflow-hidden flex items-center justify-center">
                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Awaiting...</span>
                     </div>
                  </div>
                  <p className="text-[10px] font-bold text-gray-400 italic px-2">Photos must be taken via app for GPS metadata. Documents like land records are mandatory.</p>
               </div>

               <div className="space-y-3">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-2">Explain the situation</label>
                  <div className="relative">
                     <MessageSquare className="absolute left-6 top-6 w-5 h-5 text-gray-300" />
                     <textarea 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full pl-16 pr-8 py-6 bg-gray-50 rounded-[2.5rem] min-h-[200px] text-sm font-bold border-2 border-transparent focus:border-green-400 focus:bg-white transition-all outline-none resize-none leading-relaxed"
                        required
                     />
                  </div>
               </div>

               <Button 
                  type="submit"
                  disabled={loading}
                  className="w-full h-24 bg-green-600 hover:bg-green-700 text-white rounded-[2.5rem] shadow-2xl shadow-green-100 text-xl font-black uppercase tracking-widest transition-all active:scale-95"
               >
                  {loading ? 'Transmitting Data...' : 'Submit Support Request'}
               </Button>
            </form>
         </CardContent>
      </Card>
    </div>
  )
}

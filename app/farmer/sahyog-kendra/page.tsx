'use client'

import { useState } from 'react'
import { FarmerNavbar } from '../components/navbar'
import { CloudRain, Bug, TrendingDown, Leaf, ChevronLeft } from 'lucide-react'
import { SahyogCategoryCard } from './components/SahyogCategoryCard'
import { ReportForm } from './components/ReportForm'
import { SuccessState } from './components/SuccessState'

const categories = [
  {
    id: 'natural-disaster',
    title: 'Natural Disaster',
    icon: CloudRain,
    description: 'Floods, heavy rain, or storm damage',
    script: 'Please describe the extent of flood damage. When did it start? How many acres are affected?'
  },
  {
    id: 'crop-disease',
    title: 'Pests & Diseases',
    icon: Bug,
    description: 'Unknown pests or spreading diseases',
    script: 'Describe the symptoms on leaves/stems. Is it spreading fast? What treatments have you tried?'
  },
  {
    id: 'market-loss',
    title: 'Market & Price Loss',
    icon: TrendingDown,
    description: 'Sudden price crash or exploitation',
    script: 'Which crop is affected? What is the current market rate vs expected rate? Provide mandi details.'
  },
  {
    id: 'input-quality',
    title: 'Seed/Fertilizer Quality',
    icon: Leaf,
    description: 'Fake seeds or low-quality chemicals',
    script: 'Provide brand name and batch number. Why do you suspect low quality? Attach bill photo if possible.'
  }
]

export default function SahyogKendraPage() {
  const [step, setStep] = useState<'categories' | 'form' | 'success'>('categories')
  const [selectedCategory, setSelectedCategory] = useState<typeof categories[0] | null>(null)
  const [loading, setLoading] = useState(false)
  const [caseId, setCaseId] = useState('')

  const handleCategorySelect = (cat: typeof categories[0]) => {
    setSelectedCategory(cat)
    setStep('form')
  }

  const handleFormSubmit = async (aadhaar: string, description: string) => {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setCaseId(`FW-${Math.random().toString(36).substring(7).toUpperCase()}`)
    setLoading(false)
    setStep('success')
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      <FarmerNavbar />

      <main className="max-w-4xl mx-auto px-6 py-12">
        {step !== 'categories' && step !== 'success' && (
          <button 
            onClick={() => setStep('categories')}
            className="flex items-center gap-2 mb-8 text-gray-400 font-black uppercase tracking-widest text-[10px] hover:text-green-600 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Change Problem Type
          </button>
        )}

        {step === 'categories' && (
          <div className="space-y-12">
            <div className="text-center space-y-4">
               <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter leading-none">Kissan Sahyog Kendra</h1>
               <p className="max-w-2xl mx-auto text-gray-700 font-bold leading-relaxed">
                 Report your losses to our community hub. We verify your data and work with our <span className="text-green-600">Social Media Team</span> and <span className="text-green-600">Charity Partners</span> to raise funds and aid your farm.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categories.map((cat) => (
                <SahyogCategoryCard
                  key={cat.id}
                  id={cat.id}
                  title={cat.title}
                  description={cat.description}
                  icon={cat.icon}
                  onClick={() => handleCategorySelect(cat)}
                />
              ))}
            </div>
          </div>
        )}

        {step === 'form' && selectedCategory && (
          <ReportForm
            categoryTitle={selectedCategory.title}
            initialDescription={selectedCategory.script}
            onSubmit={handleFormSubmit}
            loading={loading}
          />
        )}

        {step === 'success' && <SuccessState caseId={caseId} />}
      </main>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100;300;400;500;700;900&display=swap');
        body { font-family: 'Outfit', sans-serif; }
      `}</style>
    </div>
  )
}

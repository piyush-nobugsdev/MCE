'use client'

import { useState, useEffect } from 'react'
import { FarmerNavbar } from '../components/navbar'
import { PostBox } from '@/components/farmer/community/PostBox'
import { PostCard } from '@/components/farmer/community/PostCard'
import { FilterTabs } from '@/components/farmer/community/FilterTabs'
import { getPosts } from '@/app/actions/community'
import { Post } from '@/lib/types'
import { toast } from 'sonner'
import { Loader2, Users, CloudRain, Bug, TrendingDown, Leaf, ChevronLeft } from 'lucide-react'
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
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')

  // Reporting state
  const [step, setStep] = useState<'categories' | 'form' | 'success'>('categories')
  const [selectedCategory, setSelectedCategory] = useState<typeof categories[0] | null>(null)
  const [reportingLoading, setReportingLoading] = useState(false)
  const [caseId, setCaseId] = useState('')

  const handleCategorySelect = (cat: typeof categories[0]) => {
    setSelectedCategory(cat)
    setStep('form')
  }

  const handleFormSubmit = async (aadhaar: string, description: string) => {
    setReportingLoading(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setCaseId(`FW-${Math.random().toString(36).substring(7).toUpperCase()}`)
    setReportingLoading(false)
    setStep('success')
  }

  const fetchPosts = async (tag: string) => {
    setLoading(true)
    const result = await getPosts(tag)
    if (result.error) {
      toast.error(result.error)
    } else {
      setPosts(result.posts || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchPosts(activeTab)
  }, [activeTab])

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gray-50/50 pb-20 font-sans">
        <FarmerNavbar />
        <main className="max-w-4xl mx-auto px-6 py-12">
          <SuccessState caseId={caseId} />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20 font-sans">
      <FarmerNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 rounded-lg border border-green-100 mb-3">
            <Users className="w-3.5 h-3.5 text-green-600" />
            <span className="text-[10px] font-bold text-green-700 uppercase tracking-widest">Farmer Support Hub</span>
          </div>
          <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter leading-none">Sahyog Kendra</h1>
          <p className="max-w-xl text-gray-500 font-bold leading-relaxed text-sm mt-2">
            A unified space to connect with fellow farmers, share wisdom, and report critical issues for verified aid.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Community Feed (8/12) */}
          <div className="lg:col-span-8 space-y-10">
            {/* Create Post Section */}
            <PostBox onPostCreated={() => fetchPosts(activeTab)} />

            {/* Filtering Section */}
            <FilterTabs activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Feed List */}
            <div className="space-y-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4 bg-white rounded-2xl border border-gray-200 shadow-sm">
                  <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Loading Feed...</p>
                </div>
              ) : posts.length === 0 ? (
                <div className="bg-white p-20 rounded-2xl border border-gray-200 shadow-sm text-center">
                  <p className="text-lg font-bold text-gray-300 uppercase tracking-wider">No posts found</p>
                  <button 
                    onClick={() => setActiveTab('all')}
                    className="mt-6 text-green-600 font-bold uppercase tracking-widest text-[10px] hover:underline"
                  >
                    View All Posts
                  </button>
                </div>
              ) : (
                posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))
              )}
            </div>
          </div>

          {/* Right Column: Reporting (4/12) */}
          <div className="lg:col-span-4 space-y-8">
            {step === 'categories' ? (
              <div className="space-y-6">
                <div className="px-1">
                   <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Report Critical Issue</h2>
                   <p className="text-xs text-gray-400 font-medium">
                     Select a category below to report losses for aid verification.
                   </p>
                </div>
                <div className="grid grid-cols-1 gap-4">
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
            ) : selectedCategory && (
              <div className="space-y-6">
                <button 
                  onClick={() => setStep('categories')}
                  className="flex items-center gap-2 text-gray-400 font-bold uppercase tracking-widest text-[10px] hover:text-green-600 transition-colors px-2"
                >
                  <ChevronLeft className="w-4 h-4" /> Back to Categories
                </button>
                <ReportForm
                  categoryTitle={selectedCategory.title}
                  onSubmit={handleFormSubmit}
                  loading={reportingLoading}
                  script={selectedCategory.script}
                />
              </div>
            )}

            {/* Sidebar Support Info */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
               <h3 className="text-[10px] font-bold text-gray-900 uppercase tracking-widest pb-4 border-b border-gray-50">How it works</h3>
               <div className="space-y-4">
                  {[
                    { title: 'Verified Data', text: 'We verify your Aadhaar and loss reports rigorously.' },
                    { title: 'Social Reach', text: 'Our media team raises awareness for your case.' },
                    { title: 'Aid Allocation', text: 'Funds are distributed through charity partners.' }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4">
                       <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 border border-gray-200">
                          <span className="text-[10px] font-bold text-gray-400">{i + 1}</span>
                       </div>
                       <div className="space-y-1 pt-0.5">
                          <p className="text-[11px] font-bold text-gray-900 uppercase tracking-wider">{item.title}</p>
                          <p className="text-[10px] font-medium text-gray-400 leading-relaxed">{item.text}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100;300;400;500;700;900&display=swap');
        body { font-family: 'Outfit', sans-serif; }
      `}</style>
    </div>
  )
}

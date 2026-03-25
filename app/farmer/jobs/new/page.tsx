'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createJob } from '@/app/actions/jobs'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { FarmerNavbar } from '../../components/navbar'
import { toast } from 'sonner'
import Link from 'next/link'
import { MapPin, Calendar, Users, Briefcase, IndianRupee, ChevronLeft, Loader2, Sparkles, Plus } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/context'

export default function NewJobPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location_name: '',
    latitude: '0',
    longitude: '0',
    category: '',
    workers_needed: '1',
    wage_amount: '0',
    wage_type: 'daily',
    start_date: '',
    end_date: '',
  })

  const [skills, setSkills] = useState<string[]>([])
  const skillsList = [
    "Harvesting", "Weeding", "Crop Planting", "Seed Sowing", 
    "Irrigation", "Pesticide Spraying", "Fertilizer Application", 
    "Tractor Driving", "Fruit Picking", "Crop Cutting"
  ]

  const handleSkillChange = (skill: string) => {
    setSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill])
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString(),
          }))
          toast.success('Location captured')
        },
        () => toast.error('Could not get location')
      )
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (skills.length === 0) return toast.error('Please select at least one skill')
    setLoading(true)

    const result = await createJob({
      ...formData,
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude),
      category: skills.join(', '),
      workers_needed: parseInt(formData.workers_needed),
      wage_amount: parseFloat(formData.wage_amount),
    })

    if (result?.error) {
      toast.error(result.error)
      setLoading(false)
    } else {
      toast.success('Job posted successfully!')
      router.push('/farmer/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      <FarmerNavbar />

      <main className="max-w-4xl mx-auto px-6 py-10">
        <Link href="/farmer/dashboard" className="inline-flex items-center gap-2 mb-8 text-gray-400 font-bold text-sm hover:text-green-600 transition-colors group">
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          {t('back')}
        </Link>

        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 leading-tight">
            {t('post_job')}
          </h1>
          <p className="text-lg text-gray-500 mt-1 font-medium italic flex items-center gap-2">
             <Sparkles className="w-5 h-5 text-yellow-500" /> Let workers find your farm
          </p>
        </div>

        <Card className="border border-gray-100 shadow-sm rounded-3xl overflow-hidden bg-white">
          <CardContent className="p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-10">

              {/* Basic Info */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Job Title</label>
                  <div className="relative">
                    <Briefcase className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                    <input
                      name="title"
                      placeholder="e.g., Rice Harvesting"
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full pl-16 pr-6 h-16 border-2 border-gray-50 rounded-2xl text-lg font-bold focus:outline-none focus:border-green-400 focus:bg-white bg-gray-50/50 transition-all placeholder:text-gray-200"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Work Description</label>
                  <textarea
                    name="description"
                    placeholder="Briefly describe the work..."
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-6 py-6 border-2 border-gray-50 rounded-2xl text-lg font-medium focus:outline-none focus:border-green-400 focus:bg-white bg-gray-50/50 transition-all min-h-[150px] placeholder:text-gray-200"
                    required
                  />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-6 pt-6 border-t border-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Village / Town</label>
                    <div className="relative">
                      <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                      <input
                        name="location_name"
                        placeholder="e.g., Mandya District"
                        value={formData.location_name}
                        onChange={handleChange}
                        className="w-full pl-16 pr-6 h-16 border-2 border-gray-50 rounded-2xl text-lg font-bold focus:outline-none focus:border-green-400 focus:bg-white bg-gray-50/50 transition-all placeholder:text-gray-200"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex items-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleGetLocation}
                      className="w-full h-16 rounded-2xl border-2 border-gray-100 flex items-center justify-center gap-3 active:scale-95"
                    >
                      <MapPin className="w-5 h-5 text-green-600" />
                      Capture My Location
                    </Button>
                  </div>
                </div>
              </div>

              {/* Nature of Work */}
              <div className="space-y-4 pt-6 border-t border-gray-50">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Type of work (Select all that apply)</label>
                <div className="flex flex-wrap gap-2">
                  {skillsList.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => handleSkillChange(skill)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all ${
                        skills.includes(skill)
                        ? 'bg-green-600 border-green-600 text-white shadow-md'
                        : 'bg-white border-gray-100 text-gray-400 hover:border-green-200'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              {/* Numbers */}
              <div className="space-y-6 pt-6 border-t border-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Workers Needed</label>
                    <div className="relative">
                      <Users className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                      <input
                        type="number"
                        name="workers_needed"
                        value={formData.workers_needed}
                        onChange={handleChange}
                        min="1"
                        className="w-full pl-16 pr-6 h-16 border-2 border-gray-50 rounded-2xl text-2xl font-bold focus:outline-none focus:border-green-400 focus:bg-white bg-gray-50/50 transition-all"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Daily Pay (per person)</label>
                    <div className="relative">
                      <IndianRupee className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" />
                      <input
                        type="number"
                        name="wage_amount"
                        value={formData.wage_amount}
                        onChange={handleChange}
                        min="0"
                        className="w-full pl-16 pr-6 h-16 border-2 border-gray-50 rounded-2xl text-2xl font-bold text-green-700 focus:outline-none focus:border-green-400 focus:bg-white bg-gray-50/50 transition-all"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="space-y-6 pt-6 border-t border-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Start Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                      <input
                        type="date"
                        name="start_date"
                        value={formData.start_date}
                        onChange={handleChange}
                        className="w-full pl-16 pr-6 h-16 border-2 border-gray-50 rounded-2xl text-lg font-bold focus:outline-none focus:border-green-400 focus:bg-white bg-gray-50/50 transition-all"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">End Date (optional)</label>
                    <div className="relative">
                      <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                      <input
                        type="date"
                        name="end_date"
                        value={formData.end_date}
                        onChange={handleChange}
                        className="w-full pl-16 pr-6 h-16 border-2 border-gray-50 rounded-2xl text-lg font-bold focus:outline-none focus:border-green-400 focus:bg-white bg-gray-50/50 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-8">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-20 bg-black hover:bg-gray-900 rounded-2xl text-xl font-bold transition-all active:scale-95 flex items-center justify-center gap-3"
                >
                  {loading ? <Loader2 className="w-8 h-8 animate-spin" /> : (
                    <>
                      <Plus className="w-6 h-6 stroke-[3]" /> Post Job Now
                    </>
                  )}
                </Button>
              </div>

            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
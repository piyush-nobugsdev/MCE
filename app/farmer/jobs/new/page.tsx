'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createJob } from '@/app/actions/jobs'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { FarmerNavbar } from '../../components/navbar'
import { toast } from 'sonner'
import Link from 'next/link'
import { MapPin, Calendar, Users, Briefcase, IndianRupee, ChevronLeft, Loader2, Sparkles, Plus, History, ChevronDown, CheckCircle2 } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/context'
import { getFarms } from '@/app/actions/farms'
import { FarmForm } from '@/components/farm-form'

export default function NewJobPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [loading, setLoading] = useState(false)
  const [showFarmForm, setShowFarmForm] = useState(false)

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
  
  const [farms, setFarms] = useState<any[]>([])
  const [selectedFarm, setSelectedFarm] = useState<string>('')

  const fetchFarms = async () => {
    const { farms } = await getFarms()
    if (farms) setFarms(farms)
  }

  useEffect(() => {
    fetchFarms()
  }, [])

  const handleFarmSelect = (farmId: string) => {
    setSelectedFarm(farmId)
    const farm = farms.find(f => f.id === farmId)
    if (farm) {
      setFormData(prev => ({
        ...prev,
        location_name: farm.nickname + ' (' + (farm.area_name || '') + ')',
        latitude: farm.location.lat.toString(),
        longitude: farm.location.lng.toString(),
      }))
    }
  }

  const handleFarmCreated = (farm: any) => {
    setFarms(prev => [farm, ...prev])
    setSelectedFarm(farm.id)
    setFormData(prev => ({
      ...prev,
      location_name: farm.nickname + ' (' + (farm.area_name || '') + ')',
      latitude: farm.location.lat.toString(),
      longitude: farm.location.lng.toString(),
    }))
    setShowFarmForm(false)
    toast.success('New farm selected for the job!')
  }

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.location_name || formData.latitude === '0') return toast.error('Please select a farm location')
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
        <Link href="/farmer/dashboard" className="inline-flex items-center gap-2 mb-8 text-gray-400 font-bold text-sm hover:text-green-600 transition-all group">
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

        <Card className="border-none shadow-xl shadow-gray-100/50 rounded-[40px] overflow-hidden bg-white">
          <CardContent className="p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-10">

              {/* Basic Info */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-300 uppercase tracking-widest pl-1">Job Title</label>
                  <div className="relative">
                    <Briefcase className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-200" />
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
                  <label className="text-xs font-black text-gray-300 uppercase tracking-widest pl-1">Work Description</label>
                  <textarea
                    name="description"
                    placeholder="Briefly describe the work..."
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-8 py-6 border-2 border-gray-50 rounded-2xl text-lg font-medium focus:outline-none focus:border-green-400 focus:bg-white bg-gray-50/50 transition-all min-h-[150px] placeholder:text-gray-200"
                    required
                  />
                </div>
              </div>

              {/* Location Selection */}
              <div className="space-y-6 pt-10 border-t border-gray-50">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-black text-gray-300 uppercase tracking-widest pl-1">Where is the work? (Farm Location)</label>
                        <button 
                            type="button" 
                            onClick={() => setShowFarmForm(!showFarmForm)} 
                            className={`text-xs font-black px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${showFarmForm ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600 active:scale-95'}`}
                        >
                            {showFarmForm ? 'Cancel New Farm' : <><Plus className="w-4 h-4 stroke-[3]" /> Register New Farm</>}
                        </button>
                    </div>

                    {showFarmForm ? (
                        <div className="bg-gray-50/50 p-8 rounded-[32px] border-2 border-dashed border-gray-100 animate-in zoom-in-95 fade-in">
                            <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <MapPin className="w-4 h-4" /> Quick Farm Registration
                            </h4>
                            <FarmForm onSuccess={handleFarmCreated} onCancel={() => setShowFarmForm(false)} />
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="relative">
                                <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                                <select 
                                    value={selectedFarm} 
                                    onChange={(e) => handleFarmSelect(e.target.value)}
                                    className="w-full h-20 pl-16 pr-6 bg-gray-50 rounded-[28px] border-2 border-transparent focus:border-green-400 focus:bg-white transition-all text-xl font-bold outline-none appearance-none cursor-pointer"
                                >
                                    <option value="">-- Choose a saved farm --</option>
                                    {farms.map(farm => (
                                        <option key={farm.id} value={farm.id}>📌 {farm.nickname} ({farm.area_name})</option>
                                    ))}
                                </select>
                                <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                    <ChevronDown className="w-6 h-6" />
                                </div>
                            </div>

                            {selectedFarm && (
                                <div className="p-6 bg-green-50/50 rounded-2xl border border-green-100 flex items-start gap-4 animate-in slide-in-from-top-2">
                                    <CheckCircle2 className="w-6 h-6 text-green-600 mt-1 shrink-0" />
                                    <div>
                                        <p className="text-xs font-black text-green-700 uppercase tracking-widest">Farm Verified</p>
                                        <p className="text-lg font-bold text-gray-900 leading-tight">
                                           {farms.find(f => f.id === selectedFarm)?.location.address}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {!selectedFarm && (
                                <div className="bg-gray-50 p-8 rounded-[28px] text-center space-y-3">
                                    <p className="text-sm font-bold text-gray-400">Please select a farm from the list or add a new one.</p>
                                </div>
                            )}
                        </div>
                    )}
                  </div>
              </div>

              {/* Skills */}
              <div className="space-y-4 pt-10 border-t border-gray-50">
                <label className="text-xs font-black text-gray-300 uppercase tracking-widest pl-1">What skills are needed?</label>
                <div className="flex flex-wrap gap-2">
                  {skillsList.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => handleSkillChange(skill)}
                      className={`px-5 py-3 rounded-2xl text-sm font-bold border-2 transition-all ${
                        skills.includes(skill)
                        ? 'bg-green-600 border-green-600 text-white shadow-xl shadow-green-100'
                        : 'bg-white border-gray-100 text-gray-300 hover:border-green-200'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              {/* Numbers & Pay */}
              <div className="space-y-4 pt-10 border-t border-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-300 uppercase tracking-widest pl-1">Workers Needed</label>
                    <div className="relative">
                      <Users className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-200" />
                      <input
                        type="number"
                        name="workers_needed"
                        value={formData.workers_needed}
                        onChange={handleChange}
                        min="1"
                        className="w-full pl-16 pr-6 h-20 border-2 border-gray-50 rounded-[28px] text-3xl font-bold focus:outline-none focus:border-green-400 focus:bg-white bg-gray-50/50 transition-all"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-300 uppercase tracking-widest pl-1">Daily Pay (Rupees)</label>
                    <div className="relative">
                      <IndianRupee className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" />
                      <input
                        type="number"
                        name="wage_amount"
                        value={formData.wage_amount}
                        onChange={handleChange}
                        min="1"
                        className="w-full pl-16 pr-6 h-20 border-2 border-gray-50 rounded-[28px] text-3xl font-bold text-green-700 focus:outline-none focus:border-green-400 focus:bg-white bg-gray-50/50 transition-all"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="space-y-4 pt-10 border-t border-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-300 uppercase tracking-widest pl-1">Work Start Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-200" />
                      <input
                        type="date"
                        name="start_date"
                        value={formData.start_date}
                        onChange={handleChange}
                        className="w-full pl-16 pr-6 h-20 border-2 border-gray-50 rounded-[28px] text-xl font-bold focus:outline-none focus:border-green-400 focus:bg-white bg-gray-50/50 transition-all font-sans"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-300 uppercase tracking-widest pl-1">End Date (optional)</label>
                    <div className="relative">
                      <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-200" />
                      <input
                        type="date"
                        name="end_date"
                        value={formData.end_date}
                        onChange={handleChange}
                        className="w-full pl-16 pr-6 h-20 border-2 border-gray-50 rounded-[28px] text-xl font-bold focus:outline-none focus:border-green-400 focus:bg-white bg-gray-50/50 transition-all font-sans"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Final Submit */}
              <div className="pt-10">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-24 bg-black hover:bg-gray-900 text-white rounded-[32px] text-2xl font-bold shadow-2xl shadow-gray-200 transition-all active:scale-95 flex items-center justify-center gap-4"
                >
                  {loading ? <Loader2 className="w-10 h-10 animate-spin" /> : (
                    <>
                      <Plus className="w-8 h-8 stroke-[3]" /> POST JOB NOW
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
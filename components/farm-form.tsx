'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { createFarm } from '@/app/actions/farms'
import { MapPin, Satellite, Save, Navigation, Loader2, Home, Crosshair, Map } from 'lucide-react'

// Dynamically import the map to avoid SSR issues
const LeafletMap = dynamic(() => import('./leaflet-map'), { ssr: false, loading: () => <div className="h-[300px] w-full bg-gray-100 animate-pulse flex items-center justify-center font-bold text-gray-400">Loading Map Engine...</div> })

const defaultCenter: [number, number] = [20.5937, 78.9629]

interface FarmFormProps {
  onSuccess: (farm: any) => void
  onCancel?: () => void
}

export function FarmForm({ onSuccess, onCancel }: FarmFormProps) {
  const [step, setStep] = useState(1) // 1: Info Form, 2: Map Pinning
  const [mapCenter, setMapCenter] = useState<[number, number]>(defaultCenter)
  const [markerPos, setMarkerPos] = useState<[number, number] | null>(null)
  const [mapZoom, setMapZoom] = useState(5)
  const [searching, setSearching] = useState(false)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    farm_nickname: '',
    area_name: '',
    district: '',
    state: '',
    specific_directions: '',
    latitude: 0,
    longitude: 0,
    is_current_location: false,
    address: ''
  })

  // Pre-fill district and state if available from search
  const handleInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.farm_nickname) return toast.error('Please enter a nickname')
    if (!formData.area_name) return toast.error('Please enter a village/area')
    
    setSearching(true)
    try {
        const query = `${formData.area_name}, ${formData.district}, ${formData.state}, India`.replace(/, ,/g, ',')
        const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=1`)
        const data = await res.json()
        if (data && data[0]) {
            const loc: [number, number] = [parseFloat(data[0].lat), parseFloat(data[0].lon)]
            setMapCenter(loc)
            setMarkerPos(loc)
            setMapZoom(17)
            
            setFormData(prev => ({ 
                ...prev, 
                latitude: loc[0], 
                longitude: loc[1], 
                address: data[0].display_name,
                district: data[0].address.city_district || data[0].address.district || data[0].address.county || prev.district,
                state: data[0].address.state || prev.state
            }))
            setStep(2)
        } else {
            setStep(2)
        }
    } catch (err) {
        setStep(2)
    } finally {
        setSearching(false)
    }
  }

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
        const data = await res.json()
        if (data && data.display_name) {
            setFormData(prev => ({ 
                ...prev, 
                latitude: lat, 
                longitude: lng, 
                address: data.display_name 
            }))
        }
    } catch (err) { }
  }

  const handleGetCurrentLocation = () => {
    if ("geolocation" in navigator) {
      toast.info('Getting GPS position...')
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc: [number, number] = [position.coords.latitude, position.coords.longitude]
          setMarkerPos(loc)
          setMapCenter(loc)
          setMapZoom(18)
          setFormData(prev => ({ ...prev, latitude: loc[0], longitude: loc[1], is_current_location: true }))
          reverseGeocode(loc[0], loc[1])
          setStep(2)
        },
        () => toast.error('Could not get GPS. Please enable access.')
      )
    }
  }

  const handleSaveFarm = async () => {
    if (!formData.district || !formData.state) return toast.error('Please enter district and state')
    setLoading(true)
    const result = await createFarm(formData)
    setLoading(false)
    if (result.error) toast.error(result.error)
    else {
      toast.success('Farm registered!')
      onSuccess(result.farm)
    }
  }

  return (
    <div className="space-y-6">
        {step === 1 ? (
             <form onSubmit={handleInfoSubmit} className="space-y-6 animate-in fade-in zoom-in-95">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-xs font-black text-gray-300 uppercase tracking-widest pl-1">Farm Nickname</label>
                        <input 
                            value={formData.farm_nickname}
                            onChange={(e) => setFormData(prev => ({ ...prev, farm_nickname: e.target.value }))}
                            placeholder="e.g., North Field"
                            className="w-full h-14 px-6 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-green-400 focus:bg-white transition-all font-bold"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-300 uppercase tracking-widest pl-1">Village / Area</label>
                        <input 
                            value={formData.area_name}
                            onChange={(e) => setFormData(prev => ({ ...prev, area_name: e.target.value }))}
                            placeholder="Village name"
                            className="w-full h-14 px-6 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-blue-400 focus:bg-white transition-all font-bold"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-300 uppercase tracking-widest pl-1">District</label>
                        <input 
                            value={formData.district}
                            onChange={(e) => setFormData(prev => ({ ...prev, district: e.target.value }))}
                            placeholder="District name"
                            className="w-full h-14 px-6 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-blue-400 focus:bg-white transition-all font-bold"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-300 uppercase tracking-widest pl-1">State</label>
                        <input 
                            value={formData.state}
                            onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                            placeholder="State name"
                            className="w-full h-14 px-6 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-blue-400 focus:bg-white transition-all font-bold"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-300 uppercase tracking-widest pl-1">Directions (Optional)</label>
                        <input 
                            value={formData.specific_directions}
                            onChange={(e) => setFormData(prev => ({ ...prev, specific_directions: e.target.value }))}
                            placeholder="Near landmark..."
                            className="w-full h-14 px-6 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-orange-400 focus:bg-white transition-all font-bold"
                        />
                    </div>

                    <div className="flex gap-4 pt-4 md:col-span-2">
                        <Button type="submit" disabled={searching} className="flex-[2] h-14 bg-black text-white rounded-2xl font-bold active:scale-95">
                            {searching ? <Loader2 className="animate-spin" /> : 'Choose on Map'}
                        </Button>
                        <Button type="button" onClick={handleGetCurrentLocation} className="flex-1 h-14 bg-green-50 text-green-700 rounded-2xl font-bold active:scale-95">
                            Use GPS
                        </Button>
                        {onCancel && (
                            <Button type="button" variant="ghost" onClick={onCancel} className="h-14 px-6 rounded-2xl font-bold text-gray-400">
                                Cancel
                            </Button>
                        )}
                    </div>
                </div>
             </form>
        ) : (
            <div className="space-y-6 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Map className="w-4 h-4" /> Standard Road View
                    </h3>
                    <div className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black tracking-widest rounded-full uppercase">
                        Easy Navigation with Labels
                    </div>
                </div>
                <div className="rounded-3xl overflow-hidden border-2 border-gray-100 relative h-[350px]">
                    <LeafletMap 
                        center={mapCenter} 
                        zoom={mapZoom} 
                        markerPos={markerPos} 
                        onMarkerMove={(lat: number, lng: number) => {
                            setMarkerPos([lat, lng])
                            reverseGeocode(lat, lng)
                        }} 
                    />
                    <div className="absolute top-4 left-4 right-4 bg-white/95 p-3 rounded-xl shadow-lg z-[1000] flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-green-600 shrink-0" />
                        <p className="text-xs font-bold text-gray-600 truncate">{formData.address || 'Picking spot...'}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-6 rounded-[28px]">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Latitude</label>
                        <input 
                            readOnly 
                            value={formData.latitude.toFixed(6)} 
                            className="w-full bg-white h-10 px-4 rounded-xl border border-gray-100 font-bold text-gray-400"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Longitude</label>
                        <input 
                            readOnly 
                            value={formData.longitude.toFixed(6)} 
                            className="w-full bg-white h-10 px-4 rounded-xl border border-gray-100 font-bold text-gray-400"
                        />
                    </div>
                    <div className="md:col-span-2 space-y-1">
                         <label className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Full Registered Address</label>
                         <textarea 
                            readOnly 
                            value={formData.address} 
                            className="w-full bg-white py-3 px-4 rounded-xl border border-gray-100 font-bold text-gray-400 h-16 resize-none text-[12px] leading-tight"
                        />
                    </div>
                </div>

                <div className="flex gap-4">
                    <Button variant="outline" onClick={() => setStep(1)} className="flex-1 h-14 rounded-2xl font-bold">
                        Back to Info
                    </Button>
                    <Button onClick={handleSaveFarm} disabled={loading} className="flex-[2] h-14 bg-green-600 text-white rounded-2xl font-bold shadow-xl shadow-green-100 flex items-center justify-center gap-2">
                        {loading ? <Loader2 className="animate-spin" /> : <><Save className="w-5 h-5" /> Save & Select Farm</>}
                    </Button>
                </div>
            </div>
        )}
    </div>
  )
}

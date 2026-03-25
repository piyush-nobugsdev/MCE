'use client'

import { useEffect, useState } from 'react'
import { FarmerNavbar } from '../components/navbar'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, MapPin, ChevronRight, Navigation, Trash2, Home, Crosshair } from 'lucide-react'
import Link from 'next/link'
import { getFarms } from '@/app/actions/farms'
import { useLanguage } from '@/lib/i18n/context'

export default function ManageFarmsPage() {
  const { t } = useLanguage()
  const [farms, setFarms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFarms = async () => {
      const { farms, error } = await getFarms()
      if (farms) setFarms(farms)
      setLoading(false)
    }
    fetchFarms()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      <FarmerNavbar />
      
      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
                <h1 className="text-4xl font-bold text-gray-900 leading-tight">My Saved Farms</h1>
                <p className="text-lg text-gray-500 font-medium italic">Manage your field locations for easy job posting</p>
            </div>
            <Link href="/farmer/farms/add">
                <Button className="h-16 px-8 bg-green-600 hover:bg-green-700 rounded-2xl shadow-lg shadow-green-100 text-white flex items-center gap-3 active:scale-95 transition-all">
                    <Plus className="w-6 h-6 stroke-[3]" /> Add New Farm
                </Button>
            </Link>
        </div>

        {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
                <p className="text-gray-400 font-bold tracking-widest uppercase text-xs">Loading addresses...</p>
            </div>
        ) : farms.length === 0 ? (
            <div className="bg-white p-16 rounded-[40px] border border-gray-100 shadow-sm text-center space-y-8">
               <div className="w-24 h-24 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto">
                   <MapPin className="w-12 h-12 text-gray-200" />
               </div>
               <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-gray-900">No farms saved yet</h2>
                  <p className="text-gray-400 font-medium max-w-sm mx-auto">Add your first farm location to quickly post jobs without entering the address every time.</p>
               </div>
               <Link href="/farmer/farms/add" className="inline-block">
                <Button className="h-16 px-10 bg-black hover:bg-gray-900 rounded-2xl text-white font-bold transition-all active:scale-95">
                    Register Your First Farm
                </Button>
               </Link>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {farms.map((farm) => (
                    <Card key={farm.id} className="border-none shadow-xl shadow-gray-100/50 rounded-[32px] overflow-hidden bg-white hover:shadow-2xl hover:shadow-green-100/50 transition-all group">
                        <CardContent className="p-8">
                             <div className="flex items-start justify-between mb-8">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                                            <Home className="w-4 h-4 text-green-600" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">{farm.nickname}</h3>
                                    </div>
                                    <p className="text-sm font-bold text-green-600 flex items-center gap-1.5 pl-0.5">
                                        <Crosshair className="w-3.5 h-3.5" /> {farm.area_name}
                                    </p>
                                </div>
                                <button className="p-3 text-gray-200 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                             </div>

                             <div className="space-y-6">
                                <div className="p-5 bg-gray-50 rounded-2xl space-y-1.5 border border-transparent group-hover:border-green-100 transition-all">
                                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">Precise Address</p>
                                    <p className="text-sm font-bold text-gray-600 leading-relaxed line-clamp-2">{farm.location.address}</p>
                                </div>

                                <div className="flex items-center justify-between pt-2">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-2 h-2 rounded-full bg-green-500" />
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Live Coords Verified</span>
                                    </div>
                                    <div className="flex gap-1.5">
                                         <span className="px-3 py-1 bg-gray-100 text-[10px] font-bold text-gray-500 rounded-md uppercase">{farm.location.lat.toFixed(4)}° N</span>
                                         <span className="px-3 py-1 bg-gray-100 text-[10px] font-bold text-gray-500 rounded-md uppercase">{farm.location.lng.toFixed(4)}° E</span>
                                    </div>
                                </div>
                             </div>
                        </CardContent>
                    </Card>
                ))}

                <Link href="/farmer/farms/add">
                    <button className="w-full h-full min-h-[250px] border-4 border-dashed border-gray-100 rounded-[32px] flex flex-col items-center justify-center gap-4 hover:border-green-200 hover:bg-green-50/30 transition-all group active:scale-[0.98]">
                        <div className="w-16 h-16 bg-white shadow-lg rounded-2xl flex items-center justify-center group-hover:bg-green-600 transition-colors">
                            <Plus className="w-8 h-8 text-gray-300 group-hover:text-white stroke-[3]" />
                        </div>
                        <span className="text-lg font-bold text-gray-300 group-hover:text-green-600">Add Another Farm</span>
                    </button>
                </Link>
            </div>
        )}
      </main>
    </div>
  )
}

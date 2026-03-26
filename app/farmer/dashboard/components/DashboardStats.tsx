'use client'

import { Briefcase, Users, Star } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/context'

interface DashboardStatsProps {
  activeJobs: number
  completedJobs: number
  rating: number
}

export function DashboardStats({ activeJobs, completedJobs, rating }: DashboardStatsProps) {
  const { t } = useLanguage()

  const stats = [
    { label: t('active_jobs'), value: activeJobs, icon: Briefcase, color: 'text-gray-600' },
    { label: t('completed_jobs'), value: completedJobs, icon: Users, color: 'text-gray-600' },
    { label: 'Avg. Rating', value: rating.toFixed(1), icon: Star, color: 'text-yellow-500 fill-yellow-500' },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((stat, idx) => (
        <div 
          key={stat.label} 
          className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm transition-all hover:shadow-md hover:border-gray-300 group"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center group-hover:bg-green-50 transition-colors">
              <stat.icon className={`w-5 h-5 ${stat.color} transition-colors group-hover:text-green-600`} />
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-black text-gray-900 tracking-tight">{stat.value}</p>
            {idx === 2 && <span className="text-[10px] font-bold text-gray-400 uppercase">/ 5.0</span>}
          </div>
        </div>
      ))}
    </div>
  )
}

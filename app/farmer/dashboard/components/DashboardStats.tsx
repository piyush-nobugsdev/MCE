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
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {stats.map((stat, idx) => (
        <div 
          key={stat.label} 
          className={`bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:border-gray-200 transition-colors ${idx === 2 ? 'col-span-2 md:col-span-1' : ''}`}
        >
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-7 h-7 bg-gray-50 rounded-lg flex items-center justify-center">
              <stat.icon className={`w-3.5 h-3.5 ${stat.color}`} />
            </div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{stat.label}</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
        </div>
      ))}
    </div>
  )
}

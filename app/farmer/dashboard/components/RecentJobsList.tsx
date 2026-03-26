'use client'

import Link from 'next/link'
import { MapPin, IndianRupee, ChevronRight } from 'lucide-react'
import { Job } from '@/lib/types'
import { useLanguage } from '@/lib/i18n/context'

interface RecentJobsListProps {
  jobs: Job[]
}

export function RecentJobsList({ jobs }: RecentJobsListProps) {
  const { t } = useLanguage()

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
         <h2 className="text-sm font-black text-gray-900 uppercase tracking-[0.2em]">
           {t('recent_jobs')}
         </h2>
         <Link href="/farmer/jobs" className="text-[10px] font-black text-green-600 hover:text-green-700 tracking-widest transition-colors uppercase">View All</Link>
      </div>

      {jobs.length === 0 ? (
        <div className="bg-white border border-gray-200 border-dashed p-12 rounded-xl text-center">
           <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">No recent jobs found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {jobs.slice(0, 4).map((job) => (
            <Link key={job.id} href={`/farmer/jobs/${job.id}`}>
              <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-gray-400 shadow-sm transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group">
                <div className="flex items-center gap-5">
                  <div className={`w-2.5 h-2.5 rounded-full ${job.status === 'open' ? 'bg-green-500' : 'bg-gray-200'}`} />
                  <div>
                    <h3 className="text-base font-black text-gray-900 leading-none uppercase tracking-tight mb-1">{job.title}</h3>
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1.5 uppercase tracking-widest">
                        <MapPin className="w-3 h-3" />
                        {typeof job.location === 'string' ? job.location : job.location?.name}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between md:justify-end gap-8 border-t md:border-t-0 pt-4 md:pt-0">
                  <div className="text-right">
                    <p className="text-xl font-black text-gray-900 flex items-center gap-1.5 justify-end leading-none">
                      <IndianRupee className="w-4 h-4 text-green-600" /> {job.wage_amount}
                    </p>
                    <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest mt-1.5">PER DAY • {job.workers_needed} POSITIONS</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-green-600 transition-colors">
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-white transition-all" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

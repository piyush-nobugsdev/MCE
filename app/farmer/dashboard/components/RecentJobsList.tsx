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
        <div className="bg-white border-2 border-gray-100 border-dashed p-10 rounded-[2rem] text-center">
           <p className="text-xs font-black text-gray-300 uppercase tracking-widest">No jobs posted yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.slice(0, 4).map((job) => (
            <Link key={job.id} href={`/farmer/jobs/${job.id}`}>
              <div className="bg-white p-5 rounded-2xl border border-gray-100 hover:border-gray-200 shadow-sm transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group">
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${job.status === 'open' ? 'bg-blue-500 animate-pulse' : 'bg-gray-200'}`} />
                  <div>
                    <h3 className="text-sm font-black text-gray-900 leading-tight uppercase tracking-tight">{job.title}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[9px] font-bold text-gray-400 flex items-center gap-1 uppercase tracking-wider">
                        <MapPin className="w-3 h-3" />
                        {typeof job.location === 'string' ? job.location : job.location?.name}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-3 md:pt-0">
                  <div className="text-right">
                    <p className="text-lg font-black text-gray-900 flex items-center gap-1 justify-end leading-none">
                      <IndianRupee className="w-4 h-4 text-green-600" /> {job.wage_amount}
                    </p>
                    <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest mt-1">PER DAY</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-200 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

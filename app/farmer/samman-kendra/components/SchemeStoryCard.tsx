import Image from 'next/image'
import { Scheme } from '@/lib/schemes'

interface SchemeStoryCardProps {
  scheme: Scheme;
  onClick: (scheme: Scheme) => void;
}

export function SchemeStoryCard({ scheme, onClick }: SchemeStoryCardProps) {
  return (
    <div 
      className="flex flex-col items-center gap-2 cursor-pointer transition-all group"
      onClick={() => onClick(scheme)}
    >
      <div className="w-12 h-12 rounded border border-gray-200 p-0.5 overflow-hidden bg-white group-hover:border-green-500 transition-colors">
        <div className="w-full h-full rounded-sm relative overflow-hidden grayscale group-hover:grayscale-0 transition-all">
          <Image
            src={scheme.image}
            alt={scheme.name}
            fill
            className="object-cover"
          />
        </div>
      </div>
      <span className="text-[8px] font-bold text-gray-400 text-center w-12 truncate uppercase tracking-tighter group-hover:text-gray-900 transition-colors">
        {scheme.name}
      </span>
    </div>
  )
}

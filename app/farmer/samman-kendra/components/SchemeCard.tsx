import Image from 'next/image'
import { Scheme } from '@/lib/schemes'
import { Card, CardContent } from '@/components/ui/card'

interface SchemeCardProps {
  scheme: Scheme;
  onClick: (scheme: Scheme) => void;
}

export function SchemeCard({ scheme, onClick }: SchemeCardProps) {
  return (
    <Card 
      className="overflow-hidden cursor-pointer hover:border-green-500 shadow-sm hover:shadow-md transition-all group border-gray-200 rounded-xl bg-white flex flex-col"
      onClick={() => onClick(scheme)}
    >
      <div className="relative w-full h-48 overflow-hidden border-b border-gray-100">
        <Image
          src={scheme.image}
          alt={scheme.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4">
           <span className="bg-white/95 backdrop-blur-sm px-3 py-1 rounded-md text-[9px] font-bold text-green-700 uppercase tracking-wider shadow-sm border border-green-100">
             Government Approved
           </span>
        </div>
      </div>
      <CardContent className="p-5 space-y-4">
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-green-600 transition-colors">
            {scheme.name}
          </h3>
          <p className="text-[11px] font-bold text-green-600 uppercase tracking-widest">
            {scheme.benefit}
          </p>
        </div>
        
        <p className="text-xs text-gray-500 font-medium leading-relaxed line-clamp-2">
          {scheme.description}
        </p>

        <div className="pt-4 flex items-center justify-between border-t border-gray-100">
           <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">View Details</span>
           <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-green-600 transition-colors">
              <span className="text-gray-400 group-hover:text-white text-xs">→</span>
           </div>
        </div>
      </CardContent>
    </Card>
  )
}

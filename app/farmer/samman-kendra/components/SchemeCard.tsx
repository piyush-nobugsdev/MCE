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
      className="overflow-hidden cursor-pointer hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-50/50 transition-all group border-gray-100 flex h-32 rounded-3xl bg-white/50 backdrop-blur-sm"
      onClick={() => onClick(scheme)}
    >
      <div className="relative w-32 h-full flex-shrink-0 overflow-hidden border-r border-gray-50">
        <Image
          src={scheme.image}
          alt={scheme.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
      </div>
      <CardContent className="p-4 flex flex-col justify-center min-w-0">
        <h3 className="text-lg font-black text-gray-900 mb-0.5 truncate leading-tight">{scheme.name}</h3>
        <p className="text-[10px] font-black text-green-600 uppercase tracking-[0.2em] mb-2">
          {scheme.benefit}
        </p>
        <p className="text-[11px] text-gray-500 font-medium line-clamp-2 leading-tight">
          {scheme.description}
        </p>
      </CardContent>
    </Card>
  )
}

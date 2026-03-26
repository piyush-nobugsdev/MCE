'use client'
 
import { Card, CardContent } from '@/components/ui/card'
import { type ElementType } from 'react'

interface Props {
  id: string
  title: string
  description: string
  icon: ElementType
  onClick: () => void
}

export function SahyogCategoryCard({ title, description, icon: Icon, onClick }: Props) {
  return (
    <Card 
      className="group cursor-pointer rounded-[2rem] border border-gray-100/50 shadow-sm hover:border-green-200/50 hover:shadow-2xl hover:shadow-green-100/30 transition-all duration-500 overflow-hidden bg-white/80 backdrop-blur-sm"
      onClick={onClick}
    >
      <CardContent className="p-8">
        <div className="flex items-start gap-5">
          <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-all duration-500 shadow-inner">
            <Icon className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
          </div>
          <div className="flex-1 space-y-2 pt-1">
            <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-[0.2em] group-hover:text-green-600 transition-colors">{title}</h3>
            <p className="text-[10px] text-gray-400 font-bold leading-relaxed uppercase tracking-widest opacity-70">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

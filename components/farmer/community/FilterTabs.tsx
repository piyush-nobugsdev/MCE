'use client'

import { LayoutGrid, MessageCircleQuestion, Lightbulb, NotebookPen } from 'lucide-react'

const filters = [
  { id: 'all', label: 'All Feed', icon: LayoutGrid },
  { id: 'question', label: 'Inquiries', icon: MessageCircleQuestion },
  { id: 'tip', label: 'Knowledge', icon: Lightbulb },
  { id: 'experience', label: 'Field Notes', icon: NotebookPen },
]

interface Props {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function FilterTabs({ activeTab, onTabChange }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-8 bg-gray-100/50 p-1 rounded-xl border border-gray-200">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onTabChange(filter.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[11px] font-bold transition-all duration-200 ${
            activeTab === filter.id 
              ? 'bg-white text-gray-900 shadow-sm border border-gray-100' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
          }`}
        >
          <filter.icon className={`w-3.5 h-3.5 ${activeTab === filter.id ? 'text-green-600' : 'text-gray-400'}`} />
          <span>{filter.label}</span>
        </button>
      ))}
    </div>
  )
}

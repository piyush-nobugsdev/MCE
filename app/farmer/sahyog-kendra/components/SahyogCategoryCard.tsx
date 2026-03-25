import { LucideIcon } from 'lucide-react'

interface SahyogCategoryCardProps {
  id: string
  title: string
  description: string
  icon: LucideIcon
  onClick: () => void
}

export function SahyogCategoryCard({ id, title, description, icon: Icon, onClick }: SahyogCategoryCardProps) {
  const getIconColor = (cid: string) => {
    switch (cid) {
      case 'natural-disaster': return 'text-blue-600'
      case 'crop-disease': return 'text-green-600'
      case 'market-loss': return 'text-orange-600'
      default: return 'text-purple-600'
    }
  }

  return (
    <button
      onClick={onClick}
      className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 text-left hover:scale-[1.02] hover:shadow-2xl hover:shadow-green-50 transition-all group"
    >
      <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-600 transition-colors">
        <Icon className={`w-8 h-8 ${getIconColor(id)} group-hover:text-white transition-colors`} />
      </div>
      <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-2 leading-none">{title}</h3>
      <p className="text-sm font-bold text-gray-600 leading-relaxed max-w-[200px]">{description}</p>
    </button>
  )
}

import Link from 'next/link'
import { Plus, ChevronRight, Library, HeartHandshake, MapPin } from 'lucide-react'

export function QuickActions() {
  const actions = [
    {
      href: '/farmer/samman-kendra',
      title: 'Samman Kendra',
      subtitle: 'Govt Schemes & Benefits',
      icon: Library,
      color: 'blue',
      h: 'h-28'
    },
    {
      href: '/farmer/sahyog-kendra',
      title: 'Sahyog Kendra',
      subtitle: 'Community Support Hub',
      icon: HeartHandshake,
      color: 'orange',
      h: 'h-28'
    },
    {
      href: '/farmer/farms',
      title: 'Manage Farms',
      subtitle: 'Locations & Details',
      icon: MapPin,
      color: 'gray',
      h: 'h-24'
    },
    {
       href: '/farmer/jobs/new',
       title: 'Post New Task',
       subtitle: 'Find help instantly',
       icon: Plus,
       color: 'green',
       h: 'h-24'
    }
  ]

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-50 text-blue-600 group-hover:bg-blue-600'
      case 'orange': return 'bg-orange-50 text-orange-600 group-hover:bg-orange-600'
      case 'green': return 'bg-white/10 text-white'
      default: return 'bg-gray-50 text-gray-600'
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {actions.map((action) => (
        <Link key={action.href} href={action.href} className="group">
          <div className={`${action.h} p-5 rounded-2xl border border-gray-200 shadow-sm transition-all flex items-center justify-between ${
            action.color === 'green' ? 'bg-green-600 hover:bg-green-700 shadow-xl shadow-green-100' : 'bg-white hover:border-gray-400 hover:shadow-xl'
          }`}>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${getColorClasses(action.color)}`}>
                <action.icon className="w-5 h-5 group-hover:text-white transition-colors" />
              </div>
              <div>
                <h3 className={`text-base font-black leading-tight uppercase tracking-tight ${action.color === 'green' ? 'text-white' : 'text-gray-900'}`}>{action.title}</h3>
                <p className={`${action.color === 'green' ? 'text-green-100/70' : 'text-gray-400'} text-[10px] font-bold uppercase tracking-[0.15em] mt-1`}>{action.subtitle}</p>
              </div>
            </div>
            <ChevronRight className={`w-4 h-4 ${action.color === 'green' ? 'text-white/50' : 'text-gray-300'} group-hover:translate-x-1 transition-transform`} />
          </div>
        </Link>
      ))}
    </div>
  )
}

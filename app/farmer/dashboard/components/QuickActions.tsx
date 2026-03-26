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
      case 'blue': return 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'
      case 'orange': return 'bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white'
      case 'green': return 'bg-white/20 text-white'
      default: return 'bg-gray-100 text-gray-500 group-hover:bg-gray-600 group-hover:text-white'
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action) => (
        <Link key={action.href} href={action.href} className="group">
          <div className={`p-6 rounded-xl border border-gray-200 shadow-sm transition-all h-full flex flex-col justify-between gap-6 ${
            action.color === 'green' ? 'bg-green-600 hover:bg-green-700 shadow-md shadow-green-100' : 'bg-white hover:border-gray-400 hover:shadow-md'
          }`}>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300 ${getColorClasses(action.color)}`}>
              <action.icon className="w-6 h-6 transition-colors" />
            </div>
            
            <div className="space-y-1">
              <h3 className={`text-sm font-black leading-tight uppercase tracking-widest ${action.color === 'green' ? 'text-white' : 'text-gray-900'}`}>{action.title}</h3>
              <p className={`${action.color === 'green' ? 'text-green-100/70' : 'text-gray-400'} text-[10px] font-bold uppercase tracking-wider`}>{action.subtitle}</p>
            </div>

            <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${action.color === 'green' ? 'text-white' : 'text-green-600'} opacity-0 group-hover:opacity-100 transition-opacity`}>
               <span>Open</span>
               <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

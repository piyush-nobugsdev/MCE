'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { signOut } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Menu, X, Home, Briefcase, Users, LogOut, User, Globe, ChevronDown, Library, HeartHandshake } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { useLanguage } from '@/lib/i18n/context'

export function FarmerNavbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { t, language } = useLanguage()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { href: '/farmer/dashboard', label: t('home'), icon: Home },
    { href: '/farmer/jobs', label: t('tasks'), icon: Briefcase },
    { href: '/farmer/applications', label: t('applications'), icon: Users },
    { href: '/farmer/samman-kendra', label: t('samman_kendra'), icon: Library },
    { href: '/farmer/sahyog-kendra', label: t('sahyog_kendra'), icon: HeartHandshake },
  ]

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/auth/role-selection')
    } catch (error) {
      toast.error('Failed to sign out')
    }
  }

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/farmer/dashboard" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center shadow-sm group-hover:rotate-3 transition-transform">
            <span className="text-white font-bold text-base">F</span>
          </div>
          <span className="text-lg font-bold text-gray-900 tracking-tight">FarmWorks</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-1 bg-gray-100/50 p-1 rounded-xl border border-gray-200">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                pathname === href
                  ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${pathname === href ? 'text-green-600' : 'text-gray-400'}`} />
              {label}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-4">
          {/* Profile Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-2.5 px-3 py-1.5 bg-gray-900 text-white rounded-lg transition-transform active:scale-95">
              <div className="w-6 h-6 bg-green-500 rounded-md flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-xs font-bold">{t('profile')}</span>
              <ChevronDown className="w-3 h-3 opacity-50" />
            </button>

            <div className="absolute right-0 mt-2 w-52 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right translate-y-1 group-hover:translate-y-0 z-50">
              <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-1.5 overflow-hidden">
                <Link href="/farmer/profile" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-xs font-bold">
                  <User className="w-4 h-4 text-green-600" />
                  {t('profile')}
                </Link>
                <Link href="/settings/language" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-xs font-bold">
                  <Globe className="w-4 h-4 text-blue-600" />
                  {t('language')}
                </Link>
                <div className="h-px bg-gray-100 my-1.5 mx-1.5" />
                <button 
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-xs font-bold text-left"
                >
                  <LogOut className="w-4 h-4" />
                  {t('logout')}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-100 shadow-xl z-[60]">
          <div className="p-4 space-y-2">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-4 p-4 rounded-xl text-lg font-bold ${
                  pathname === href ? 'bg-green-600 text-white shadow-md' : 'bg-gray-50 text-gray-600'
                }`}
              >
                <Icon className="w-6 h-6" />
                {label}
              </Link>
            ))}
            <div className="h-px bg-gray-100 my-2" />
            <Link 
              href="/farmer/profile" 
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-4 p-4 rounded-xl text-lg font-bold bg-gray-50 text-gray-600"
            >
              <User className="w-6 h-6 text-green-600" />
              {t('profile')}
            </Link>
            <Link 
              href="/settings/language" 
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-4 p-4 rounded-xl text-lg font-bold bg-gray-50 text-gray-600"
            >
              <Globe className="w-6 h-6 text-blue-600" />
              {t('language')}
            </Link>
            <button
              onClick={() => {
                setMobileMenuOpen(false)
                handleSignOut()
              }}
              className="w-full flex items-center gap-4 p-4 rounded-xl text-lg font-bold bg-red-50 text-red-600"
            >
              <LogOut className="w-6 h-6" />
              {t('logout')}
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}

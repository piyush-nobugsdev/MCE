'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { signOut } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Menu, X, Home, Briefcase, Users, DollarSign, LogOut, User, ChevronDown } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { toast } from 'sonner'

export function FarmerNavbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { href: '/farmer/dashboard', label: 'Dashboard', icon: Home },
    { href: '/farmer/jobs', label: 'My Jobs', icon: Briefcase },
    { href: '/farmer/applications', label: 'Applications', icon: Users },
  ]

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success('Signed out successfully')
    } catch (error) {
      toast.error('Failed to sign out')
    }
  }

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:flex bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between w-full">
          <Link href="/farmer/dashboard" className="text-xl font-bold text-green-600">
            FarmWork
          </Link>

          <div className="flex gap-8">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  pathname === href
                    ? 'text-green-600 bg-green-50'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                {label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group">
              <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-green-50 text-green-700 hover:bg-green-100 transition-colors font-semibold">
                <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white">
                  <User className="w-5 h-5" />
                </div>
                <span>Profile</span>
                <ChevronDown className="w-4 h-4 opacity-50" />
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right translate-y-2 group-hover:translate-y-0 z-50">
                <div className="bg-white border border-gray-100 rounded-2xl shadow-xl p-2 pb-3">
                  <div className="px-4 py-3 border-b border-gray-50 mb-2">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Account</p>
                  </div>
                  <Link href="/farmer/profile" className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-xl transition-colors">
                    <User className="w-4 h-4" /> My Profile
                  </Link>
                  <Link href="/farmer/payments" className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-xl transition-colors">
                    <DollarSign className="w-4 h-4" /> Payment History
                  </Link>
                  <div className="h-px bg-gray-50 my-2" />
                  <button 
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navbar */}
      <nav className="md:hidden bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-3 flex items-center justify-between">
          <Link href="/farmer/dashboard" className="text-xl font-bold text-green-600">
            FarmWork
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-gray-200 bg-white">
            <div className="flex flex-col">
              {navItems.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 border-b border-gray-100 transition-colors ${
                    pathname === href
                      ? 'text-green-600 bg-green-50'
                      : 'text-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {label}
                </Link>
              ))}
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                <p className="text-xs font-semibold text-gray-400 uppercase mb-3">Settings</p>
                <div className="space-y-3">
                  <Link 
                    href="/farmer/profile" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 text-gray-700 hover:text-green-600"
                  >
                    <User className="w-5 h-5" /> My Profile
                  </Link>
                  <Link 
                    href="/farmer/payments" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 text-gray-700 hover:text-green-600"
                  >
                    <DollarSign className="w-5 h-5" /> Payment History
                  </Link>
                </div>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  handleSignOut()
                }}
                className="flex items-center gap-3 px-4 py-4 text-red-600 font-semibold transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}

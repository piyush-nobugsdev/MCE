'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Sprout, Users, Leaf } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/context'
import { Language } from '@/lib/i18n/translations'

export default function RoleSelectionPage() {
  const { t, language, setLanguage } = useLanguage()

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिंदी' },
    { code: 'kn', label: 'ಕನ್ನಡ' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col">
      
      {/* Header with Logo and Language Toggle */}
      <header className="border-b-2 border-green-200">
        <div className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-green-500 rounded-lg flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div className="text-lg font-bold bg-gradient-to-r from-green-600 to-amber-500 bg-clip-text text-transparent">FarmWork</div>
          </Link>
          
          {/* Language Selection */}
          <div className="flex gap-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  language === lang.code 
                    ? 'bg-green-600 text-white shadow-md' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-green-300 hover:text-green-600'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-4xl">
          {/* Title Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight">
              {t('select_role')}
            </h1>
            <div className="h-1 w-16 bg-gradient-to-r from-green-600 to-amber-500 mx-auto"></div>
          </div>

          {/* Role Cards */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Farmer Card */}
            <Link href="/auth/farmer/login" className="group">
              <Card className="h-full bg-gradient-to-br from-green-50 to-white border-2 border-green-200 hover:border-green-400 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden cursor-pointer">
                <div className="p-12 text-center flex flex-col h-full justify-center">
                  {/* Icon */}
                  <div className="flex justify-center mb-8">
                    <div className="bg-gradient-to-br from-green-500 to-green-600 w-24 h-24 rounded-2xl flex items-center justify-center shadow-lg shadow-green-200 group-hover:shadow-green-300 group-hover:scale-110 transition-all duration-300">
                      <Sprout className="w-12 h-12 text-white" />
                    </div>
                  </div>
                  
                  {/* Title */}
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    {t('i_am_farmer')}
                  </h2>
                  
                  {/* Description */}
                  <p className="text-gray-700 font-medium leading-relaxed mb-8 text-sm px-2">
                    {t('find_workers')}
                  </p>
                  
                  {/* CTA Button */}
                  <div className="w-full py-4 bg-gradient-to-r from-green-600 to-green-500 group-hover:from-green-700 group-hover:to-green-600 rounded-xl text-lg font-bold text-white transition-all duration-300 group-hover:shadow-lg group-hover:shadow-green-200">
                    {t('farmer_login')}
                  </div>
                </div>
              </Card>
            </Link>

            {/* Worker Card */}
            <Link href="/auth/worker/login" className="group">
              <Card className="h-full bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200 hover:border-blue-400 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden cursor-pointer">
                <div className="p-12 text-center flex flex-col h-full justify-center">
                  {/* Icon */}
                  <div className="flex justify-center mb-8">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-24 h-24 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 group-hover:shadow-blue-300 group-hover:scale-110 transition-all duration-300">
                      <Users className="w-12 h-12 text-white" />
                    </div>
                  </div>
                  
                  {/* Title */}
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    {t('i_am_worker')}
                  </h2>
                  
                  {/* Description */}
                  <p className="text-gray-700 font-medium leading-relaxed mb-8 text-sm px-2">
                    {t('find_work')}
                  </p>
                  
                  {/* CTA Button */}
                  <div className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-500 group-hover:from-blue-700 group-hover:to-blue-600 rounded-xl text-lg font-bold text-white transition-all duration-300 group-hover:shadow-lg group-hover:shadow-blue-200">
                    {t('worker_login')}
                  </div>
                </div>
              </Card>
            </Link>
          </div>

          {/* Footer Text */}
          <div className="text-center mt-16">
            <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold">
              {t('footer_tagline')} • 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

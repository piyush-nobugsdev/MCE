'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Sprout, Users } from 'lucide-react'
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
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      
      {/* Simple Language Selection */}
      <p className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-widest">Select Language</p>
      <div className="mb-16 flex flex-wrap justify-center gap-3">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`px-6 py-3 rounded-xl text-sm font-bold transition-all border ${
              language === lang.code 
                ? 'bg-black text-white border-black shadow-lg' 
                : 'bg-white text-gray-500 border-gray-100'
            }`}
          >
            {lang.label}
          </button>
        ))}
      </div>

      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Smart Resource
          </h1>
          <p className="text-lg text-gray-400 font-medium">
            {t('select_role')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Farmer Card */}
          <Link href="/auth/farmer/login" className="group">
            <Card className="h-full border border-gray-100 shadow-sm hover:shadow-xl hover:border-green-200 transition-all duration-300 rounded-[2rem] overflow-hidden bg-white">
              <div className="p-10 text-center">
                <div className="flex justify-center mb-8">
                  <div className="bg-green-600 w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg shadow-green-100 group-hover:scale-110 transition-transform">
                    <Sprout className="w-10 h-10 text-white" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  {t('i_am_farmer')}
                </h2>
                <p className="text-gray-500 font-medium leading-relaxed mb-10 px-4">
                  {t('find_workers')}
                </p>
                <div className="w-full py-5 bg-green-600 group-hover:bg-green-700 rounded-2xl text-xl font-bold text-white transition-colors">
                  {t('farmer_login')}
                </div>
              </div>
            </Card>
          </Link>

          {/* Worker Card */}
          <Link href="/auth/worker/login" className="group">
            <Card className="h-full border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 rounded-[2rem] overflow-hidden bg-white">
              <div className="p-10 text-center">
                <div className="flex justify-center mb-8">
                  <div className="bg-blue-600 w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100 group-hover:scale-110 transition-transform">
                    <Users className="w-10 h-10 text-white" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  {t('i_am_worker')}
                </h2>
                <p className="text-gray-500 font-medium leading-relaxed mb-10 px-4">
                  {t('find_work')}
                </p>
                <div className="w-full py-5 bg-blue-600 group-hover:bg-blue-700 rounded-2xl text-xl font-bold text-white transition-colors">
                  {t('worker_login')}
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </div>

      <div className="mt-20 text-center text-gray-300 font-bold text-xs uppercase tracking-widest">
        Helping Farmers Grow &bull; 2026
      </div>
    </div>
  )
}

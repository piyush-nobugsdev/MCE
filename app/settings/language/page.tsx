'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Globe, ArrowLeft, Check } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/context'
import { Language } from '@/lib/i18n/translations'

export default function LanguageSettingsPage() {
  const router = useRouter()
  const { language, setLanguage, t } = useLanguage()

  const languages: { code: Language; label: string; native: string }[] = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'Hindi', native: 'हिंदी' },
    { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
  ]

  const handleLanguageSelect = (code: Language) => {
    setLanguage(code)
    router.back() // One-click selection and go back
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 font-sans">
      <div className="max-w-md mx-auto pt-10">
        
        <button 
          onClick={() => router.back()}
          className="mb-8 flex items-center gap-2 text-gray-400 font-bold uppercase tracking-widest hover:text-gray-600 transition-colors text-[10px]"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-black shadow-lg mb-4">
            <Globe className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">{t('language')}</h1>
          <p className="text-xs text-gray-400 mt-1.5 font-bold uppercase tracking-widest leading-relaxed">Choose your preferred tongue for the market</p>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] px-2 mb-2">Select Language</p>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageSelect(lang.code)}
              className={`w-full p-5 rounded-2xl border transition-all flex items-center justify-between group ${
                language === lang.code
                  ? 'bg-black border-black shadow-xl'
                  : 'bg-white border-gray-100 hover:border-gray-200 shadow-sm'
              }`}
            >
              <div className="text-left">
                <p className={`text-[9px] font-black uppercase tracking-widest mb-0.5 ${language === lang.code ? 'text-gray-400' : 'text-gray-300'}`}>
                  {lang.label}
                </p>
                <p className={`text-lg font-black uppercase tracking-tight ${language === lang.code ? 'text-white' : 'text-gray-900'}`}>
                  {lang.native}
                </p>
              </div>
              {language === lang.code && (
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-md">
                  <Check className="w-5 h-5 text-black stroke-[3]" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-4 font-sans">
      <div className="max-w-md mx-auto pt-12">
        
        {/* Back Button */}
        <button 
          onClick={() => router.back()}
          className="mb-8 flex items-center gap-2 text-gray-400 font-bold uppercase tracking-widest hover:text-gray-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> Back
        </button>

        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-black shadow-2xl mb-6">
            <Globe className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tight">{t('language')}</h1>
          <p className="text-lg text-gray-400 mt-2 font-medium uppercase tracking-widest">{t('change_language')}</p>
        </div>

        {/* Localized Prompt Card (No bounce, refined design) */}
        {language === 'en' && (
          <Card className="mb-10 border-2 border-yellow-100 bg-yellow-50/30 rounded-[3rem] overflow-hidden shadow-2xl shadow-yellow-50/50">
            <CardContent className="p-10 text-center space-y-8">
              <div>
                <p className="text-3xl font-black text-yellow-900 mb-6 leading-tight">
                  ನೀವು ಕನ್ನಡಕ್ಕೆ ಬದಲಾಯಿಸಲು ಬಯಸುವಿರಾ?
                </p>
                <Button 
                  onClick={() => setLanguage('kn')}
                  className="w-full bg-yellow-600 hover:bg-yellow-700 h-20 rounded-2xl text-2xl font-black uppercase tracking-widest shadow-xl shadow-yellow-200 transition-all active:scale-95"
                >
                  ಹೌದು (YES)
                </Button>
              </div>

              {/* Small Hindi Option for Migrants */}
              <div className="pt-6 border-t border-yellow-100">
                <p className="text-sm font-bold text-yellow-800/60 uppercase tracking-widest mb-4">
                  हिंदी भाषा के लिए (For Hindi)
                </p>
                <button 
                  onClick={() => setLanguage('hi')}
                  className="text-lg font-black text-yellow-700 underline decoration-2 underline-offset-8 hover:text-yellow-900"
                >
                  हिन्दी में बदलें (CHANGE TO HINDI)
                </button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] px-4 py-2">All Languages</p>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`w-full p-8 rounded-[2.5rem] border-2 transition-all flex items-center justify-between group ${
                language === lang.code
                  ? 'bg-black border-black shadow-2xl shadow-gray-200'
                  : 'bg-white border-gray-100 hover:border-gray-200 shadow-xl shadow-gray-50'
              }`}
            >
              <div className="text-left">
                <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${language === lang.code ? 'text-gray-400' : 'text-gray-300'}`}>
                  {lang.label}
                </p>
                <p className={`text-2xl font-black uppercase tracking-tight ${language === lang.code ? 'text-white' : 'text-gray-900'}`}>
                  {lang.native}
                </p>
              </div>
              {language === lang.code && (
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg">
                  <Check className="w-7 h-7 text-black stroke-[4]" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

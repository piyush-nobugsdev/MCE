'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { translations, Language } from './translations'

type LanguageContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: keyof typeof translations['en']) => string
}

const defaultContext: LanguageContextType = {
  language: 'en',
  setLanguage: () => {},
  t: (key) => translations['en'][key] || (key as string)
}

const LanguageContext = createContext<LanguageContextType>(defaultContext)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Load preference from localStorage
    const stored = localStorage.getItem('app_language') as Language
    if (stored && ['en', 'hi', 'kn'].includes(stored)) {
      setLanguageState(stored)
    }
    setMounted(true)
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('app_language', lang)
    document.cookie = `app_language=${lang}; path=/; max-age=31536000; SameSite=Lax`
  }

  const t = (key: keyof typeof translations['en']): string => {
    return translations[language][key] || translations['en'][key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      <div style={{ visibility: mounted ? 'visible' : 'hidden' }}>
        {children}
      </div>
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  return context
}

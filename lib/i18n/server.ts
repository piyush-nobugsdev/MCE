import { cookies } from 'next/headers'
import { translations, Language } from './translations'

export async function getLanguage(): Promise<Language> {
  const cookieStore = await cookies()
  const lang = cookieStore.get('app_language')?.value as Language
  return ['en', 'hi', 'kn'].includes(lang) ? lang : 'en'
}

export async function getTranslations() {
  const lang = await getLanguage()
  
  return {
    t: (key: keyof typeof translations['en']): string => {
      return translations[lang][key] || translations['en'][key] || key
    },
    language: lang
  }
}

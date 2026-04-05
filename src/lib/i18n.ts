import { useEffect, useState } from 'react'
import type { Language } from '@/lib/types'

const key = 'club5octobre-language'

export function useLanguage() {
  const [language, setLanguage] = useState<Language>(() => {
    const existing = localStorage.getItem(key)
    return existing === 'ar' ? 'ar' : 'fr'
  })

  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
    localStorage.setItem(key, language)
  }, [language])

  return {
    language,
    setLanguage,
    isArabic: language === 'ar',
  }
}

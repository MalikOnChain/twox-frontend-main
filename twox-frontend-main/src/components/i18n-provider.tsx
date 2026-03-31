'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const { i18n, ready } = useTranslation()
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Wait for i18next to be ready
    if (i18n.isInitialized && ready) {
      setIsReady(true)
    }

    // Ensure English is loaded on first visit
    const initLanguage = async () => {
      try {
        if (!i18n.hasResourceBundle('en', 'translation')) {
          await i18n.loadLanguages('en')
        }
        
        // If no language is set, default to English
        if (!i18n.language || i18n.language === 'cimode') {
          await i18n.changeLanguage('en')
        }
        
        setIsReady(true)
      } catch (error) {
        console.error('Failed to initialize i18n:', error)
        setIsReady(true) // Show content anyway
      }
    }

    if (!isReady) {
      initLanguage()
    }
  }, [i18n, ready, isReady])

  // Show children immediately - translations will load asynchronously
  // The useSuspense: false setting prevents showing keys
  return <>{children}</>
}


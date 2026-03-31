import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import HttpBackend from 'i18next-http-backend'
import { initReactI18next } from 'react-i18next'

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    lng: 'en', // Set default language to English
    supportedLngs: ['pt', 'en'],
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: '/locales/{{lng}}/translation.json',
    },
    detection: {
      order: ['cookie', 'localStorage', 'navigator'],
      caches: ['cookie', 'localStorage'],
      lookupCookie: 'i18next',
      lookupLocalStorage: 'i18nextLng',
    },
    react: {
      useSuspense: false, // Disable suspense to prevent showing keys before translations load
    },
    load: 'languageOnly', // Load only 'en' not 'en-US'
  })

export default i18n

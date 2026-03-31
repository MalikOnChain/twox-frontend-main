import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import {
  GoogleReCaptchaProvider,
  useGoogleReCaptcha,
} from 'react-google-recaptcha-v3'

import { validateRecaptcha } from '@/api/auth'

type RecaptchaContextType = string | null

const RecaptchaContext = createContext<RecaptchaContextType>(null)

const RECAPTCHA_CONFIG = {
  SITE_KEY: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '',
  ERROR_MESSAGES: {
    VALIDATION_FAILED:
      'Human validation failed. Please complete the challenge.',
  },
}

interface RecaptchaProviderProps {
  children: React.ReactNode
}

export const RecaptchaProvider: React.FC<RecaptchaProviderProps> = ({
  children,
}) => {
  if (!RECAPTCHA_CONFIG.SITE_KEY) {
    throw new Error(
      'Google reCAPTCHA site key is not set in environment variables.'
    )
  }

  return (
    <GoogleReCaptchaProvider reCaptchaKey={RECAPTCHA_CONFIG.SITE_KEY}>
      <RecaptchaContext.Provider value={RECAPTCHA_CONFIG.SITE_KEY}>
        {children}
      </RecaptchaContext.Provider>
    </GoogleReCaptchaProvider>
  )
}

interface ValidateHumanResult {
  success: boolean
  token: string | null
}

export const useRecaptcha = () => {
  const siteKey = useContext(RecaptchaContext)
  const { executeRecaptcha: execute } = useGoogleReCaptcha()
  const [isLoading, setIsLoading] = useState(false)

  if (!siteKey) {
    throw new Error('useRecaptcha must be used within a RecaptchaProvider')
  }

  /**
   * Executes reCAPTCHA and validates the token with your backend server.
   * @returns {Promise<ValidateHumanResult>} - Returns the result of validation and the token.
   */
  const validateHuman = useCallback(async (): Promise<ValidateHumanResult> => {
    setIsLoading(true)

    try {
      if (!execute) {
        throw new Error('reCAPTCHA has not been initialized properly.')
      }

      const token = await execute('submit')
      if (!token) {
        throw new Error(RECAPTCHA_CONFIG.ERROR_MESSAGES.VALIDATION_FAILED)
      }

      const response = await validateRecaptcha({ token })
      if (!response.success) {
        throw new Error('reCAPTCHA validation failed on the server.')
      }

      return { success: true, token }
    } catch (error: unknown) {
      console.error('reCAPTCHA validation error:', error)
      if (error instanceof Error) {
        throw error
      }
      throw new Error('An unknown error occurred during reCAPTCHA validation.')
    } finally {
      setIsLoading(false)
    }
  }, [execute])

  useEffect(() => {
    const badge = document.querySelector('.grecaptcha-badge') as HTMLElement

    if (badge) {
      if (isLoading) {
        badge.style.visibility = 'visible' // Show the badge
        badge.style.zIndex = '51' // Show the badge
      } else {
        badge.style.visibility = 'hidden' // Hide the badge
      }
    }

    return () => {
      if (badge) badge.style.visibility = 'hidden' // Cleanup
    }
  }, [isLoading])

  return {
    validateHuman,
    isLoading,
  }
}

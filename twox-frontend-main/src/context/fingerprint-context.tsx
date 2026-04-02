'use client'

import { useVisitorData } from '@fingerprintjs/fingerprintjs-pro-react'
import React, { createContext, ReactNode,useContext, useEffect, useState } from 'react'

interface FingerprintContextType {
  visitorId: string | null
  fingerprintData: any | null
  isLoading: boolean
  error: Error | null
  getFingerprint: () => Promise<void>
}

const FingerprintContext = createContext<FingerprintContextType | undefined>(undefined)

export function FingerprintProvider({ children }: { children: ReactNode }) {
  const [visitorId, setVisitorId] = useState<string | null>(null)
  const [fingerprintData, setFingerprintData] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fingerprintApiKey = process.env.NEXT_PUBLIC_FINGERPRINT_API_KEY || ''
  
  // Always call the hook, but disable it if no API key
  const { isLoading: isFpLoading, error: fpError, data, getData } = useVisitorData(
    fingerprintApiKey
      ? {
          extendedResult: true,
          linkedId: undefined,
        }
      : undefined,
    { immediate: !!fingerprintApiKey }
  )

  useEffect(() => {
    if (!fingerprintApiKey) {
      setIsLoading(false)
      setError(new Error('FingerprintJS API key not configured'))
      return
    }

    if (data) {
      setVisitorId(data.visitorId)
      setFingerprintData(data)
      setIsLoading(false)
      setError(null)
    }
  }, [data, fingerprintApiKey])

  useEffect(() => {
    setIsLoading(isFpLoading ?? false)
  }, [isFpLoading])

  useEffect(() => {
    if (fpError) {
      setError(fpError as Error)
      setIsLoading(false)
    }
  }, [fpError])

  const getFingerprint = async () => {
    if (!fingerprintApiKey) {
      console.warn('FingerprintJS API key not configured')
      return
    }
    try {
      setIsLoading(true)
      await getData({ ignoreCache: true })
    } catch (err) {
      console.error('Error getting fingerprint:', err)
      setError(err as Error)
    } finally {
      setIsLoading(false)
    }
  }

  const value: FingerprintContextType = {
    visitorId,
    fingerprintData,
    isLoading,
    error: error as Error | null,
    getFingerprint,
  }

  return <FingerprintContext.Provider value={value}>{children}</FingerprintContext.Provider>
}

export function useFingerprint() {
  const context = useContext(FingerprintContext)
  if (context === undefined) {
    throw new Error('useFingerprint must be used within a FingerprintProvider')
  }
  return context
}


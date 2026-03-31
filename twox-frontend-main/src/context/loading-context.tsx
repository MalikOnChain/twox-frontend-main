'use client'

import React, { createContext, useContext, useMemo, useState } from 'react'

import { useInitialSettingsContext } from '@/context/initial-settings-context'

import MainLoading from '@/components/templates/loading/main-loading'
interface LoadingContextType {
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { settings } = useInitialSettingsContext()

  const value = useMemo(
    () => ({
      isLoading,
      setIsLoading,
    }),
    [isLoading, setIsLoading]
  )

  return (
    <LoadingContext.Provider value={value}>
      {isLoading && (
        <MainLoading logoImg={settings.socialMediaSetting.logo} />
      )}
      {children}
    </LoadingContext.Provider>
  )
}

// Custom hook for using the user context

export function useLoading() {
  const context = useContext(LoadingContext)
  if (context === undefined) {
    throw new Error('useMenu must be used within a LoadingProvider')
  }
  return context
}

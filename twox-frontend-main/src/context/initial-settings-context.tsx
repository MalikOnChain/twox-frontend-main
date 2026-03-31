'use client'

import React, { createContext, useCallback, useContext, useMemo } from 'react'

import { Bonus, ReferralBonus } from '@/types/bonus'
import { SiteSettings } from '@/types/site-settings'
import { LoyaltyTier } from '@/types/vip'

interface InitialSettingsContextType {
  ranks: LoyaltyTier[]
  initialBonuses: Bonus[] | ReferralBonus[]
  settings: SiteSettings
  getRankIcon: (rank: string) => string
}

const InitialSettingsContext = createContext<
  InitialSettingsContextType | undefined
>(undefined)

export function InitialSettingsContextProvider({
  children,
  loyaltyTiers,
  settings,
  initialBonuses,
}: {
  settings: SiteSettings
  children: React.ReactNode
  loyaltyTiers: LoyaltyTier[]
  initialBonuses: Bonus[] | ReferralBonus[]
}) {
  const getRankIcon = useCallback(
    (rank: string) => {
      const rankIcon = loyaltyTiers.find((r) => r.name === rank)?.icon
      return rankIcon || ''
    },
    [loyaltyTiers]
  )

  const value = useMemo(
    () => ({
      settings,
      initialBonuses,
      ranks: loyaltyTiers,
      getRankIcon,
    }),
    [loyaltyTiers, settings, initialBonuses, getRankIcon]
  )

  return (
    <InitialSettingsContext.Provider value={value}>
      {children}
    </InitialSettingsContext.Provider>
  )
}

// Custom hook for using the user context

export function useInitialSettingsContext() {
  const context = useContext(InitialSettingsContext)
  if (context === undefined) {
    throw new Error(
      'useInitialSettingsContext must be used within a InitialSettingsContextProvider'
    )
  }
  return context
}

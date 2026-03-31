import React, { Suspense } from 'react'

import { getBonuses } from '@/api/server/bonus'
import { getLoyaltyTiers } from '@/api/server/loyalty-tier'
import { getSettings } from '@/api/server/settings'
import { SiteSettings } from '@/types/site-settings'

import { InitialSettingsContextProvider } from '@/context/initial-settings-context'

import ServerError from '@/components/error/ServerError'
import MainLayout from '@/components/layout/main-layout/main-layout'
import MainLoading from '@/components/templates/loading/main-loading'

import Providers from '@/app/providers'

const defaultSettings: SiteSettings = {
  depositMinAmount: 10,
  withdrawMinAmount: 10,
  withdrawMaxAmount: 10000,
  termsCondition: '',
  socialMediaSetting: {
    logo: '/images/small-logo-32.png',
    logoSymbol: '/images/small-logo-32.png',
    logoStyle: { height: 48, top: 0, left: 0 },
    logoSymbolStyle: { height: 48, top: 0, left: 0 },
    title: 'TwoX',
    slogan: '',
    instagram: '',
    facebook: '',
    twitter: '',
    whatspp: '',
    discord: '',
    telegram: '',
  },
  xpSetting: {
    status: 'active',
    depositXpAmount: 100,
    lossXpAmount: 100,
    wagerXpSetting: [],
  },
}

const layout = async ({ children }: { children: React.ReactNode }) => {
  const settingsRes = await getSettings()
  const settingsResponse = await settingsRes.json()

  const loyaltyRes = await getLoyaltyTiers()
  const loyaltyResponse = await loyaltyRes.json()

  const bonusesRes = await getBonuses()
  const bonusesResponse = await bonusesRes.json()

  if (!settingsRes.ok || !loyaltyRes.ok || !bonusesRes.ok) {
    return (
      <ServerError
        error={
          settingsResponse.error ||
          loyaltyResponse.error ||
          bonusesResponse.error
        }
      />
    )
  }

  const resolvedSettings = settingsResponse.settings || defaultSettings

  const resolvedLoyaltyTiers = Array.isArray(loyaltyResponse.ranks)
    ? loyaltyResponse.ranks
    : []
  const resolvedBonuses = Array.isArray(bonusesResponse.bonuses)
    ? bonusesResponse.bonuses
    : []

  return (
    <Suspense
      fallback={
        <MainLoading
          logoImg={resolvedSettings.socialMediaSetting.logo}
        />
      }
    >
      <InitialSettingsContextProvider
        loyaltyTiers={resolvedLoyaltyTiers}
        settings={resolvedSettings}
        initialBonuses={resolvedBonuses}
      >
        <Providers>
          <MainLayout>{children}</MainLayout>
        </Providers>
      </InitialSettingsContextProvider>
    </Suspense>
  )
}

export default layout

import React, { Suspense } from 'react'

import { getBonuses } from '@/api/server/bonus'
import { getLoyaltyTiers } from '@/api/server/loyalty-tier'
import { getSettings } from '@/api/server/settings'
import {
  SITE_BRAND_LOGO_SYMBOL_URL,
  SITE_BRAND_LOGO_URL,
  resolveSiteLogoUrl,
} from '@/lib/site-brand-defaults'
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
    logo: SITE_BRAND_LOGO_URL,
    logoSymbol: SITE_BRAND_LOGO_SYMBOL_URL,
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

  const apiSettings = settingsResponse.settings as SiteSettings | undefined
  const resolvedSettings: SiteSettings = apiSettings
    ? {
        ...defaultSettings,
        ...apiSettings,
        socialMediaSetting: {
          ...defaultSettings.socialMediaSetting,
          ...apiSettings.socialMediaSetting,
          logo: resolveSiteLogoUrl(
            apiSettings.socialMediaSetting?.logo,
            defaultSettings.socialMediaSetting.logo
          ),
          logoSymbol: resolveSiteLogoUrl(
            apiSettings.socialMediaSetting?.logoSymbol,
            defaultSettings.socialMediaSetting.logoSymbol
          ),
        },
      }
    : defaultSettings

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

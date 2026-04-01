import React from 'react'

import { getSettings } from '@/api/server/settings'
import {
  SITE_BRAND_LOGO_URL,
  resolveSiteLogoUrl,
} from '@/lib/site-brand-defaults'

import MainLoading from '@/components/templates/loading/main-loading'

const Loading = async () => {
  const settingsRes = await getSettings()
  const settingsResponse = await settingsRes.json()

  return (
    <MainLoading
      logoImg={resolveSiteLogoUrl(
        settingsResponse.settings?.socialMediaSetting?.logo,
        SITE_BRAND_LOGO_URL
      )}
    />
  )
}

export default Loading

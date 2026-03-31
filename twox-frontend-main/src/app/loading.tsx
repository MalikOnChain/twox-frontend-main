import React from 'react'

import { getSettings } from '@/api/server/settings'

import MainLoading from '@/components/templates/loading/main-loading'

const Loading = async () => {
  const settingsRes = await getSettings()
  const settingsResponse = await settingsRes.json()

  return (
    <MainLoading logoImg={settingsResponse.settings?.socialMediaSetting?.logo || '/images/small-logo-32.png'} />
  )
}

export default Loading

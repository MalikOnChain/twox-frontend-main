'use client'
import React from 'react'

import { useInitialSettingsContext } from '@/context/initial-settings-context'

const TermsPage = () => {
  const { settings } = useInitialSettingsContext()
  return (
    <div
      className='py-8'
      dangerouslySetInnerHTML={{
        __html: settings.termsCondition || '',
      }}
    />
  )
}

export default TermsPage

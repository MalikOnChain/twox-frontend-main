import { Metadata } from 'next'
import React from 'react'

// import ComingSoon from '@/components/templates/coming-soon/coming-soon'
import { CrashGameProvider } from '@/context/games/crash-context'

import CrashPage from '@/components/pages/(game)/crash'

// Define metadata
export const metadata: Metadata = {
  title: 'Crash Game - Bitstake',
  description: 'Play the crash game on Bitstake and win big!',
}

const CrashGamePage = () => {
  return (
    // <ComingSoon />
    <CrashGameProvider>
      <CrashPage />
    </CrashGameProvider>
  )
}

export default CrashGamePage

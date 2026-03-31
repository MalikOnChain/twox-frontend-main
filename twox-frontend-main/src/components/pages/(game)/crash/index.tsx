'use client'

import React from 'react'

import CrashGameContainer from '@/components/pages/(game)/crash/crash-game-container'
import BettingStatusTable from '@/components/tables/betting-status-table'

const CrashPage = () => {
  return (
    <div className='crash-game-page w-full'>
      <CrashGameContainer />
      <BettingStatusTable />
    </div>
  )
}

export default CrashPage

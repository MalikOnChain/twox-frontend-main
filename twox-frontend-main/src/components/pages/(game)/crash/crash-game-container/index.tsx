'use client'

import React from 'react'

import { useCrashGame } from '@/context/games/crash-context'

import { cn } from '@/lib/utils'

import BetLists from '@/components/pages/(game)/crash/crash-game-container/bet-lists'
import Body from '@/components/pages/(game)/crash/crash-game-container/body'
// import Footer from '@/components/pages/(game)/crash/crash-game-container/footer'
import Header from '@/components/pages/(game)/crash/crash-game-container/header'

const CrashGameContainer = () => {
  const { history, players, topWinners } = useCrashGame()

  return (
    <div
      className={cn(
        'crash-game-container',
        'flex w-full items-stretch gap-4',
        'flex-col xl:flex-row'
      )}
    >
      <div className='crash-game-body flex-1'>
        <Header history={history} />
        <Body />
        {/* <Footer /> */}
      </div>

      <BetLists players={players} topWinners={topWinners || []} />
    </div>
  )
}

export default CrashGameContainer

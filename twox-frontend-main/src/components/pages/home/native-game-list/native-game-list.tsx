import React from 'react'

import GameCard from '@/components/pages/(game)/game-card/game-card'

import { GameCategory } from '@/types/bet'

const NativeGameList = () => {
  return (
    <section className='space-y-2 md:space-y-4'>
      <div className='grid grid-cols-2 gap-2 md:gap-3 lg:grid-cols-4'>
        <GameCard className='col-span-2' type={GameCategory.CASES} />
        <GameCard type='lottery' />
        <GameCard type='wager-race' />
        <GameCard className='col-span-2' type={GameCategory.SLOTS} />
        <GameCard className='col-span-2' type={GameCategory.LIVE_CASINO} />
      </div>
    </section>
  )
}

export default NativeGameList

'use client'
import React from 'react'

import GameList from '@/components/pages/(game)/slots-casino/game-list/game-list'

import { ProviderGameType } from '@/types/game'

const GameShowPage = () => {
  return (
    <div className='flex flex-col gap-4'>
      {/* // TODO: Replace with the correct type once the API integration is complete */}
      <GameList type={ProviderGameType.RECOMMENDED} />
    </div>
  )
}

export default GameShowPage

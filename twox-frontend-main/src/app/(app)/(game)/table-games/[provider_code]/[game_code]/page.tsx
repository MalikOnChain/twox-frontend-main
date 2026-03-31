import React from 'react'

import GamePlayPage from '@/components/pages/(game)/slots-casino/game-play/game-play'

import { ProviderGameType } from '@/types/game'

const Page = () => {
  return <GamePlayPage type={ProviderGameType.LIVE} /> // TODO: Replace with the correct type once the API integration is complete
}

export default Page

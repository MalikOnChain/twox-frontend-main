'use client'
import React, { ReactNode } from 'react'

import { GameProviderProvider } from '@/context/games/game-provider-context'

const Providers = ({ children }: { children: ReactNode }) => {
  return <GameProviderProvider>{children}</GameProviderProvider>
}

export default Providers

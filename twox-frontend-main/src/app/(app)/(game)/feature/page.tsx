'use client'
import React from 'react'

import FeatureBuyInGameList from '@/components/pages/(game)/slots-casino/game-list/feature-buy-in-game-list'

const FeaturePage = () => {
  return (
    <div className='flex flex-col gap-4'>
      {/* <CasinoBanner banners={banners || []} /> */}
      <FeatureBuyInGameList />
    </div>
  )
}

export default FeaturePage

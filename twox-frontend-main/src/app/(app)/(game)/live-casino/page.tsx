'use client'
import React from 'react'

import { useBanner } from '@/context/features/banner-context'

import LiveCasinoGameList from '@/components/pages/(game)/slots-casino/game-list/live-casino-game-list'
import CasinoBanner from '@/components/pages/home/banner/casino-banner'

import { BannerSection } from '@/types/banner'

const LiveCasinoListPage = () => {
  const { banners } = useBanner({ section: BannerSection.CASINO })

  return (
    <div className='flex flex-col gap-4'>
      <CasinoBanner banners={banners || []} />
      <LiveCasinoGameList />
    </div>
  )
}

export default LiveCasinoListPage

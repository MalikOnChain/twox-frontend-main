'use client'
import React from 'react'

import { useBanner } from '@/context/features/banner-context'

import GameList from '@/components/pages/(game)/slots-casino/game-list/game-list'
import CasinoBanner from '@/components/pages/home/banner/casino-banner'

import { BannerSection } from '@/types/banner'

const LiveCasinoListPage = () => {
  const { banners } = useBanner({ section: BannerSection.CASINO })

  return (
    <div className='flex flex-col gap-4'>
      <CasinoBanner banners={banners || []} />
      <GameList type="all" session="popular" />
    </div>
  )
}

export default LiveCasinoListPage

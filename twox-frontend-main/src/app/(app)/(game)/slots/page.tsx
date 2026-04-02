'use client'
import { useSearchParams } from 'next/navigation'
import React, { useEffect } from 'react'

import { useBanner } from '@/context/features/banner-context'
import { useGameProvider } from '@/context/games/game-provider-context'

import GameList from '@/components/pages/(game)/slots-casino/game-list/game-list'
import CasinoBanner from '@/components/pages/home/banner/casino-banner'

import { BannerSection } from '@/types/banner'
import { ProviderGameType } from '@/types/game'

const SlotListPage = () => {
  const { banners } = useBanner({ section: BannerSection.GAMES })
  const searchParams = useSearchParams()
  const { setProvider } = useGameProvider()
  
  // Handle provider filter from URL
  useEffect(() => {
    const providerParam = searchParams.get('provider')
    if (providerParam) {
      setProvider(providerParam)
    }
  }, [searchParams, setProvider])

  return (
    <div className='flex flex-col gap-4'>
      <CasinoBanner banners={banners || []} />
      <GameList type={ProviderGameType.SLOT} />
    </div>
  )
}

export default SlotListPage

'use client'

import React, { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import Banner from '@/components/pages/home/banner/banner'
import GameGridLoader from '@/components/templates/loading/game-grid-loader'
import GamePageLoader from '@/components/templates/loading/game-page-loader'
import GamePreviewer from '@/components/pages/(game)/slots-casino/game/game-previewer'
import GamingRanking from '@/components/templates/game-rank-table/game-rank-table'
import LatestWinners from '@/components/templates/latest-winners/latest-winners'
import ProviderSection from '@/components/templates/provider-section/provider-section'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

import { useGameProvider } from '@/context/games/game-provider-context'
import { ProviderGameType } from '@/types/game'

import plusIcon from '@/assets/icons/plusicon.png'
import Image from 'next/image'
import ContentSectionDisplay from '@/components/templates/content-section/content-section'

export default function FeatureBuyInGameList() {
  const {
    games,
    loading,
    initialLoading,
    error,
    pagination,
    fetchGames,
    loadMore,
  } = useGameProvider()
  
  const loadMoreRef = useRef<HTMLButtonElement>(null)
  const { t } = useTranslation()

  const handleLoadMore = async () => {
    await loadMore(ProviderGameType.LIVE)
  }

  useEffect(() => {
    const timeId = setTimeout(() => {
      // Fetch only games with featurebuySupported: true
      fetchGames({ 
        offset: 0, 
        limit: 28, 
        type: ProviderGameType.LIVE,
        featurebuySupported: true,
        sortBy: 'plays',
        sortOrder: 'desc'
      })
    }, 200)

    return () => clearTimeout(timeId)
  }, [fetchGames])

  useEffect(() => {
    if (!error) return
    toast.error(error)
  }, [error])

  if (error) {
    return null
  }

  if (initialLoading) return <GamePageLoader type={ProviderGameType.LIVE} />

  return (
    <div>
      <Banner />

      {loading ? (
        <>
          <Skeleton className='mb-4 h-[33px] w-[200px] md:mb-[18px]' />
          <GameGridLoader type={ProviderGameType.LIVE} />
        </>
      ) : (
        <>
          {games.length === 0 && (
            <div className='text-md flex justify-center gap-2 py-20 text-center font-bold uppercase md:text-lg'>
              <span>{t('game_list.no_games_found')}</span>
            </div>
          )}

          {/* Games Grid */}
          <div className='grid grid-cols-3 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-5 xl:grid-cols-7'>
            {games.map((game) => (
              <div key={game._id}>
                <GamePreviewer item={game} type={ProviderGameType.LIVE} />
              </div>
            ))}
          </div>

          {/* Load More Button */}
          {pagination.hasMore && (
            <div className='mt-8 flex justify-center'>
              <Button
                onClick={handleLoadMore}
                size='sm'
                disabled={loading}
                loading={loading}
                ref={loadMoreRef}
                variant='secondary2'
                className='px-5 uppercase md:px-10'
              >
                <Image src={plusIcon} alt='games' width={10} height={10} />
                {t('game_list.load_more')}
              </Button>
            </div>
          )}
        </>
      )}
      <div className='mt-20 space-y-4 md:space-y-7'>
        <ProviderSection />
        <LatestWinners />
        <GamingRanking />
        <ContentSectionDisplay />
      </div>
    </div>
  )
}

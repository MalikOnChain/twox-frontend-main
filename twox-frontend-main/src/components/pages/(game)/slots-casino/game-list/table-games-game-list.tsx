'use client'

import React, { useEffect, useRef, useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { getGames } from '@/api/game'
import Banner from '@/components/pages/home/banner/banner'
import GameGridLoader from '@/components/templates/loading/game-grid-loader'
import GamePageLoader from '@/components/templates/loading/game-page-loader'
import GamePreviewer from '@/components/pages/(game)/slots-casino/game/game-previewer'
import GamingRanking from '@/components/templates/game-rank-table/game-rank-table'
import LatestWinners from '@/components/templates/latest-winners/latest-winners'
import ProviderSection from '@/components/templates/provider-section/provider-section'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

import { ProviderGameType, TProviderGameItem } from '@/types/game'
import { TPagination } from '@/types/pagination'

import plusIcon from '@/assets/icons/plusicon.png'
import Image from 'next/image'
import ContentSectionDisplay from '@/components/templates/content-section/content-section'

export default function TableGamesGameList() {
  const [games, setGames] = useState<TProviderGameItem[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [initialLoading, setInitialLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<TPagination>({
    offset: 0,
    limit: 28,
    total: 0,
    hasMore: true,
  })
  
  const loadMoreRef = useRef<HTMLButtonElement>(null)
  const { t } = useTranslation()

  // Filter out roulette and blackjack games
  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      const gameName = game.game_name.toLowerCase()
      return !gameName.includes('roulette') && !gameName.includes('blackjack')
    })
  }, [games])

  const fetchTableGames = async (offset = 0) => {
    try {
      setLoading(true)
      setError(null)

      const response = await getGames({
        offset,
        limit: 28,
        type: ProviderGameType.LIVE,
        provider: 'all',
        sortBy: 'plays',
        sortOrder: 'desc',
      })

      if (response.error) {
        throw new Error(response.error)
      }

      const data = response.data

      if (offset === 0) {
        setGames(data)
      } else {
        setGames((prev) => [...prev, ...data])
      }

      setPagination(response.pagination)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
        toast.error(err.message)
      } else {
        setError('Error while getting table games')
        toast.error('Error while getting table games')
      }
    } finally {
      setLoading(false)
      setInitialLoading(false)
    }
  }

  const handleLoadMore = async () => {
    const newOffset = pagination.offset + pagination.limit
    await fetchTableGames(newOffset)
  }

  useEffect(() => {
    const timeId = setTimeout(() => {
      fetchTableGames(0)
    }, 200)

    return () => clearTimeout(timeId)
  }, [])

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

      {loading && games.length === 0 ? (
        <>
          <Skeleton className='mb-4 h-[33px] w-[200px] md:mb-[18px]' />
          <GameGridLoader type={ProviderGameType.LIVE} />
        </>
      ) : (
        <>
          {filteredGames.length === 0 && (
            <div className='text-md flex justify-center gap-2 py-20 text-center font-bold uppercase md:text-lg'>
              <span>{t('game_list.no_games_found') || 'No table games found'}</span>
            </div>
          )}

          {/* Games Grid */}
          <div className='grid grid-cols-3 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-5 xl:grid-cols-7'>
            {filteredGames.map((game) => (
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


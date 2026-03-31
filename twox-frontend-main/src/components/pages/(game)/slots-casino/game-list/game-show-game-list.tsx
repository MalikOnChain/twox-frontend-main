'use client'

import React, { useEffect, useState, useMemo } from 'react'
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

export default function GameShowGameList() {
  const [allGames, setAllGames] = useState<TProviderGameItem[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [initialLoading, setInitialLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<TPagination>({
    offset: 0,
    limit: 28,
    total: 0,
    hasMore: true,
  })
  
  const { t } = useTranslation()

  // Game show keywords for filtering
  const gameShowKeywords = [
    'monopoly', 'crazy', 'mega ball', 'dream catcher', 'deal or no deal',
    'gonzo', 'lightning', 'cash', 'wheel', 'adventure', 'quest',
    'show', 'bonus', 'fortune', 'treasure', 'safari', 'party'
  ]

  // Filter games to show only game shows (TV-style games)
  const filteredGames = useMemo(() => {
    return allGames.filter((game) => {
      const gameName = game.game_name.toLowerCase()
      // Exclude traditional live casino games
      if (gameName.includes('live')) {
        return false
      }
      // Include game show style games
      return gameShowKeywords.some(keyword => gameName.includes(keyword))
    })
  }, [allGames])

  const fetchGameShows = async (offset = 0) => {
    try {
      setLoading(true)
      setError(null)

      // Fetch more games to have enough after filtering
      const response = await getGames({
        offset,
        limit: 100, // Fetch more to ensure we have enough after filtering
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
        setAllGames(data)
      } else {
        setAllGames((prev) => [...prev, ...data])
      }

      setPagination(response.pagination)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
        toast.error(err.message)
      } else {
        setError('Error while getting game shows')
        toast.error('Error while getting game shows')
      }
    } finally {
      setLoading(false)
      setInitialLoading(false)
    }
  }

  const handleLoadMore = async () => {
    const newOffset = pagination.offset + pagination.limit
    await fetchGameShows(newOffset)
  }

  useEffect(() => {
    const timeId = setTimeout(() => {
      fetchGameShows(0)
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
      <div className='flex flex-wrap items-center justify-end gap-2 pb-8 sm:flex-nowrap md:justify-between md:gap-3'>
        <div className='flex items-center gap-2'>
          <h1 className='text-lg font-bold uppercase md:text-xl'>
            {t('navbar.game_show') || 'Game Shows'}
          </h1>
        </div>
      </div>

      {loading && allGames.length === 0 ? (
        <>
          <Skeleton className='mb-4 h-[33px] w-[200px] md:mb-[18px]' />
          <GameGridLoader type={ProviderGameType.LIVE} />
        </>
      ) : (
        <>
          {filteredGames.length === 0 && (
            <div className='text-md flex justify-center gap-2 py-20 text-center font-bold uppercase md:text-lg'>
              <span>{t('game_list.no_games_found') || 'No game shows found'}</span>
            </div>
          )}

          {/* Games Grid */}
          {filteredGames.length > 0 && (
            <div className='grid grid-cols-3 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-5 xl:grid-cols-7'>
              {filteredGames.map((game) => (
                <div key={game._id}>
                  <GamePreviewer item={game} type={ProviderGameType.LIVE} />
                </div>
              ))}
            </div>
          )}

          {/* Load More Button */}
          {pagination.hasMore && filteredGames.length > 0 && (
            <div className='mt-8 flex justify-center'>
              <Button
                onClick={handleLoadMore}
                size='sm'
                disabled={loading}
                loading={loading}
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


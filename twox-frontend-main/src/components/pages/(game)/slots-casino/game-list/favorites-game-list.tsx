'use client'

import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { getFavoriteGames } from '@/api/user-games'
import Banner from '@/components/pages/home/banner/banner'
import GamePageLoader from '@/components/templates/loading/game-page-loader'
import GamePreviewer from '@/components/pages/(game)/slots-casino/game/game-previewer'
import GamingRanking from '@/components/templates/game-rank-table/game-rank-table'
import LatestWinners from '@/components/templates/latest-winners/latest-winners'
import ProviderSection from '@/components/templates/provider-section/provider-section'
import { Skeleton } from '@/components/ui/skeleton'

import { useUser } from '@/context/user-context'
import { ProviderGameType, TProviderGameItem } from '@/types/game'
import { AUTH_TABS, ModalType, useModal } from '@/context/modal-context'

import GameGridLoader from '@/components/templates/loading/game-grid-loader'
import ContentSectionDisplay from '@/components/templates/content-section/content-section'

export default function FavoritesGameList() {
  const [games, setGames] = useState<TProviderGameItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const { isAuthenticated } = useUser()
  const { setIsOpen, setType, setActiveTab } = useModal()
  
  const { t } = useTranslation()

  const fetchFavorites = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await getFavoriteGames()
      setGames(response.data)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
        toast.error(err.message)
      } else {
        setError('Error while getting favorite games')
        toast.error('Error while getting favorite games')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleOpenAuthModal = () => {
    setActiveTab(AUTH_TABS.signin)
    setType(ModalType.Auth)
    setIsOpen(true)
  }

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false)
      return
    }

    fetchFavorites()
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return (
      <div>
        <Banner />
        <div className='flex flex-col items-center justify-center py-20'>
          <p className='text-md mb-6'>Please sign in to view your favorite games</p>
          <button
            onClick={handleOpenAuthModal}
            className='rounded-md bg-arty-red px-6 py-2 font-semibold text-white hover:bg-red-600'
          >
            Sign In
          </button>
        </div>
      </div>
    )
  }

  if (loading) return <GamePageLoader type={ProviderGameType.LIVE} />

  if (error) {
    return null
  }

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
              <span>{t('game_list.no_games_found') || 'No favorite games yet. Add some games to your favorites!'}</span>
            </div>
          )}

          {/* Games Grid */}
          {games.length > 0 && (
            <div className='grid grid-cols-3 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-5 xl:grid-cols-7'>
              {games.map((game) => (
                <div key={game._id}>
                  <GamePreviewer item={game} type={ProviderGameType.LIVE} />
                </div>
              ))}
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


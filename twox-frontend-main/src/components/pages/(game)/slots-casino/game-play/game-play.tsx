'use client'

import { Info, Heart } from 'lucide-react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

import { getGame, getGames, onChangePlayMode } from '@/api/game'
import { addFavorite, removeFavorite, addRecentGame, checkIsFavorite } from '@/api/user-games'

import { AUTH_TABS, ModalType, useModal } from '@/context/modal-context'
import { useUser } from '@/context/user-context'
import { useFingerprint } from '@/context/fingerprint-context'

import GamePreviewer from '@/components/pages/(game)/slots-casino/game/game-previewer'
import GamePlayPageLoader from '@/components/templates/loading/game-play-loader'

import gameIcon from '@/assets/banner/icon/Isolation_Mode.png'
import { PlayButton } from '@/svg'

import GamePlayScreenContainer from './game-play-container'

import {
  GamePlayMode,
  ProviderGameType,
  TProviderGameItem,
  TProviderGameType,
} from '@/types/game'

enum GAME_TYPE {
  DEMO = 'demo',
  REAL = 'real',
}

const GamePlayPage = ({ type }: { type: TProviderGameType }) => {
  const { provider_code, game_code } = useParams()
  const [loading, setLoading] = useState<boolean>(true)
  const [game, setGame] = useState<TProviderGameItem | null>(null)
  const [isOpening, setIsOpening] = useState<string | null>(null)
  const [gameUrl, setGameUrl] = useState<string | null>(null)
  const { user, isAuthenticated } = useUser()
  const { setIsOpen, setType, setActiveTab } = useModal()
  const router = useRouter()
  const [similarGames, setSimilarGames] = useState<TProviderGameItem[]>([])
  const [gamePlayMode, setGamePlayMode] = useState<GamePlayMode>(
    GamePlayMode.REAL
  )
  const [isFavorite, setIsFavorite] = useState<boolean>(false)
  const [isTogglingFavorite, setIsTogglingFavorite] = useState<boolean>(false)
  const { visitorId, fingerprintData } = useFingerprint()

  const launchGame = async () => {
    const isDemo = gamePlayMode === GamePlayMode.FUN

    if (!user && !isDemo) {
      handleOpenAuthModal()
      return
    }

    if (
      !provider_code ||
      typeof provider_code !== 'string' ||
      !game_code ||
      typeof game_code !== 'string' ||
      isOpening
    )
      return
    setIsOpening(isDemo ? GAME_TYPE.DEMO : GAME_TYPE.REAL)
    try {
      const response = await onChangePlayMode(
        {
          provider_code: provider_code,
          game_code,
        },
        isDemo,
        user ? {
          username: user.username || user.email || '',
          password: `blueocean_${user._id}` // Use user ID as password for BlueOcean
        } : undefined,
        {
          visitorId: visitorId || '',
          fingerprintData,
        }
      )
      if (response.status === 1 && response.launch_url) {
        setGameUrl(response.launch_url)
        
        // Track this game as recently played (only for authenticated users)
        if (user && game_code && typeof game_code === 'string') {
          try {
            await addRecentGame(game_code)
          } catch (error) {
            console.error('Failed to track recent game:', error)
          }
        }
      } else {
        toast.error('Failed to launch game')
      }
    } catch (error) {
      console.error('Failed to launch game:', error)
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Failed to launch game')
      }
    } finally {
      setIsOpening(null)
    }
  }

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      handleOpenAuthModal()
      return
    }

    if (!game_code || typeof game_code !== 'string' || isTogglingFavorite) {
      return
    }

    setIsTogglingFavorite(true)
    try {
      if (isFavorite) {
        await removeFavorite(game_code)
        setIsFavorite(false)
        toast.success('Removed from favorites')
      } else {
        await addFavorite(game_code)
        setIsFavorite(true)
        toast.success('Added to favorites')
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error)
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Failed to update favorites')
      }
    } finally {
      setIsTogglingFavorite(false)
    }
  }

  const fetchGame = async (provider_code: string, game_code: string) => {
    try {
      const response = await getGame({
        provider_code: provider_code.toUpperCase(),
        game_code,
      })
      setGame(response.data)
    } catch (error) {
      console.error('Failed to get game:', error)
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Failed to get game')
      }
    } finally {
      setLoading(false)
    }
  }

  const fetchSimilarGames = async (
    provider_code: string,
    game_code: string
  ) => {
    try {
      const response = await getGames({
        type: type,
        limit: 29,
        offset: 0,
        provider: provider_code.toUpperCase(),
      })
      const filteredGames = response.data.filter(
        (similarGame) => similarGame.game_code !== game_code
      )
      setSimilarGames(filteredGames)
    } catch (error) {
      console.error('Failed to get similar games:', error)
    }
  }

  const handleOpenAuthModal = () => {
    setType(ModalType.Auth)
    setIsOpen(true)
    setActiveTab(AUTH_TABS.signin)
  }

  useEffect(() => {
    if (
      !provider_code ||
      typeof provider_code !== 'string' ||
      !game_code ||
      typeof game_code !== 'string'
    )
      return

    fetchGame(provider_code, game_code)
    fetchSimilarGames(provider_code, game_code)
  }, [provider_code, game_code])

  // Check if game is in favorites
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (isAuthenticated && game_code && typeof game_code === 'string') {
        try {
          const isFav = await checkIsFavorite(game_code)
          setIsFavorite(isFav)
        } catch (error) {
          console.error('Failed to check favorite status:', error)
        }
      } else {
        setIsFavorite(false)
      }
    }

    checkFavoriteStatus()
  }, [game_code, isAuthenticated])

  const goBack = useCallback(() => {
    router.push(type === ProviderGameType.SLOT ? '/slots' : '/live-casino')
  }, [type, router])

  if (!game || loading) return <GamePlayPageLoader />

  console.log(game, 'game')

  return (
    <div className='mx-auto w-full space-y-4 md:space-y-8'>
      {/* <div className='flex items-center gap-2'>
        <Button
          variant='icon'
          size='icon'
          className='size-8 text-muted-foreground hover:text-foreground md:size-10'
          onClick={goBack}
        >
          <ArrowLeft className='size-3 md:size-4' />
        </Button>
        <span className='text-sm text-muted-foreground'>Go Back</span>
      </div> */}
      <div className='flex flex-col gap-4 lg:flex-row'>
        <div className='game-main w-full overflow-hidden rounded-[20px] bg-muted'>
          <GamePlayScreenContainer
            onChangePlayMode={(value) => setGamePlayMode(value)}
            gamePlayMode={gamePlayMode}
            type={type}
            isFavorite={isFavorite}
            onToggleFavorite={handleToggleFavorite}
            isTogglingFavorite={isTogglingFavorite}
          >
            {gameUrl ? (
              <iframe
                src={gameUrl}
                className='h-full w-full border-0'
                allow='fullscreen'
                title={game.game_name}
              />
            ) : (
              <>
                <Image
                  src={game.banner}
                  className='h-full w-full object-cover backdrop-blur-md'
                  width={0}
                  height={0}
                  sizes='100vw'
                  alt={game.game_name}
                />
                <div className='absolute left-0 top-0 flex h-full w-full items-center justify-center gap-2 bg-white/0 backdrop-blur-lg'>
                  <button
                    disabled={Boolean(isOpening)}
                    onClick={() => launchGame()}
                  >
                    <PlayButton width='54' height='54' />
                  </button>
                </div>
              </>
            )}
          </GamePlayScreenContainer>
        </div>
        <div className='hidden max-h-[720px] w-[400px] flex-col gap-4 overflow-y-auto rounded-2xl bg-dark-grey-gradient py-4 lg:flex'>
          <div className='flex flex-col gap-4'>
            <div className='flex items-center justify-between border-b border-mulberry px-3 pb-4'>
              <div className='flex items-center gap-2'>
                <Info size={20} className='text-white' />
                <span className='text-sm font-medium text-white'>About Game</span>
              </div>
              <button
                onClick={handleToggleFavorite}
                disabled={isTogglingFavorite}
                className={`transition-all duration-200 ${isTogglingFavorite ? 'opacity-50' : 'opacity-100 hover:scale-110'}`}
                title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart 
                  size={24} 
                  className={`${isFavorite ? 'fill-red-500 text-red-500' : 'text-white'} transition-colors`}
                />
              </button>
            </div>
            <div className='flex w-full items-center gap-4 px-3'>
              <Image
                src={game.banner}
                alt={game.game_name}
                className='h-[180px] w-[150px] rounded-md object-cover'
                width={0}
                height={0}
                sizes='100vw'
              />
              <div className='flex flex-col justify-between gap-1 font-satoshi'>
                <div className='flex flex-col gap-1'>
                  <span className='text-sm text-arty-red'>
                    {game.provider_code}
                  </span>
                  <span className='break-words font-kepler text-[22px] leading-7'>
                    {game.game_name}
                  </span>
                </div>
                <span className='mt-2 w-fit rounded-md border border-mulberry p-1 px-3 text-sm font-medium capitalize text-white'>
                  {game.type}
                </span>
              </div>
            </div>
          </div>

          <div className='flex flex-col gap-4 px-3'>
            <div className='flex items-center gap-2'>
              <Image
                src={gameIcon}
                alt={game.game_name}
                className='h-[22px] w-[22px] object-contain'
                width={22}
                height={22}
              />
              <span className='font-satoshi text-base font-medium text-muted-foreground'>
                Similar games
              </span>
            </div>
            <div className='grid grid-cols-2 gap-2'>
              {similarGames.map((game) => (
                <GamePreviewer
                  key={game._id}
                  item={game}
                  type={type}
                  hideName
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* {typeof provider_code === 'string' && (
        <CasinoGameSlider
          type={type}
          provider={provider_code}
          title='Slots'
          mode={GameSliderMode.RANDOM}
          titleIcon={<Diamond className='absolute size-12' />}
          className='mb-8 mt-[42px] md:mb-[42px]'
        />
      )} */}
    </div>
  )
}

export default GamePlayPage

'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Swiper as SwiperType } from 'swiper'
import { Autoplay, Grid, Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/grid'
import 'swiper/css/navigation'

import { getGames } from '@/api/game'

import { toastErrorUnlessConnectivityShown } from '@/lib/error-handler'

import GamePreviewer from '@/components/pages/(game)/slots-casino/game/game-previewer'
import GameGridLoader from '@/components/templates/loading/game-grid-loader'
import { Button } from '@/components/ui/button'

import slotIcon from '@/assets/banner/icon/Isolation_Mode.png'

import { ProviderGameType, TProviderGameItem } from '@/types/game'
const GameShows = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [games, setGames] = useState<TProviderGameItem[]>([])
  const [isBeginning, setIsBeginning] = useState<boolean>(true)
  const [isEnd, setIsEnd] = useState<boolean>(false)
  const swiperRef = useRef<SwiperType | null>(null)
  const router = useRouter()
  const { t } = useTranslation()

  const fetchGames = useCallback(
    async ({ offset = 0, limit = 100 }: { offset: number; limit: number }) => {
      const provider = 'all'
      const type = ProviderGameType.LIVE

      try {
        setLoading(true)
        const response = await getGames({
          offset,
          limit,
          type: ProviderGameType.LIVE,
          provider,
          sortBy: 'plays',
          sortOrder: 'desc',
        })
        if (response.error) {
          throw new Error(response.error)
        }
        
        // Filter for game show style games (TV-style games with hosts)
        // These typically DON'T have "live" in the name and often have show/entertainment keywords
        const gameShowKeywords = [
          'monopoly', 'crazy', 'mega ball', 'dream catcher', 'deal or no deal',
          'gonzo', 'lightning', 'cash', 'wheel', 'adventure', 'quest',
          'show', 'bonus', 'fortune', 'treasure', 'safari', 'party'
        ]
        
        const data = response.data.filter((game) => {
          const gameName = game.game_name.toLowerCase()
          // Exclude games with "live" in the name (those are for Live Games section)
          if (gameName.includes('live')) {
            return false
          }
          // Include games that match game show keywords
          return gameShowKeywords.some(keyword => gameName.includes(keyword))
        }).slice(0, 24) // Limit to 24 games
        
        if (offset === 0) {
          setGames(data)
        } else {
          setGames((prev) => [...prev, ...data])
        }
      } catch (error) {
        toastErrorUnlessConnectivityShown(
          error,
          'Error while getting game shows list'
        )
      } finally {
        setLoading(false)
      }
    },
    []
  )

  useEffect(() => {
    fetchGames({ offset: 0, limit: 100 })
  }, [fetchGames])

  const handlePrev = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev()
    }
  }

  const handleNext = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext()
    }
  }

  const handleSwiperUpdate = (swiper: SwiperType) => {
    setIsBeginning(swiper.isBeginning)
    setIsEnd(swiper.isEnd)
  }

  const handleViewAll = () => {
    router.push('/game-show')
  }

  if (loading) return <GameGridLoader type={ProviderGameType.LIVE} />

  return (
    <div className='flex'>
      <div className='w-0 flex-1 space-y-4 max-md:pb-6 md:space-y-6'>
        <div className='flex justify-between'>
          <div className='flex items-center gap-2 md:gap-3'>
            <Image
              src={slotIcon}
              alt='game shows'
              width={28}
              height={28}
              className='h-7 w-7'
            />
            <h3 className='text-[15px] font-medium uppercase'>
              {t('navbar.game_show')}
            </h3>
          </div>
          <div className='flex items-center gap-2'>
            <Button
              variant='gradient-border'
              className='max-h-9'
              onClick={handleViewAll}
            >
              {t('navbar.view_all')}
            </Button>
            <Button
              className='h-9 w-9 p-0 md:p-0 [&_svg]:size-4'
              onClick={handlePrev}
              disabled={isBeginning}
              aria-label='Previous slide'
              variant={isBeginning ? 'gradient-border' : 'secondary2'}
            >
              <ChevronLeft />
            </Button>
            <Button
              className='h-9 w-9 p-0 md:p-0 [&_svg]:size-4'
              onClick={handleNext}
              disabled={isEnd}
              aria-label='Next slide'
              variant={isEnd ? 'gradient-border' : 'secondary2'}
            >
              <ChevronRight />
            </Button>
          </div>
        </div>
        <div className='overflow-hidden rounded-lg'>
          <Swiper
            modules={[Autoplay, Navigation, Grid]}
            spaceBetween={8}
            slidesPerView={2.5}
            pagination={{ clickable: true }}
            // autoplay={{
            //   delay: 5000,
            //   disableOnInteraction: false,
            // }}
            grid={{
              rows: window.innerWidth < 640 ? 2 : 1,
              fill: 'row',
            }}
            onSwiper={(swiper) => {
              swiperRef.current = swiper
              handleSwiperUpdate(swiper)
            }}
            onSlideChange={(swiper) => {
              handleSwiperUpdate(swiper)
            }}
            breakpoints={{
              0: {
                slidesPerView: 3,
              },
              550: {
                slidesPerView: 3,
              },
              768: {
                slidesPerView: 3,
              },
              1025: {
                slidesPerView: 4,
              },
              1280: {
                slidesPerView: 5,
              },
              1536: {
                slidesPerView: 7,
              },
            }}
          >
            {games.map((game, index) => (
              <SwiperSlide key={`${game._id}-slide-${index}`} className='mb-4'>
                <GamePreviewer
                  hideName
                  item={game}
                  type={ProviderGameType.LIVE}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  )
}

export default GameShows

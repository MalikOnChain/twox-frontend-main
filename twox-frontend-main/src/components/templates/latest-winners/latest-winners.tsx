'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Swiper as SwiperType } from 'swiper'
import { Autoplay, FreeMode } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/grid'
import 'swiper/css/navigation'

import { getLatestWinners, GameStatsWinner } from '@/api/game-stats'

import { Button } from '@/components/ui/button'

import winnerIcon from '@/assets/banner/icon/winner.png'
import CrownIcon from '@/assets/winner/crown.svg'

const LatestWinners = () => {
  const [isBeginning, setIsBeginning] = useState<boolean>(true)
  const [isEnd, setIsEnd] = useState<boolean>(false)
  const [winners, setWinners] = useState<GameStatsWinner[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const swiperRef = useRef<SwiperType | null>(null)
  const { t } = useTranslation()

  // Fetch latest winners from backend
  useEffect(() => {
    const fetchWinners = async () => {
      try {
        setLoading(true)
        const response = await getLatestWinners(20)
        if (response.success && response.data) {
          setWinners(response.data)
        }
      } catch (error) {
        console.error('Failed to fetch latest winners:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchWinners()
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchWinners, 30000)
    return () => clearInterval(interval)
  }, [])

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

  return (
    <div className='flex'>
      <div className='w-0 flex-1 space-y-4 max-md:pb-6 md:space-y-6'>
        <div className='flex justify-between'>
          <div className='flex items-center gap-2 md:gap-3'>
            <Image
              src={winnerIcon}
              alt='Popular'
              width={24}
              height={24}
              className='h-6 w-6'
            />
            <h3 className='pt-1 text-[15px] font-medium uppercase'>
              {t('title.latest_winner')}
            </h3>
          </div>
          <div className='flex items-center gap-2'>
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
          {loading ? (
            // Loading skeleton
            <div className='flex gap-4'>
              {[...Array(5)].map((_, i) => (
                <div
                  key={`skeleton-${i}`}
                  className='h-[130px] w-full animate-pulse rounded-2xl bg-custom-dual-gradient'
                />
              ))}
            </div>
          ) : winners.length === 0 ? (
            // No winners yet
            <div className='flex h-[130px] items-center justify-center rounded-2xl border border-mirage bg-custom-dual-gradient'>
              <p className='text-sm text-gray-400'>No recent winners yet</p>
            </div>
          ) : (
            // Swiper with real winner data
            <Swiper
              modules={[Autoplay, FreeMode]}
              spaceBetween={16}
              slidesPerView={2.5}
              pagination={{ clickable: true }}
              freeMode={true}
              onSwiper={(swiper) => {
                swiperRef.current = swiper
                handleSwiperUpdate(swiper)
              }}
              onSlideChange={(swiper) => {
                handleSwiperUpdate(swiper)
              }}
              breakpoints={{
                0: {
                  slidesPerView: 1.5,
                },
                450: {
                  slidesPerView: 2,
                },
                550: {
                  slidesPerView: 2.5,
                },
                768: {
                  slidesPerView: 3,
                },
                940: {
                  slidesPerView: 4,
                },
                1025: {
                  slidesPerView: 3,
                },
                1280: {
                  slidesPerView: 3.5,
                },
                1400: {
                  slidesPerView: 4,
                },
                1536: {
                  slidesPerView: 4.25,
                },
                1630: {
                  slidesPerView: 5,
                },
              }}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
            >
              {winners.map((winner, index) => (
                <SwiperSlide key={`${winner.id}-slide-${index}`}>
                  <div className='flex h-[130px] w-full items-center gap-[14px] rounded-2xl border border-mirage bg-custom-dual-gradient p-4 font-satoshi hover:border hover:border-mulberry hover:shadow-card-shadow-red'>
                    <div className='shrink-0'>
                      {winner.gameImage ? (
                        <Image
                          src={winner.gameImage}
                          alt={winner.gameName}
                          width={80}
                          height={80}
                          className='rounded-lg object-cover'
                          unoptimized
                        />
                      ) : (
                        <div className='flex h-20 w-20 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500'>
                          <span className='text-2xl font-bold text-white'>
                            {winner.gameName.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className='flex-1 overflow-hidden'>
                      <div className='flex items-center gap-2'>
                        <CrownIcon />
                        <p className='truncate text-sm font-normal text-oslo-grey'>
                          {winner.player.slice(0, 3)}***
                        </p>
                      </div>
                      <p className='truncate text-sm font-semibold text-white'>
                        {winner.gameName}
                      </p>
                      <div className='mt-1 flex items-center gap-2'>
                        <span className='text-xs text-gray-400'>Won:</span>
                        <span className='text-sm font-bold text-red-500'>
                          {winner.currency}{winner.winAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                        {/* <span className='text-xs text-yellow-400'>({winner.multiplier})</span> */}
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>
    </div>
  )
}

export default LatestWinners

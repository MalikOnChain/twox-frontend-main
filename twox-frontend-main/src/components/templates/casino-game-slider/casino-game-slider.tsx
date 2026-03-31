'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import type { Swiper as SwiperType } from 'swiper'
import { Autoplay, Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import { getGames } from '@/api/game'

import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

import {
  GameSliderMode,
  ProviderGameType,
  TProviderGameItem,
  TProviderGameType,
} from '@/types/game'

interface CasinoGameSliderProps {
  type: TProviderGameType
  title: string
  titleIcon?: React.ReactNode
  mode: GameSliderMode
  provider?: string
  className?: string
}

const CasinoGameSlider = ({
  provider = 'all',
  type,
  title,
  titleIcon,
  mode,
  className,
}: CasinoGameSliderProps) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [games, setGames] = useState<TProviderGameItem[]>([])
  const [isBeginning, setIsBeginning] = useState<boolean>(true)
  const [isEnd, setIsEnd] = useState<boolean>(false)
  const swiperRef = useRef<SwiperType | null>(null)

  const router = useRouter()
  const fetchGames = useCallback(
    async ({ offset = 0, limit = 12 }: { offset: number; limit: number }) => {
      try {
        setLoading(true)
        const response = await getGames({ offset, limit, type, provider })
        if (response.error) {
          throw new Error(response.error)
        }
        const data = response.data
        setGames((prev) => {
          const allGames = [...prev, ...data]
          if (mode !== GameSliderMode.RANDOM) {
            return allGames
          }

          const shuffled = allGames.sort(() => Math.random() - 0.5)
          return shuffled.slice(0, 15)
        })
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message)
        } else {
          toast.error('Error while getting recent slots game list')
        }
      } finally {
        setLoading(false)
      }
    },
    [type, provider, mode]
  )

  useEffect(() => {
    const limit = mode === GameSliderMode.RANDOM ? 50 : 15
    fetchGames({ offset: 0, limit })
  }, [fetchGames, mode])

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
    router.push('/slots')
  }

  const slotBreakPoints = {
    0: {
      slidesPerView: 3.5,
      grid: {
        rows: 2,
        fill: 'row',
      },
    },
    550: {
      slidesPerView: 3.5,
      grid: {
        rows: 2,
        fill: 'row',
      },
    },
    768: {
      slidesPerView: 5.5,
      grid: {
        rows: 2,
        fill: 'row',
      },
    },
    1025: {
      slidesPerView: 7,
      grid: {
        rows: 2,
        fill: 'row',
      },
    },
  }

  const liveBreakPoints = {
    0: {
      slidesPerView: 3.3,
    },
    550: {
      slidesPerView: 4.5,
    },
    768: {
      slidesPerView: 5,
    },
    1025: {
      slidesPerView: 6,
    },
  }

  return (
    <section className={cn('flex', className)}>
      <div className='w-0 flex-1 space-y-4 max-md:pb-6 md:space-y-6'>
        <div className='flex justify-between'>
          <div className='flex items-center gap-1 md:gap-3'>
            <span className='relative flex size-6 items-center justify-center'>
              {titleIcon}
            </span>
            <h3 className='text-2xl font-bold md:text-[28px]'>{title}</h3>
          </div>
          <div className='flex items-center gap-2'>
            <Button
              className='h-9 w-9 p-0 md:p-0 [&_svg]:size-4'
              onClick={handlePrev}
              disabled={isBeginning}
              aria-label='Previous slide'
            >
              <ChevronLeft />
            </Button>
            <Button
              className='h-9 w-9 p-0 md:p-0 [&_svg]:size-4'
              onClick={handleNext}
              disabled={isEnd}
              aria-label='Next slide'
            >
              <ChevronRight />
            </Button>
            <Button
              variant='secondary1'
              className='max-h-9'
              onClick={handleViewAll}
            >
              View All
            </Button>
          </div>
        </div>

        <Swiper
          modules={[Autoplay, Navigation]}
          spaceBetween={8}
          slidesPerView={2.5}
          pagination={{ clickable: true }}
          grid={{
            rows: 2,
            fill: 'row',
          }}
          // autoplay={{
          //   delay: 5000,
          //   disableOnInteraction: false,
          // }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper
            handleSwiperUpdate(swiper)
          }}
          onSlideChange={(swiper) => {
            handleSwiperUpdate(swiper)
          }}
          breakpoints={
            type === ProviderGameType.SLOT ? slotBreakPoints : liveBreakPoints
          }
        >
          {loading
            ? [...Array(7)].map((item, index) => (
                <SwiperSlide key={`skeleton-${index}`}>
                  <Skeleton
                    className='aspect-[155/200] rounded-2xl'
                    key={`skeleton-${index}`}
                  />
                </SwiperSlide>
              ))
            : games.map((game, index) => (
                <SwiperSlide key={`${game._id}-slide-${index}`}>
                  {/* <GamePreviewer hideName item={game} type={type} size='sm' /> */}
                </SwiperSlide>
              ))}
        </Swiper>
      </div>
    </section>
  )
}

export default CasinoGameSlider

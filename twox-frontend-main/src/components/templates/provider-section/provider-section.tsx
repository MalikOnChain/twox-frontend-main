'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Swiper as SwiperType } from 'swiper'
import { Autoplay, FreeMode } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/grid'
import 'swiper/css/navigation'

import { getGamesProviders } from '@/api/game'
import { TGameProvider } from '@/types/game'

import { Button } from '@/components/ui/button'

import popularIcon from '@/assets/banner/icon/provider.png'

const ProviderSection = () => {
  const [isBeginning, setIsBeginning] = useState<boolean>(true)
  const [isEnd, setIsEnd] = useState<boolean>(false)
  const [activeSlide, setActiveSlide] = useState<number | null>(null)
  const [providers, setProviders] = useState<TGameProvider[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const swiperRef = useRef<SwiperType | null>(null)
  const { t } = useTranslation()

  // Fetch providers from backend
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setLoading(true)
        const response = await getGamesProviders({ type: 'video-slots' })
        if (response.data) {
          const validProviders = response.data
            // .filter((p) => p.gamesCount > 0)
            .sort((a, b) => b.gamesCount - a.gamesCount)
            .slice(0, 20) // Limit to top 20 providers
          
          setProviders(validProviders)
        }
      } catch (error) {
        console.error('Failed to fetch providers:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProviders()
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

  const handleSlideTouch = (index: number) => {
    setActiveSlide(activeSlide === index ? null : index)
  }

  return (
    <div className='flex'>
      <div className='w-0 flex-1 space-y-4 max-md:pb-6 md:space-y-6'>
        <div className='flex justify-between'>
          <div className='flex items-center gap-2 md:gap-3'>
            <Image
              src={popularIcon}
              alt='Providers'
              width={25}
              height={25}
              className='object-contain'
            />
            <h3 className='pt-1 text-[15px] font-medium uppercase'>
              {t('navbar.provider')}
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
            <div className='flex gap-4'>
              {[...Array(5)].map((_, i) => (
                <div
                  key={`skeleton-${i}`}
                  className='h-[106px] w-full animate-pulse rounded-2xl bg-custom-dual-gradient md:h-[132px]'
                />
              ))}
            </div>
          ) : providers.length === 0 ? (
            // No providers available
            <div className='flex h-[106px] items-center justify-center rounded-2xl border border-mirage bg-custom-dual-gradient md:h-[132px]'>
              <p className='text-sm text-gray-400'>No providers available</p>
            </div>
          ) : (
            // Swiper with real provider data
            <Swiper
              modules={[Autoplay, FreeMode]}
              spaceBetween={16}
              mousewheel={true}
              slidesPerView={2.5}
              pagination={{ clickable: true }}
              onSwiper={(swiper) => {
                swiperRef.current = swiper
                handleSwiperUpdate(swiper)
              }}
              onSlideChange={(swiper) => {
                handleSwiperUpdate(swiper)
              }}
              breakpoints={{
                0: {
                  slidesPerView: 2.5,
                },
                550: {
                  slidesPerView: 3.5,
                },
                768: {
                  slidesPerView: 4,
                },
                1025: {
                  slidesPerView: 3,
                },
                1220: {
                  slidesPerView: 4,
                },
                1536: {
                  slidesPerView: 5,
                },
              }}
            >
              {providers.map((provider, index) => (
                <SwiperSlide key={`${provider.code}-slide-${index}`}>
                  <Link
                    href={`/slots?provider=${provider.code}`}
                    className={`group flex h-[106px] w-full cursor-pointer items-center justify-center rounded-2xl border border-mirage bg-custom-dual-gradient transition-all duration-300 ease-in-out hover:border-mulberry hover:shadow-card-shadow-red active:border-mulberry active:shadow-card-shadow-red ${activeSlide === index ? 'border-mulberry shadow-card-shadow-red' : ''} md:h-[132px]`}
                    onClick={() => handleSlideTouch(index)}
                    onTouchStart={() => handleSlideTouch(index)}
                    title={`${provider.name} (${provider.gamesCount} games)`}
                  >
                    {provider.image || provider.imageColored ? (
                      <Image
                        src={provider.image || provider.imageColored || ''}
                        alt={provider.name}
                        width={145}
                        height={50}
                        className={`h-8 w-[100px] object-contain transition-transform duration-300 ease-in-out group-hover:scale-110 group-active:scale-110 ${activeSlide === index ? 'scale-110' : ''} md:h-[50px] md:w-[145px]`}
                        unoptimized
                      />
                    ) : (
                      // Fallback text if no image
                      <div className='text-center'>
                        <p className='text-sm font-semibold text-white md:text-base'>
                          {provider.name}
                        </p>
                        <p className='text-xs text-gray-400'>{provider.gamesCount} games</p>
                      </div>
                    )}
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProviderSection

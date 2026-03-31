'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Swiper as SwiperType } from 'swiper'
import { Autoplay, FreeMode } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/free-mode'

import { getGamesProviders } from '@/api/game'
import { TGameProvider } from '@/types/game'
import { SectionTitle, SectionDescription } from '@/components/landing/common'

export default function LandingProviders() {
  const [providers, setProviders] = useState<TGameProvider[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  // Fetch providers from backend
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setLoading(true)
        const response = await getGamesProviders({ type: 'video-slots' })
        console.log('LandingProviders - API response:', response)
        
        if (response.data) {
          console.log('LandingProviders - Raw providers:', response.data)
          
          // Use same logic as home page ProviderSection
          const validProviders = response.data
            // .filter((p) => p.gamesCount > 0) // Commented out like home page
            .sort((a, b) => b.gamesCount - a.gamesCount)
            .slice(0, 20) // Limit to top 20 providers for 2 rows (10 per row)

          console.log('LandingProviders - Filtered providers:', validProviders)
          setProviders(validProviders)
        } else {
          console.warn('LandingProviders - No data in response:', response)
        }
      } catch (error) {
        console.error('Failed to fetch providers:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProviders()
  }, [])

  return (
    <section className='w-full py-8 md:py-16 lg:py-24' style={{ backgroundColor: '#0A0A0A' }}>
      <div className='mx-auto w-full max-w-7xl px-4 md:px-8'>
        <SectionTitle className='mb-3 md:mb-4'>Providers</SectionTitle>
        <SectionDescription className='mb-8 md:mb-12'>
          Play over 3,500+ games from the world&apos;s leading studios - all in one place.
        </SectionDescription>

        {/* Providers Carousel */}
        {loading ? (
          <div className='flex gap-4 overflow-hidden'>
            {[...Array(10)].map((_, i) => (
              <div
                key={`skeleton-${i}`}
                className='h-12 w-24 flex-shrink-0 animate-pulse rounded-lg bg-gray-800 md:h-20 md:w-40'
              />
            ))}
          </div>
        ) : providers.length === 0 ? (
          <div className='flex items-center justify-center py-12'>
            <p className='text-white/70'>No providers available</p>
          </div>
        ) : (
          <div className='flex flex-col gap-6 md:gap-8 overflow-hidden'>
            {/* First Row - Normal Direction */}
            <Swiper
              modules={[Autoplay, FreeMode]}
              spaceBetween={16}
              freeMode={true}
              loop={false}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              breakpoints={{
                320: {
                  spaceBetween: 16,
                  slidesPerView: 5,
                },
                640: {
                  spaceBetween: 20,
                  slidesPerView: 5,
                },
                768: {
                  spaceBetween: 24,
                  slidesPerView: 5,
                },
                1024: {
                  spaceBetween: 24,
                  slidesPerView: 6,
                },
                1280: {
                  spaceBetween: 32,
                  slidesPerView: 7,
                },
              }}
              className='overflow-hidden'
            >
              {providers.slice(0, 10).map((provider, index) => (
                <SwiperSlide key={`${provider.code}-${index}`} className='!w-auto'>
                  <Link
                    href={`/slots?provider=${provider.code}`}
                    className='group flex items-center justify-center transition-opacity hover:opacity-80'
                    title={provider.name}
                  >
                    {provider.image || provider.imageColored ? (
                      <div className='relative flex h-12 w-24 items-center justify-center md:h-16 md:w-32 lg:h-20 lg:w-40'>
                        <Image
                          src={provider.image || provider.imageColored || ''}
                          alt={provider.name}
                          fill
                          className='object-contain'
                          sizes='(max-width: 640px) 96px, (max-width: 1024px) 128px, 160px'
                          unoptimized
                        />
                      </div>
                    ) : (
                      <div className='flex h-12 w-24 items-center justify-center rounded-lg bg-gray-800 md:h-16 md:w-32 lg:h-20 lg:w-40'>
                        <p
                          className='text-center text-xs text-white md:text-sm'
                          style={{
                            fontFamily: 'var(--font-satoshi), sans-serif',
                            fontWeight: 400,
                          }}
                        >
                          {provider.name}
                        </p>
                      </div>
                    )}
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Second Row - Reverse Direction */}
            <Swiper
              modules={[Autoplay, FreeMode]}
              spaceBetween={16}
              freeMode={true}
              loop={false}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
                reverseDirection: true, // Reverse direction
              }}
              breakpoints={{
                320: {
                  spaceBetween: 16,
                  slidesPerView: 5,
                },
                640: {
                  spaceBetween: 20,
                  slidesPerView: 5,
                },
                768: {
                  spaceBetween: 24,
                  slidesPerView: 5,
                },
                1024: {
                  spaceBetween: 24,
                  slidesPerView: 6,
                },
                1280: {
                  spaceBetween: 32,
                  slidesPerView: 7,
                },
              }}
              className='overflow-hidden'
            >
              {providers.slice(10, 20).reverse().map((provider, index) => (
                <SwiperSlide key={`${provider.code}-${index}`} className='!w-auto'>
                  <Link
                    href={`/slots?provider=${provider.code}`}
                    className='group flex items-center justify-center transition-opacity hover:opacity-80'
                    title={provider.name}
                  >
                    {provider.image || provider.imageColored ? (
                      <div className='relative flex h-12 w-24 items-center justify-center md:h-16 md:w-32 lg:h-20 lg:w-40'>
                        <Image
                          src={provider.image || provider.imageColored || ''}
                          alt={provider.name}
                          fill
                          className='object-contain'
                          sizes='(max-width: 640px) 96px, (max-width: 1024px) 128px, 160px'
                          unoptimized
                        />
                      </div>
                    ) : (
                      <div className='flex h-12 w-24 items-center justify-center rounded-lg bg-gray-800 md:h-16 md:w-32 lg:h-20 lg:w-40'>
                        <p
                          className='text-center text-xs text-white md:text-sm'
                          style={{
                            fontFamily: 'var(--font-satoshi), sans-serif',
                            fontWeight: 400,
                          }}
                        >
                          {provider.name}
                        </p>
                      </div>
                    )}
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </div>
    </section>
  )
}


'use client'

import { useEffect } from 'react'
import { useState } from 'react'
import { Navigation } from 'swiper/modules'
import { Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import { getWagerRaces } from '@/api/wagerRace'

import { toastErrorUnlessConnectivityShown } from '@/lib/error-handler'

import WagerRaceListLoader from '@/components/templates/loading/wagerRace-list-loader'

import TimerIcon from '@/assets/timer.svg'

import EventCard from './event-card'

import { WagerRace } from '@/types/wagerRace'
export default function EventsList() {
  const [loading, setLoading] = useState<boolean>(true)
  const [wagerRaces, setWagerRaces] = useState<WagerRace[]>([])

  const fetchWagerRaces = async () => {
    try {
      const response = await getWagerRaces()
      const data = response.wagerRaces
      setWagerRaces(data)
    } catch (error) {
      toastErrorUnlessConnectivityShown(
        error,
        'Error while getting wager races'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWagerRaces()
  }, [])

  if (loading) return <WagerRaceListLoader className='xl:grid-cols-3' />
  if (wagerRaces.length === 0) return null

  return (
    <section className='flex' id='wager-race'>
      <div className='w-0 flex-1 space-y-4 max-md:pb-6 md:space-y-6'>
        <div className='flex items-center gap-1 md:gap-3'>
          <span className='relative flex size-6 items-center justify-center'>
            <TimerIcon className='absolute size-12 text-primary-500' />
          </span>
          <h3 className='text-2xl font-bold md:text-[28px]'>Events</h3>
        </div>

        {/* Events List */}

        <Swiper
          modules={[Autoplay, Navigation]}
          spaceBetween={16}
          slidesPerView={2.5}
          pagination={{ clickable: true }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            0: {
              slidesPerView: 1,
            },
            550: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 2,
            },
            1280: {
              slidesPerView: 2,
            },
            1440: {
              slidesPerView: 3,
            },
          }}
        >
          {wagerRaces.map((wagerRace, index) => (
            <SwiperSlide key={`${wagerRace._id}-slide-${index}`}>
              <EventCard wagerRace={wagerRace} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}

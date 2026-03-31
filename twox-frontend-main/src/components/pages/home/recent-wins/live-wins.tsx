'use client'

import React, { memo } from 'react'
import { Navigation } from 'swiper/modules'
import { Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import { useBettingStatus } from '@/context/data/betting-status-context'

import RecentWinItem from '@/components/templates/recent-win/recent-win'

const LiveWins = () => {
  const { recentWinList } = useBettingStatus()

  return (
    <div className='min-[110px] relative flex w-full overflow-hidden'>
      <div className='w-0 flex-1 overflow-hidden rounded-lg'>
        <Swiper
          modules={[Autoplay, Navigation]}
          spaceBetween={16}
          mousewheel={true}
          creativeEffect={{
            prev: {
              shadow: true,
              translate: ['-120%', 0, -500],
            },
            next: {
              shadow: true,
              translate: ['120%', 0, -500],
            },
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            320: {
              slidesPerView: 1.5,
            },
            640: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 3,
            },
            1024: {
              slidesPerView: 4,
            },
            1520: {
              slidesPerView: 6,
            },
          }}
        >
          {recentWinList.map((el, index) => (
            <SwiperSlide key={`slide-${index}`}>
              <RecentWinItem key={`recent-win_${index}`} item={el} />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* <Marquee pauseOnHover>
          <div className='mr-2 flex gap-3.5 overflow-hidden'>
            {recentWinList.map((item, index) => (
              <RecentWinItem key={`recent-win_${index}`} item={item} />
            ))}
          </div>
        </Marquee> */}
      </div>
    </div>
  )
}

export default memo(LiveWins)

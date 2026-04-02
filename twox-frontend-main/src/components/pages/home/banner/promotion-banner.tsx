'use client'
import Image from 'next/image'
import React from 'react'
import { Autoplay, Navigation } from 'swiper/modules'
import { SwiperSlide } from 'swiper/react'
import { Swiper } from 'swiper/react'

import { useBanner } from '@/context/features/banner-context'
import { ModalType, useModal } from '@/context/modal-context'
import { AUTH_TABS } from '@/context/modal-context'
import { useUser } from '@/context/user-context'

import { Button } from '@/components/ui/button'

import { BannerSection } from '@/types/banner'

const PromotionBanner = () => {
  const { isAuthenticated } = useUser()
  const { setIsOpen, setType, setActiveTab } = useModal()
  const { banners } = useBanner({ section: BannerSection.PROMOTIONS })

  const handleClick = () => {
    if (isAuthenticated) {
      setType(ModalType.DepositWithdraw)
      setIsOpen(true)
    } else {
      setType(ModalType.Auth)
      setActiveTab(AUTH_TABS.signup)
      setIsOpen(true)
    }
  }

  return (
    <div className='flex'>
      <div className='w-0 flex-1 overflow-hidden rounded-3xl'>
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
          slidesPerView={1}
        >
          {banners?.map((el, index) => (
            <SwiperSlide key={`slide-${index}`}>
              <div className='relative'>
                <Image
                  src={el.image}
                  alt={el.title}
                  width={0}
                  height={0}
                  sizes='100vw'
                  className='min-h-24 w-full rounded-xl object-cover md:object-contain lg:rounded-3xl'
                />
                <Button
                  variant='secondary2'
                  className='absolute bottom-4 right-4 bg-black text-white'
                  onClick={handleClick}
                >
                  {isAuthenticated ? 'Deposit Now' : 'Sign Up'}
                </Button>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}

export default PromotionBanner

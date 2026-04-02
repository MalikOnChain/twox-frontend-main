'use client'
import Image from 'next/image'
import React from 'react'
import { Autoplay, Navigation } from 'swiper/modules'
import { SwiperSlide } from 'swiper/react'
import { Swiper } from 'swiper/react'

import { ModalType, useModal } from '@/context/modal-context'
import { AUTH_TABS } from '@/context/modal-context'
import { useUser } from '@/context/user-context'

import { Banner } from '@/types/banner'

const CasinoBanner = ({ banners }: { banners: Banner[] }) => {
  const { isAuthenticated } = useUser()
  const { setIsOpen, setType, setActiveTab } = useModal()

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
                  className='max-h-96 min-h-48 w-full rounded-xl object-cover lg:rounded-3xl'
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}

export default CasinoBanner

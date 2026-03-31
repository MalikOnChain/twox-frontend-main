'use client'

import { ChevronRight } from 'lucide-react'
import Image from 'next/image'
import React, { useRef, useState } from 'react'
import type { Swiper as SwiperType } from 'swiper'
import { Autoplay, Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css/pagination'

import { useBanner } from '@/context/features/banner-context'
import { useMenu } from '@/context/menu-context'

import { Button } from '@/components/ui/button'

import { BannerSection } from '@/types/banner'

const HeroBanner = () => {
  const { isExpanded } = useMenu()
  const { banners, isLoading, error } = useBanner({ section: BannerSection.HOME })
  const swiperRef = useRef<SwiperType | null>(null)
  const [isEnd, setIsEnd] = useState<boolean>(false)

  // Debug logging (remove in production)
  React.useEffect(() => {
    if (banners) {
      console.log('WelcomeBanner - Banners loaded:', banners.length, banners)
    }
    if (error) {
      console.error('WelcomeBanner - Error loading banners:', error)
    }
  }, [banners, error])

  const handleNext = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext()
    }
  }

  const handleSwiperUpdate = (swiper: SwiperType) => {
    setIsEnd(swiper.isEnd && !swiper.params.loop)
  }

  // Don't render if loading or no banners
  if (isLoading) {
    return null // or a loading spinner
  }

  if (!banners || banners.length === 0) {
    return null // or a placeholder
  }

  return (
    <div className='flex items-center gap-3'>
      <div className='w-0 flex-[2] space-y-4 overflow-hidden rounded-3xl md:space-y-6'>
        <div className='slider-container relative flex'>
          {/* Arrow Button positioned on top-right */}
          <Button
            className='absolute right-4 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center p-0 shadow-lg sm:flex md:p-0 [&_svg]:size-4'
            onClick={handleNext}
            aria-label='Next slide'
            variant='secondary2'
          >
            <ChevronRight />
          </Button>

          <Swiper
            key={isExpanded ? 'expanded' : 'collapsed'}
            modules={[Autoplay, Navigation]}
            spaceBetween={16}
            mousewheel={true}
            loop={banners.length > 1}
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
              pauseOnMouseEnter: true,
            }}
            onSwiper={(swiper) => {
              swiperRef.current = swiper
              handleSwiperUpdate(swiper)
            }}
            onSlideChange={(swiper) => {
              handleSwiperUpdate(swiper)
            }}
            onReachEnd={(swiper) => {
              handleSwiperUpdate(swiper)
            }}
            onReachBeginning={(swiper) => {
              handleSwiperUpdate(swiper)
            }}
            breakpoints={{
              320: {
                slidesPerView: 1,
              },
              640: {
                slidesPerView: 1.5,
              },
              768: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 2.5,
              },
              1280: {
                slidesPerView: isExpanded ? 2.5 : 3,
              },
              1520: {
                slidesPerView: 3,
              },
            }}
          >
            {banners.map((el, index) => (
              <SwiperSlide key={el._id || `slide-${index}`}>
                <Image
                  src={el.image}
                  alt={el.title}
                  width={0}
                  height={0}
                  sizes='100vw'
                  className='w-full rounded-xl object-cover md:object-contain lg:rounded-3xl'
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  )
}

export default HeroBanner

// {
//   /* <div className='hidden w-0 max-w-[330px] flex-1 space-y-4 max-md:pb-6 md:space-y-6 xl:block'>
//         <div className='slider-container flex'>
//           <Swiper
//             modules={[Autoplay, Navigation, EffectCards]}
//             grabCursor={true}
//             spaceBetween={16}
//             effect='cards'
//             slidesPerView={1}
//             // breakpoints={{
//             //   320: {
//             //     slidesPerView: 1,
//             //     spaceBetween: 10,
//             //   },
//             //   1024: {
//             //     slidesPerView: 2,
//             //     spaceBetween: 16,
//             //   },
//             // }}
//             autoplay={{
//               delay: 5000,
//               disableOnInteraction: false,
//             }}
//           >
//             {bonusBanners.map((el, index) => (
//               <SwiperSlide key={`slide-${index}`}>
//                 <Image
//                   src={el.image}
//                   alt={el.title}
//                   width={1000}
//                   height={1000}
//                   sizes='100vw'
//                   className='h-[344px] rounded-xl object-cover'
//                 />
//               </SwiperSlide>
//             ))}
//           </Swiper>
//         </div>
//       </div> */
// }

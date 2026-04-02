'use client'

import React, { useRef,useState } from 'react'
import type { Swiper as SwiperType } from 'swiper'

import BonusBanner from './bonus-banner'

// Wrapper component that manages pagination state
export default function BonusBannerWithPagination() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [totalSlides, setTotalSlides] = useState(0)
  const swiperRef = useRef<SwiperType | null>(null)

  const goToSlide = (index: number) => {
    if (swiperRef.current) {
      swiperRef.current.slideToLoop(index)
    }
  }

  return (
    <>
      <BonusBanner
        onSwiperInit={(swiper) => {
          swiperRef.current = swiper
        }}
        onSlideChange={(index) => setCurrentSlide(index)}
        onBannersLoad={(count) => setTotalSlides(count)}
      />
      
      {/* Pagination Dots - Between BonusBanner and next component (Desktop only) */}
      {totalSlides > 1 && (
        <div className='my-6 hidden justify-center gap-2 lg:flex'>
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                currentSlide === index
                  ? 'bg-white'
                  : 'bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </>
  )
}


import Image from 'next/image'
import React, { useState } from 'react'

import { Skeleton } from '@/components/ui/skeleton'

import SlotMobileBannerGif from '@/assets/banner/slots.gif'
import SlotMobileBanner from '@/assets/banner/slots-mob.png'

const SlotBanner = () => {
  const [isLoadingDesktop, setIsLoadingDesktop] = useState(true)
  const [isLoadingMobile, setIsLoadingMobile] = useState(true)

  return (
    <div className='aspect-[1242/500] flex-1 lg:aspect-[2.91]'>
      <div className='relative hidden h-full md:block'>
        {isLoadingDesktop && (
          <Skeleton className='absolute inset-0 rounded-lg' />
        )}
        <Image
          src={SlotMobileBannerGif}
          alt='slots game'
          className={`rounded-lg object-cover ${isLoadingDesktop ? 'invisible' : 'visible'}`}
          onLoad={() => setIsLoadingDesktop(false)}
          fill
          sizes='100vw'
          priority
        />
      </div>

      <div className='relative block h-full md:hidden'>
        {isLoadingMobile && (
          <Skeleton className='absolute inset-0 rounded-lg' />
        )}
        <Image
          src={SlotMobileBanner}
          alt='slots game'
          className={`rounded-lg object-cover ${isLoadingMobile ? 'invisible' : 'visible'}`}
          onLoad={() => setIsLoadingMobile(false)}
          fill
          sizes='100vw'
          priority
        />
      </div>
    </div>
  )
}

export default SlotBanner

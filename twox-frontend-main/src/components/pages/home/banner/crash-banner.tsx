import Image from 'next/image'
import React, { useState } from 'react'

import { Skeleton } from '@/components/ui/skeleton'

import CrashMobileBannerGif from '@/assets/banner/crash.gif'
import CrashMobileBanner from '@/assets/banner/crash-mob.png'

const CrashBanner = () => {
  const [isLoadingDesktop, setIsLoadingDesktop] = useState(true)
  const [isLoadingMobile, setIsLoadingMobile] = useState(true)

  return (
    <div className='aspect-[1242/500] flex-1 lg:aspect-[2.91]'>
      <div className='relative hidden h-full md:block'>
        {isLoadingDesktop && (
          <Skeleton className='absolute inset-0 rounded-lg' />
        )}
        <Image
          src={CrashMobileBannerGif}
          alt='crash'
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
          src={CrashMobileBanner}
          alt='crash'
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

export default CrashBanner

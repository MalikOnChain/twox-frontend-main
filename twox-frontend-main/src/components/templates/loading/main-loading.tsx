'use client'

import Image, { StaticImageData } from 'next/image'
import React, { memo } from 'react'

import { getLogo } from '@/lib/logo'
import { cn } from '@/lib/utils'

const MainLoading = ({
  className = '',
  logoImg,
}: {
  className?: string
  logoImg?: string | StaticImageData
}) => {
  const { logo } = getLogo('easter')

  return (
    <div
      className={cn(
        'fixed left-0 top-0 z-[50] flex h-screen w-screen items-center justify-center bg-dark-grey',
        className
      )}
    >
      <div className='relative animate-pulse'>
        <Image
          src={logoImg || logo}
          alt='Loading...'
          width={200}
          height={133}
          className='object-contain'
          priority
        />
      </div>
    </div>
  )
}

export default memo(MainLoading)

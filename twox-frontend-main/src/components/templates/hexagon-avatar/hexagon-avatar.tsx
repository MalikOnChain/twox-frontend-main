import Image, { ImageProps } from 'next/image'
import React from 'react'

import { cn } from '@/lib/utils'

const HexagonAvatar = ({
  src,
  alt,
  className,
}: {
  src: ImageProps['src']
  alt: ImageProps['alt']
  className?: string
}) => {
  return (
    <div className='relative'>
      <div className='hex-mask absolute inset-[-2px] bg-white/15' />
      <div
        className={cn(
          'hex-mask relative h-9 w-8 min-w-8 bg-secondary-600',
          className
        )}
      >
        <Image
          src={src}
          alt={alt}
          className='hex-mask h-full w-full object-cover'
          width={0}
          height={0}
          sizes='100vw'
        />
      </div>
    </div>
  )
}

export default HexagonAvatar

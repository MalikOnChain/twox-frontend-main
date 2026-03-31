import Image, { ImageProps } from 'next/image'
import React, { useState } from 'react'

import { useInitialSettingsContext } from '@/context/initial-settings-context'
import { cn } from '@/lib/utils'

interface NextImageProps {
  src: ImageProps['src']
  alt: string
  width?: string
  height?: string
  className?: string
  containerClassName?: string
  priority?: boolean
  objectFit?:
    | 'object-contain'
    | 'object-cover'
    | 'object-fill'
    | 'object-none'
    | 'object-scale-down'
}

const NextImage: React.FC<NextImageProps> = ({
  src,
  alt,
  width = 'w-full',
  height = 'h-64',
  className = '',
  priority = false,
  objectFit = 'object-cover',
  containerClassName = '',
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<boolean>(false)

  const { settings } = useInitialSettingsContext()

  const handleLoad = (): void => {
    setIsLoading(false)
  }

  const handleError = (): void => {
    setIsLoading(false)
    setError(true)
  }

  return (
    <div className={`relative ${width} ${height} ${containerClassName}`}>
      {isLoading && (
        <div className='absolute inset-0 flex items-center justify-center bg-accent'>
          <Image
            width={0}
            height={0}
            sizes='100vw'
            src={settings.socialMediaSetting.logo}
            alt='logo'
            className='h-10 w-auto'
          />
        </div>
      )}

      {error ? (
        <div className='absolute inset-0 flex items-center justify-center bg-gray-100'>
          <span className='text-sm text-gray-500'>Failed to load image</span>
        </div>
      ) : (
        <Image
          width={0}
          height={0}
          sizes='100vw'
          src={src}
          alt={alt}
          className={cn(
            objectFit,
            width,
            height,
            'opacity-100',
            {
              'opacity-0': isLoading,
            },
            className
          )}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? 'eager' : 'lazy'}
        />
      )}
    </div>
  )
}

export default NextImage

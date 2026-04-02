import type { StaticImageData } from 'next/image'
import Image from 'next/image'
import { ReactNode } from 'react'

import DetailsButton from './details-button'

interface FeatureCardProps {
  icon: string | StaticImageData | ReactNode
  iconAlt?: string
  title: string
  description: string
  onDetailsClick?: () => void
  detailsText?: string
}

export default function FeatureCard({
  icon,
  iconAlt = 'Feature Icon',
  title,
  description,
  onDetailsClick,
  detailsText = 'Details',
}: FeatureCardProps) {
  return (
    <div
      className='relative backdrop-blur-md flex flex-col items-center justify-center text-center w-full max-w-[636px] md:w-[636px] md:px-8 md:py-10 md:gap-8 md:min-h-[428px] lg:min-h-[428px]'
      style={{
        background: 'linear-gradient(to bottom, rgba(225, 230, 187, 0.3), rgba(0, 0, 0, 0.8))',
        backdropFilter: 'blur(8px)',
        border: '1px solid #4A4A4AB2',
        borderRadius: '24px',
        padding: '24px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
      }}
    >
      {/* Icon */}
      <div className='flex h-24 w-24 items-center justify-center md:h-[136px] md:w-[136px]'>
        {typeof icon === 'string' || (typeof icon === 'object' && icon !== null && 'src' in icon) ? (
          <div className='relative h-full w-full'>
            <Image src={icon as string | StaticImageData} alt={iconAlt} fill className='object-contain' quality={90} />
          </div>
        ) : (
          icon
        )}
      </div>

      {/* Title */}
      <h3
        className='text-lg font-bold text-white md:text-[24px]'
        style={{
          fontFamily: 'var(--font-stolzl), sans-serif',
          fontWeight: 700,
        }}
      >
        {title}
      </h3>

      {/* Description */}
      <p
        className='text-sm text-white/90 md:text-base'
        style={{
          fontFamily: 'var(--font-satoshi), sans-serif',
          fontWeight: 400,
          fontSize: 'inherit',
          lineHeight: '120%',
        }}
      >
        {description}
      </p>

      {/* Details Button */}
      <DetailsButton onClick={onDetailsClick}>{detailsText}</DetailsButton>
    </div>
  )
}


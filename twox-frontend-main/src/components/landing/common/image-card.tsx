import Image from 'next/image'
import type { StaticImageData } from 'next/image'

interface ImageCardProps {
  image: string | StaticImageData
  imageAlt: string
  title: string
  description: string
  width: number | string
  height: number | string
}

export default function ImageCard({ image, imageAlt, title, description, width, height }: ImageCardProps) {
  const widthStyle = typeof width === 'number' ? `${width}px` : width
  const heightStyle = typeof height === 'number' ? `${height}px` : height

  return (
    <div
      className='relative overflow-hidden rounded-2xl w-full'
      style={{
        width: widthStyle,
        height: heightStyle,
        border: '0.5px solid #D1D1D150',
      }}
    >
      <div className='relative h-full w-full'>
        <Image src={image} alt={imageAlt} fill className='object-cover object-center' quality={90} />
      </div>
      <div className='absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 md:p-6'>
        <h3
          className='mb-2 text-base font-bold text-white md:text-[20px]'
          style={{
            fontFamily: 'var(--font-stolzl), sans-serif',
            fontWeight: 700,
          }}
        >
          {title}
        </h3>
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
      </div>
    </div>
  )
}


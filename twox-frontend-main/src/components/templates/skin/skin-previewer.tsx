'use client'

import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import NextImage from '@/components/ui/image'

import { SkinItem } from '@/types/skins'

// This component displays a single skin item in the grid
const SkinPreviewer = ({ item }: { item: SkinItem }) => {
  // Format price with currency symbol
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(item.price)

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-md bg-card transition-all duration-300',
        'border border-border hover:border-primary',
        'flex flex-col items-center'
      )}
    >
      {/* Skin Image */}
      <div className='relative aspect-square w-full overflow-hidden'>
        <NextImage
          src={item.image || '/images/placeholder-skin.png'}
          alt={item.name}
          width='w-full'
          height='h-auto'
          containerClassName='aspect-[1]'
          className='object-contain transition-transform duration-300 group-hover:scale-110'
        />
      </div>

      {/* Skin Details */}
      <div className='w-full p-3'>
        <h3 className='line-clamp-2 min-h-[2.5rem] text-sm font-medium'>
          {item.name}
        </h3>

        <div className='mt-2 flex items-center justify-between'>
          <span className='font-bold text-primary'>{formattedPrice}</span>

          {/* Buy button shows on hover */}
          <Button size='sm'>Buy</Button>
        </div>
      </div>
    </div>
  )
}

export default SkinPreviewer

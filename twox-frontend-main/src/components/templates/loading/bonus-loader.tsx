import React from 'react'

import { cn } from '@/lib/utils'

import { Skeleton } from '../../ui/skeleton'

const BonusLoader = ({ className = '' }: { className?: string }) => {
  return (
    <div
      className={cn(
        'grid gap-4 md:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-4',
        className
      )}
    >
      {[...Array(12)].map((item, index) => (
        <Skeleton
          key={`skeleton-${index}`}
          className='aspect-[1] max-h-[202px] w-full rounded-lg md:rounded-2xl'
        />
      ))}
    </div>
  )
}

export default BonusLoader

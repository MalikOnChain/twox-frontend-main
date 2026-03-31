import React from 'react'

import { cn } from '@/lib/utils'

import { Skeleton } from '@/components/ui/skeleton'

const PromotionLoader = ({ className = '' }: { className?: string }) => {
  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4',
        className
      )}
    >
      <div className='flex flex-col gap-2 rounded-lg bg-background-third pb-2'>
        <Skeleton className='aspect-[1] w-full rounded-t-lg' />
        <Skeleton className='ml-2 h-4 w-24' />
      </div>
    </div>
  )
}

export default PromotionLoader

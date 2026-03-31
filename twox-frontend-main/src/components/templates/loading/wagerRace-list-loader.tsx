import React from 'react'

import { cn } from '@/lib/utils'

import { Skeleton } from '../../ui/skeleton'

const WagerRaceListLoader = ({ className = '' }: { className?: string }) => {
  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3',
        className
      )}
    >
      {[...Array(3)].map((item, index) => {
        let visibleClass = ''

        if (index > 1) {
          visibleClass = 'hidden xl:block'
        } else if (index > 0) {
          visibleClass = 'hidden md:block'
        }

        return (
          <div key={`skeleton-${index}`} className={cn(visibleClass)}>
            <Skeleton className='aspect-[450/220] w-full rounded-2xl' />
          </div>
        )
      })}
    </div>
  )
}

export default WagerRaceListLoader

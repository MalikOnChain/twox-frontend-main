import React from 'react'

import { cn } from '@/lib/utils'

import { Skeleton } from '../../ui/skeleton'

import { TProviderGameType } from '@/types/game'

const GameGridLoader = ({
  className = '',
  type,
}: {
  className?: string
  type: TProviderGameType
}) => {
  return (
    <div
      className={cn(
        `grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 md:gap-3 xl:grid-cols-${
          type === 'live' ? '6' : '7'
        }`,
        className
      )}
    >
      {[...Array(28)].map((item, index) => {
        let visibleClass = ''

        if (index > 7) {
          visibleClass = 'hidden xl:block'
        } else if (index > 5) {
          visibleClass = 'hidden md:block'
        } else if (index > 3) {
          visibleClass = 'hidden sm:block'
        }

        return (
          <div key={`skeleton-${index}`} className={cn(visibleClass)}>
            <Skeleton className='aspect-[155/200] w-full rounded-2xl' />
            {/* <Skeleton className='mt-2 hidden h-4 w-[75%] rounded-2xl md:block' /> */}
          </div>
        )
      })}
    </div>
  )
}

export default GameGridLoader

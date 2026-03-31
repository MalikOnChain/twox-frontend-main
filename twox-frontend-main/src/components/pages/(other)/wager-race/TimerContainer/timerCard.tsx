'use client'

import React from 'react'

import { Skeleton } from '@/components/ui/skeleton'
const TimerCard = ({ unit, value }: { unit: string; value: number }) => {
  return (
    <div className='bg-blur-white-1 md:h-21 md:w-21 h-16 w-16 rounded-2xl'>
      <div className='bg-blur-white-3 my-0.5 h-full w-full rounded-2xl'>
        <div className='flex flex-col items-center justify-center gap-1 p-2.5 text-center text-secondary-text'>
          <div className='text-s-sm font-medium md:text-xs'>{unit}</div>
          {value ? (
            <div className='md:text-3.2xl font-satoshi text-2xl font-black'>
              {value}
            </div>
          ) : (
            <Skeleton className='h-8 w-10' />
          )}
        </div>
      </div>
    </div>
  )
}

export default TimerCard

import React from 'react'

import InputLoader from '@/components/templates/loading/input-loader'
import { Skeleton } from '@/components/ui/skeleton'

const WithdrawContentLoader = () => {
  return (
    <div className='grid w-full grid-rows-1 gap-3 overflow-hidden bg-background p-0 md:max-w-[575px]'>
      <div className='flex h-full w-full flex-col gap-2 overflow-y-auto'>
        <InputLoader />
        <InputLoader />
        <InputLoader />

        <div className='flex justify-between'>
          <Skeleton className='h-5 w-[30px]' />
          <Skeleton className='h-5 w-[40px]' />
        </div>

        <Skeleton className='h-11 w-full' />

        <Skeleton className='h-5 w-full' />
      </div>
    </div>
  )
}

export default WithdrawContentLoader

import React from 'react'

import { Skeleton } from '@/components/ui/skeleton'

const InputLoader = () => {
  return (
    <div className='flex w-full flex-col gap-0.5'>
      <Skeleton className='h-4 w-[50px]' />
      <Skeleton className='h-12 w-full' />
    </div>
  )
}

export default InputLoader

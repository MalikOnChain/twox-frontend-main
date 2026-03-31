import React from 'react'

import { Skeleton } from '../../ui/skeleton'

const GamePlayPageLoader = () => {
  return (
    <div className='mx-auto w-full max-w-5xl space-y-4 md:space-y-8'>
      <Skeleton className='h-9 w-[150px]' />
      <Skeleton className='h-[576px] w-full max-w-full' />
    </div>
  )
}

export default GamePlayPageLoader

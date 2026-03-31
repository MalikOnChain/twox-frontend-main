import React from 'react'

import { Skeleton } from '../../ui/skeleton'

const VipRankLoader = () => {
  return (
    <div className='relative flex flex-col items-center'>
      <Skeleton className='mb-8 h-10 w-full max-w-[340px]' />
      <Skeleton className='mb-8 h-14 w-full max-w-[670px]' />

      <div className='relative grid w-full grid-cols-1 gap-4 px-8 md:grid-cols-2 md:px-12 lg:grid-cols-3'>
        {[...Array(3)].map((el, index) => (
          <Skeleton
            key={`ranking-loader-${index}`}
            className='mb-8 h-[300px] w-full'
          />
        ))}
      </div>
    </div>
  )
}

export default VipRankLoader

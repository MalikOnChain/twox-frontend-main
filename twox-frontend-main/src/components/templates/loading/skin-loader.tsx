'use client'

import { Skeleton } from '@/components/ui/skeleton'

// Skeleton loader for an individual skin card
export const SkinCardSkeleton = () => {
  return (
    <div className='overflow-hidden rounded-md border border-border'>
      {/* Image skeleton */}
      <Skeleton className='aspect-square w-full' />

      {/* Content skeletons */}
      <div className='p-3'>
        <Skeleton className='mb-2 h-4 w-full' />
        <Skeleton className='h-4 w-3/4' />

        <div className='mt-2 flex justify-between'>
          <Skeleton className='h-4 w-1/3' />
        </div>
      </div>
    </div>
  )
}

// Grid of skeleton loaders for the skins list
export const SkinGridLoader = () => {
  return (
    <div className='grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6'>
      {Array(12)
        .fill(0)
        .map((_, index) => (
          <SkinCardSkeleton key={index} />
        ))}
    </div>
  )
}

// Full page skeleton for initial loading
export const SkinPageLoader = () => {
  return (
    <div className='container mx-auto py-8'>
      <div className='mb-8 flex items-center justify-between'>
        <Skeleton className='h-10 w-32' />
        <Skeleton className='h-9 w-[250px]' />
      </div>

      <Skeleton className='mb-4 h-7 w-[230px]' />

      <SkinGridLoader />
    </div>
  )
}

export default SkinGridLoader

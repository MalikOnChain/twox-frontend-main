import React from 'react'

import GameGridLoader from './game-grid-loader'
import { Skeleton } from '../../ui/skeleton'

import { TProviderGameType } from '@/types/game'

const GamePageLoader = ({ type = 'video-slots' }: { type?: TProviderGameType }) => {
  return (
    <div>
      {/* <div className='mb-4 mt-4 flex items-center justify-end gap-2 md:mb-8 md:justify-between md:gap-3'>
        <Skeleton className='!h-8 flex-1' />
        <Skeleton className='!h-8 w-[156px]' />
      </div> */}

      <div className='custom-scrollbar -webkit-overflow-scrolling-touch mb-4 flex w-full justify-between gap-3 overflow-x-auto md:mb-5 md:gap-4'>
        <div className='flex gap-3'>
          <Skeleton className='h-7 w-[500px] md:h-8' />
        </div>
        <Skeleton className='!h-8 w-[156px]' />
      </div>

      <GameGridLoader type={type} />
    </div>
  )
}

export default GamePageLoader

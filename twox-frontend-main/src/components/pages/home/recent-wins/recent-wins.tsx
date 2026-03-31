'use client'

import React from 'react'

import LiveWins from '@/components/pages/home/recent-wins/live-wins'

const RecentWins = () => {
  return (
    <section className='relative'>
      {/* <div className='flex items-center gap-3'>
        <span className='flex size-3 items-center justify-center rounded-full bg-success/25'>
          <span className='flex size-1.5 items-center justify-center rounded-full bg-success shadow-0-0-12-0 shadow-success/40' />
        </span>
        <span className='text-sm'>Big Wins</span>
      </div> */}

      <div className='relative flex w-full items-center gap-2'>
        {/* <Image
          src={BigWinnerImage}
          alt='Big Winner'
          className='absolute left-0 top-1/2 z-50 max-w-32 -translate-y-1/2'
          sizes='100vw'
        /> */}

        <div className='ml-24 w-full'>
          <LiveWins />
        </div>
      </div>
      <div className='bg-big-winds-overlay absolute left-24 top-0 z-[1] h-full w-[300px] bg-gradient-to-r from-background to-background/0' />
      <div className='bg-big-winds-overlay absolute right-0 top-0 z-[1] h-full w-[137px] bg-gradient-to-l from-background to-background/0' />
    </section>
  )
}

export default RecentWins

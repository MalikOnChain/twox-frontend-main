import Image from 'next/image'
import React from 'react'

import { formatNumber } from '@/lib/number'

const LotteryCard = () => {
  const price = 10000
  return (
    <div className='flex items-center gap-2.5 rounded-lg bg-lottery-card px-2 py-2'>
      <Image
        src='/wheel-fortune.svg'
        alt='wheel-fortune'
        className='h-auto w-auto'
        sizes='100vw'
        width={0}
        height={0}
      />
      <span className='text-sm font-bold'>{`Lottery - $${formatNumber(price)}`}</span>
    </div>
  )
}

export default LotteryCard

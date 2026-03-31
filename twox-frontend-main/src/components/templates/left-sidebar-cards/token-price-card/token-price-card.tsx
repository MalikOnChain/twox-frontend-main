import React, { memo, useEffect, useState } from 'react'

import { cn } from '@/lib/utils'

import ArrowMoreDown from '@/assets/arrow-more-down.svg'
import ArrowMoreUp from '@/assets/arrow-more-up.svg'

const TokenPriceCard = () => {
  const [isUp, setIsUp] = useState(true)

  // Use setInterval to automatically toggle the trend
  useEffect(() => {
    const intervalId = setInterval(() => {
      setIsUp((prevIsUp) => !prevIsUp)
    }, 3000) // Toggle every 3 seconds

    // Clean up interval on component unmount
    return () => clearInterval(intervalId)
  }, [])

  return (
    <div
      className={cn(
        'flex gap-2 rounded-lg px-2 py-3',
        isUp ? 'bg-token-price-card-up' : 'bg-token-price-card-down'
      )}
    >
      {/* <Image
        src='/logo-symbol.webp'
        alt='logo'
        width={0}
        height={0}
        className='h-auto w-auto'
      /> */}

      <div className='flex flex-col font-bold'>
        <h6 className='text-sm'>BitStake Token BST</h6>
        <div className='flex items-center gap-1 text-xs'>
          <span className='text-secondary-text'>$0.0397</span>
          {isUp ? (
            <span className='flex items-center gap-0.5 text-success-500'>
              <ArrowMoreUp className='w-2.5' />
              <span>1.13%</span>
            </span>
          ) : (
            <span className='flex items-center gap-0.5 text-error'>
              <ArrowMoreDown className='w-2.5' />
              <span>1.11%</span>
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default memo(TokenPriceCard)

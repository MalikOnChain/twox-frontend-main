// import Coin from '@/assets/coin.svg'
import Image from 'next/image'
import { memo } from 'react'

import { cn } from '@/lib/utils'

import CoinImage from '@/assets/icons/coin.png'

const CoinIcon = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        'relative flex h-5 w-5 min-w-5 items-center justify-center',
        className
      )}
    >
      <Image
        src={CoinImage}
        alt='coin'
        className={cn(
          'h-5 w-5 filter transition-shadow duration-300 hover:shadow-xl',
          className
        )}
        width={20}
        height={20}
      />
      <Image
        src={CoinImage}
        alt='coin'
        className={cn('absolute top-0 h-5 w-5', className)}
        width={20}
        height={20}
      />
    </div>
  )
}

export default memo(CoinIcon)

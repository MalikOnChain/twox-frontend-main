import Image from 'next/image'

import { cn } from '@/lib/utils'

import BitCoin from '@/assets/images/coin-o.webp'
import Lock from '@/assets/lock-1.svg'
import SpreadVector from '@/assets/vector/spread-vector.webp'

interface BonusTierCardProps {
  bonus: {
    name: string
    amount: number
    description: string
  }
  disabled: boolean
}

const BonusTierCard = ({
  bonus: { name, amount, description },
  disabled,
}: BonusTierCardProps) => {
  return (
    <div className='relative flex min-w-[234px] items-center overflow-hidden rounded-2xl bg-background-secondary py-3 pr-2 sm:py-[17px]'>
      <div className='relative h-0 w-[88px] items-center justify-center'>
        <div
          className={cn(
            'absolute bottom-0 right-0 flex w-[278px] translate-x-[37%] translate-y-[50%] items-center justify-center',
            disabled && 'opacity-40'
          )}
        >
          <Image
            src={SpreadVector}
            alt='spread-vector'
            className='h-auto w-full opacity-[.32]'
            width={0}
            height={0}
            sizes='100vw'
          />
          <div className='absolute flex -translate-x-[10%] -translate-y-[2%] items-center justify-center'>
            <Image
              src={BitCoin}
              alt='bitcoin'
              className='h-12 w-12'
              width={0}
              height={0}
              sizes='100vw'
            />

            <span
              className={cn(
                'absolute rounded-full bg-primary/60 blur-[50px]',
                'h-[44px] w-[60px]'
              )}
            />
          </div>
        </div>
      </div>
      <div
        className={cn('flex flex-1 flex-col gap-2', disabled && 'opacity-40')}
      >
        <div className='text-[10px] font-medium text-secondary-text'>
          {name}
        </div>
        <div className='text-base font-bold text-foreground'>
          {amount} Tokens
        </div>
        <div className='text-xs text-secondary-text'>{description}</div>
      </div>

      {disabled && (
        <div className='absolute right-0 top-0 flex h-full w-full items-center justify-center'>
          <span className='rounded-[6px] border-2 border-secondary-450 bg-secondary px-2 py-[7px]'>
            <Lock className='h-[17px] w-[15px]' />
          </span>
        </div>
      )}
    </div>
  )
}

export default BonusTierCard

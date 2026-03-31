import Image from 'next/image'
import { memo, useEffect, useState } from 'react'

import { cn } from '@/lib/utils'

import CoinIcon from '@/components/templates/icons/coin-icon'

import MultiplierIcon from '@/assets/multiplier-icon.svg'

import { Bet, GameType } from '@/types/bet'

interface TableRowProps {
  username: string
  time: string
  game: GameType
  avatar: string
  betAmount: number
  payout: number
  isEven: boolean
  multiplier: number
  gameIcon: string
}

interface TableColumnsProps {
  username: string
  time: string
  game: GameType
  avatar: string
  betAmount: number
  payout: number
  multiplier: number
  gameIcon: string
}

// Basic usage example
const styles = {
  betRow: {
    base: 'w-full grid grid-cols-9 lg:grid-cols-11 py-3 text-sm text-white px-4 lg:px-6 bg-muted/50',
    column: 'flex items-center gap-2 col-span-2',
  },
  animations: {
    container: 'transition-all duration-300 ease-in-out',
    row: 'transform transition-all duration-300 ease-in-out',
    value: 'transition-all duration-300 ease-in-out',
    highlight: 'animate-highlight',
  },
} as const

const AnimatedValue = memo(
  ({
    value,
    prefix = '',
    suffix = '',
    className,
  }: {
    value: number
    prefix?: string
    suffix?: string
    className?: string
  }) => {
    const [displayValue, setDisplayValue] = useState(value)
    const [isHighlighted, setIsHighlighted] = useState(false)

    useEffect(() => {
      if (value !== displayValue) {
        setIsHighlighted(true)
        setDisplayValue(value)
        const timer = setTimeout(() => setIsHighlighted(false), 1000)
        return () => clearTimeout(timer)
      }
    }, [value, displayValue])

    return (
      <span
        className={cn(
          'transition-all duration-300',
          isHighlighted && styles.animations.highlight,
          className
        )}
      >
        {prefix}
        {displayValue.toFixed(2)}
        {suffix}
      </span>
    )
  }
)

AnimatedValue.displayName = 'AnimatedValue'

const TableColumns = memo(
  ({
    username,
    time,
    avatar,
    betAmount,
    payout,
    multiplier,
    gameIcon,
  }: TableColumnsProps) => {
    return (
      <>
        <div
          className={cn(styles.betRow.column, 'gap-3 text-white', 'truncate')}
        >
          <Image
            width={0}
            height={0}
            src={avatar}
            alt='avatar'
            className='h-4.5 w-4.5 rounded-full lg:h-8 lg:w-8 lg:rounded-lg'
            sizes='100vw'
          />
          <span className='min-w-0 truncate text-xs font-medium lg:text-sm'>
            {username}
          </span>
        </div>
        <div className='col-span-1 flex items-center gap-3'>
          <Image
            width={0}
            height={0}
            src={gameIcon}
            alt='game'
            className='h-12 w-12 rounded-xl'
            sizes='100vw'
          />
        </div>

        <div className='col-span-2 hidden items-center gap-2 pl-2 text-secondary-text lg:flex'>
          {time}
        </div>

        <div className={cn(styles.betRow.column, styles.animations.value)}>
          <CoinIcon className='h-4 w-4 lg:h-5 lg:w-5' />
          <AnimatedValue value={betAmount} prefix='R$' />
        </div>
        <div
          className={cn(
            styles.betRow.column,
            styles.animations.value,
            'justify-end sm:justify-start'
          )}
        >
          <MultiplierIcon className='hidden h-4 w-4 lg:block lg:h-5 lg:w-5' />
          <AnimatedValue value={multiplier} prefix='x' />
        </div>
        <div className={cn(styles.betRow.column, styles.animations.value)}>
          <CoinIcon className='h-4 w-4 lg:h-5 lg:w-5' />
          <AnimatedValue
            value={payout}
            prefix='R$'
            className='text-success-400'
          />
        </div>
      </>
    )
  }
)

TableColumns.displayName = 'TableColumns'

const TableRow = memo(
  ({
    username,
    time,
    game,
    avatar,
    betAmount,
    payout,
    multiplier,
    gameIcon,
  }: Omit<TableRowProps, 'isEven'>) => {
    return (
      <div
        className={cn(
          styles.betRow.base,
          styles.animations.row,
          // 'min-w-[750px]',
          'gap-2'
        )}
      >
        <TableColumns
          avatar={avatar}
          betAmount={betAmount}
          game={game}
          multiplier={multiplier}
          payout={payout}
          time={time}
          username={username}
          gameIcon={gameIcon}
        />
      </div>
    )
  }
)

TableRow.displayName = 'TableRow'

const TableBody = memo(({ bets }: { bets: Bet[] }) => {
  return (
    <div
      className={cn(
        'table-body relative w-full bg-background-fourth',
        styles.animations.container
      )}
    >
      <div className='table-rows-container max-h-[450px] w-full'>
        {bets.map((bet) => (
          <TableRow
            avatar={bet.user.avatar}
            betAmount={bet.betAmount}
            game={bet.game as unknown as GameType}
            gameIcon={bet.metadata.banner}
            multiplier={bet.multiplier}
            payout={bet.payout}
            time={bet.time}
            username={bet.user.username}
            key={bet.id}
          />
        ))}
      </div>
      <div
        className={cn(
          'pointer-events-none absolute bottom-0 left-0 right-0',
          'h-24 w-full',
          'bg-gradient-to-t from-background to-background/40'
        )}
      />
    </div>
  )
})

TableBody.displayName = 'TableBody'

export default TableBody

import Image from 'next/image'
import React, { memo } from 'react'

import { cn } from '@/lib/utils'

import CoinIcon from '@/components/templates/icons/coin-icon'

import UserGroupIcon from '@/assets/games/crash/icons/user-group.svg'

interface ListBodyWinProps {
  players: any[]
  topWinners: any[]
  totalBetAmount: number
  winningUsers: any[]
}

const ListBodyWin = ({
  players,
  topWinners,
  totalBetAmount,
  winningUsers,
}: ListBodyWinProps) => {
  return (
    <div
      className={cn(
        'bet-list-body',
        'w-full flex-1',
        'rounded-bl-[20px] rounded-br-[20px]',
        'px-2 py-3'
      )}
    >
      <div
        className={cn(
          'status-row',
          'flex items-center justify-between gap-2',
          'h-10 w-full',
          'bg-secondary',
          'mb-2 rounded-md px-2'
        )}
      >
        <div className='user-group flex items-center gap-2'>
          <UserGroupIcon />
          <span className='text-sm font-medium'>
            {winningUsers?.length} / {players?.length}
          </span>
        </div>
        <div className='total-bet flex items-center gap-2'>
          <CoinIcon />
          <span className='text-sm font-medium'>
            {totalBetAmount.toFixed(2)}
          </span>
        </div>
      </div>

      <div className={cn('bet-list-body-content')}>
        <div className='header mb-1 grid grid-cols-11 gap-2 px-2 text-secondary-text'>
          <span className='col-span-5'>Player</span>
          <span className='col-span-3'>Wagered</span>
          <span className='col-span-3'>Won</span>
        </div>

        <div className='body custom-scrollbar relative h-[460px] max-h-[460px] overflow-y-hidden'>
          {topWinners &&
            topWinners.length > 0 &&
            topWinners.map((player: any, index: number) => (
              <div
                className={cn(
                  'player-item grid grid-cols-11 gap-2 px-2',
                  index % 2 === 1 ? 'bg-muted' : 'bg-secondary',
                  'flex-center h-10',
                  'animate-enter-1'
                )}
                key={index}
              >
                <div className='username col-span-5 flex max-w-full items-center gap-2 truncate pr-1'>
                  <Image
                    src={player?.avatar}
                    alt='avatar'
                    width={20}
                    height={20}
                    className='rounded-full'
                  />
                  <span className='truncate'>{player.username} </span>
                </div>
                <div className='wagered col-span-3 flex items-center gap-1'>
                  <CoinIcon />
                  <span className='font-bold text-success-300'>
                    -{player?.totalBets.toFixed(2)}
                  </span>
                </div>
                <div className='won col-span-3 flex items-center gap-1'>
                  <CoinIcon />
                  <span className='font-bold text-error'>
                    +{player?.totalWinnings.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          <div
            className={cn(
              'pointer-events-none absolute bottom-0 left-0 right-0',
              'h-24 w-full',
              'to-background/40} bg-gradient-to-t from-background'
            )}
          />
        </div>
      </div>
    </div>
  )
}

export default memo(ListBodyWin)

'use client'

import { clsx } from 'clsx'
import Image from 'next/image'
import { memo } from 'react'

import { useProfile } from '@/context/data/profile-context'
import { useInitialSettingsContext } from '@/context/initial-settings-context'

import { cn } from '@/lib/utils'

import CoinIcon from '@/components/templates/icons/coin-icon'
import UserAvatar from '@/components/ui/user-avatar'

import CrownIcon from '@/assets/crown.svg'
import LightIcon from '@/assets/light.svg'

import { IUserRankingInfo } from '@/types/wagerRace'

interface IWinnerCardProps {
  winner: IUserRankingInfo
  classGroup: {
    badgeColor: string
    textShadow: string
    textColor: string
    decorationColor: string
    cardBackground: string
    levelBackground: string
    margin: string
  }
}

const WinnerCard = ({ winner, classGroup }: IWinnerCardProps) => {
  const { userRankStatus } = useProfile()
  const { getRankIcon } = useInitialSettingsContext()
  if (!userRankStatus) return null
  const rankIcon = getRankIcon(userRankStatus.currentTier)

  return (
    <div
      className={cn(
        'bg-wager-card relative col-span-1 m-auto flex w-full flex-col overflow-hidden rounded-2xl p-3 md:w-60',
        classGroup.margin
      )}
    >
      {/* top decoration */}
      <div
        className={cn(
          'absolute left-0 top-0 h-1 w-full',
          classGroup.decorationColor
        )}
      />

      {/* light decoration */}
      <div className='absolute left-0 top-0 h-full w-full'>
        <LightIcon
          className={clsx(
            'h-full w-full',
            classGroup.textColor,
            classGroup.cardBackground
          )}
        />
      </div>

      {/* user information */}
      <div className='mb-2 flex flex-col items-center'>
        {/* crown icon */}
        <div className='flex items-center justify-center'>
          <CrownIcon className={cn('h-5.5 w-auto', classGroup.textColor)} />
        </div>

        {/* user avatar */}
        <UserAvatar
          src={winner.avatar}
          alt={winner.username}
          level={userRankStatus.currentLevel}
          className={{
            avatarClassName: clsx('h-19.5 w-17.5'),
            levelClassName: clsx(
              'h-9 w-8 text-sm font-bold text-white',
              classGroup.levelBackground
            ),
          }}
        />
        {rankIcon && (
          <div className='flex flex-row items-center justify-center gap-2'>
            <Image
              src={rankIcon}
              alt='rankIcon'
              width={0}
              height={0}
              sizes='100vw'
              className='h-7.5 w-auto'
            />
            <span
              className={clsx(
                'text-lg font-normal',
                classGroup.textShadow,
                classGroup.textColor
              )}
            >
              {winner.username}
            </span>
          </div>
        )}
      </div>

      {/* user place badge*/}
      <div
        className={clsx(
          'absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg',
          classGroup.badgeColor,
          classGroup.textColor
        )}
      >
        <div className='flex flex-row items-baseline justify-center'>
          <span className='text-base font-bold'>{winner.place}</span>
          <span className='text-xs font-normal'>st</span>
        </div>
      </div>

      {/* user total wagered */}
      <div className='mb-5 flex w-full flex-row items-center justify-between gap-2'>
        <div className='text-sm font-medium text-foreground'>Wager Amount</div>
        <div className='flex flex-row items-center justify-between gap-1 text-sm font-bold text-foreground'>
          <CoinIcon className='!blur-none' />
          <span className='text-sm font-bold'>
            {winner.totalWagered?.toFixed(2) || 'n/a'}
          </span>
        </div>
      </div>

      {/* user prize */}
      <div
        className={cn(
          'flex w-full flex-row items-center justify-between gap-2 rounded-lg p-2',
          classGroup.badgeColor
        )}
      >
        <div className='text-lg font-bold uppercase text-foreground'>Prize</div>
        <div className='flex flex-row items-center justify-between gap-1 text-sm font-bold'>
          <CoinIcon className='!blur-none' />
          <span className='text-lg font-bold text-success-500'>
            {winner.prize?.toFixed(2) || 'n/a'}
          </span>
        </div>
      </div>
    </div>
  )
}

export default memo(WinnerCard)

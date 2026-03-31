'use client'

import { clsx } from 'clsx'
import Image from 'next/image'
import { memo } from 'react'

import { cn } from '@/lib/utils'

import CrownIcon from '@/assets/crown.svg'
import LightIcon from '@/assets/light.svg'

import { GameIcons } from '@/types/bet'

interface IPlayerCardProps {
  player: {
    game: {
      type: string
    }
    user: {
      username: string
      avatar: string
    }
  }
  classGroup: {
    textColor: string
    decorationColor: string
    cardBackground: string
  }
}

const PlayerCard = ({ player, classGroup }: IPlayerCardProps) => {
  const Icon = GameIcons[player.game.type as keyof typeof GameIcons]
  return (
    <div
      className={cn(
        'bg-wager-card relative col-span-1 m-auto flex w-full flex-col overflow-hidden rounded-2xl p-3.5',
        classGroup.cardBackground
      )}
    >
      {/* left decoration */}
      <div
        className={cn(
          'absolute left-0 top-0 h-full w-1',
          classGroup.decorationColor
        )}
      />

      {/* light decoration */}
      <div className='absolute -right-[35%] top-0 h-full w-full'>
        <LightIcon className={clsx('h-full w-full', classGroup.textColor)} />
      </div>

      <div className='border-blur-white-3 grid grid-cols-3 gap-1 border-b-2 pb-3.5'>
        <div className='flex items-center justify-start text-sm text-secondary-text'>
          Game
        </div>
        <div className='flex items-center justify-center text-sm text-secondary-text'>
          User
        </div>
        <div className='flex items-center justify-end'>
          <CrownIcon className={cn('max-h-5 w-auto', classGroup.textColor)} />
        </div>
      </div>

      <div className='grid grid-cols-3 gap-1 pt-3.5'>
        <div className='flex items-center justify-start gap-1 text-sm text-secondary-text'>
          <Icon className='size-4 text-secondary-text' />
          <span className='text-sm text-foreground'>{player.game.type}</span>
        </div>
        <div className='flex items-center justify-center gap-1'>
          <Image
            src={player.user.avatar}
            alt={player.user.username}
            width={0}
            height={0}
            sizes='100vw'
            className='size-5 rounded-full'
          />
          <span className='line-clamp-1 text-sm text-foreground'>
            {player.user.username}
          </span>
        </div>
        <div />
      </div>
    </div>
  )
}

export default memo(PlayerCard)

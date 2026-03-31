import Image from 'next/image'
import Link from 'next/link'
import { useMemo } from 'react'

import { GAME_CARD_CONTENT } from '@/lib/games/games'
import { cn } from '@/lib/utils'

import { Badge } from '@/components/ui/badge'

import SpreadVector from '@/assets/vector/spread-vector.webp'

import { GameCategory } from '@/types/bet'

const GameCard = ({
  className = '',
  type,
}: {
  className?: string
  type:
    | (typeof GameCategory)[keyof typeof GameCategory]
    | 'wager-race'
    | 'lottery'
}) => {
  const title = GAME_CARD_CONTENT[type].title
  const description = GAME_CARD_CONTENT[type].description
  const shortDescription = GAME_CARD_CONTENT[type].shortDescription
  const gameImage = GAME_CARD_CONTENT[type].gameImage
  const disabled = GAME_CARD_CONTENT[type].disabled
  const href = GAME_CARD_CONTENT[type].href

  const classes = useMemo(() => {
    if (type === GameCategory.CASES) {
      return {
        spreadVector:
          'w-[396px] xl:w-[570px] translate-x-[33%] xl:translate-x-[30%] translate-y-[40%]',
        bubble: 'w-[129px] h-[93px] xl:h-[208px] xl:w-[150px]',
        gameImage: 'w-[156px] xl:w-[260px]',
      }
    }

    if (type === 'lottery') {
      return {
        spreadVector:
          'w-[425px] xl:w-[405px] translate-x-[45%] translate-y-[42%] xl:translate-x-[37%] xl:translate-y-[35%]',
        bubble: 'h-[84.5px] w-[117px] xl:h-[136px] xl:w-[100px]',
        gameImage: 'w-[143px] xl:w-[207px]',
      }
    }

    if (type === 'wager-race') {
      return {
        spreadVector:
          'w-[360px]  xl:w-[405px] translate-x-[40%] translate-y-[40%] xl:translate-x-[35%] xl:translate-y-[34%]',
        bubble: 'h-[84.5px] w-[117px] xl:h-[138px] xl:w-[100px]',
        gameImage: 'w-[129px] xl:w-[198px] rotate-[15deg]',
      }
    }

    if (type === GameCategory.SLOTS) {
      return {
        spreadVector:
          'w-[522px] xl:w-[570px] translate-x-[35%] translate-y-[42%] xl:translate-x-[30%] xl:translate-y-[40%]',
        bubble: 'h-[93px] w-[129px] xl:h-[208px] xl:w-[150px]',
        gameImage: 'w-[138px] xl:w-[216px]',
      }
    }

    if (type === GameCategory.LIVE_CASINO) {
      return {
        spreadVector:
          'w-[396px] xl:w-[570px] translate-x-[33%] translate-y-[42%] xl:translate-x-[30%] xl:translate-y-[40%]',
        bubble: 'h-[93px] w-[129px] xl:h-[208px] xl:w-[150px]',
        gameImage: 'w-[184px] xl:w-[273px]',
      }
    }
    return {}
  }, [type])

  return (
    <Link
      href={disabled ? '#' : href}
      className={cn(
        'relative flex min-h-[120px] w-full flex-col gap-2 overflow-hidden rounded-[16px] bg-background-secondary p-3 transition-all duration-300 xl:h-[180px] xl:p-4',
        {
          'group cursor-pointer hover:bg-secondary-600': !disabled,
          'cursor-default': disabled,
        },
        className
      )}
    >
      {disabled && (
        <Badge variant='success' className='absolute right-2 top-2 z-[2]'>
          Coming
        </Badge>
      )}

      <div
        className={cn(
          'absolute bottom-0 right-0 flex items-center justify-center',
          classes.spreadVector
        )}
      >
        <Image
          src={SpreadVector}
          alt='spread-vector'
          className='h-auto w-full opacity-30'
          width={0}
          height={0}
          sizes='100vw'
        />
        <span
          className={cn(
            'absolute rounded-full bg-primary/60 blur-[40px]',
            classes.bubble
          )}
        />
        {gameImage && (
          <Image
            src={gameImage}
            alt='game-card'
            className={cn(
              'absolute h-auto transition-all duration-300 group-hover:rotate-12 group-hover:scale-110',
              classes.gameImage
            )}
            width={0}
            height={0}
            sizes='100vw'
          />
        )}
      </div>
      {type !== GameCategory.CASES && (
        <div className='absolute bottom-0 right-0 h-[100px] w-[450px] translate-y-[55%] rotate-[10deg] bg-background-secondary blur-[13.5px] transition-all duration-300 group-hover:bg-secondary-600' />
      )}
      <h4 className='z-[1] font-bold leading-[1] text-white max-xl:text-[18px]'>
        {title}
      </h4>
      <p className='z-[1] hidden max-w-[55%] text-xs font-medium text-secondary-text md:block'>
        {description}
      </p>
      <p className='z-[1] max-w-[55%] text-xs font-medium text-secondary-text md:hidden'>
        {shortDescription}
      </p>
    </Link>
  )
}

export default GameCard

import Link from 'next/link'
import React from 'react'

import { cn } from '@/lib/utils'

import { PlayButton } from '@/svg'

import NextImage from '../../../../ui/image'

import {
  ProviderGameType,
  TProviderGameItem,
  TProviderGameType,
} from '@/types/game'
const GamePreviewer = ({
  item,
  type,
  hideName,
  onImageLoad,
}: {
  item: TProviderGameItem
  type: TProviderGameType
  hideName?: boolean
  onImageLoad?: () => void
}) => {
  const to = `/${type === ProviderGameType.SLOT ? `slots` : `live-casino`}/${item.provider_code}/${item.game_code}`

  const handleImageLoad = () => {
    onImageLoad?.()
  }

  return (
    <div className='relative rounded-lg bg-background-third'>
      <Link
        href={to}
        className='group relative flex overflow-hidden rounded-lg'
      >
        <NextImage
          src={item.banner}
          alt={item.game_name}
          width='w-full'
          height='h-auto'
          containerClassName='aspect-[3/4]'
          className={cn(
            'aspect-[3/4]',
            'transition-all duration-300 md:group-hover:scale-110'
          )}
          // onLoad={handleImageLoad}
        />
        <div
          className={`pointer-events-none absolute inset-0 transition-opacity duration-300`}
        />
        <button
          className={`absolute bottom-4 left-1/2 z-10 translate-x-[-50%] translate-y-full opacity-0 transition-all duration-500 ease-in-out md:group-hover:bottom-1/2 md:group-hover:translate-y-1/2 md:group-hover:opacity-100`}
        >
          <PlayButton />
        </button>
      </Link>
    </div>
  )
}

export default GamePreviewer

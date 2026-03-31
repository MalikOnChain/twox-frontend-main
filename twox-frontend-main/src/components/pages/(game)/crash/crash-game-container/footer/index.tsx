import { Maximize2, Minimize2 } from 'lucide-react'
import Image from 'next/image'
import React, { memo } from 'react'

import { cn } from '@/lib/utils'

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

import Logo from '@/assets/brand/logo.webp'

import { GamePlayMode, ProviderGameType, TProviderGameType } from '@/types/game'

interface FooterProps {
  className?: string
  isFullscreen: boolean
  toggleFullscreen: () => void
  gamePlayMode: GamePlayMode
  onChangePlayMode: (mode: GamePlayMode) => void
  type: TProviderGameType
}

const Footer = ({
  className,
  isFullscreen,
  toggleFullscreen,
  gamePlayMode,
  onChangePlayMode,
  type,
}: FooterProps) => {
  const handleGamePlayModeChange = (value: GamePlayMode) => {
    if (value) {
      onChangePlayMode(value)
    }
  }

  return (
    <div
      className={cn(
        'relative h-[64px] w-full rounded-xl px-3',
        'flex items-center justify-between bg-background-secondary',
        className
      )}
    >
      <div className={cn('flex gap-5', 'text-secondary-text')}>
        {isFullscreen ? (
          <Minimize2 size={16} onClick={toggleFullscreen} />
        ) : (
          <Maximize2 size={16} onClick={toggleFullscreen} />
        )}
      </div>

      <Image
        src={Logo}
        alt='logo'
        width={100}
        height={100}
        className='align-center absolute hidden w-[122px] sm:block'
      />

      <ToggleGroup
        type='single'
        className='bg-background'
        onValueChange={handleGamePlayModeChange}
        value={gamePlayMode}
      >
        <ToggleGroupItem
          value={GamePlayMode.REAL}
          className='h-[38px] font-medium'
        >
          Real Play
        </ToggleGroupItem>
        {type === ProviderGameType.SLOT && (
          <ToggleGroupItem
            value={GamePlayMode.FUN}
            className='h-[38px] font-medium'
          >
            Fun Play
          </ToggleGroupItem>
        )}
      </ToggleGroup>
    </div>
  )
}

export default memo(Footer)

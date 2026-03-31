'use client'

import Image from 'next/image'
import React, { memo } from 'react'

import { useCrashGame } from '@/context/games/crash-context'

import { cn } from '@/lib/utils'
import { useCrashWebSocket } from '@/hooks/games/use-crash-websocket'

import { AnimationMultiplier } from '@/components/pages/(game)/crash/crash-game-container/body/AnimationMultiplier'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

import slotBackground from '@/assets/games/slot-background.png'

const Body = () => {
  const { currentMultiplier, gameState } = useCrashGame()
  const { cashout, placeBet } = useCrashWebSocket()

  return (
    <div className={cn('relative', 'crash-game-body', 'h-[500px] w-full')}>
      <div className='absolute inset-0 z-[1] h-full w-full bg-secondary opacity-50' />
      <Image
        src={slotBackground}
        alt='crash-game-background'
        width={1000}
        height={1000}
        className='absolute h-full w-full object-cover'
      />

      <div className='flex-center relative z-[2] h-full flex-col gap-4'>
        <Card className='min-w-[120px] text-center'>
          <AnimationMultiplier
            value={currentMultiplier ?? 0}
            gameState={gameState}
          />
        </Card>
        <div className='flex gap-2'>
          <Button onClick={() => placeBet(100, 2)}>Place Bet</Button>
          <Button onClick={() => cashout()}>Cashout </Button>
        </div>
      </div>
    </div>
  )
}

export default memo(Body)

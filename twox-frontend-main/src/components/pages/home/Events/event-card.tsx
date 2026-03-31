'use client'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@radix-ui/react-tooltip'
import Link from 'next/link'
import { useCallback } from 'react'

import CoinIcon from '@/components/templates/icons/coin-icon'
import { Button } from '@/components/ui/button'
import ProgressBar from '@/components/ui/progress-bar'

import CupIcon from '@/assets/cup.svg'
import InfoIcon from '@/assets/info.svg'

import { WagerRace } from '@/types/wagerRace'
export default function EventCard({ wagerRace }: { wagerRace: WagerRace }) {
  const getPercentage = useCallback(() => {
    const now = new Date().getTime()
    const start = new Date(wagerRace.period.start).getTime()
    const end = new Date(wagerRace.period.end).getTime()
    const percentage = ((now - start) / (end - start)) * 100

    const days = Math.floor((end - now) / (1000 * 60 * 60 * 24))
    const hours = Math.floor(
      ((end - now) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    )
    return { percentage, days, hours }
  }, [wagerRace])

  const getFormattedTime = useCallback(() => {
    const { days, hours } = getPercentage()
    return (
      <div className='flex flex-row items-center gap-1'>
        <div className='flex flex-row items-center'>
          <span className='text-xs font-medium text-foreground'>
            {days.toString().padStart(2, '0')}
          </span>
          <span className='text-xs font-medium text-secondary-text'>d</span>
        </div>
        <div className='flex flex-row items-center'>
          <span className='text-xs font-medium text-foreground'>
            {hours.toString().padStart(2, '0')}
          </span>
          <span className='text-xs font-medium text-secondary-text'>h</span>
        </div>
      </div>
    )
  }, [getPercentage])

  return (
    <div className='bg-table-even-row flex flex-col gap-4.5 rounded-lg px-3 py-4.5'>
      <div className='flex items-center justify-between border-b-2 border-secondary-600 pb-4.5'>
        <div className='flex flex-col gap-2'>
          <div className='truncate text-lg font-bold text-foreground first-letter:uppercase'>
            {wagerRace.title}
          </div>
          <div className='flex items-center gap-2'>
            <CoinIcon className='size-4 !blur-none' />
            <span className='text-base font-medium text-foreground'>
              {wagerRace.minWager}
            </span>
          </div>
          <div className='line-clamp-1 text-xs font-medium text-secondary-text'>
            {wagerRace.description}
          </div>
          <div className='flex items-center gap-3.5'>
            <Button
              className='flex items-center border-2 border-secondary-450 bg-secondary px-6 py-3 text-sm font-medium text-foreground'
              asChild
            >
              <Link href={`/wager-race/${wagerRace._id}`}>LEARN MORE</Link>
            </Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <InfoIcon className='size-6 text-secondary-text' />
                </TooltipTrigger>
                <TooltipContent>
                  <div className='bg-table-even-row flex w-60 justify-center rounded-md border-2 border-foreground p-3 text-base font-medium text-secondary-text'>
                    {wagerRace.description}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <div className='relative mb-auto ml-auto'>
          <ProgressBar
            percentage={getPercentage().percentage}
            className='size-28'
            bgClassName='text-secondary-600'
            fgClassName='text-gold'
            bgStrokeWidth={8}
            fgStrokeWidth={12}
            glow={true}
          />
          <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'>
            <div className='text-center text-xs font-medium text-secondary-text'>
              Ends in
            </div>
            {getFormattedTime()}
          </div>
        </div>
      </div>
      <div className='flex flex-row items-center gap-2'>
        <CupIcon className='size-4.5 text-secondary-text' />
        <span className='text-sm font-medium text-secondary-text'>
          {wagerRace.participants?.users?.length || 'Not entered yet'}
        </span>
      </div>
    </div>
  )
}

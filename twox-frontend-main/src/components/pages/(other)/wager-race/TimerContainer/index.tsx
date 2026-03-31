'use client'

import React, { useEffect, useState } from 'react'

import { useUser } from '@/context/user-context'

import TimerCard from '@/components/pages/(other)/wager-race/TimerContainer/timerCard'
import { Button } from '@/components/ui/button'

import { IWagerRaceRankingData } from '@/types/wagerRace'

const TimerTypes = ['Days', 'Hours', 'Minutes', 'Seconds']

const TopContainer = ({
  myStatus,
  wagerRace,
  isJoining,
  onJoin,
}: {
  isJoining: boolean
  myStatus: {
    isJoined: boolean
    rank: number | null
  } | null
  wagerRace: IWagerRaceRankingData
  onJoin: () => void
}) => {
  const [timer, setTimer] = useState({})
  const { isAuthenticated } = useUser()
  const getFormatNumberWithPad = (value: number) => {
    return value.toString().padStart(2, '0')
  }

  useEffect(() => {
    if (Object.keys(wagerRace).length <= 0) return
    const endDate = new Date(wagerRace?.period?.end || '')
    const timerInterval = setInterval(() => {
      const now = new Date()
      const diff = endDate.getTime() - now.getTime()
      if (diff <= 0) {
        clearInterval(timerInterval)
        setTimer({
          Days: '00',
          Hours: '00',
          Minutes: '00',
          Seconds: '00',
        })
      } else {
        setTimer({
          Days: getFormatNumberWithPad(
            Math.floor(diff / (1000 * 60 * 60 * 24))
          ),
          Hours: getFormatNumberWithPad(
            Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
          ),
          Minutes: getFormatNumberWithPad(
            Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
          ),
          Seconds: getFormatNumberWithPad(
            Math.floor((diff % (1000 * 60)) / 1000)
          ),
        })
      }
    }, 1000)
    return () => clearInterval(timerInterval)
  }, [wagerRace])

  return (
    <div className='mb-14 flex flex-col gap-5 md:mb-20'>
      <div className='flex flex-row items-center gap-2'>
        <div className='text-sm font-normal text-secondary-text'>
          Your position
        </div>
        <div className='bg-blur-white-2 flex items-center justify-center rounded-lg px-3 py-2'>
          <div className='text-center text-sm font-bold text-foreground'>
            {myStatus?.rank || 'n/a'}
          </div>
        </div>
      </div>

      <div className='text-shadow-wager-text-shadow mt-14 flex flex-col items-center justify-center md:mt-0'>
        <div className='md:text-6.8xl flex flex-col items-center gap-4 font-satoshi text-5xl font-black uppercase md:flex-row'>
          <div className='bg-gradient-to-bl from-[#F2B03B] via-[#ffe0a6] to-[#F2B03B] bg-clip-text text-transparent'>
            {wagerRace.title
              .replace('Race', '')
              .replace('RACE', '')
              .replace('race', '')}
          </div>
          <div>Race</div>
        </div>
        <div className='mt-2 max-w-2xl text-center text-sm font-medium text-foreground'>
          {wagerRace.description}
        </div>
      </div>

      <div className='flex flex-row items-center justify-center gap-2'>
        {TimerTypes.map((type, index) => (
          <div key={index} className='flex flex-row items-center gap-2'>
            <TimerCard unit={type} value={timer[type as keyof typeof timer]} />
            {index !== TimerTypes.length - 1 && (
              <div className='text-3xl font-bold text-foreground'>:</div>
            )}
          </div>
        ))}
      </div>

      {(!isAuthenticated || !myStatus?.isJoined) && (
        <div className='mt-4 flex justify-center'>
          <Button
            loading={isJoining}
            disabled={isJoining}
            size='lg'
            onClick={onJoin}
          >
            Join Now
          </Button>
        </div>
      )}
    </div>
  )
}

export default TopContainer

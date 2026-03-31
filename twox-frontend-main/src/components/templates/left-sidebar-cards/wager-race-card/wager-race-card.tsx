import Image from 'next/image'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import csCharacterBg from '@/assets/image/cs-character-bg.png'
import cSCharacter from '@/assets/images/cs-character.png'
import Timer from '@/assets/timer-2.svg'

const WagerRaceCard = () => {
  const raceEndDate = useMemo(() => '2025-04-01', [])

  const calculateTimeLeft = useCallback((): number => {
    const difference = new Date(raceEndDate).getTime() - new Date().getTime()
    return difference > 0 ? Math.floor(difference / 1000) : 0
  }, [raceEndDate])

  const [timeLeft, setTimeLeft] = useState<number>(calculateTimeLeft)

  useEffect(() => {
    if (timeLeft <= 0) return
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft)
    }, 1000)

    return () => clearInterval(interval)
  }, [timeLeft, calculateTimeLeft])

  const formatTime = (seconds: number): string => {
    const days = Math.floor(seconds / (3600 * 24))
    const hours = Math.floor((seconds % (3600 * 24)) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${days}d : ${hours}h : ${minutes}m : ${secs}s`
  }

  return (
    <div className='relative flex flex-col gap-2'>
      <Image
        src={cSCharacter}
        alt='CS Character'
        width={0}
        height={0}
        sizes='100vw'
        className='absolute bottom-0 right-0 z-[2] h-auto w-[95px]'
      />

      <div className='content relative h-full w-full overflow-hidden rounded-lg bg-wager-race-card px-2 py-3'>
        <div className='relative z-[2]'>
          <div className='text-sm font-bold'>
            <span>10k</span> Wager Race
          </div>
          <div className='flex items-center gap-1 text-xs'>
            <Timer className='w-4' />
            <span>{formatTime(timeLeft)}</span>
          </div>
        </div>
        <Image
          src={csCharacterBg}
          alt='CS Character'
          width={0}
          height={0}
          sizes='100vw'
          className='absolute bottom-0 left-0 right-0 top-0 z-[1] h-[122px] w-full opacity-50'
        />
      </div>
    </div>
  )
}

export default WagerRaceCard

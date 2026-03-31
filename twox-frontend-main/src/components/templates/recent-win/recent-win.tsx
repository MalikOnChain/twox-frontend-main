import Image from 'next/image'
import Link from 'next/link'
import React, { memo, useEffect, useMemo, useRef, useState } from 'react'

import { formatNumber } from '@/lib/number'
import { cn } from '@/lib/utils'

import NextImage from '@/components/ui/image'

import CoinIcon from '@/assets/icons/coin.png'
import Crash from '@/assets/native-game/crash.png'

import { RecentWinItem as RecentWinItemType } from '@/types/recent-win'

const RecentWinItem = ({ item }: { item: RecentWinItemType }) => {
  const { banners, game, lastBet } = item
  const price = lastBet?.winAmount
  const username = useMemo(() => {
    if (!lastBet?.username) {
      return 'Anonymous'
    }

    if (lastBet.username.length > 5) {
      return lastBet.username.slice(0, 3) + '***' + lastBet.username.slice(-2)
    }

    return lastBet.username
  }, [lastBet?.username])
  const gameLink = `/live-casino/${game.provider.toLowerCase()}/${game.id}`

  // Track previous values to detect changes
  const prevUsernameRef = useRef(username)
  const prevPriceRef = useRef(price)

  // Animation states
  const [usernameAnimating, setUsernameAnimating] = useState(false)
  const [priceAnimating, setPriceAnimating] = useState(false)

  // Animation sequence states
  const [usernamePhase, setUsernamePhase] = useState('idle') // 'idle', 'out', 'in'
  const [pricePhase, setPricePhase] = useState('idle') // 'idle', 'out', 'in'

  const getBanner = () => {
    if (banners === 'anonymous') {
      return Crash
    }

    return banners
  }

  useEffect(() => {
    // Check if username has changed
    if (prevUsernameRef.current !== username) {
      // Start animation sequence
      setUsernameAnimating(true)
      setUsernamePhase('out')

      // After sliding out, update to slide in
      const slideInTimer = setTimeout(() => {
        setUsernamePhase('in')
      }, 150)

      // Reset animation after it completes
      const resetTimer = setTimeout(() => {
        setUsernameAnimating(false)
        setUsernamePhase('idle')
      }, 600)

      // Update ref with current value
      prevUsernameRef.current = username

      return () => {
        clearTimeout(slideInTimer)
        clearTimeout(resetTimer)
      }
    }
  }, [username])

  useEffect(() => {
    // Check if price has changed
    if (prevPriceRef.current !== price) {
      // Start animation sequence
      setPriceAnimating(true)
      setPricePhase('out')

      // After sliding out, update to slide in
      const slideInTimer = setTimeout(() => {
        setPricePhase('in')
      }, 150)

      // Reset animation after it completes
      const resetTimer = setTimeout(() => {
        setPriceAnimating(false)
        setPricePhase('idle')
      }, 600)

      // Update ref with current value
      prevPriceRef.current = price

      return () => {
        clearTimeout(slideInTimer)
        clearTimeout(resetTimer)
      }
    }
  }, [price])

  // Helper function to get transform classes based on animation phase
  const getTransformClass = (phase: string) => {
    switch (phase) {
      case 'out':
        return 'transform -translate-y-4 opacity-0'
      case 'in':
        return 'transform translate-y-0 opacity-100'
      default:
        return ''
    }
  }

  return (
    <Link
      href={gameLink}
      className={cn(
        'group relative',
        'flex cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg bg-background-fourth',
        'min-w-[60px]',
        'md:min-w-[70px]',
        'transition-all duration-150 hover:opacity-80'
      )}
    >
      <NextImage
        src={getBanner()}
        alt='recent win'
        containerClassName='bg-secondary rounded-lg min-w-24'
        height='h-auto'
        className='aspect-[1] h-24 min-w-24 rounded-xl object-cover transition-all duration-150 group-hover:shadow-active-game'
      />
      <div className='flex w-full flex-col gap-1 font-semibold'>
        <span className='w-3/5 truncate whitespace-nowrap text-sm font-medium'>
          {game.name}
        </span>
        <div
          className={cn(
            'line-clamp-1 px-1 text-sm font-medium',
            'w-full overflow-hidden !text-[#94919A] transition-all duration-150',
            usernameAnimating && 'font-bold !text-white',
            getTransformClass(usernamePhase)
          )}
        >
          {username}
        </div>
        <div className='flex items-center gap-0.5 text-gold-token md:gap-1'>
          <Image
            src={CoinIcon}
            alt='coin'
            className='size-3 md:size-4'
            width={0}
            height={0}
            sizes='100vw'
          />
          {/* <CoinIcon
            className={cn(
              'h-3 w-3 min-w-3 transition-transform duration-150',
              priceAnimating && 'scale-110'
            )}
          /> */}
          <span
            className={cn(
              'text-sm leading-[1] text-success-300',
              'transition-all duration-150',
              priceAnimating && 'brightness-125',
              getTransformClass(pricePhase)
            )}
          >
            {price ? formatNumber(price) : '0'}
          </span>
        </div>
      </div>
    </Link>
  )
}

export default memo(RecentWinItem)

'use client'

import React, { useEffect, useState } from 'react'

import { GameStates } from '@/lib/games/crash'
import { cn } from '@/lib/utils'

interface AnimationMultiplierProps {
  value: number
  className?: string
  gameState: GameStates
}

export const AnimationMultiplier = ({
  value,
  className,
  gameState,
}: AnimationMultiplierProps) => {
  const [isAnimating, setIsAnimating] = useState(false)
  const [displayValue, setDisplayValue] = useState(value)

  useEffect(() => {
    // If game state is START, show 1.00
    if (gameState === GameStates.Starting) {
      setDisplayValue(1)
      setIsAnimating(false)
      return
    }

    // If game state is OVER, keep the last value
    if (gameState === GameStates.Over) {
      setDisplayValue(value)
      setIsAnimating(false)
      return
    }

    // Normal animation logic for other states
    const nearestInteger = Math.round(value)
    const isNearInteger =
      value - nearestInteger <= 0.05 && value - nearestInteger >= 0

    if (isNearInteger) {
      setDisplayValue(nearestInteger)
      setIsAnimating(true)

      // Calculate timeout based on current multiplier
      // As multiplier increases, timeout decreases
      const baseTimeout = 1000
      const minTimeout = 100 // Minimum timeout to ensure animation is visible
      const timeoutDuration = Math.max(
        minTimeout,
        baseTimeout / Math.pow(value, 0.2) // Using a smaller exponent for slower decrease
      )

      const timeout = setTimeout(() => {
        setIsAnimating(false)
      }, timeoutDuration)

      return () => clearTimeout(timeout)
    } else {
      setDisplayValue(value)
      setIsAnimating(false)
    }
  }, [value, gameState])

  return (
    <span
      className={cn(
        'inline-block transform font-mono text-xl transition-all duration-300 ease-in-out',
        isAnimating ? 'scale-125' : 'scale-100',
        className
      )}
    >
      {displayValue.toFixed(2)}X
    </span>
  )
}

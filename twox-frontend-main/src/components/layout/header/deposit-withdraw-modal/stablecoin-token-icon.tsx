'use client'

import * as React from 'react'

import USDCIcon from '@/assets/currencies/usdc.svg'
import USDTIcon from '@/assets/currencies/usdt.svg'

export type StablecoinSymbol = 'USDT' | 'USDC'

export function StablecoinTokenIcon({
  symbol,
  className,
  size = 22,
}: {
  symbol: StablecoinSymbol
  className?: string
  size?: number
}) {
  const Icon = symbol === 'USDC' ? USDCIcon : USDTIcon
  return (
    <Icon
      width={size}
      height={size}
      className={['shrink-0', className].filter(Boolean).join(' ')}
      aria-hidden
    />
  )
}

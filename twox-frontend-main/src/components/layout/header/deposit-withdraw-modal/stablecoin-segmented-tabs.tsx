'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

import { StablecoinTokenIcon } from './stablecoin-token-icon'

export type StablecoinTab = 'USDT' | 'USDC'

type StablecoinSegmentedTabsProps = {
  value: StablecoinTab
  onChange: (next: StablecoinTab) => void
  className?: string
}

const TAB_ICON_SIZE = 18

/** Same slide style as Deposit / Withdraw in `deposit-withdraw-modal.tsx`. */
export function StablecoinSegmentedTabs({
  value,
  onChange,
  className,
}: StablecoinSegmentedTabsProps) {
  return (
    <div className={cn('flex rounded-lg bg-cinder p-1.5', className)}>
      <button
        type='button'
        onClick={() => onChange('USDT')}
        className={cn(
          'flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
          value === 'USDT' ? 'bg-mirage text-white' : 'text-gray-400 hover:text-white'
        )}
      >
        <StablecoinTokenIcon symbol='USDT' size={TAB_ICON_SIZE} />
        USDT
      </button>
      <button
        type='button'
        onClick={() => onChange('USDC')}
        className={cn(
          'flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
          value === 'USDC' ? 'bg-mirage text-white' : 'text-gray-400 hover:text-white'
        )}
      >
        <StablecoinTokenIcon symbol='USDC' size={TAB_ICON_SIZE} />
        USDC
      </button>
    </div>
  )
}

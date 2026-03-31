import React, { memo } from 'react'

import { cn } from '@/lib/utils'

import HistoryBar from '@/components/pages/(game)/crash/crash-game-container/header/history-bar'
import NetworkStatus from '@/components/pages/(game)/crash/crash-game-container/header/network-status'

const Header = ({ history }: { history: any[] }) => {
  return (
    <div
      className={cn(
        'crash-game-header',
        'h-[60px] w-full rounded-tl-[20px] rounded-tr-[20px] px-8',
        'flex items-center justify-center bg-secondary',
        'sm:justify-between'
      )}
    >
      <NetworkStatus />
      <HistoryBar histories={history} />
    </div>
  )
}

export default memo(Header)

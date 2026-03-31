import React, { memo, useEffect, useState } from 'react'

import { cn } from '@/lib/utils'

// Types
interface HistoryData {
  crashPoint: number
  privateSeed: string
  publicSeed: string
  users: number
  [key: string]: any // Allow for additional properties
}

interface HistoryBlockProps {
  history: HistoryData
  isExiting: boolean
}

interface HistoryBarProps {
  histories: HistoryData[]
}

const HistoryBlock = memo(({ history, isExiting }: HistoryBlockProps) => {
  const multiplier = Number(history.crashPoint) / 100

  return (
    <div
      className={cn(
        'history-block',
        'flex h-10 items-center justify-center rounded-md',
        'w-[55px] min-w-[55px] sm:w-[80px] sm:min-w-[80px]',
        'border border-[#2C2A51]',
        'transition-all duration-500',
        `${multiplier < 2 ? 'bg-primary-300' : 'bg-primary'}`,
        'animate-slide-in',
        isExiting ? '-translate-x-full opacity-0' : 'translate-x-0 opacity-100'
      )}
    >
      {multiplier.toFixed(2)}x
    </div>
  )
})

const HistoryBar: React.FC<HistoryBarProps> = ({ histories }) => {
  const [visibleHistories, setVisibleHistories] = useState<HistoryData[]>([])
  const maxBlocks = 10

  useEffect(() => {
    // Only keep the most recent maxBlocks items
    const latestHistories = histories.slice(-maxBlocks)
    setVisibleHistories(latestHistories)
  }, [histories])

  return (
    <div
      className={cn(
        'history-bar relative flex h-10 w-auto items-center justify-end overflow-hidden',
        'max-w-[310px] sm:max-w-[432px]'
      )}
    >
      <div className='flex justify-end gap-2 overflow-hidden transition-transform duration-500 will-change-auto'>
        {visibleHistories.map((history: HistoryData) => (
          <HistoryBlock
            key={`history_${history.privateSeed}`}
            history={history}
            isExiting={false}
          />
        ))}
      </div>
    </div>
  )
}

export default memo(HistoryBar)

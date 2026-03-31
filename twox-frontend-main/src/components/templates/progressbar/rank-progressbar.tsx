import React from 'react'

import { useProfile } from '@/context/data/profile-context'

import { formatNumber } from '@/lib/number'

import ProgressBar from '@/components/templates/progressbar/progressbar'

const RankProgressbar = ({
  progress,
  height,
  showProgress = false,
}: {
  progress: number
  height?: string
  hideNextRank?: boolean
  showProgress?: boolean
  hideRemainingXP?: boolean
}) => {
  const { userRankStatus } = useProfile()

  if (!userRankStatus) return null

  const current = userRankStatus.currentXP
  const total = userRankStatus.totalXP
  return (
    <div className='flex-1 space-y-2.5'>
      <ProgressBar
        className='w-full'
        height={height}
        showPercentage={false}
        progress={progress}
      />
      <div className='flex w-full items-center justify-between gap-1'>
        {/* {RankIcon && (
          <div className='flex items-center gap-2'>
            <Image
              src={RankIcon}
              sizes='100vw'
              alt='Rank'
              width={0}
              height={0}
              className='size-8 min-w-5'
            />
            <span className='text-xs font-bold uppercase'>
              {userRankStatus.currentTier + ' ' + userRankStatus.currentLevel}
            </span>
          </div>
        )} */}

        {showProgress && (
          <span className='text-xs text-muted-foreground'>
            <span className='font-bold text-foreground'>
              {formatNumber(current)}
            </span>
            /{formatNumber(total)} Points
          </span>
        )}

        {/* {!hideNextRank && NextRankIcon && (
          <Image
            src={NextRankIcon}
            sizes='100vw'
            alt='Next Rank'
            width={0}
            height={0}
            className='size-8 min-w-5'
          />
        )} */}
      </div>
      {/* Remaining XP to next rank */}
      {/* {!hideRemainingXP && (
        <div className='flex items-center justify-between'>
          <div className='ml-1 flex items-center gap-1'>
            <span className='text-xs font-bold text-foreground'>
              {formatNumber(total - current)} exp
            </span>
            <span className='text-xs text-secondary-text'>to next level</span>
          </div>
          {NextRankIcon && (
            <Image
              src={NextRankIcon}
              sizes='100vw'
              alt='Next Rank'
              width={0}
              height={0}
              className='size-8 min-w-5'
            />
          )}
        </div>
      )} */}
    </div>
  )
}

export default RankProgressbar

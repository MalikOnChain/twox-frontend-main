'use client'
import React, { memo } from 'react'

import TableBody from '@/components/tables/wagerRace-ranking-table/table-body'

import TableHeader from './table-header'

import { IUserRankingInfo } from '@/types/wagerRace'

const WagerRaceRankingStatusTable = ({
  rankingData,
}: {
  rankingData: IUserRankingInfo[]
}) => {
  return (
    rankingData.length > 0 && (
      <div className='w-full overflow-hidden'>
        <div className='relative w-full rounded-xl'>
          <TableHeader />
          <TableBody rankingData={rankingData} />
        </div>
      </div>
    )
  )
}

export default memo(WagerRaceRankingStatusTable)

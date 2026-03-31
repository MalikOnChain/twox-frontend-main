'use client'
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'

import { useBettingStatus } from '@/context/data/betting-status-context'

import TableBody from '@/components/tables/betting-status-table/table-body'

import LatestBet from '@/assets/icons/latest-bet.svg'

import TableHeader from './table-header'

interface BettingStatusTableProps {
  onPageChange?: (page: number) => void
  itemsPerPage?: number
}

const BettingStatusTable: React.FC<BettingStatusTableProps> = () => {
  const { allBets } = useBettingStatus()
  const { t } = useTranslation()

  return (
    <div className='flex w-full flex-col gap-2 overflow-hidden'>
      <div className='flex flex-col justify-between gap-2 lg:flex-row lg:items-center'>
        <div className='flex items-center gap-2'>
          <LatestBet className='h-6 w-6' />
          <h3 className='text-[15px] font-medium uppercase'>
            {t('latest_bets.title')}
          </h3>
        </div>
        {/* <HeaderTabs /> */}
      </div>
      <div className='relative w-full overflow-x-auto overflow-y-hidden rounded-xl'>
        <TableHeader />
        <TableBody bets={allBets} />
        {/* <Pagination />s */}
      </div>
    </div>
  )
}

export default memo(BettingStatusTable)

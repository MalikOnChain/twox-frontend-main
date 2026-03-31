import Image from 'next/image'
import { memo } from 'react'

import { cn } from '@/lib/utils'

import CoinIcon from '@/components/templates/icons/coin-icon'

import CupIcon from '@/assets/cup.svg'

import { IUserRankingInfo } from '@/types/wagerRace'

interface TableRowProps {
  place: number
  username: string
  avatar: string
  totalWagered: number
  prize: number
  isEven: boolean
}

interface TableColumnsProps {
  place: number
  username: string
  avatar: string
  totalWagered: number
  prize: number
}

// Basic usage example
const styles = {
  rankRow: {
    base: 'w-full grid grid-cols-4 p-3 md:py-3.5 text-sm text-white md:px-6 rounded-md',
    column: 'flex items-center gap-2 col-span-1',
    variants: {
      even: '',
      odd: 'bg-table-even-row',
    },
  },
} as const

const TableColumns = memo(
  ({ place, username, avatar, totalWagered, prize }: TableColumnsProps) => {
    return (
      <>
        <div className='col-span-1 flex items-center gap-2'>
          <CupIcon className='h-5 w-5 text-secondary-text' />
          <span className='text-secondary-text'>{place}</span>
        </div>

        <div
          className={cn(
            styles.rankRow.column,
            'text-white',
            'max-w-[140px] truncate'
          )}
        >
          <Image
            width={20}
            height={20}
            src={avatar}
            alt='avatar'
            className='rounded-full'
          />
          <span className='hidden min-w-0 truncate md:block'>{username}</span>
        </div>
        <div className={cn(styles.rankRow.column)}>
          <CoinIcon />
          {totalWagered.toFixed(2)}
        </div>
        <div className={cn(styles.rankRow.column, 'text-success-500')}>
          <CoinIcon />
          {prize.toFixed(2)}
        </div>
      </>
    )
  }
)

TableColumns.displayName = 'TableColumns'

const TableRow = memo(
  ({ place, username, avatar, totalWagered, prize, isEven }: TableRowProps) => {
    return (
      <div
        className={cn(
          styles.rankRow.base,
          isEven ? styles.rankRow.variants.even : styles.rankRow.variants.odd,
          'animate-enter-1',
          'gap-2'
        )}
      >
        <TableColumns
          place={place}
          avatar={avatar}
          username={username}
          totalWagered={totalWagered}
          prize={prize}
        />
      </div>
    )
  }
)

TableRow.displayName = 'TableRow'

const TableBody = ({ rankingData }: { rankingData: IUserRankingInfo[] }) => {
  return (
    <div className='table-body relative w-full'>
      <div className='table-rows-container max-h-[450px] w-full'>
        {rankingData.length > 0 &&
          rankingData.map((data, index) => (
            <TableRow
              place={data?.place || 0}
              avatar={data?.avatar || ''}
              totalWagered={data?.totalWagered || 0}
              prize={data?.prize || 0}
              username={data?.username || ''}
              isEven={index % 2 === 1}
              key={`${data.username}-${data.totalWagered}-${data.prize}-${index}`}
            />
          ))}
      </div>
      {rankingData.length > 3 && (
        <div
          className={cn(
            'pointer-events-none absolute bottom-0 left-0 right-0',
            'h-24 w-full',
            'bg-gradient-to-t from-background to-background/40'
          )}
        />
      )}
    </div>
  )
}

export default memo(TableBody)

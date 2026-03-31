import { memo } from 'react'
import { useTranslation } from 'react-i18next'

import { cn } from '@/lib/utils'

interface TableColumn {
  id: string
  label: string
  ariaLabel?: string
  col: number
  pl?: number
}

interface TableHeaderProps {
  columns?: TableColumn[]
  className?: string
}

const TableHeader: React.FC<TableHeaderProps> = ({ className = '' }) => {
  const { t } = useTranslation()

  const defaultColumns: TableColumn[] = [
    {
      id: 'user',
      label: t('latest_bets.user'),
      ariaLabel: 'User identifier',
      col: 2,
    },
    {
      id: 'game',
      label: t('latest_bets.game'),
      ariaLabel: 'Gaming category',
      col: 1,
    },
    {
      id: 'time',
      label: t('latest_bets.date'),
      ariaLabel: 'Transaction timestamp',
      col: 2,
      pl: 2,
    },
    {
      id: 'betAmount',
      label: t('latest_bets.bet_amount'),
      ariaLabel: 'Amount wagered',
      col: 2,
    },
    {
      id: 'multiplier',
      label: t('latest_bets.multiplier'),
      ariaLabel: 'Winning multiplier',
      col: 2,
    },
    {
      id: 'payout',
      label: t('latest_bets.profit'),
      ariaLabel: 'Total payout amount',
      col: 2,
    },
  ]

  return (
    <div
      role='rowheader'
      className={`hidden w-full grid-cols-11 gap-2 bg-background-fourth px-6 py-4 text-sm font-medium lg:grid ${className}`}
    >
      {defaultColumns.map((column) => (
        <div
          key={column.id}
          role='columnheader'
          aria-label={column.ariaLabel}
          className={cn(
            `tracking-wide text-white transition-colors duration-200 hover:text-gray-200`,
            `col-span-${column.col} ${column.pl && `pl-${column.pl}`}`
          )}
        >
          <span className='flex items-center gap-2 text-xs font-bold uppercase text-secondary-800'>
            {column.label}
            <span className='sr-only'>{column.ariaLabel}</span>
          </span>
        </div>
      ))}
    </div>
  )
}

export default memo(TableHeader)

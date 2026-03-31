import { memo } from 'react'

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

const defaultColumns: TableColumn[] = [
  { id: 'place', label: 'Place', ariaLabel: 'Place', col: 1 },
  { id: 'user', label: 'User', ariaLabel: 'User identifier', col: 1 },
  {
    id: 'totalWagered',
    label: 'Wager Amount',
    ariaLabel: 'Amount totalWagered',
    col: 1,
  },
  { id: 'prize', label: 'Prize', ariaLabel: 'Amount Prize', col: 1 },
]

const TableHeader: React.FC<TableHeaderProps> = ({
  columns = defaultColumns,
  className = '',
}) => {
  return (
    <div
      role='rowheader'
      className={`grid w-full grid-cols-4 gap-2 p-3 text-sm font-medium md:px-6 md:py-2 ${className}`}
    >
      {columns.map((column) => (
        <div
          key={column.id}
          role='columnheader'
          aria-label={column.ariaLabel}
          className={cn(
            `tracking-wide text-white transition-colors duration-200 hover:text-gray-200`,
            `col-span-${column.col} ${column.pl && `pl-${column.pl}`}`
          )}
        >
          <span className='flex items-center gap-2'>
            {column.label}
            <span className='sr-only'>{column.ariaLabel}</span>
          </span>
        </div>
      ))}
    </div>
  )
}

export default memo(TableHeader)

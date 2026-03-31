import { memo } from 'react'

import { cn } from '@/lib/utils'

import { COLUMNS } from '.'

interface TableHeaderProps {
  columns: (typeof COLUMNS)[keyof typeof COLUMNS]
}

const TableHeader = ({ columns }: TableHeaderProps) => {
  const totalCols = columns.reduce((sum, column) => sum + column.col, 0)

  return (
    <div
      role='rowheader'
      className={cn(
        'grid w-full min-w-[750px]',
        'gap-2 bg-secondary px-6 py-4 text-sm font-medium'
      )}
      style={{ gridTemplateColumns: `repeat(${totalCols}, 1fr)` }}
    >
      {columns.map((column) => (
        <div
          key={column.id}
          role='columnheader'
          className={cn(
            'tracking-wide text-white transition-colors duration-200 hover:text-gray-200',
            `col-span-${column.col}`
          )}
        >
          {column.label}
        </div>
      ))}
    </div>
  )
}

export default memo(TableHeader)

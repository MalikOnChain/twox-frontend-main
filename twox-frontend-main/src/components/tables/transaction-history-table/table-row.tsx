import { formatNumber } from '@/lib/number'
import { cn } from '@/lib/utils'

import { COLUMNS } from '.'

import {
  CryptoTransaction,
  GameTransaction,
  ServiceTransaction,
} from '@/types/transaction'

interface TableRowProps {
  columns: (typeof COLUMNS)[keyof typeof COLUMNS]
  transaction: GameTransaction | CryptoTransaction | ServiceTransaction
  index: number
}

const getValue = (transaction: any, id: string) => {
  switch (id) {
    case 'time':
      return new Date(
        transaction.createdAt || transaction.updatedAt
      ).toLocaleString()
    case 'userBalance.before':
      return formatNumber(transaction.userBalance.before)
    case 'userBalance.after':
      return formatNumber(transaction.userBalance.after)
    case 'amount':
      return formatNumber(transaction.amount)
    default:
      if (id.includes('.')) {
        // Split the path and access nested properties
        return id.split('.').reduce((obj, key) => obj?.[key], transaction)
      }
      // Otherwise access directly
      return transaction[id]
  }
}

const TableRow = ({ columns, transaction, index }: TableRowProps) => {
  const totalCols = columns.reduce((sum, column) => sum + column.col, 0)

  return (
    <div
      key={transaction.createdAt + index}
      className={cn(
        'grid min-w-[750px] gap-2 border-t border-gray-800 px-6 py-4 text-sm',
        index % 2 === 0 ? 'bg-muted' : 'bg-secondary'
      )}
      style={{ gridTemplateColumns: `repeat(${totalCols}, 1fr)` }}
    >
      {columns.map((column) => {
        const value = getValue(transaction, column.id)

        return (
          <div
            key={column.id}
            style={{
              gridColumn: `span ${column.col}`,
            }}
          >
            {value}
          </div>
        )
      })}
    </div>
  )
}

export default TableRow

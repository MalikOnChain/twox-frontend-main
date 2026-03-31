import { memo } from 'react'

import { COLUMNS } from '@/components/tables/transaction-history-table'
import TableRow from '@/components/tables/transaction-history-table/table-row'

import {
  CryptoTransaction,
  GameTransaction,
  ServiceTransaction,
} from '@/types/transaction'

type TabType = 'game' | 'crypto' | 'service'

interface TableBodyProps {
  type: TabType
  transactions?: GameTransaction[] | CryptoTransaction[] | ServiceTransaction[]
  columns: (typeof COLUMNS)[keyof typeof COLUMNS]
}

const TableBody = ({ transactions = [], columns }: TableBodyProps) => {
  if (!transactions.length) {
    return (
      <div className='flex h-[200px] items-center justify-center bg-muted'>
        No transactions found
      </div>
    )
  }

  return (
    <div className='table-body relative w-full'>
      <div className='table-rows-container max-h-[450px] w-full'>
        {transactions.map((transaction, index) => (
          <TableRow
            key={transaction.createdAt + index}
            columns={columns}
            transaction={transaction}
            index={index}
          />
        ))}
      </div>
    </div>
  )
}

export default memo(TableBody)

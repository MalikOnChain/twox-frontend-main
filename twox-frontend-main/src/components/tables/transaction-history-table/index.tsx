'use client'
import React, { memo, useState } from 'react'

// import { CryptoTransactionHistoryTable } from '@/components/tables/crypto-tx-history-table/crypto-tx-history-table'
// import { GameHistoryTable } from '@/components/tables/game-history-table'
import HeaderTabs from '@/components/tables/transaction-history-table/header-tabs'

type TabType = 'game' | 'crypto' | 'service'

export const COLUMNS = {
  game: [
    { id: 'time', label: 'Time', col: 3 },
    { id: 'category', label: 'Game', col: 2 },
    { id: 'betAmount', label: 'Bet', col: 2 },
    { id: 'winAmount', label: 'Payout', col: 2 },
    { id: 'userBalance.before', label: 'Before Transaction', col: 2 },
    { id: 'userBalance.after', label: 'After Transaction', col: 2 },
    { id: 'status', label: 'Status', col: 2 },
  ],
  crypto: [
    { id: 'time', label: 'Time', col: 2 },
    { id: 'type', label: 'Type', col: 2 },
    { id: 'userBalance.before', label: 'Before Balance', col: 2 },
    { id: 'userBalance.after', label: 'After Balance', col: 2 },
    { id: 'amount', label: 'Amount', col: 2 },
    { id: 'unit', label: 'Currency', col: 2 },
    { id: 'transactionId', label: 'Transaction ID', col: 2 },
    { id: 'transactionHash', label: 'Transaction Hash', col: 2 },
    { id: 'blockchain', label: 'Blockchain', col: 2 },
    { id: 'network', label: 'Network', col: 2 },
    { id: 'status', label: 'Status', col: 2 },
  ],
  service: [
    { id: 'time', label: 'Time', col: 2 },
    { id: 'type', label: 'Type', col: 3 },
    { id: 'amount', label: 'Amount', col: 2 },
    { id: 'status', label: 'Status', col: 2 },
    { id: 'userBalance.before', label: 'Before Balance', col: 3 },
    { id: 'userBalance.after', label: 'After Balance', col: 3 },
  ],
} as const

const TransactionHistoryTable = () => {
  const [activeTab, setActiveTab] = useState<TabType>('game')

  return (
    <div className='flex-1 overflow-hidden'>
      <HeaderTabs activeTab={activeTab} onTabChange={setActiveTab} />
      {/* {activeTab === 'crypto' && <CryptoTransactionHistoryTable />} */}
      {/* {activeTab === 'game' && <GameHistoryTable />} */}
    </div>
  )
}

export default memo(TransactionHistoryTable)

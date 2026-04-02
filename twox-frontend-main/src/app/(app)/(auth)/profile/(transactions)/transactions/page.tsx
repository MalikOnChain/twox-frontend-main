'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

import { getWalletLedgerTransactions } from '@/api/transactions'

import { CryptoTransactionHistoryTable } from '@/components/tables/crypto-tx-history-table/crypto-tx-history-table'

import type { CryptoTransaction } from '@/types/transaction'

const TransactionsPage = () => {
  const [tableData, setTableData] = useState<CryptoTransaction[]>([])
  const [totalPages, setTotalPages] = useState<number>(0)
  const [page, setPage] = useState<number>(1)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [limit] = useState<number>(10)

  const fetchTransactions = useCallback(
    async (nextPage: number) => {
      try {
        setIsLoading(true)
        const response = await getWalletLedgerTransactions({
          page: nextPage,
          limit,
        })
        // API ledger rows are a superset-compatible shape at runtime; table expects CryptoTransaction
        setTableData((response.transactions || []) as unknown as CryptoTransaction[])
        setTotalPages(response.pagination.totalPages || 1)
        setPage(response.pagination.currentPage || nextPage)
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message)
        } else {
          toast.error('Failed to load transactions')
        }
      } finally {
        setIsLoading(false)
      }
    },
    [limit]
  )

  useEffect(() => {
    fetchTransactions(1)
  }, [fetchTransactions])

  const handleChangePage = (next: number) => {
    setPage(next)
    fetchTransactions(next)
  }

  if (isLoading && tableData.length === 0) {
    return (
      <div className='-mx-5 flex overflow-hidden p-4 text-sm text-muted-foreground'>
        Loading transactions…
      </div>
    )
  }

  return (
    <div className='-mx-5 flex overflow-hidden'>
      <CryptoTransactionHistoryTable
        data={tableData}
        totalPages={totalPages}
        page={page}
        setPage={handleChangePage}
      />
    </div>
  )
}

export default TransactionsPage

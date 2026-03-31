'use client'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { getTransactions } from '@/api/pix'

import Transactions from '@/components/tables/pix-transactions-table'

const PIX_TYPES = {
  transaction: 'DEPOSIT',
  withdrawal: 'WITHDRAWAL',
}

const PIX_STATUSES = [
  'PENDING',
  'COMPLETED',
  'REJECTED',
  'EXPIRED',
  'REFUNDED',
  'WAITING',
]

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

const tableColumns = [
  {
    id: 'time',
    label: 'Time',
    col: 2,
    render: (item: any) => formatDate(item.time),
  },
  {
    id: 'type',
    label: 'Type',
    col: 3,
    render: (item: any) => PIX_TYPES[item.type as 'transaction' | 'withdrawal'],
  },
  {
    id: 'amount',
    label: 'Amount',
    col: 2,
    render: (item: any) => Number(item.amount).toFixed(2),
  },
  {
    id: 'status',
    label: 'Status',
    col: 2,
    render: (item: any) => PIX_STATUSES[item.status as any],
  },
]

const TransactionsPage = () => {
  const [tableData, setTableData] = useState<any[]>([])
  const [totalPages, setTotalPages] = useState<number>(0)
  const [page, setPage] = useState<number>(1)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [limit] = useState<number>(10)

  const fetchTransactions = async (page: number) => {
    try {
      setIsLoading(true)

      const response = await getTransactions({
        page,
        limit,
      })

      setTableData(response.rows)
      setTotalPages(response.pagination.totalPages)
      setPage(response.pagination.currentPage)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Error fetching FTD summary')
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions(page)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleChangePage = (page: number) => {
    setPage(page)
    fetchTransactions(page)
  }

  return (
    <div className='-mx-5 flex overflow-hidden'>
      <Transactions
        columns={tableColumns}
        rows={tableData}
        totalPages={totalPages}
        setPage={handleChangePage}
        page={page}
        isLoading={isLoading}
      />
    </div>
  )
}

export default TransactionsPage

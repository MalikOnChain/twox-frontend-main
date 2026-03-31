'use client'
import React, { useEffect, useState } from 'react'

import { useSocket } from '@/context/socket-context'
import { useUser } from '@/context/user-context'

import {
  SOCKET_EMIT_EVENTS,
  SOCKET_LISTEN_EVENTS,
  SOCKET_NAMESPACES,
} from '@/lib/socket'

import { BonusTransactionHistoryTable } from '@/components/tables/bonus-history-table/bonus-history-table'

import {
  GetTransactionsResponse,
  ServiceTransaction,
  Transaction,
} from '@/types/transaction'

const TransactionsPage = () => {
  const { socket } = useSocket(SOCKET_NAMESPACES.TRANSACTION)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [page, setPage] = useState(1)
  const [limit, _setLimit] = useState(5)
  const [_total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const { user } = useUser()
  const [filter, setFilter] = useState<string>('')

  useEffect(() => {
    if (!socket) return
    socket.emit(SOCKET_EMIT_EVENTS.TRANSACTION.GET_SERVICE_TRANSACTIONS, {
      page: page,
      limit: limit,
      filter: filter,
    })

    socket.on(
      SOCKET_LISTEN_EVENTS.TRANSACTION.GET_SERVICE_TRANSACTIONS,
      (data: GetTransactionsResponse) => {
        setTransactions(data.transactions)
        setTotal(data.pagination.total)
        setTotalPages(data.pagination.totalPages)
      }
    )

    socket.on(
      SOCKET_LISTEN_EVENTS.TRANSACTION.GET_NEW_SERVICE_TRANSACTIONS,
      (data: Transaction) => {
        setTransactions((prev) => {
          const isExists = prev.some((t) => t._id === data._id)
          if (isExists) {
            return prev.map((t) => (t._id === data._id ? data : t))
          }
          return [data, ...prev]
        })
      }
    )
    return () => {
      socket?.off(SOCKET_LISTEN_EVENTS.TRANSACTION.GET_SERVICE_TRANSACTIONS)
      socket?.off(SOCKET_LISTEN_EVENTS.TRANSACTION.GET_NEW_SERVICE_TRANSACTIONS)
    }
  }, [page, socket, user, limit, filter])

  return (
    <div className='flex overflow-hidden'>
      <BonusTransactionHistoryTable
        data={transactions as ServiceTransaction[]}
        totalPages={totalPages}
        page={page}
        setPage={setPage}
        filter={filter}
        setFilter={setFilter}
        className='w-0 flex-1'
      />
    </div>
  )
}

export default TransactionsPage

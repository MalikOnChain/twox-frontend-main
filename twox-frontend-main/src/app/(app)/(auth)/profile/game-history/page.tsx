'use client'
import React, { useEffect, useState } from 'react'

import { useSocket } from '@/context/socket-context'
import { useUser } from '@/context/user-context'

import {
  SOCKET_EMIT_EVENTS,
  SOCKET_LISTEN_EVENTS,
  SOCKET_NAMESPACES,
} from '@/lib/socket'

import { GameHistoryTable } from '@/components/tables/game-history-table/game-history-table'

import { GAME_RESULT } from '@/types/game'
import {
  GameTransaction,
  GetTransactionsResponse,
  Transaction,
} from '@/types/transaction'
const GameHistoryPage = () => {
  const { socket } = useSocket(SOCKET_NAMESPACES.TRANSACTION)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [page, setPage] = useState(1)
  const [limit, _setLimit] = useState(10)
  const [_total, setTotal] = useState(0)
  const [_totalPages, setTotalPages] = useState(0)
  const { user } = useUser()
  const [filter, setFilter] = useState({
    type: GAME_RESULT.WIN,
    category: '',
  })

  useEffect(() => {
    if (!socket) return
    socket.emit(SOCKET_EMIT_EVENTS.TRANSACTION.GET_GAME_TRANSACTIONS, {
      page: page,
      limit: limit,
      filter: filter,
    })

    socket.on(
      SOCKET_LISTEN_EVENTS.TRANSACTION.GET_GAME_TRANSACTIONS,
      (data: GetTransactionsResponse) => {
        setTransactions(data.transactions)
        setTotal(data.pagination.total)
        setTotalPages(data.pagination.totalPages)
      }
    )

    socket.on(
      SOCKET_LISTEN_EVENTS.TRANSACTION.GET_NEW_GAME_TRANSACTIONS,
      (data: Transaction) => {
        setTransactions((prev) => {
          if (prev.some((p) => p._id === data._id)) {
            return prev.map((t) => (t._id === data._id ? data : t))
          } else {
            return [data, ...prev]
          }
        })
      }
    )
    return () => {
      socket?.off(SOCKET_LISTEN_EVENTS.TRANSACTION.GET_GAME_TRANSACTIONS)
      socket?.off(SOCKET_LISTEN_EVENTS.TRANSACTION.GET_NEW_GAME_TRANSACTIONS)
    }
  }, [page, socket, user, limit, filter])

  return (
    <div className='flex overflow-hidden'>
      <GameHistoryTable
        data={transactions as GameTransaction[]}
        totalPages={_totalPages}
        page={page}
        setPage={setPage}
        filter={filter}
        setFilter={setFilter}
        className='w-0 flex-1'
      />
    </div>
  )
}

export default GameHistoryPage

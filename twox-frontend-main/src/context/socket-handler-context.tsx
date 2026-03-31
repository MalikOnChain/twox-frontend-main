'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react'
import { toast } from 'sonner'

import { useSocket } from '@/context/socket-context'
import { useUser } from '@/context/user-context'

import { PRIVATE_SOCKET_NAMESPACES, SOCKET_LISTEN_EVENTS } from '@/lib/socket'

import { BALANCE_UPDATE_TYPES } from '@/types/balance'
import { BonusType } from '@/types/bonus'
import {
  SocketBalanceUpdatePayload,
  SocketVipTierUpPayload,
} from '@/types/socket'

const SocketHandlerContext = createContext<any | undefined>(undefined)

export function SocketHandlerProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { setBalance } = useUser()
  const { socket } = useSocket(PRIVATE_SOCKET_NAMESPACES.USER)
  const balanceUpdate = useCallback(
    (data: SocketBalanceUpdatePayload) => {
      if (data.type === BALANCE_UPDATE_TYPES.BONUS) {
        if (data.metadata?.type === BonusType.WELCOME) {
          toast.success(
            `Congratulations! You Received ${data.metadata?.amount} Welcome Bonus`
          )
        } else if (data.metadata?.type === BonusType.REFERRAL) {
          toast.success(
            `Congratulations! You Received ${data.metadata?.amount} Referral Bonus`
          )
        } else if (data.metadata?.type === BonusType.WAGER_RACE) {
          toast.success(
            `Congratulations! You Received ${data.metadata?.amount} Wager Race Prize`
          )
        } else {
          toast.success(
            `Congratulations! You Received ${data.metadata?.amount} Bonus`
          )
        }
      }

      if (data.type === BALANCE_UPDATE_TYPES.CASHBACK) {
        toast.success(
          `Congratulations! You Received ${data.metadata?.amount} Cashback`
        )
      }

      if (data.type === BALANCE_UPDATE_TYPES.DEPOSIT) {
        toast.success('Deposit successful')
      }
      setBalance(data.balance)
    },
    [setBalance]
  )

  const vipTierUp = useCallback((data: SocketVipTierUpPayload) => {
    toast.success(`You are now a ${data.newTier}`)
  }, [])

  useEffect(() => {
    if (!socket) return
    socket.on(SOCKET_LISTEN_EVENTS.TOKEN_BALANCE_UPDATE, balanceUpdate)
    return () => {
      socket.off(SOCKET_LISTEN_EVENTS.TOKEN_BALANCE_UPDATE)
    }
  }, [socket, balanceUpdate])

  useEffect(() => {
    if (!socket) return
    socket.on(SOCKET_LISTEN_EVENTS.VIP_TIER_UP, vipTierUp)
    return () => {
      socket.off(SOCKET_LISTEN_EVENTS.VIP_TIER_UP)
    }
  }, [socket, vipTierUp])

  const value = useMemo(() => ({}), [])

  return (
    <SocketHandlerContext.Provider value={value}>
      {children}
    </SocketHandlerContext.Provider>
  )
}

// Custom hook for using the modal context with a specific modal type
export function useSocketHandler() {
  const context = useContext(SocketHandlerContext)
  if (context === undefined) {
    throw new Error(
      'useSocketHandler must be used within a SocketHandlerProvider'
    )
  }

  return context
}

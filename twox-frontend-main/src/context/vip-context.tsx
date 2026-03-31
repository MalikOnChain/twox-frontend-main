'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react'

import { useProfile } from '@/context/data/profile-context'

import { SOCKET_LISTEN_EVENTS, SOCKET_NAMESPACES } from '@/lib/socket'

import { useSocket } from './socket-context'

import { UserRankStatus } from '@/types/vip'

// Define the context type
interface VipContextType {
  handleVipStatusUpdate: (data: UserRankStatus) => void
}

const VipContext = createContext<VipContextType | undefined>(undefined)

export function VipProvider({ children }: { children: React.ReactNode }) {
  const { socket } = useSocket(SOCKET_NAMESPACES.USER)
  const { setUserRankStatus } = useProfile()

  const handleVipStatusUpdate = useCallback(
    (vipData: UserRankStatus) => {
      setUserRankStatus(vipData)
    },
    [setUserRankStatus]
  )

  useEffect(() => {
    if (!socket) return

    // Listen for VIP status updates
    socket.on(SOCKET_LISTEN_EVENTS.VIP_STATUS_UPDATE, handleVipStatusUpdate)

    // Cleanup listener on unmount
    return () => {
      socket?.off(SOCKET_LISTEN_EVENTS.VIP_STATUS_UPDATE)
    }
  }, [socket, handleVipStatusUpdate])

  const value = useMemo(
    () => ({
      handleVipStatusUpdate,
    }),
    [handleVipStatusUpdate]
  )

  return <VipContext.Provider value={value}>{children}</VipContext.Provider>
}

// Custom hook for using the VIP context
export function useVip() {
  const context = useContext(VipContext)
  if (context === undefined) {
    throw new Error('useVip must be used within a VipProvider')
  }
  return context
}

'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { io } from 'socket.io-client'
import { toast } from 'sonner'

import {
  EnhancedSocket,
  getSocketUrl,
  PUBLIC_SOCKET_NAMESPACES,
  SOCKET_NAMESPACES,
  SocketNamespace,
} from '@/lib/socket'
import useStorage from '@/hooks/features/use-storage'

import { useUser } from './user-context'

interface SocketConnections {
  [key: string]: EnhancedSocket | null
}

export interface SocketContextType {
  sockets: SocketConnections
  reconnect: (namespace?: SocketNamespace) => void
}

interface SocketConfig {
  auth?: { token: string }
  transports: string[]
  reconnectionAttempts: number
  reconnectionDelay: number
  withCredentials: boolean
  autoConnect: boolean
}

const RECONNECTION_DELAY = 5000

const SocketContext = createContext<SocketContextType | undefined>(undefined)

const createInitialState = (isAuthenticated: boolean) => {
  // Only initialize public sockets when not authenticated
  const namespacesToInitialize = isAuthenticated
    ? SOCKET_NAMESPACES
    : PUBLIC_SOCKET_NAMESPACES

  return Object.values(namespacesToInitialize).reduce((acc, namespace) => {
    const key = namespace.slice(1)
    acc[key] = null
    return acc
  }, {} as SocketConnections)
}

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useUser()
  const { getValue: getToken, setValue: setToken } = useStorage({
    key: 'token',
  })
  const [sockets, setSockets] = useState<SocketConnections>(
    createInitialState(isAuthenticated)
  )
  const socketRefs = useRef<SocketConnections>(
    createInitialState(isAuthenticated)
  )

  const createSocketConfig = useCallback(
    (isAuthenticated: boolean): SocketConfig => {
      return {
        ...(isAuthenticated && { auth: { token: getToken() } }),
        transports: ['polling', 'websocket'],
        reconnectionAttempts: 3,
        reconnectionDelay: RECONNECTION_DELAY,
        withCredentials: true,
        autoConnect: false,
      }
    },
    [getToken]
  )

  const createSocketInstance = useCallback(
    (namespace: string, isAuthenticated: boolean) => {
      const config = createSocketConfig(isAuthenticated)
      const baseUrl = getSocketUrl()
      if (!baseUrl) {
        return new EnhancedSocket(null, isAuthenticated, namespace)
      }
      const partIo = io(baseUrl + namespace, config)
      const enhancedSocket = new EnhancedSocket(
        partIo,
        isAuthenticated,
        namespace
      )
      return enhancedSocket
    },
    [createSocketConfig]
  )

  const handleSocketError = useCallback((namespace: string, error: Error) => {
    const key = namespace.slice(1)
    const enhancedSocket = socketRefs.current[key]

    console.error(`Socket connection error for ${namespace}:`, error)
    if (enhancedSocket) {
      enhancedSocket.setConnected(false)

      toast.error(
        `Unable to establish connection to ${key}. Please try again later.`
      )
    }
  }, [])

  const setupSocketListeners = useCallback(
    (
      socketInstance: EnhancedSocket,
      namespace: string,
      isAuthenticated: boolean
    ) => {
      const key = namespace.slice(1)
      socketInstance.on('connect', () => {
        // console.log(`${namespace}: connected successfully `)
        socketInstance.setConnected(true)
        socketInstance.setAuthenticated(isAuthenticated)
        socketInstance.on('connect_error', (error: Error) =>
          handleSocketError(namespace, error)
        )

        socketInstance.on('disconnect', () => {
          socketInstance.setConnected(false)
          socketInstance.setAuthenticated(false)
        })

        socketInstance.on('auth:refreshToken', ({ accessToken }) => {
          setToken(accessToken)
        })
        socketRefs.current[key] = socketInstance
        setSockets((prev) => ({ ...prev, [key]: socketInstance }))
      })
      return socketInstance
    },
    [handleSocketError, setToken]
  )

  const reconnectNamespace = useCallback(
    (ns: string, isAuthenticated: boolean) => {
      const key = ns.slice(1)
      if (socketRefs.current[key]) {
        socketRefs.current[key].removeAllListeners()
        // socketRefs.current[key].disconnect()
      }

      const socketInstance = createSocketInstance(ns, isAuthenticated)
      setupSocketListeners(socketInstance, ns, isAuthenticated)
    },
    [createSocketInstance, setupSocketListeners]
  )

  const reconnect = useCallback(
    (namespace?: SocketNamespace) => {
      if (namespace) {
        reconnectNamespace(namespace, isAuthenticated)
      } else {
        // Only reconnect appropriate sockets based on auth state
        const namespacesToReconnect = isAuthenticated
          ? Object.values(SOCKET_NAMESPACES)
          : Object.values(PUBLIC_SOCKET_NAMESPACES)
        namespacesToReconnect.forEach((el) =>
          reconnectNamespace(el, isAuthenticated)
        )
      }
    },
    [reconnectNamespace, isAuthenticated]
  )

  useEffect(() => {
    // Initialize appropriate sockets based on authentication state
    const namespacesToInitialize = isAuthenticated
      ? Object.values(SOCKET_NAMESPACES)
      : Object.values(PUBLIC_SOCKET_NAMESPACES)

    namespacesToInitialize.forEach((namespace) => {
      const socketInstance = createSocketInstance(namespace, isAuthenticated)
      setupSocketListeners(socketInstance, namespace, isAuthenticated)
      socketInstance.connect()
    })
    // Cleanup function
    return () => {
      Object.values(socketRefs.current).forEach((socketInstance) => {
        if (socketInstance) {
          socketInstance.removeAllListeners()
          // socketInstance.disconnect()
        }
      })
      socketRefs.current = createInitialState(isAuthenticated)
      setSockets(createInitialState(isAuthenticated))
    }
  }, [isAuthenticated, createSocketInstance, setupSocketListeners])

  const contextValue = useMemo(
    () => ({
      sockets,
      reconnect,
    }),
    [sockets, reconnect]
  )

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  )
}

export function useSocket(namespace: SocketNamespace): {
  socket: EnhancedSocket | null
  reconnect: () => void
  reconnectAll: () => void
} {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider')
  }

  const key = namespace.slice(1)
  return {
    socket: context.sockets[key],
    reconnect: () => context.reconnect(namespace),
    reconnectAll: () => context.reconnect(),
  }
}

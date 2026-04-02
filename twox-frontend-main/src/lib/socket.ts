import { Socket } from 'socket.io-client'
import { toast } from 'sonner'

import { getSocketHttpOrigin } from '@/lib/api-base-url'
// socket-types.ts
export const PUBLIC_SOCKET_NAMESPACES = {
  DEFAULT: '/',
  CRASH: '/crash',
  BET_HISTORY: '/bet-history',
  NOTIFICATION: '/notification',
  CHAT: '/chat',
  // APP: '/app',
} as const

export const PRIVATE_SOCKET_NAMESPACES = {
  AUTH: '/auth',
  PRICE: '/price',
  USER: '/user',
  TRIVIA: '/trivia',
  TRANSACTION: '/transaction',
  // CHAT: '/chat',
  // ROULETTE: '/roulette',
  // COINFLIP: '/coinflip',
  // JACKPOT: '/jackpot',
  // BATTLES: '/battles',
  // MINE: '/mine',
  // LIMBO: '/limbo',
} as const

export const SOCKET_NAMESPACES = {
  ...PUBLIC_SOCKET_NAMESPACES,
  ...PRIVATE_SOCKET_NAMESPACES,
} as const

export const SOCKET_EMIT_EVENTS = {
  TRANSACTION: {
    GET_TRANSACTIONS: 'transaction:get',
    JOIN_TRANSACTION_ROOM: 'transaction-room:join',
    LEAVE_TRANSACTION_ROOM: 'transaction-room:leave',
    GET_SERVICE_TRANSACTIONS: 'service-transaction:get',
    GET_GAME_TRANSACTIONS: 'game-transaction:get',
  },
}

export const SOCKET_LISTEN_EVENTS = {
  ERROR: 'error',
  VIP_STATUS_UPDATE: 'vip:statusUpdate',
  VIP_RANK_UP: 'vip:rankUp',
  USER_PROFILE: 'user:profile',
  USER_STATUS: 'user:status',
  AUTH_LOGOUT_SUCCESS: 'auth:logoutSuccess',
  TOKEN_BALANCE_UPDATE: 'balance:update',
  VIP_TIER_UP: 'vip:tierUp',
  TRANSACTION: {
    GET_TRANSACTIONS: 'transaction:get',
    GET_SERVICE_TRANSACTIONS: 'service-transaction:get',
    GET_GAME_TRANSACTIONS: 'game-transaction:get',
    GET_NEW_TRANSACTIONS: 'transaction:new',
    GET_NEW_SERVICE_TRANSACTIONS: 'service-transaction:new',
    GET_NEW_GAME_TRANSACTIONS: 'game-transaction:new',
  },
}

export type PublicSocketNamespace =
  (typeof PUBLIC_SOCKET_NAMESPACES)[keyof typeof PUBLIC_SOCKET_NAMESPACES]

export type PrivateSocketNamespace =
  (typeof PRIVATE_SOCKET_NAMESPACES)[keyof typeof PRIVATE_SOCKET_NAMESPACES]

export type SocketNamespace =
  (typeof SOCKET_NAMESPACES)[keyof typeof SOCKET_NAMESPACES]

export class SocketError extends Error {
  constructor(
    message: string,
    public readonly namespace: string,
    public readonly code?: string
  ) {
    super(message)
    this.name = 'SocketError'
  }
}

export class EnhancedSocket {
  private socket: Socket | null = null
  public isConnected = false
  private isAuthenticated = false
  private namespace = ''
  private reconnectAttempts = 0
  private maxReconnectAttempts = 3
  private readonly isPrivateNamespace: boolean

  constructor(
    socket: Socket | null,
    isAuthenticated: boolean,
    namespace: string
  ) {
    this.socket = socket
    this.isAuthenticated = isAuthenticated
    this.namespace = namespace
    this.isPrivateNamespace = Object.values(PRIVATE_SOCKET_NAMESPACES).includes(
      namespace as PrivateSocketNamespace
    )
  }

  setAuthenticated(status: boolean) {
    this.isAuthenticated = status
  }

  setConnected(status: boolean) {
    this.isConnected = status
    if (status) {
      this.reconnectAttempts = 0
    }
  }

  incrementReconnectAttempts() {
    this.reconnectAttempts++
    return this.reconnectAttempts < this.maxReconnectAttempts
  }

  private handleError(error: Error) {
    const socketError =
      error instanceof SocketError
        ? error
        : new SocketError(error.message, this.namespace)

    console.error(`[${this.namespace}] Socket Error:`, socketError)
    toast.error(socketError.message)
    return socketError
  }

  on(event: string, callback: (...args: any[]) => void) {
    try {
      if (this.socket) {
        this.socket.off(event)
        this.socket.on(event, (...args: any[]) => {
          try {
            callback(...args)
          } catch (error) {
            this.handleError(error as Error)
          }
        })
      }
    } catch (error) {
      this.handleError(error as Error)
    }
  }

  emit(event: string, data?: any) {
    try {
      return new Promise((resolve, reject) => {
        if (this.socket) {
          this.socket.emit(event, data, (response: any) => {
            if (response?.error) {
              reject(new SocketError(response?.error, this.namespace))
            } else {
              resolve(response)
            }
          })
        }
      })
    } catch (error) {
      return Promise.reject(this.handleError(error as Error))
    }
  }

  off(event: string, callback?: (...args: any[]) => void) {
    try {
      if (this.socket) {
        this.socket.off(event, callback)
      }
    } catch (error) {
      this.handleError(error as Error)
    }
  }

  connect() {
    if (this.socket) {
      this.socket.connect()
    }
  }

  removeAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners()
    }
  }

  getSocket() {
    return this.socket
  }

  getNamespace() {
    return this.namespace
  }

  isConnectedStatus() {
    return this.isConnected
  }

  isAuthenticatedStatus() {
    return this.isAuthenticated
  }

  isPrivate() {
    return this.isPrivateNamespace
  }
}

export const getSocketUrl = () => getSocketHttpOrigin()

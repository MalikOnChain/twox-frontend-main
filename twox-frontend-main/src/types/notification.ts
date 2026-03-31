// types/notification.ts

export type NotificationImportance = 'LOW' | 'MEDIUM' | 'HIGH'

export interface Notifications {
  notifications: NotificationItem[]
  pagination: {
    limit: number
    skip: number
    total: number
    hasMore: boolean
  }
}
export interface NotificationItem {
  id: string
  type:
    | 'DEPOSIT_SUCCESS'
    | 'WITHDRAWAL_SUCCESS'
    | 'WITHDRAWAL_PENDING'
    | 'BONUS_RECEIVED'
    | 'CASHBACK_RECEIVED'
    | 'GAME_WIN'
    | 'WAGER_RACE_REWARD'
    | 'REFERRAL_REWARD'
    | 'VIP_LEVEL_UP'
    | 'SYSTEM_ANNOUNCEMENT'
    | 'PROMOTION'
    | 'MAINTENANCE'
    | 'CUSTOM'
  title: string
  message: string
  createdAt: string
  importance: NotificationImportance
  data?: Record<string, any>
  isRead: boolean
}

export interface BonusReceivedData {
  amount: number
  currency: string
  bonusType: string
  bonusName: string
}

export interface NotificationCount {
  count: number
}

// Socket event types
export const SOCKET_EVENTS = {
  // Emit events (from server)
  ERROR: 'error',
  NEW_NOTIFICATION: 'notification:new',
  NOTIFICATIONS: 'notification:list',
  NOTIFICATION_COUNT: 'notification:count',
  NOTIFICATION_READ: 'notification:read',
  NOTIFICATION_DELETED: 'notification:deleted',
  ALL_MARKED_READ: 'notification:all-read',
  ALL_USERS_NOTIFICATION: 'notification:all-users',

  // Listen events (to server)
  CONNECTION: 'connection',
  DISCONNECT: 'disconnect',
  GET_NOTIFICATIONS: 'notification:get',
  GET_UNREAD_COUNT: 'notification:get-count',
  MARK_AS_READ: 'notification:mark-read',
  MARK_ALL_READ: 'notification:mark-all-read',
  DELETE_NOTIFICATION: 'notification:delete',
} as const

export const formatCurrency = (amount: number, currency: string) => {
  // Map of cryptocurrencies and their symbols
  const cryptoMap: Record<string, string> = {
    'USDT': 'USDT',
    'BTC': '₿',
    'ETH': 'Ξ',
    'BNB': 'BNB',
    'USDC': 'USDC',
    'SOL': 'SOL',
    'DOGE': 'Ð',
    'LTC': 'Ł',
    'TRX': 'TRX',
    'XRP': 'XRP',
  }

  // Check if it's a cryptocurrency
  if (cryptoMap[currency.toUpperCase()]) {
    const formatted = amount.toFixed(2)
    return `${formatted} ${cryptoMap[currency.toUpperCase()]}`
  }

  // For fiat currencies, use Intl.NumberFormat
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  } catch (error) {
    // Fallback for unknown currencies
    return `${amount.toFixed(2)} ${currency.toUpperCase()}`
  }
}

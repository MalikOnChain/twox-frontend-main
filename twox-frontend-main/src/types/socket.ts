import { BALANCE_UPDATE_TYPES, IBalance } from '@/types/balance'

export type SocketVipTierUpPayload = {
  userId: string
  newTier: string
  oldTier: string
  timestamp: number
}

export type SocketBalanceUpdatePayload = {
  userId: string
  balance: IBalance
  timestamp: number
  type: BALANCE_UPDATE_TYPES
  metadata: any
}

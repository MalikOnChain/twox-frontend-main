// const GAME_CATEGORIES = {
//   SLOTS: 'Slots',
//   LIVE_CASINO: 'Live Casino',
//   MINES: 'Mines',
//   ROULETTE: 'Roulette',
//   CRASH: 'Crash',
//   CASES: 'Cases',
//   LIMBO: 'Limbo',
// };

// const GAME_TRANSACTION_STATUS = {
//   PENDING: 'PENDING',
//   COMPLETED: 'COMPLETED',
//   FAILED: 'FAILED',
//   CANCELLED: 'CANCELLED',
//   LOSE: 'LOSE',
// }

export type GameTransaction = {
  _id: string
  amount: number
  currency: string
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'LOSE'

  createdAt: string
  updatedAt: string
  category:
    | 'Slots'
    | 'Live Casino'
    | 'Mines'
    | 'Roulette'
    | 'Crash'
    | 'Cases'
    | 'Limbo'

  betAmount: number
  winAmount: number
  userBalance: {
    before: number
    after: number
  }
  type: 'BET' | 'WIN' | 'REFUND' | 'LOSE'
  verified: boolean
}

export type CryptoTransaction = {
  _id: string
  currency: string
  status:
    | 'TRANSACTION_REQUEST'
    | 'TRANSACTION_APPROVED'
    | 'TRANSACTION_REJECTED'
    | 'INCOMING_CONFIRMED_COIN_TX'
    | 'INCOMING_CONFIRMED_TOKEN_TX'
    | 'INCOMING_CONFIRMED_INTERNAL_TX'
    | 'INCOMING_MINED_TX'
    | 'OUTGOING_FAILED'
    | 'OUTGOING_MINED'
    | 'TRANSACTION_BROADCASTED'
    | 'completed'
  createdAt: string
  updatedAt: string
  type: 'DEPOSIT' | 'WITHDRAW'
  blockchain:
    | 'bitcoin'
    | 'litecoin'
    | 'dogecoin'
    | 'ethereum'
    | 'xrp'
    | 'binance-smart-chain'
    | 'tron'
    | 'polygon'
    | 'avalanche'
    | 'arbitrum'
  network:
    | 'mainnet'
    | 'testnet'
    | 'sepolia'
    | 'mordor'
    | 'nile'
    | 'amoy'
    | 'fuji'
  unit: string
  amount: number
  exchangeRate: number
  exchangedAmount: number
  transactionId: string
  blockHash: string
  processingError?: string
  verified: boolean
  address: string
  userBalance: {
    before: number
    after: number
  }
  currentConfirmations: string
  targetConfirmations: string
}

// const SERVICE_TRANSACTION_STATUS = {
//   PENDING: 'PENDING',
//   COMPLETED: 'COMPLETED',
//   FAILED: 'FAILED',
//   CANCELLED: 'CANCELLED',
//   EXPIRED: 'EXPIRED',
// };

export type ServiceTransaction = {
  _id: string
  amount: number
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'EXPIRED'
  userBalance: {
    before: number
    after: number
  }
  type:
    | 'BONUS'
    | 'RACE_PRIZE'
    | 'CASHBACK'
    | 'LOYALTY_REWARD'
    | 'REFERRAL_BONUS'
    | 'VIP_WELCOME_BONUS'

  verified: boolean
  createdAt: string
  updatedAt: string
}

export type Transaction = (
  | GameTransaction
  | CryptoTransaction
  | ServiceTransaction
) & { userId?: string }

export const isCryptoTransaction = (
  transaction: Transaction
): transaction is CryptoTransaction => {
  return transaction.type === 'DEPOSIT' || transaction.type === 'WITHDRAW'
}

export const isServiceTransaction = (
  transaction: Transaction
): transaction is ServiceTransaction => {
  return transaction.type === 'BONUS' || transaction.type === 'RACE_PRIZE'
}

export type GetTransactionsResponse = {
  transactions: Transaction[]
  pagination: {
    total: number
    totalPages: number
    currentPage: number
  }
}

import api from '@/lib/api'

// Transaction types
export interface Transaction {
  _id: string
  userId: string
  amount: number | string
  currency: string
  type: string // 'deposit', 'withdrawal', 'transaction', 'bet', 'win', etc.
  method?: string // e.g. 'fystack_crypto', legacy 'payout_pix'
  status: string | number // Can be numeric (0-5) or string ('active', 'completed', etc.)
  category?: string // For game transactions
  gameId?: string
  gameName?: string
  pixKey?: string
  metadata?: Record<string, any>
  createdAt: string
  updatedAt: string
}

export interface TransactionPagination {
  total?: number
  totalPages: number
  currentPage: number
}

export interface TransactionResponse {
  transactions: Transaction[]
  pagination: TransactionPagination
}

export interface GetTransactionsParams {
  page?: number
  limit?: number
  type?: string // 'all', 'deposits', 'withdrawals', 'bonus'
  currency?: string
  dateFrom?: string
  dateTo?: string
}

// Bonus transaction interface
export interface BonusTransaction {
  _id: string
  userId: string
  bonusId: any
  amount: number
  status: string
  wageringRequired: number
  wageringCompleted: number
  claimedAt: string
  expiresAt?: string
  createdAt: string
  updatedAt: string
}

/**
 * Player wallet activity from GET /transactions (CryptoTransactions / ledger — not PIX).
 */
export const getWalletLedgerTransactions = async (
  params: GetTransactionsParams = {}
): Promise<TransactionResponse> => {
  try {
    const { page = 1, limit = 20, type, currency, dateFrom, dateTo } = params

    const queryParams: any = { page, limit }
    
    if (type && type !== 'all') {
      queryParams['filter[type]'] = type
    }
    if (currency && currency !== 'all') {
      queryParams['filter[currency]'] = currency
    }
    if (dateFrom) {
      queryParams['filter[date_from]'] = dateFrom
    }
    if (dateTo) {
      queryParams['filter[date_to]'] = dateTo
    }

    const response = await api.get<any>('/transactions', { params: queryParams })

    const pagination = response.data?.pagination || {
      total: 0,
      totalPages: 0,
      currentPage: 1,
    }
    return {
      transactions: response.data?.rows || [],
      pagination: {
        total: pagination.total ?? 0,
        totalPages: pagination.totalPages ?? 0,
        currentPage: pagination.currentPage ?? 1,
      },
    }
  } catch (error) {
    console.error('Failed to fetch wallet transactions:', error)
    return { transactions: [], pagination: { total: 0, totalPages: 0, currentPage: 1 } }
  }
}

/** @deprecated Use getWalletLedgerTransactions (name kept for older imports). */
export const getPixTransactions = getWalletLedgerTransactions

/**
 * Get game transactions (bets, wins, etc.)
 */
export const getGameTransactions = async (params: GetTransactionsParams = {}): Promise<TransactionResponse> => {
  try {
    const { page = 1, limit = 20, type, dateFrom, dateTo } = params

    const queryParams: any = { page, limit }
    
    if (type && type !== 'all') {
      queryParams['filter[type]'] = type
    }
    if (dateFrom) {
      queryParams['filter[date_from]'] = dateFrom
    }
    if (dateTo) {
      queryParams['filter[date_to]'] = dateTo
    }

    const response = await api.get<any>('/user/transaction/game', { params: queryParams })
    
    // Normalize response structure
    return {
      transactions: response.data?.transactions || [],
      pagination: response.data?.pagination || { total: 0, totalPages: 0, currentPage: 1 }
    }
  } catch (error) {
    console.error('Failed to fetch game transactions:', error)
    return { transactions: [], pagination: { total: 0, totalPages: 0, currentPage: 1 } }
  }
}

/**
 * Get crypto transactions from `/user/transaction/crypto` (legacy path; may differ from ledger list).
 */
export const getCryptoTransactions = async (params: GetTransactionsParams = {}): Promise<TransactionResponse> => {
  try {
    const { page = 1, limit = 20 } = params

    const response = await api.get<any>('/user/transaction/crypto', { 
      params: { page, limit } 
    })
    
    // Normalize response structure
    return {
      transactions: response.data?.transactions || [],
      pagination: response.data?.pagination || { total: 0, totalPages: 0, currentPage: 1 }
    }
  } catch (error) {
    console.error('Failed to fetch crypto transactions:', error)
    return { transactions: [], pagination: { total: 0, totalPages: 0, currentPage: 1 } }
  }
}

/**
 * Get service transactions
 */
export const getServiceTransactions = async (params: GetTransactionsParams = {}): Promise<TransactionResponse> => {
  try {
    const { page = 1, limit = 20, type, dateFrom, dateTo } = params

    const queryParams: any = { page, limit }
    
    if (type && type !== 'all') {
      queryParams['filter[type]'] = type
    }
    if (dateFrom) {
      queryParams['filter[date_from]'] = dateFrom
    }
    if (dateTo) {
      queryParams['filter[date_to]'] = dateTo
    }

    const response = await api.get<any>('/user/transaction/service', { params: queryParams })
    
    // Normalize response structure
    return {
      transactions: response.data?.transactions || [],
      pagination: response.data?.pagination || { total: 0, totalPages: 0, currentPage: 1 }
    }
  } catch (error) {
    console.error('Failed to fetch service transactions:', error)
    return { transactions: [], pagination: { total: 0, totalPages: 0, currentPage: 1 } }
  }
}

/**
 * Get bonus transactions (from UserBonusBalance)
 */
export const getBonusTransactions = async (params: GetTransactionsParams = {}): Promise<TransactionResponse> => {
  try {
    const { page = 1, limit = 20 } = params

    const response = await api.get<any>('/rewards/bonus/history', { 
      params: { page, limit, status: 'active' } 
    })
    
    // Transform bonus data to match Transaction interface
    const bonuses: any[] = response.data?.data || []
    const transactions: Transaction[] = bonuses.map((bonus) => ({
      _id: bonus._id,
      userId: bonus.userId,
      amount: bonus.initialAmount || bonus.bonusBalance || bonus.amount || 0,
      currency: 'USDT',
      type: 'bonus',
      method: 'bonus_claim',
      status: bonus.status,
      category: bonus.bonusId?.type || bonus.bonusType || 'bonus',
      gameName: bonus.bonusId?.name || 'Bonus Reward',
      metadata: {
        bonusId: bonus.bonusId?._id,
        wageringRequired: bonus.wageringProgress || bonus.wageringRequired || 0,
        wageringCompleted: bonus.wageringProgress || 0,
        bonusBalance: bonus.bonusBalance || 0,
        initialAmount: bonus.initialAmount || 0,
      },
      createdAt: bonus.claimedAt || bonus.createdAt,
      updatedAt: bonus.updatedAt,
    }))

    return {
      transactions,
      pagination: response.data?.pagination || { total: 0, totalPages: 0, currentPage: 1 }
    }
  } catch (error) {
    console.error('Failed to fetch bonus transactions:', error)
    return { transactions: [], pagination: { total: 0, totalPages: 0, currentPage: 1 } }
  }
}

function normalizeLedgerTransaction(row: Record<string, any>): Transaction {
  const typeRaw = String(row?.type || '').toUpperCase()
  const typeNorm =
    typeRaw === 'WITHDRAW'
      ? 'withdraw'
      : typeRaw === 'DEPOSIT'
        ? 'deposit'
        : String(row?.type || 'unknown').toLowerCase()
  return {
    ...row,
    currency: row.currency || row.unit || 'USD',
    type: typeNorm,
    amount:
      row.amount != null && row.amount !== ''
        ? row.amount
        : row.exchangedAmount != null
          ? row.exchangedAmount
          : 0,
  } as Transaction
}

/**
 * Get all transactions combined (wallet ledger + game + legacy crypto + service + bonus).
 * Always pulls recent pages from each source with a generous cap, then merges client-side.
 */
export const getAllTransactions = async (params: GetTransactionsParams = {}): Promise<TransactionResponse> => {
  try {
    const { page = 1, limit = 20, type } = params

    const fetchLimit = Math.min(500, Math.max(150, (type && type !== 'all' ? limit * 3 : limit) * 3))
    const fetchParams = {
      ...params,
      page: 1,
      limit: fetchLimit,
    }

    const [walletLedgerData, gameData, cryptoData, serviceData, bonusData] = await Promise.allSettled([
      getWalletLedgerTransactions(fetchParams),
      getGameTransactions(fetchParams),
      getCryptoTransactions(fetchParams),
      getServiceTransactions(fetchParams),
      getBonusTransactions(fetchParams),
    ])

    const walletLedgerTransactions =
      walletLedgerData.status === 'fulfilled' && Array.isArray(walletLedgerData.value.transactions)
        ? walletLedgerData.value.transactions.map((r) => normalizeLedgerTransaction(r as Record<string, any>))
        : []
    const gameTransactions = gameData.status === 'fulfilled' && Array.isArray(gameData.value.transactions)
      ? gameData.value.transactions 
      : []
    const cryptoTransactions = cryptoData.status === 'fulfilled' && Array.isArray(cryptoData.value.transactions)
      ? cryptoData.value.transactions 
      : []
    const serviceTransactions = serviceData.status === 'fulfilled' && Array.isArray(serviceData.value.transactions)
      ? serviceData.value.transactions 
      : []
    const bonusTransactions = bonusData.status === 'fulfilled' && Array.isArray(bonusData.value.transactions)
      ? bonusData.value.transactions 
      : []

    // Log any failures for debugging
    if (walletLedgerData.status === 'rejected')
      console.warn('Wallet ledger transactions failed:', walletLedgerData.reason)
    if (gameData.status === 'rejected') console.warn('Game transactions failed:', gameData.reason)
    if (cryptoData.status === 'rejected') console.warn('Crypto transactions failed:', cryptoData.reason)
    if (serviceData.status === 'rejected') console.warn('Service transactions failed:', serviceData.reason)
    if (bonusData.status === 'rejected') console.warn('Bonus transactions failed:', bonusData.reason)

    // Combine and sort by date - NO FILTERING HERE, filtering happens client-side
    const allTransactions = [
      ...walletLedgerTransactions,
      ...gameTransactions,
      ...cryptoTransactions,
      ...serviceTransactions,
      ...bonusTransactions,
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    // Return ALL transactions without pagination or filtering
    // The frontend will handle filtering and pagination client-side
    return {
      transactions: allTransactions,
      pagination: {
        total: allTransactions.length,
        totalPages: Math.max(1, Math.ceil(allTransactions.length / limit)),
        currentPage: page,
      },
    }
  } catch (error) {
    console.error('Failed to fetch all transactions:', error)
    return { transactions: [], pagination: { total: 0, totalPages: 0, currentPage: 1 } }
  }
}


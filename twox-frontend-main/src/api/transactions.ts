import api from '@/lib/api'

// Transaction types
export interface Transaction {
  _id: string
  userId: string
  amount: number | string
  currency: string
  type: string // 'deposit', 'withdrawal', 'transaction', 'bet', 'win', etc.
  method?: string // 'payout_pix', 'coinsbuy_crypto', etc.
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
  total: number
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
 * Get all PIX transactions (deposits + withdrawals + Coinsbuy)
 */
export const getPixTransactions = async (params: GetTransactionsParams = {}): Promise<TransactionResponse> => {
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
    
    // Backend returns { rows: [...], pagination: {...} } instead of { transactions: [...] }
    return {
      transactions: response.data?.rows || [],
      pagination: response.data?.pagination || { total: 0, totalPages: 0, currentPage: 1 }
    }
  } catch (error) {
    console.error('Failed to fetch PIX transactions:', error)
    return { transactions: [], pagination: { total: 0, totalPages: 0, currentPage: 1 } }
  }
}

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
 * Get crypto transactions (Vaultody)
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

/**
 * Get all transactions combined
 */
export const getAllTransactions = async (params: GetTransactionsParams = {}): Promise<TransactionResponse> => {
  try {
    const { page = 1, limit = 20, type } = params

    // Determine how much to fetch based on filter type
    const fetchLimit = type && type !== 'all' ? limit * 2 : Math.ceil(limit / 5)
    
    // Fetch from all sources with error handling
    const [pixData, gameData, cryptoData, serviceData, bonusData] = await Promise.allSettled([
      getPixTransactions({ ...params, limit: fetchLimit }),
      getGameTransactions({ ...params, limit: fetchLimit }),
      getCryptoTransactions({ ...params, limit: fetchLimit }),
      getServiceTransactions({ ...params, limit: fetchLimit }),
      getBonusTransactions({ ...params, limit: fetchLimit }),
    ])

    // Extract successful results with validation
    const pixTransactions = pixData.status === 'fulfilled' && Array.isArray(pixData.value.transactions) 
      ? pixData.value.transactions 
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
    if (pixData.status === 'rejected') console.warn('PIX transactions failed:', pixData.reason)
    if (gameData.status === 'rejected') console.warn('Game transactions failed:', gameData.reason)
    if (cryptoData.status === 'rejected') console.warn('Crypto transactions failed:', cryptoData.reason)
    if (serviceData.status === 'rejected') console.warn('Service transactions failed:', serviceData.reason)
    if (bonusData.status === 'rejected') console.warn('Bonus transactions failed:', bonusData.reason)

    // Combine and sort by date - NO FILTERING HERE, filtering happens client-side
    const allTransactions = [
      ...pixTransactions,
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
        totalPages: Math.ceil(allTransactions.length / limit),
        currentPage: page,
      },
    }
  } catch (error) {
    console.error('Failed to fetch all transactions:', error)
    return { transactions: [], pagination: { total: 0, totalPages: 0, currentPage: 1 } }
  }
}


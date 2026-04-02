import api from '@/lib/api'

export interface WalletAddress {
  address: string
  blockchain: string
  network: string
  label: string
  walletType: 'metamask' | 'phantom' | 'vaultody' | 'fystack' | 'manual'
  createdAt: string
}

export interface GroupedWalletAddresses {
  metamask: WalletAddress[]
  phantom: WalletAddress[]
  vaultody: WalletAddress[]
  fystack: WalletAddress[]
  manual: WalletAddress[]
}

export interface WalletAddressesResponse {
  success: boolean
  data: WalletAddress[]
  grouped: GroupedWalletAddresses
}

/**
 * Fetch all wallet addresses for the current user, grouped by wallet type
 */
export const getWalletAddresses = async (): Promise<WalletAddressesResponse> => {
  try {
    const response = await api.get('/user/wallet/addresses')
    const data = response.data
    if (data.grouped && !data.grouped.fystack) {
      data.grouped.fystack = []
    }
    return data
  } catch (error) {
    console.error('Failed to fetch wallet addresses:', error)
    throw error
  }
}

/**
 * Get balance for a specific blockchain address
 */
export const getAddressBalance = async (
  blockchain: string,
  address: string
): Promise<{ balance: number }> => {
  try {
    const response = await api.get('/blockchain/balance', {
      params: { blockchain, address },
    })
    return { balance: response.data.data.balance }
  } catch (error) {
    console.error(`Failed to fetch balance for ${blockchain}:`, error)
    return { balance: 0 }
  }
}

/**
 * Get balances for multiple addresses at once
 */
export const getMultipleBalances = async (
  addresses: Array<{ blockchain: string; address: string }>
): Promise<Array<{ blockchain: string; address: string; balance: number }>> => {
  try {
    const response = await api.post('/blockchain/balances', { addresses })
    return response.data.data
  } catch (error) {
    console.error('Failed to fetch multiple balances:', error)
    return addresses.map(addr => ({ ...addr, balance: 0 }))
  }
}


import api from '@/lib/api'
import { handleApiError } from '@/lib/error-handler'

export interface DepositAddressRow {
  blockchain: string
  network: string
  address: string
  label?: string
  walletType?: string
  createdAt?: string
  qrCode?: string | null
}

export async function getCryptoDepositAddresses(): Promise<DepositAddressRow[]> {
  try {
    const res = await api.get<{ success: boolean; data: DepositAddressRow[] }>(
      '/crypto/deposit-addresses'
    )
    if (!res.data.success || !Array.isArray(res.data.data)) {
      return []
    }
    return res.data.data
  } catch (error) {
    throw handleApiError(error, 'Failed to load deposit addresses')
  }
}

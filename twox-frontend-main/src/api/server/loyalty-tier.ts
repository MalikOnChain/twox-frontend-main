// app/lib/loyalty.ts
import { baseUrl } from './consts'

export const getLoyaltyTiers = async () => {
  const endpoint = '/vip/ranking-info'
  const response = await fetch(`${baseUrl}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
    credentials: 'include',
  })
  return response
}

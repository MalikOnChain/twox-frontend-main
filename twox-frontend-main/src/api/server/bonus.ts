// app/lib/loyalty.ts
import { baseUrl } from './consts'

export const getBonuses = async () => {
  const endpoint = '/rewards/bonuses'
  const response = await fetch(`${baseUrl}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
    credentials: 'include',
    next: {
      revalidate: 0,
    },
  })
  return response
}

// app/lib/loyalty.ts
import { baseUrl } from './consts'

export const getSettings = async () => {
  const endpoint = '/settings'
  const response = await fetch(`${baseUrl}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
    credentials: 'include',
  })
  return response
}

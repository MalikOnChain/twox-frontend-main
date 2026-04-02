import {
  getServerFetchApiBase,
  shellStubJsonResponse,
} from '@/lib/api-base-url'

export const getBonuses = async () => {
  const baseUrl = getServerFetchApiBase()
  if (!baseUrl) return shellStubJsonResponse()

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

import {
  getServerFetchApiBase,
  shellStubJsonResponse,
} from '@/lib/api-base-url'

export const getSettings = async () => {
  const baseUrl = getServerFetchApiBase()
  if (!baseUrl) return shellStubJsonResponse()

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

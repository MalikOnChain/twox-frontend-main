// lib/api.ts
import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios'

import storageHandler from '@/lib/storage-utils'

// Token management with type safety
const tokenStorage = storageHandler({ key: 'token' })
const referralCodeStorage = storageHandler({ key: 'ref' })

// Environment variables
export const API_URL = process.env.NEXT_PUBLIC_BACKEND_API
if (!API_URL) {
  console.warn('Backend API URL is not defined in environment variables')
}

// Create and configure axios instance
export const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 30000, // Add a reasonable timeout
})

// Constants
const AUTH_TOKEN_HEADER = 'x-auth-token'

/** Do not treat failed login / token exchange as "session expired" (avoid redirect + broken UX). */
function isAuthCredentialRequest(config: { method?: string; url?: string }): boolean {
  const method = (config.method || 'get').toLowerCase()
  if (method !== 'post') return false
  const url = config.url || ''
  const suffixes = [
    '/auth/registration/login',
    '/auth/registration/register',
    '/auth/signin',
    '/auth/exchange-token',
  ]
  return suffixes.some((p) => url === p || url.endsWith(p))
}

/**
 * Add request interceptor to handle authentication and timezone
 */
api.interceptors.request.use(
  (request) => {
    const token = tokenStorage.getValue()
    if (token) {
      request.headers['x-auth-token'] = `${token}`
      request.headers['timezone'] =
        Intl.DateTimeFormat().resolvedOptions().timeZone
    }
    const referralCode = referralCodeStorage.getValue()
    if (referralCode) {
      request.headers['x-referral-code'] = referralCode
    }
    return request
  },
  (error) => {
    return Promise.reject(error)
  }
)

/**
 * Add response interceptor to handle token refresh and errors
 */
api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    // Check if new auth token exists in response headers
    const newAccessToken = response.headers[AUTH_TOKEN_HEADER]

    if (newAccessToken) {
      tokenStorage.setValue(newAccessToken)
    }

    return response
  },
  async (error: AxiosError): Promise<never> => {
    // Handle network errors (no response received)
    if (!error.response) {
      return Promise.reject(
        new Error('Network error: Please check your internet connection')
      )
    }

    // Session invalid: only redirect if we actually had a token (guest 403s must surface errors, e.g. game list)
    const status = error.response.status
    if (status === 403 || status === 401) {
      const hadToken = Boolean(tokenStorage.getValue())
      if (
        hadToken &&
        error.config &&
        !isAuthCredentialRequest(error.config)
      ) {
        tokenStorage.removeValue()
        window.location.href = '/'
        await new Promise((resolve) => setTimeout(resolve, 5000))
      }
      return Promise.reject(error)
    }

    return Promise.reject(error)
  }
)

export default api

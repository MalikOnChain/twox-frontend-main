// lib/errorHandler.ts
import axios, { AxiosError } from 'axios'
import { toast } from 'sonner'

import {
  ClientUnreachableApiError,
  describeAxiosNetworkFailure,
  isClientUnreachableApiError,
  isLikelyApiConnectivityMessage,
  toastApiUnreachable,
} from '@/lib/api-network-error'

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

/** True when the axios layer already showed a deduplicated connectivity toast. */
export function shouldSuppressConnectivityToast(error: unknown): boolean {
  if (isClientUnreachableApiError(error)) return true
  if (
    error instanceof ApiError &&
    error.statusCode === 0 &&
    isLikelyApiConnectivityMessage(error.message)
  ) {
    return true
  }
  return false
}

export function toastErrorUnlessConnectivityShown(
  error: unknown,
  fallbackMessage = 'Something went wrong'
): void {
  if (shouldSuppressConnectivityToast(error)) return
  if (error instanceof Error && error.message) {
    toast.error(error.message)
  } else {
    toast.error(fallbackMessage)
  }
}

export const handleApiError = (
  error: unknown,
  defaultMessage = 'An unexpected error occurred'
): never => {
  if (isClientUnreachableApiError(error)) {
    throw error
  }

  // Handle Axios errors - check both instanceof and duck typing
  if (
    axios.isAxiosError(error) ||
    (typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'ERR_NETWORK' &&
      'name' in error &&
      error.name === 'AxiosError')
  ) {
    const axiosError = error as AxiosError<{ error?: string; message?: string }>

    if (!axiosError.response) {
      const msg = describeAxiosNetworkFailure(axiosError)
      if (typeof window !== 'undefined') {
        toastApiUnreachable(msg)
        throw new ClientUnreachableApiError(msg)
      }
      throw new ApiError(msg, 0)
    }

    const errorData = axiosError.response?.data
    const statusCode = axiosError.response?.status

    throw new ApiError(
      errorData?.error || errorData?.message || defaultMessage,
      statusCode
    )
  }

  // Handle standard errors
  if (error instanceof Error) {
    throw new ApiError(error.message)
  }

  // Handle unknown errors
  throw new ApiError(defaultMessage)
}

// Type guard to check if an error is an ApiError
export const isApiError = (error: unknown): error is ApiError => {
  return error instanceof ApiError
}

// Helper function to extract error message for display
export const getErrorMessage = (error: unknown): string => {
  if (isApiError(error)) {
    return error.message
  }
  if (error instanceof Error) {
    return error.message
  }
  return 'An unexpected error occurred'
}

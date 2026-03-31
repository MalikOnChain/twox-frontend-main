// api/auth.ts
import { api, API_URL } from '@/lib/api'
import { handleApiError } from '@/lib/error-handler'
import storageHandler from '@/lib/storage-utils'

import { LoginFormValues, RegisterFormValues } from '@/schema/auth'

import { AUTH_PROVIDER_KEYS } from '@/types/auth'
import { IBalance } from '@/types/balance'
import { UserDepositAddress } from '@/types/crypto'
import { IUser } from '@/types/user'

export interface AuthResponse {
  redirect?: string
  message?: string
  error?: string
  identifier?: string
  success?: boolean
  needsVerification?: boolean
}

export interface FetchNonceResponse {
  nonce?: string
  error?: string
}

export interface ValidateRecaptchaResponse {
  success?: boolean
  error?: string
}

export const signIn = async (
  credentials: LoginFormValues,
  fingerprint?: { visitorId: string; fingerprintData?: any }
): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>(
      '/auth/registration/login',
      {
        ...credentials,
        ...(fingerprint && {
          fingerprint: {
            visitorId: fingerprint.visitorId,
            data: fingerprint.fingerprintData,
          },
        }),
      }
    )
    return response.data
  } catch (error) {
    throw handleApiError(error, 'Failed to sign in')
  }
}

export const signUp = async (
  credentials: RegisterFormValues,
  fingerprint?: { visitorId: string; fingerprintData?: any }
): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>(
      '/auth/registration/register',
      {
        ...credentials,
        ...(fingerprint && {
          fingerprint: {
            visitorId: fingerprint.visitorId,
            data: fingerprint.fingerprintData,
          },
        }),
      }
    )
    return response.data
  } catch (error) {
    throw handleApiError(error, 'Failed to sign up')
  }
}

export const exchangeToken = async (
  identifier: string
): Promise<{ token: string }> => {
  try {
    const response = await api.post<{ token: string }>('/auth/exchange-token', {
      identifier,
    })
    return response.data
  } catch (error) {
    throw handleApiError(error, 'Failed to exchange token')
  }
}

export const signOut = () => {
  const { removeValue } = storageHandler({ key: 'token' })
  removeValue()
}

export interface UserResponse {
  error?: string
  user: IUser
  balance: IBalance
  depositAddresses: UserDepositAddress[]
}

export const getUser = async (): Promise<UserResponse> => {
  try {
    const response = await api.get<UserResponse>('/user')

    if (response.data.error) {
      throw new Error(response.data.error)
    }

    return response.data
  } catch (error) {
    throw handleApiError(error, 'Failed to get user')
  }
}

export const oAuthLogin = (provider: string) => {
  try {
    if (typeof window === 'undefined') return
    const { getValue } = storageHandler({ key: 'ref' })
    const referralCode = getValue()
    const currentPath = encodeURIComponent(window.location.pathname)
    let url = `${API_URL}/auth/${provider}`
    
    // Add query params for OAuth providers (Telegram uses widget, not redirect)
    if (
      provider === AUTH_PROVIDER_KEYS.GOOGLE ||
      provider === AUTH_PROVIDER_KEYS.DISCORD
    ) {
      url += `?redirect=${currentPath}${referralCode ? `&ref=${referralCode}` : ''}`
    }
    
    window.location.href = url
  } catch (error) {
    throw handleApiError(error, 'Failed to oauth login')
  }
}

export const fetchWalletLoginNonce = async ({
  address,
  chain = 'ethereum',
}: {
  address: string | null
  chain?: string
}): Promise<FetchNonceResponse> => {
  try {
    const response = await api.post<FetchNonceResponse>(
      '/auth/wallet/connect',
      { address: address, chain: chain }
    )

    if (response.data.error) {
      throw new Error(response.data.error)
    }
    return response.data
  } catch (error) {
    throw handleApiError(error, 'Failed to fetch wallet nonce!')
  }
}

export const validateRecaptcha = async ({
  token,
}: {
  token: string
}): Promise<ValidateRecaptchaResponse> => {
  try {
    const response = await api.post<ValidateRecaptchaResponse>(
      '/auth/validate-recaptcha',
      { token }
    )

    if (response.data.error) {
      throw new Error(response.data.error)
    }
    return response.data
  } catch (error) {
    console.error(error, 'Failed to validate recaptcha!')

    throw handleApiError(error, 'Failed to validate recaptcha!')
  }
}

export const walletLogin = async ({
  address,
  chain = 'ethereum',
  signature = null,
}: {
  signature: string | null
  address: string | null
  chain?: string
}): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/auth/wallet/verify', {
      address: address,
      chain: chain,
      signature: signature,
    })
    return response.data
  } catch (error) {
    throw handleApiError(error, 'Failed to fetch wallet nonce!')
  }
}

export const createDepositIntent = async ({
  address,
  recipient,
  chain = 'ethereum',
  currency = 'USDC',
  amount = '1',
  signature,
}: {
  address: string | null
  chain?: string
  currency?: string
  amount?: string
  signature: string
  recipient: string | null
}): Promise<any> => {
  try {
    const response = await api.post<any>('/auth/wallet/deposit', {
      address: address,
      chain: chain,
      currency: currency,
      amount: amount,
      signature: signature,
      recipient: recipient,
    })

    if (response.data.error) {
      throw new Error(response.data.error)
    }
    return response.data
  } catch (error) {
    throw handleApiError(error, 'Failed to create deposit intent!')
  }
}

export const fetchWalletDepositNonce = async ({
  address,
  chain = 'ethereum',
  currency = 'USDC',
  amount = '1',
}: {
  address: string | null
  chain?: string
  currency?: string
  amount?: string
}): Promise<FetchNonceResponse> => {
  try {
    const response = await api.post<FetchNonceResponse>(
      '/auth/wallet/deposit',
      { address: address, chain: chain, currency: currency, amount: amount }
    )

    if (response.data.error) {
      throw new Error(response.data.error)
    }
    return response.data
  } catch (error) {
    throw handleApiError(error, 'Failed to fetch wallet deposit nonce!')
  }
}

export const requestForgotPassword = async (email: string) => {
  try {
    const response = await api.post<AuthResponse>(
      '/auth/registration/forgot_password',
      { email }
    )
    return response.data
  } catch (error) {
    throw handleApiError(error, 'Failed to request forgot password')
  }
}

export interface VerifyOTPPayload {
  email: string
  code: string
}

export const verifyOTP = async (payload: VerifyOTPPayload) => {
  try {
    const response = await api.post<AuthResponse>(
      '/auth/registration/verify_code',
      payload
    )
    return response.data
  } catch (error) {
    throw handleApiError(error, 'Failed to verify OTP')
  }
}

export interface VerifyEmailPayload {
  emailVerificationToken: string
}

export const verifyEmail = async (payload: VerifyEmailPayload) => {
  try {
    const response = await api.post<AuthResponse>(
      '/auth/registration/verify-email',
      payload
    )
    return response.data
  } catch (error) {
    throw handleApiError(error, 'Failed to verify email!')
  }
}

export interface resetPasswordPayload {
  email: string
  code: string
  password: string
  recaptcha?: string | null
}

export const resetPassword = async (payload: resetPasswordPayload) => {
  try {
    const response = await api.post<AuthResponse>(
      '/auth/registration/new_password',
      payload
    )
    return response.data
  } catch (error) {
    throw handleApiError(error, 'Failed to reset password')
  }
}

export const resendVerificationEmail = async (
  email: string
): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>(
      '/auth/registration/resend-verification-email',
      { email }
    )
    return response.data
  } catch (error) {
    throw handleApiError(error, 'Failed to resend verification email')
  }
}

// Waiting List Auth APIs
export const waitingListSignIn = async (
  credentials: LoginFormValues
): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>(
      '/waiting-list/auth/login',
      credentials
    )
    return response.data
  } catch (error) {
    throw handleApiError(error, 'Failed to sign in to waiting list')
  }
}

export const waitingListSignUp = async (
  credentials: RegisterFormValues
): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>(
      '/waiting-list/auth/register',
      credentials
    )
    return response.data
  } catch (error) {
    throw handleApiError(error, 'Failed to sign up for waiting list')
  }
}

export const waitingListExchangeToken = async (
  identifier: string
): Promise<{ token: string }> => {
  try {
    const response = await api.post<{ token: string }>('/waiting-list/auth/exchange-token', {
      identifier,
    })
    return response.data
  } catch (error) {
    throw handleApiError(error, 'Failed to exchange waiting list token')
  }
}

export const waitingListOAuthLogin = (provider: string) => {
  try {
    if (typeof window === 'undefined') return
    const { getValue } = storageHandler({ key: 'ref' })
    const referralCode = getValue()
    const currentPath = encodeURIComponent(window.location.pathname)
    let url = `${API_URL}/waiting-list/auth/${provider}`
    
    // Add query params for OAuth providers (Telegram uses widget, not redirect)
    if (
      provider === AUTH_PROVIDER_KEYS.GOOGLE ||
      provider === AUTH_PROVIDER_KEYS.DISCORD
    ) {
      url += `?redirect=${currentPath}${referralCode ? `&ref=${referralCode}` : ''}`
    }
    
    window.location.href = url
  } catch (error) {
    throw handleApiError(error, 'Failed to oauth login to waiting list')
  }
}

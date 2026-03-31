import { AuthResponse } from '@/api/auth'

import api from '@/lib/api'
import { handleApiError } from '@/lib/error-handler'

import { IReferredUser, IUpdateProfile, KYCStatus } from '@/types/user'

export interface UserStatisticsResponse {
  error?: string
  statistics: {
    totalWageredAmount: number
    totalDepositAmount: number
    totalWithdrawAmount: number
  }
}

export const getUserStatistics = async (): Promise<UserStatisticsResponse> => {
  try {
    const response = await api.get<UserStatisticsResponse>('/user/statistics')

    if (response.data.error) {
      throw new Error(response.data.error)
    }

    return response.data
  } catch (error) {
    throw handleApiError(error, 'Failed to get user')
  }
}

export const requestChangeEmail = async (newEmail: string) => {
  try {
    const response = await api.post<AuthResponse>(
      '/user/send_email_change_code',
      { newEmail }
    )
    return response.data
  } catch (error) {
    throw handleApiError(error, 'Failed to request forgot password')
  }
}

export const changeEmail = async (newEmail: string, code: string) => {
  try {
    const response = await api.post<AuthResponse>('/user/change_email', {
      newEmail,
      code,
    })
    if (response.data.error) {
      throw new Error(response.data.error)
    }
    return response.data
  } catch (error) {
    throw handleApiError(error, 'Failed to verify OTP')
  }
}

interface updatePasswordResponse {
  success: boolean
  msg: string
}

export const updatePassword = async (
  oldPassword: string,
  newPassword: string
) => {
  try {
    const response = await api.post<updatePasswordResponse>(
      '/user/update_password',
      { currentPass: oldPassword, newPass: newPassword }
    )
    if (!response.data.success) {
      throw new Error(response.data.msg)
    }
    return response.data
  } catch (error) {
    throw handleApiError(error, 'Failed to verify OTP')
  }
}

export const updateProfile = async (data: IUpdateProfile) => {
  try {
    const response = await api.post<updatePasswordResponse>(
      '/user/update_profile',
      data
    )

    return response.data
  } catch (error) {
    throw handleApiError(error, 'Failed to verify OTP')
  }
}

interface getSumsubWebSDKAccessTokenResponse {
  success: boolean
  token: string
  error?: string
}

// interface GetKYCAccessTokenResponse {
//   success: boolean
//   accessToken: string
//   error?: string
// }

// interface   GetKYCStatusResponse {
//   success: boolean
//   status: string
//   error?: string
// }

export const getSumsubWebSDKAccessToken = async () => {
  try {
    const response =
      await api.post<getSumsubWebSDKAccessTokenResponse>('/sumsub/signup-sdk')
    if (response.data.error) {
      throw new Error(response.data.error)
    }
    return response.data
  } catch (error) {
    throw handleApiError(error, 'Failed to create sumsub applicant')
  }
}

// export const getKYCAccessToken = async (applicantId: string) => {
//   try {
//     const response = await api.get<GetKYCAccessTokenResponse>(
//       `/sumsub/kyc-access-token`,
//       { params: { applicantId } }
//     )
//     if (response.data.error) {
//       throw new Error(response.data.error)
//     }
//     return response.data
//   } catch (error) {
//     throw handleApiError(error, 'Failed to get kyc link')
//   }
// }

export const getKYCStatus = async () => {
  try {
    const response = await api.get<KYCStatus>('/user/kyc-status')
    return response.data
  } catch (error) {
    throw handleApiError(error, 'Failed to get kyc status')
  }
}

export interface ReferredUsersResponse {
  users: IReferredUser[]
  error?: string
}

export const getReferredUsers = async () => {
  try {
    const response = await api.post<ReferredUsersResponse>('/user/friends')
    if (response.data.error) {
      throw new Error(response.data.error)
    }
    return response.data
  } catch (error) {
    throw handleApiError(error, 'Failed to get referred users')
  }
}

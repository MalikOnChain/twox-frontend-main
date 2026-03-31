import api from '@/lib/api'

export interface UpdateProfileData {
  username?: string
  fullName?: string
  phoneNumber?: string
  CPFNumber?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
}

export interface EmailChangeRequest {
  newEmail: string
}

export interface EmailChangeConfirm {
  newEmail: string
  code: string
}

export interface PasswordChangeRequest {
  currentPass: string
  newPass: string
}

/**
 * Send email change verification code
 */
export const sendEmailChangeCode = async (newEmail: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await api.post('/user/send_email_change_code', { newEmail })
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to send verification code')
  }
}

/**
 * Confirm email change with verification code
 */
export const changeEmail = async (newEmail: string, code: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await api.post('/user/change_email', { newEmail, code })
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to change email')
  }
}

/**
 * Update user profile (including phone number)
 */
export const updateProfile = async (data: UpdateProfileData): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await api.post('/user/update_profile', data)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update profile')
  }
}

/**
 * Update phone number only
 */
export const updatePhoneNumber = async (phoneNumber: string): Promise<{ success: boolean; message: string; phoneNumber: string }> => {
  try {
    const response = await api.post('/user/update_phone', { phoneNumber })
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update phone number')
  }
}

/**
 * Update password
 */
export const updatePassword = async (currentPass: string, newPass: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await api.post('/user/update_password', { currentPass, newPass })
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update password')
  }
}

/**
 * Update CPF number
 */
export const updateCPFNumber = async (CPFNumber: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await api.post('/user/update_cpf', { CPFNumber })
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update CPF number')
  }
}

/**
 * User preferences interfaces
 */
export interface UserPreferences {
  language: string
  timezone: string
  currency: string
  notifications: {
    email: boolean
    push: boolean
    inApp: boolean
  }
}

export interface UpdatePreferencesData {
  language?: string
  timezone?: string
  currency?: string
  notifications?: {
    email?: boolean
    push?: boolean
    inApp?: boolean
  }
}

/**
 * Get user preferences
 */
export const getUserPreferences = async (): Promise<UserPreferences> => {
  try {
    const response = await api.get('/user/preferences')
    return response.data.preferences
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to get preferences')
  }
}

/**
 * Update user preferences
 */
export const updateUserPreferences = async (data: UpdatePreferencesData): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await api.post('/user/preferences', data)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update preferences')
  }
}

/**
 * User session interface
 */
export interface UserSession {
  _id: string
  userId: string
  ipAddress: string
  ipInfo?: {
    city?: string
    country?: string
    region?: string
  }
  userAgent: string
  device?: string
  createdAt: string
  updatedAt: string
}

/**
 * Get user login sessions
 */
export const getUserSessions = async (limit = 20): Promise<UserSession[]> => {
  try {
    const response = await api.get('/user/sessions', { params: { limit } })
    return response.data.sessions
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to get sessions')
  }
}

/**
 * Remove a specific session
 */
export const removeSession = async (sessionId: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await api.post('/user/sessions/remove', { sessionId })
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to remove session')
  }
}

/**
 * Remove all sessions
 */
export const removeAllSessions = async (): Promise<{ success: boolean; message: string; deletedCount: number }> => {
  try {
    const response = await api.post('/user/sessions/remove-all')
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to remove all sessions')
  }
}

/**
 * KYC information interface
 */
export interface KYCInfo {
  firstName: string
  lastName: string
  dateOfBirth: string
  address: string
  city: string
  postalCode: string
  status?: string
}

/**
 * Get KYC information
 */
export const getKYCInfo = async (): Promise<KYCInfo | null> => {
  try {
    const response = await api.get('/user/kyc-info')
    return response.data.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to get KYC information')
  }
}

/**
 * Submit KYC information
 */
export const submitKYCInfo = async (data: KYCInfo): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await api.post('/user/kyc-info', data)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to submit KYC information')
  }
}


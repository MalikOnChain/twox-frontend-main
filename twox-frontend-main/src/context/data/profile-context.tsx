import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  getReferredUsers,
  getUserStatistics,
  ReferredUsersResponse,
  UserStatisticsResponse,
} from '@/api/profile'
import { getUserRankStatus } from '@/api/vip'

import { useUser } from '@/context/user-context'

import { UserRankStatus } from '@/types/vip'

interface ProfileContextType {
  userStatistics: UserStatisticsResponse | null
  userRankStatus: UserRankStatus | null
  referredUsers: ReferredUsersResponse | null
  setUserStatistics: (statistics: UserStatisticsResponse | null) => void
  setUserRankStatus: (rankStatus: UserRankStatus | null) => void
  setReferredUsers: (rankStatus: ReferredUsersResponse | null) => void
  fetchUserStatistics: () => Promise<UserStatisticsResponse | null>
  fetchUserRankStatus: () => Promise<UserRankStatus | null>
  fetchReferredUsers: () => Promise<ReferredUsersResponse | null>
  isLoading: boolean
  error: string | null
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userStatistics, setUserStatistics] =
    useState<UserStatisticsResponse | null>(null)
  const { isAuthenticated } = useUser()
  const [userRankStatus, setUserRankStatus] = useState<UserRankStatus | null>(
    null
  )

  const [referredUsers, setReferredUsers] =
    useState<ReferredUsersResponse | null>(null)

  const fetchUserStatistics = useCallback(async () => {
    setIsLoading(true)
    try {
      const statistics = await getUserStatistics()
      setUserStatistics(statistics)
      return statistics
    } catch (error) {
      setError(error as string)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchReferredUsers = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await getReferredUsers()
      setReferredUsers(response)
      return response
    } catch (error) {
      setError(error as string)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchUserRankStatus = useCallback(async () => {
    setIsLoading(true)
    try {
      const rankStatus = await getUserRankStatus()
      setUserRankStatus(rankStatus)
      return rankStatus
    } catch (error) {
      setError(error as string)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!isAuthenticated) return
    fetchUserStatistics()
    fetchUserRankStatus()
    fetchReferredUsers()
  }, [
    fetchUserStatistics,
    isAuthenticated,
    fetchUserRankStatus,
    fetchReferredUsers,
  ])

  const value = useMemo(
    () => ({
      userStatistics,
      userRankStatus,
      setUserStatistics,
      setUserRankStatus,
      referredUsers,
      setReferredUsers,
      fetchReferredUsers,
      isLoading,
      error,
      fetchUserStatistics,
      fetchUserRankStatus,
    }),
    [
      userStatistics,
      userRankStatus,
      referredUsers,
      setUserStatistics,
      setUserRankStatus,
      setReferredUsers,
      isLoading,
      error,
      fetchUserStatistics,
      fetchUserRankStatus,
      fetchReferredUsers,
    ]
  )

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  )
}

export const useProfile = (): ProfileContextType => {
  const context = useContext(ProfileContext)
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider')
  }
  return context
}

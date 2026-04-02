// contexts/user-context.tsx
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { toast } from 'sonner'

import { exchangeToken, getUser, verifyEmail } from '@/api/auth'

import {
  setAuthSessionCookie,
  syncAuthSessionCookieFromStorage,
} from '@/lib/auth-session-cookie'
import { toastErrorUnlessConnectivityShown } from '@/lib/error-handler'
import {
  BLOCKCHAIN_PROTOCOL_NAME,
  USDT_NETWORKS,
  UsdtDepositAddress,
} from '@/lib/crypto'
import storageHandler from '@/lib/storage-utils'
import useStorage from '@/hooks/features/use-storage'

import { useLoading } from './loading-context'

import { IBalance } from '@/types/balance'
import { UserDepositAddress } from '@/types/crypto'
import { IUser } from '@/types/user'

interface UserContextType {
  user: IUser | null
  balance: IBalance | null
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>
  setBalance: React.Dispatch<React.SetStateAction<IBalance | null>>
  logout: () => Promise<void>
  getLoggedInUser: () => Promise<void>
  checkAuth: (identifier?: string) => Promise<void>
  isAuthenticated: boolean
  depositAddresses: UserDepositAddress[] | null
  usdtDepositAddresses: Record<USDT_NETWORKS, UsdtDepositAddress> | null
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null)
  const [balance, setBalance] = useState<IBalance | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const searchparams = useSearchParams()
  const router = useRouter()
  const [depositAddresses, setDepositAddresses] = useState<
    UserDepositAddress[]
  >([])

  const [identifier, setIdentifier] = useState<string>('')
  const [emailVerificationToken, setEmailVerificationToken] =
    useState<string>('')

  const usdtDepositAddresses: Record<USDT_NETWORKS, UsdtDepositAddress> | null =
    useMemo(() => {
      if (!depositAddresses) return null
      const ethereumAddress = depositAddresses.find(
        (addr) => addr.blockchain === BLOCKCHAIN_PROTOCOL_NAME.ETHEREUM
      )
      const bnbAddress = depositAddresses.find(
        (addr) =>
          addr.blockchain === BLOCKCHAIN_PROTOCOL_NAME.BINANCE_SMART_CHAIN
      )
      const tronAddress = depositAddresses.find(
        (addr) => addr.blockchain === BLOCKCHAIN_PROTOCOL_NAME.TRON
      )
      return {
        [USDT_NETWORKS.ERC20]: {
          address: ethereumAddress?.address || '',
          qrCode: ethereumAddress?.qrCode || '',
        },
        [USDT_NETWORKS.BEP20]: {
          address: bnbAddress?.address || '',
          qrCode: bnbAddress?.qrCode || '',
        },
        [USDT_NETWORKS.TRC20]: {
          address: tronAddress?.address || '',
          qrCode: tronAddress?.qrCode || '',
        },
      }
    }, [depositAddresses])

  const { setIsLoading } = useLoading()
  const {
    setValue: setToken,
    getValue: getToken,
    removeValue: removeToken,
  } = useStorage({ key: 'token' })

  const handleLogout = useCallback(() => {
    removeToken()
    setIdentifier('')
    setUser(null)
    setIsAuthenticated(false)
  }, [removeToken])

  const checkAuth = useCallback(
    async (identifier?: string) => {
      try {
        if (!identifier) throw new Error('Identifier is not received')

        const { token: exchangedToken } = await exchangeToken(identifier)
        setToken(exchangedToken)
        const storedToken = getToken()
        if (!storedToken) {
          toast.error('Login failed...')
          return
        }
        const { user, balance, depositAddresses } = await getUser()
        setUser(user)
        setBalance(balance)
        setDepositAddresses(depositAddresses)
        setIsAuthenticated(true)
        setAuthSessionCookie()
        setIdentifier('')
        const { removeValue } = storageHandler({ key: 'ref' })
        removeValue()
        toast.success(`Welcome back! ${user.username || ''}`)
      } catch (error) {
        handleLogout()
        if (error instanceof Error) {
          toast.error(error.message)
        } else {
          toast.error('Failed to get user')
        }
      }
    },
    [getToken, setToken, handleLogout, router]
  )

  const getLoggedInUser = useCallback(async () => {
    try {
      const storedToken = getToken()
      if (!storedToken) {
        setIsLoading(false)
        return
      }
      const { user, balance, depositAddresses } = await getUser()
      setUser(user)
      setBalance(balance)
      setDepositAddresses(depositAddresses)
      setIsAuthenticated(true)
      setAuthSessionCookie()

      const { removeValue } = storageHandler({ key: 'ref' })
      removeValue()
    } catch (error) {
      handleLogout()
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Failed to get user')
      }
    }
    setIsLoading(false)
  }, [setIsLoading, handleLogout, getToken])

  const logout = useCallback(async () => {
    try {
      handleLogout()
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Failed to logout')
      }
    }
  }, [handleLogout])

  const verifyEmailToken = useCallback(
    async (emailVerificationToken: string) => {
      try {
        const response = await verifyEmail({ emailVerificationToken })
        setEmailVerificationToken('')
        toast.success(response.message || 'Verified email successfully!')
        if (response.identifier) {
          checkAuth(response.identifier)
        }
      } catch (error) {
        toastErrorUnlessConnectivityShown(error, 'Failed to verify email!')
      }
    },
    [checkAuth]
  )

  useEffect(() => {
    const identifier_param = searchparams.get('identifier')
    const warning_param = searchparams.get('warning')
    const error = searchparams.get('error')
    const emailVerificationToken_param = searchparams.get(
      'emailVerificationToken'
    )
    if (identifier_param) {
      setIdentifier(identifier_param)
    }
    if (emailVerificationToken_param) {
      setEmailVerificationToken(emailVerificationToken_param)
    }

    if (warning_param) {
      toast.error(warning_param)
    }
    if (typeof window !== 'undefined' && identifier_param && !error) {
      router.replace(window.location.pathname)
    }
  }, [searchparams, router])

  useEffect(() => {
    if (identifier) {
      checkAuth(identifier)
    }
  }, [identifier, checkAuth])

  useEffect(() => {
    if (emailVerificationToken) {
      verifyEmailToken(emailVerificationToken)
    }
  }, [verifyEmailToken, emailVerificationToken])

  useEffect(() => {
    getLoggedInUser()
  }, [getLoggedInUser])

  useEffect(() => {
    syncAuthSessionCookieFromStorage()
  }, [])

  const value = useMemo(
    () => ({
      user,
      balance,
      setUser,
      setBalance,
      logout,
      checkAuth,
      getLoggedInUser,
      isAuthenticated,
      depositAddresses,
      usdtDepositAddresses,
    }),
    [
      user,
      balance,
      setUser,
      setBalance,
      logout,
      checkAuth,
      getLoggedInUser,
      isAuthenticated,
      depositAddresses,
      usdtDepositAddresses,
    ]
  )

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

// Custom hook for using the user context
export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

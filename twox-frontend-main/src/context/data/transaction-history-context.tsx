import { useQuery } from '@tanstack/react-query'
import { createContext, ReactNode, useContext, useMemo, useState } from 'react'

import { getGameTransactions, getServiceTransactions } from '@/api/transaction'

import { useUser } from '@/context/user-context'

import {
  // CryptoTransaction,
  GameTransaction,
  ServiceTransaction,
} from '@/types/transaction'

interface TransactionContextType {
  // cryptoTransactions: CryptoTransaction[]
  // fetchCryptoTransactions: () => void
  gameTransactions: GameTransaction[]
  serviceTransactions: ServiceTransaction[]
  fetchGameTransactions: () => void
  fetchServiceTransactions: () => void
  gameTransactionPage: number
  cryptoTransactionPage: number
  serviceTransactionPage: number
  setGameTransactionPage: (page: number) => void
  setCryptoTransactionPage: (page: number) => void
  setServiceTransactionPage: (page: number) => void
  isLoading: boolean
}

const TransactionContext = createContext<TransactionContextType | undefined>(
  undefined
)

export const TransactionHistoryProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const [gameTransactionPage, setGameTransactionPage] = useState(1)
  const [cryptoTransactionPage, setCryptoTransactionPage] = useState(1)
  const [serviceTransactionPage, setServiceTransactionPage] = useState(1)
  const { isAuthenticated } = useUser()
  const {
    data: gameTransactions = [] as GameTransaction[],
    isLoading: isLoadingGame,
    refetch: fetchGameTransactions,
  } = useQuery<GameTransaction[]>({
    queryKey: ['gameTransactions', gameTransactionPage],
    enabled: isAuthenticated,
    queryFn: () =>
      getGameTransactions(gameTransactionPage).then((res) => res.transactions),
  })

  // const {
  //   data: cryptoTransactions = [] as CryptoTransaction[],
  //   isLoading: isLoadingCrypto,
  //   refetch: fetchCryptoTransactions,
  // } = useQuery<CryptoTransaction[]>({
  //   queryKey: ['cryptoTransactions', cryptoTransactionPage],
  //   enabled: isAuthenticated,
  //   queryFn: () =>
  //     getCryptoTransactions(cryptoTransactionPage).then(
  //       (res) => res.transactions
  //     ),
  // })

  const {
    data: serviceTransactions = [] as ServiceTransaction[],
    isLoading: isLoadingService,
    refetch: fetchServiceTransactions,
  } = useQuery<ServiceTransaction[]>({
    queryKey: ['serviceTransactions', serviceTransactionPage],
    enabled: isAuthenticated,
    queryFn: () =>
      getServiceTransactions(serviceTransactionPage).then(
        (res) => res.transactions
      ),
  })

  const value = useMemo(
    () => ({
      gameTransactions,
      // cryptoTransactions,
      serviceTransactions,
      fetchGameTransactions,
      // fetchCryptoTransactions,
      fetchServiceTransactions,
      gameTransactionPage,
      cryptoTransactionPage,
      serviceTransactionPage,
      setGameTransactionPage,
      setCryptoTransactionPage,
      setServiceTransactionPage,
      isLoading: isLoadingGame || isLoadingService,
    }),
    [
      gameTransactions,
      serviceTransactions,
      fetchGameTransactions,
      fetchServiceTransactions,
      gameTransactionPage,
      cryptoTransactionPage,
      serviceTransactionPage,
      setGameTransactionPage,
      setCryptoTransactionPage,
      setServiceTransactionPage,
      isLoadingGame,
      isLoadingService,
      // isLoadingCrypto,
      // cryptoTransactions,
      // fetchCryptoTransactions,
    ]
  )

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  )
}

export const useTransactionHistory = () => {
  const context = useContext(TransactionContext)
  if (context === undefined) {
    throw new Error(
      'useTransactionHistory must be used within a TransactionProvider'
    )
  }
  return context
}

export default TransactionHistoryProvider

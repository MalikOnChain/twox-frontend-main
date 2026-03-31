// contexts/GameProviderContext.js
'use client'

import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'

import { getGames, getGamesProviders, getGameCategories } from '@/api/game'

import { TProviderGameItem, TProviderGameType, TGameProvider } from '@/types/game'
import { TPagination } from '@/types/pagination'

interface GameProviderContextType {
  games: TProviderGameItem[]
  providers: TGameProvider[]
  categories: string[]
  loading: boolean
  initialLoading: boolean
  providerChangeLoading: boolean
  provider: string
  category: string
  error: string | null
  pagination: TPagination
  searchQuery: string
  fetchGames: ({
    offset,
    limit,
    type,
    sortBy,
    sortOrder,
    featurebuySupported,
  }: {
    offset: number
    limit: number
    type: TProviderGameType
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
    featurebuySupported?: boolean
  }) => Promise<void>
  loadMore: (type: TProviderGameType) => Promise<void>
  resetGames: () => void
  setProvider: Dispatch<SetStateAction<string>>
  setCategory: Dispatch<SetStateAction<string>>
  setInitialLoading: Dispatch<SetStateAction<boolean>>
  setSearchQuery: Dispatch<SetStateAction<string>>
  fetchProviders: (type: TProviderGameType) => Promise<void>
  fetchCategories: () => Promise<void>
}

const GameProviderContext = createContext<GameProviderContextType | undefined>(
  undefined
)

export function GameProviderProvider({ children }: { children: ReactNode }) {
  const [provider, setProvider] = useState<string>('p0')
  const [category, setCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [games, setGames] = useState<TProviderGameItem[]>([])
  const [providers, setProviders] = useState<TGameProvider[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [initialLoading, setInitialLoading] = useState<boolean>(true)
  const [providerChangeLoading, setProviderChangLoading] =
    useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<TPagination>({
    offset: 0,
    limit: 12,
    total: 0,
    hasMore: true,
  })

  const fetchGames = useCallback(
    async ({
      offset = 0,
      limit = 12,
      type,
      sortBy,
      sortOrder,
      featurebuySupported,
    }: {
      offset: number
      limit: number
      type: TProviderGameType
      sortBy?: string
      sortOrder?: 'asc' | 'desc'
      featurebuySupported?: boolean
    }) => {
      try {
        setLoading(true)
        setError(null)
        if (offset === 0) {
          setProviderChangLoading(true)
        }

        const response = await getGames({
          offset,
          limit,
          type,
          provider,
          category,
          query: searchQuery,
          sortBy,
          sortOrder,
          featurebuySupported,
        })
        if (response.error) {
          throw new Error(response.error)
        }

        const data = response.data

        if (offset === 0) {
          setGames(data)
        } else {
          setGames((prev) => [...prev, ...data])
        }

        setPagination({
          offset: offset,
          limit: limit,
          total: response.pagination.total,
          hasMore: response.pagination.hasMore,
        })
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message)
        } else {
          setError('Error while getting game list')
        }
      } finally {
        setLoading(false)
        if (offset === 0) {
          setProviderChangLoading(false)
        }
        setInitialLoading(false)
      }
    },
    [provider, category, searchQuery]
  )

  const loadMore = useCallback(
    async (type: TProviderGameType) => {
      if (!loading && pagination.hasMore) {
        if (type === 'all') {
          await fetchGames({
            offset: pagination.offset + pagination.limit,
            limit: pagination.limit,
            type,
            sortBy: 'plays',
            sortOrder: 'desc'
          })
        } else {
          await fetchGames({
            offset: pagination.offset + pagination.limit,
            limit: pagination.limit,
            type,
          })
        }
      }
    },
    [loading, pagination, fetchGames]
  )

  const resetGames = useCallback(() => {
    setGames([])
    setPagination({
      offset: 0,
      limit: 12,
      total: 0,
      hasMore: true,
    })
  }, [])

  const fetchProviders = useCallback(
    async (type: TProviderGameType) => {
      try {
        setError(null)
        const response = await getGamesProviders({ type })
        if (response.error) {
          throw new Error(response.error)
        }
        setProviders(response.data)
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message)
        } else {
          setError('Error while getting providers')
        }
      }
    },
    []
  )

  const fetchCategories = useCallback(async () => {
    try {
      setError(null)
      const response = await getGameCategories()
      if (response.error) {
        throw new Error(response.error)
      }
      setCategories(response.data)
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('Error while getting categories')
      }
    }
  }, [])

  const value = useMemo(
    () => ({
      initialLoading,
      provider,
      category,
      games,
      providers,
      categories,
      loading,
      error,
      pagination,
      providerChangeLoading,
      searchQuery,
      fetchGames,
      loadMore,
      resetGames,
      setProvider,
      setCategory,
      setInitialLoading,
      setSearchQuery,
      fetchProviders,
      fetchCategories,
    }),
    [
      initialLoading,
      provider,
      category,
      games,
      providers,
      categories,
      loading,
      error,
      pagination,
      providerChangeLoading,
      searchQuery,
      fetchGames,
      loadMore,
      resetGames,
      setProvider,
      setCategory,
      setInitialLoading,
      setSearchQuery,
      fetchProviders,
      fetchCategories,
    ]
  )

  return (
    <GameProviderContext.Provider value={value}>
      {children}
    </GameProviderContext.Provider>
  )
}

export function useGameProvider() {
  const context = useContext(GameProviderContext)
  if (!context) {
    throw new Error(
      'useGameProvider must be used within a GameProviderProvider'
    )
  }
  return context
}

import { useCallback, useEffect, useState } from 'react'

import type { GiphyGif } from '@/api/giphy'
import * as giphyApi from '@/api/giphy'

import { ImagePreloader } from '@/lib/image-preloader'

interface EnhancedGif extends GiphyGif {
  isOriginalLoaded?: boolean
}

const useGif = () => {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [gifs, setGifs] = useState<EnhancedGif[]>([])

  const preloadOriginal = async (gif: EnhancedGif) => {
    try {
      const preloader = new ImagePreloader(gif.images.fixed_height.url)
      await preloader.load()
      setGifs((currentGifs) =>
        currentGifs.map((g) =>
          g._id === gif._id ? { ...g, isOriginalLoaded: true } : g
        )
      )
    } catch (error) {
      console.error('Failed to load original gif:', error)
    }
  }

  const searchGifs = async ({
    query,
    offset = 0,
    limit = 10,
  }: {
    query: string
    offset?: number
    limit?: number
  }) => {
    try {
      setLoading(true)
      setError(null)
      const response = await giphyApi.searchGifs({ query, offset, limit })
      const newGifs = response.data.map((gif) => ({
        ...gif,
        isOriginalLoaded: false,
      }))
      setGifs(newGifs)
      // Preload all GIFs after setting them in state
      newGifs.forEach((gif) => preloadOriginal(gif))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search GIFs')
      setGifs([])
    } finally {
      setLoading(false)
    }
  }

  const getTrendingGifs = useCallback(
    async ({
      limit = 10,
      offset = 0,
    }: {
      limit?: number
      offset?: number
    } = {}) => {
      try {
        setLoading(true)
        setError(null)
        const response = await giphyApi.getTrendingGifs({ limit, offset })
        const newGifs = response.data.map((gif) => ({
          ...gif,
          isOriginalLoaded: false,
        }))
        setGifs(newGifs)
        // Preload all GIFs after setting them in state
        newGifs.forEach((gif) => preloadOriginal(gif))
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to get trending GIFs'
        )
        setGifs([])
      } finally {
        setLoading(false)
      }
    },
    []
  )

  useEffect(() => {
    getTrendingGifs({ limit: 10 })
  }, [getTrendingGifs])

  return {
    searchGifs,
    getTrendingGifs,
    loading,
    error,
    gifs,
  }
}

export default useGif

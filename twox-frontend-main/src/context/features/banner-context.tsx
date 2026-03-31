import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { getAllBanners } from '@/api/banner'

import { Banner, BannerSection } from '@/types/banner'

interface BannerContextType {
  banners: Banner[] | null
  setBanners: (banners: Banner[] | null) => void
  fetchBanners: () => Promise<Banner[] | null>
  isLoading: boolean
  error: string | null
}

interface UseBannerProps {
  section?: BannerSection
}

const BannerContext = createContext<BannerContextType | undefined>(undefined)

export const BannerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [banners, setBanners] = useState<Banner[] | null>(null)

  const fetchBanners = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const banners = await getAllBanners()
      console.log('BannerContext - Fetched banners:', banners)
      if (banners && banners.banners) {
        setBanners(banners.banners)
        return banners.banners
      } else {
        console.warn('BannerContext - No banners in response:', banners)
        setBanners([])
        return []
      }
    } catch (error) {
      console.error('BannerContext - Error fetching banners:', error)
      const errorMessage = error instanceof Error ? error.message : String(error)
      setError(errorMessage)
      setBanners([])
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBanners()
  }, [fetchBanners])

  const value = useMemo(
    () => ({
      banners,
      setBanners,
      fetchBanners,
      isLoading,
      error,
    }),
    [banners, setBanners, fetchBanners, isLoading, error]
  )

  return (
    <BannerContext.Provider value={value}>{children}</BannerContext.Provider>
  )
}

export const useBanner = ({
  section,
}: UseBannerProps = {}): BannerContextType => {
  const context = useContext(BannerContext)
  if (context === undefined) {
    throw new Error('useBanner must be used within a BannerProvider')
  }

  const filteredValue = useMemo(() => {
    if (!section || !context.banners) {
      return context
    }

    const filtered = context.banners
      .filter((banner) => {
        // Normalize section comparison (case-insensitive, trim whitespace)
        const bannerSection = String(banner.section || '').toLowerCase().trim()
        const targetSection = String(section || '').toLowerCase().trim()
        return bannerSection === targetSection
      })
      .sort((a, b) => {
        // Handle both string and number positions
        const posA = typeof a.position === 'number' ? a.position : parseInt(String(a.position), 10) || 0
        const posB = typeof b.position === 'number' ? b.position : parseInt(String(b.position), 10) || 0
        return posA - posB
      })

    // Debug logging
    if (section) {
      console.log(`BannerContext - Filtered banners for section "${section}":`, {
        total: context.banners.length,
        filtered: filtered.length,
        banners: filtered,
      })
    }

    return {
      ...context,
      banners: filtered,
    }
  }, [context, section])

  return filteredValue
}

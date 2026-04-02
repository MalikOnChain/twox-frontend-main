'use client'

import { Search } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { useGameProvider } from '@/context/games/game-provider-context'

import { isLikelyApiConnectivityMessage } from '@/lib/api-network-error'
import { cn } from '@/lib/utils'

import GamePreviewer from '@/components/pages/(game)/slots-casino/game/game-previewer'
import Banner from '@/components/pages/home/banner/banner'
import ContentSectionDisplay from '@/components/templates/content-section/content-section'
import GamingRanking from '@/components/templates/game-rank-table/game-rank-table'
import LatestWinners from '@/components/templates/latest-winners/latest-winners'
import GameGridLoader from '@/components/templates/loading/game-grid-loader'
import GamePageLoader from '@/components/templates/loading/game-page-loader'
import ProviderSection from '@/components/templates/provider-section/provider-section'
import ResponsiveFilter from '@/components/templates/responsive-filter/responsive-filter'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import plusIcon from '@/assets/icons/plusicon.png'

import { Skeleton } from '../../../../ui/skeleton'

import { TProviderGameType } from '@/types/game'

export default function GameList({
  type,
  isFilters = true,
  session,
}: {
  type: TProviderGameType
  isFilters?: boolean
  session?: string
}) {
  const {
    games,
    provider,
    setProvider,
    category,
    setCategory,
    providers,
    categories,
    fetchProviders,
    fetchCategories,
    loading,
    initialLoading,
    error,
    pagination,
    providerChangeLoading,
    fetchGames,
    loadMore,
    setSearchQuery,
    searchQuery,
  } = useGameProvider()
  const loadMoreRef = useRef<HTMLButtonElement>(null)
  const [selectedProviders, setSelectedProviders] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [sort, setSort] = useState<string>('')

  const { t } = useTranslation()

  const handleLoadMore = async () => {
    await loadMore(type)
    // setTimeout(() => {
    //   if (loadMoreRef.current) {
    //     loadMoreRef.current.scrollIntoView({
    //       behavior: 'smooth',
    //       block: 'end',
    //     })
    //   }
    // }, 100)
  }

  const selectedProvider = useMemo(() => {
    if (provider === 'all') return 'All Providers'
    const _provider = providers.find((p) => p.code === provider)
    return _provider?.name
  }, [provider, providers])

  useEffect(() => {
    fetchProviders(type)
    fetchCategories()
  }, [fetchProviders, fetchCategories, type])

  useEffect(() => {
    const timeId = setTimeout(() => {
      if (session === 'popular') {
        // For 'all' type, use the same sorting as Popular Slots
        fetchGames({ 
          offset: 0, 
          limit: 28, 
          type: type,
          sortBy: 'plays',
          sortOrder: 'desc'
        })
      } else {
        fetchGames({ offset: 0, limit: type === 'livecasino' ? 24 : 28, type: type })
      }
    }, 200)

    return () => clearTimeout(timeId)
  }, [fetchGames, type])

  useEffect(() => {
    if (!error) return
    if (isLikelyApiConnectivityMessage(error)) return
    toast.error(error)
  }, [error])

  if (error) {
    return null
  }

  const toggleProvider = (code: string) => {
    setProvider(code || 'all')
  }

  if (initialLoading) return <GamePageLoader type={type} />

  // Handler functions
  const handleProviderChange = (values: string[]) => {
    setSelectedProviders(values)
    console.log('Selected Providers:', values)
    setProvider(values[values.length - 1] || 'all')
  }

  const handleCategoryChange = (values: string[]) => {
    setSelectedCategories(values)
    console.log('Selected Categories:', values)
  }

  const handleFiltersChange = async (providers: string[], categories: string[]) => {
    console.log('🔍 Filter change triggered:', { providers, categories })
    setSelectedProviders(providers)
    setSelectedCategories(categories)
    
    // For now, handle single provider/category selection to work with current backend API
    // TODO: Implement multiple selection support in backend
    let selectedProvider = 'all'
    let selectedCategory = 'all'
    
    if (providers.length > 0) {
      selectedProvider = providers[providers.length - 1] // Use the last selected provider
    }
    
    if (categories.length > 0) {
      selectedCategory = categories[categories.length - 1] // Use the last selected category
    }
    
    console.log('🎯 Selected filters:', { selectedProvider, selectedCategory })
    
    // Update the context state first
    setProvider(selectedProvider)
    setCategory(selectedCategory)
    
    // Wait a bit for state to update, then trigger fetch
    setTimeout(async () => {
      try {
        console.log('📡 Fetching games with filters:', { selectedProvider, selectedCategory, type })
        if (session === 'popular') {
          await fetchGames({ 
            offset: 0, 
            limit: 28, 
            type: type,
            sortBy: 'plays',
            sortOrder: 'desc'
          })
        } else {
          await fetchGames({ 
            offset: 0, 
            limit: type === 'livecasino' ? 24 : 28, 
            type: type
          })
        }
      } catch (error) {
        console.error('Error fetching filtered games:', error)
      }
    }, 100)
  }

  return (
    <div>
      <Banner />
      <div className='flex flex-wrap items-center justify-end gap-2 pb-8 sm:flex-nowrap md:justify-between md:gap-3'>
        {/* <ToggleGroup
          type='single'
          value={provider}
          onValueChange={toggleProvider}
          variant='secondary'
          className='flex w-full gap-3 overflow-x-auto md:gap-2'
        >
          <ToggleGroupItem
            value='all'
            variant='secondary'
            className='h-7 whitespace-nowrap bg-background-third px-4 md:h-8'
          >
            <div className='flex items-center gap-2'>
              {t('game_list.all')}
              {provider === 'all' && (
                <span className='text-sm text-success-300'>
                  {pagination.total}
                </span>
              )}
            </div>
          </ToggleGroupItem>
          {providers.map((item) => (
            <ToggleGroupItem
              key={item._id}
              value={item.code}
              variant='secondary'
              className='h-7 whitespace-nowrap bg-background-third px-4 md:h-8'
            >
              <div className='flex items-center gap-2'>
                {item.name}
                {provider === item.code && (
                  <span className='text-sm text-success-300'>
                    {item.gamesCount}
                  </span>
                )}
              </div>
            </ToggleGroupItem>
          ))}
        </ToggleGroup> */}
        <div
          className={cn(
            'mb-4 h-8 md:mb-0',
            isFilters ? 'w-full md:max-w-[300px] xl:max-w-[452px]' : 'w-full'
          )}
        >
          <Input
            type='search'
            placeholder={t('game_list.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='min-h-9 w-full border-none'
            startAddon={<Search className='size-4 !text-white' />}
            wrapperClassName='border border-mirage'
          />
        </div>
        {isFilters && (
          <div className='flex w-full flex-row-reverse items-center justify-between gap-4 sm:w-fit sm:flex-row'>
            <ResponsiveFilter
              providers={providers}
              categories={categories.map((cat, index) => ({
                _id: `cat_${index}`,
                code: cat,
                name: cat.charAt(0).toUpperCase() + cat.slice(1).replace(/-/g, ' ')
              }))}
              selectedProviders={selectedProviders}
              selectedCategories={selectedCategories}
              onFiltersChange={handleFiltersChange}
            />
            <Select
              value={sort}
              onValueChange={(value) => {
                setSort(value)
              }}
            >
              <SelectTrigger
                className='!h-[36px] !max-h-[36px] !min-h-[36px] !w-[125px] rounded-lg border border-[#404044] bg-gradient-to-b from-[#242327] to-[#151419] px-[15px] py-2 font-satoshi text-sm text-white focus:outline-none focus:ring-0 focus:ring-offset-0 md:!h-[36px] md:!min-h-[36px] [&>svg]:opacity-70'
                style={{
                  background:
                    'linear-gradient(180deg, #242327 0%, #151419 100%)',
                }}
              >
                <SelectValue placeholder='Popular' className='!font-bold' />
              </SelectTrigger>
              <SelectContent
                className='min-h-[122px] rounded-lg border border-[#222328] bg-[#141317] p-[5px] shadow-lg'
                sideOffset={8}
              >
                <div className='flex flex-col gap-2'>
                  {['Popular', 'Recent', 'A-Z', 'Z-A'].map((item) => (
                    <SelectItem
                      hideIndicator
                      key={item}
                      value={item.toLowerCase()}
                      className='min-h-[24px] cursor-pointer rounded py-2 text-white hover:bg-[#1f1f23] focus:bg-[#1f1f23] data-[highlighted]:bg-[#1f1f23]'
                    >
                      <div className='flex w-full flex-1 flex-row justify-between'>
                        <div className='flex-1 font-satoshi text-sm'>
                          {item}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </div>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
      {providerChangeLoading ? (
        <>
          <Skeleton className='mb-4 h-[33px] w-[200px] md:mb-[18px]' />
          <GameGridLoader type={type} />
        </>
      ) : (
        <>
          {games.length === 0 && (
            <div className='text-md flex justify-center gap-2 py-20 text-center font-bold uppercase md:text-lg'>
              <span>{t('game_list.no_games_found')}</span>
            </div>
          )}

          {/* Games Grid */}
          <div
            className={`grid grid-cols-3 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-5 ${
              type === 'livecasino' ? 'xl:grid-cols-7' : 'xl:grid-cols-7'
            }`}
          >
            {games.map((game) => (
              <div key={game._id}>
                <GamePreviewer item={game} type={type} />
              </div>
            ))}
          </div>

          {/* Load More Button */}
          {pagination.hasMore && (
            <div className='mt-8 flex justify-center'>
              <Button
                onClick={handleLoadMore}
                size='sm'
                disabled={loading}
                loading={loading}
                ref={loadMoreRef}
                variant='secondary2'
                className='px-5 uppercase md:px-10'
              >
                <Image src={plusIcon} alt='games' width={10} height={10} />
                {t('game_list.load_more')}
              </Button>
            </div>
          )}
        </>
      )}
      <div className='mt-20 space-y-4 md:space-y-7'>
        <ProviderSection />
        <LatestWinners />
        <GamingRanking />
        <ContentSectionDisplay />
      </div>
    </div>
  )
}


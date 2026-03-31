'use client'

import Image from 'next/image'
import { useCallback, useEffect, useReducer, useState } from 'react'
import { toast } from 'sonner'

import { getSkins } from '@/api/skins'

import SkinGridLoader, {
  SkinPageLoader,
} from '@/components/templates/loading/skin-loader'
import SkinPreviewer from '@/components/templates/skin/skin-previewer'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'

import plusIcon from '@/assets/icons/plusicon.png'

import { TPagination } from '@/types/pagination'
import { SKIN_TYPES, SkinItem } from '@/types/skins'

const ITEMS_PER_PAGE = 12

const skinTypeLabels: Record<SKIN_TYPES, string> = {
  [SKIN_TYPES.CSGO]: 'CS:GO',
  [SKIN_TYPES.DOTA2]: 'Dota 2',
  [SKIN_TYPES.TF2]: 'Rust',
}

// Define state and action types
type State = {
  skinType: SKIN_TYPES
  offset: number
  allSkins: SkinItem[]
  pagination: TPagination
}

type Action =
  | { type: 'SET_SKIN_TYPE'; payload: SKIN_TYPES }
  | {
      type: 'SET_INITIAL_DATA'
      payload: { items: SkinItem[]; pagination: TPagination }
    }
  | {
      type: 'APPEND_SKINS'
      payload: { items: SkinItem[]; pagination: TPagination }
    }

// Reducer function
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_SKIN_TYPE':
      return {
        ...state,
        skinType: action.payload,
        offset: 0,
        allSkins: [],
      }
    case 'SET_INITIAL_DATA':
      return {
        ...state,
        allSkins: action.payload.items,
        pagination: action.payload.pagination,
      }
    case 'APPEND_SKINS':
      return {
        ...state,
        offset: state.offset + ITEMS_PER_PAGE,
        allSkins: [...state.allSkins, ...action.payload.items],
        pagination: action.payload.pagination,
      }
    default:
      return state
  }
}

const SkinsListPage = () => {
  const [state, dispatch] = useReducer(reducer, {
    skinType: SKIN_TYPES.CSGO,
    offset: 0,
    allSkins: [],
    pagination: {
      total: 0,
      offset: 0,
      limit: 0,
      hasMore: false,
    },
  })

  const [isLoading, setIsLoading] = useState(true)
  const [isFetching, setIsFetching] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const { skinType, offset, allSkins, pagination } = state

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true)
      setIsFetching(true)

      try {
        const data = await getSkins({
          type: skinType,
          limit: ITEMS_PER_PAGE,
          offset: 0,
        })

        dispatch({
          type: 'SET_INITIAL_DATA',
          payload: {
            items: data.items || [],
            pagination: {
              total: data.pagination.total || 0,
              offset: data.pagination.offset || 0,
              limit: data.pagination.limit || 0,
              hasMore: data.pagination.hasMore || false,
            },
          },
        })
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message)
        } else {
          toast.error('Failed to fetch skins')
        }
      } finally {
        setIsLoading(false)
        setIsFetching(false)
      }
    }

    fetchInitialData()
  }, [skinType])

  // Load more function
  const loadMore = async () => {
    if (isLoadingMore) return

    setIsLoadingMore(true)
    const newOffset = offset + ITEMS_PER_PAGE

    try {
      const moreData = await getSkins({
        type: skinType,
        limit: ITEMS_PER_PAGE,
        offset: newOffset,
      })

      dispatch({
        type: 'APPEND_SKINS',
        payload: {
          items: moreData.items || [],
          pagination: {
            total: moreData.pagination.total || 0,
            offset: moreData.pagination.offset || 0,
            limit: moreData.pagination.limit || 0,
            hasMore: moreData.pagination.hasMore || false,
          },
        },
      })

      // Scroll to show new content
      requestAnimationFrame(() => {
        window.scrollTo({
          top: document.body.scrollHeight - 800,
          behavior: 'smooth',
        })
      })
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Failed to load more skins')
      }
    } finally {
      setIsLoadingMore(false)
    }
  }

  // Handler for skin type change
  const handleSkinTypeChange = useCallback((value: SKIN_TYPES) => {
    dispatch({ type: 'SET_SKIN_TYPE', payload: value })
  }, [])

  // Render loading state
  if (isLoading && offset === 0) {
    return <SkinPageLoader />
  }

  return (
    <div className='container mx-auto'>
      <div className='mb-8 flex items-center justify-between'>
        <span className='flex items-center justify-center rounded-md bg-muted px-6 py-2.5 font-bold leading-[1]'>
          Game Skins
        </span>

        <Select
          value={skinType}
          onValueChange={(value: string) =>
            handleSkinTypeChange(value as SKIN_TYPES)
          }
        >
          <SelectTrigger className='h-9 w-[250px]'>
            <SelectValue placeholder='Select Game Type' />
          </SelectTrigger>
          <SelectContent>
            {Object.values(SKIN_TYPES).map((type) => (
              <SelectItem key={type} value={type}>
                {skinTypeLabels[type]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isFetching && offset === 0 ? (
        <>
          <Skeleton className='mb-2 h-7 w-[230px]' />
          <SkinGridLoader />
        </>
      ) : (
        <>
          <div className='mb-2 flex gap-4 text-lg font-bold'>
            {skinTypeLabels[skinType]} Skins
            <span className='text-primary'>
              {allSkins.length} {pagination.hasMore ? '+' : ''}
            </span>
          </div>

          {/* Skins Grid */}
          <div className='grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6'>
            {allSkins.map((skin, index) => (
              <SkinPreviewer key={`${skin.classid}-${index}`} item={skin} />
            ))}
          </div>

          {/* Show message if no skins available */}
          {allSkins.length === 0 && !isFetching && (
            <div className='py-12 text-center'>
              <p className='text-xl'>No skins available for this game type.</p>
            </div>
          )}

          {/* Load More Button */}
          {pagination.hasMore && (
            <div className='mt-8 flex justify-center'>
              <Button
                onClick={loadMore}
                size='sm'
                loading={isLoadingMore}
                disabled={isLoadingMore}
                variant='secondary2'
                className='px-5 uppercase md:px-10'
              >
                <Image src={plusIcon} alt='games' width={10} height={10} />
                Load More
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default SkinsListPage

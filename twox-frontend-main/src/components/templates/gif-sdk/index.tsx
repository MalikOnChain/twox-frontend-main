import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

import { GiphyGif } from '@/api/giphy'

import { cn } from '@/lib/utils'
import useGif from '@/hooks/features/use-gif'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
interface GifSdkProps {
  setIsGifVisible: (isGifVisible: boolean) => void
  onSelect?: (gif: GiphyGif) => void
  className?: string
}

const GifSdk = ({ onSelect, className, setIsGifVisible }: GifSdkProps) => {
  const { loading, error, searchGifs, getTrendingGifs, gifs } = useGif()
  const [searchQuery, setSearchQuery] = useState('')
  const [offset, setOffset] = useState(0)
  const limit = 10

  const handleSearch = async () => {
    setOffset(0)
    if (searchQuery.trim()) {
      await searchGifs({
        query: searchQuery,
        offset: 0,
        limit,
      })
    } else {
      await getTrendingGifs({ limit })
    }
  }

  const handleTrending = async () => {
    setOffset(0)
    await getTrendingGifs({ limit })
  }

  const handleNext = async () => {
    const newOffset = offset + limit
    setOffset(newOffset)
    if (searchQuery.trim()) {
      if (searchQuery === '') {
        await getTrendingGifs({ offset: newOffset, limit })
      } else {
        await searchGifs({
          query: searchQuery,
          offset: newOffset,
          limit,
        })
      }
    } else {
      await getTrendingGifs({ offset: newOffset, limit })
    }
  }

  const handlePrevious = async () => {
    const newOffset = Math.max(0, offset - limit)
    setOffset(newOffset)
    if (searchQuery.trim()) {
      if (searchQuery === '') {
        await getTrendingGifs({ offset: newOffset, limit })
      } else {
        await searchGifs({
          query: searchQuery,
          offset: newOffset,
          limit,
        })
      }
    } else {
      await getTrendingGifs({ offset: newOffset, limit })
    }
  }

  const handleGifClick = (gif: GiphyGif) => {
    onSelect?.(gif)
  }

  return (
    <div className={cn('w-full p-4', className)}>
      <X
        size={14}
        onClick={() => setIsGifVisible(false)}
        className='absolute right-2 top-1 rounded-sm opacity-70 ring-offset-background transition-opacity hover:cursor-pointer hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary'
      />
      <div className='mb-4 mt-4 flex flex-col gap-2'>
        <Input
          type='text'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder='Search GIFs...'
          className='flex-1 rounded border p-2'
          wrapperClassName='md:h-9'
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <div className='flex w-full justify-between gap-2 px-2'>
          <Button onClick={handleSearch} disabled={loading}>
            Search
          </Button>
          <Button onClick={handleTrending} disabled={loading}>
            Trending
          </Button>
        </div>
      </div>

      {error && (
        <div className='mb-4 rounded bg-red-100 p-3 text-red-700'>{error}</div>
      )}

      {loading ? (
        <div className='grid min-h-[150px] grid-cols-5 gap-1'>
          {Array.from({ length: limit }).map((_, index) => (
            <div
              key={`skeleton-${index}`}
              className='aspect-square animate-pulse rounded bg-gray-200'
            />
          ))}
        </div>
      ) : (
        <>
          <div className='grid min-h-[150px] grid-cols-5 gap-1'>
            {gifs.map((gif, index) => {
              return (
                <button
                  key={index}
                  onClick={() => handleGifClick(gif)}
                  className='group relative aspect-square overflow-hidden rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                  <Image
                    src={
                      gif.isOriginalLoaded
                        ? gif.images.fixed_height.url
                        : gif.images.preview_webp.url
                    }
                    alt={gif.title}
                    className='h-full w-full object-cover transition-opacity'
                    style={{
                      transition: 'opacity 0.3s ease',
                    }}
                    loading='lazy'
                    width={Number(gif.images.fixed_height.width)}
                    height={Number(gif.images.fixed_height.height)}
                  />
                  {/* <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 transition-opacity group-hover:bg-opacity-20'>
                    {!gif.isOriginalLoaded && (
                      <div className='absolute inset-0 flex items-center justify-center'>
                        <div className='h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500' />
                      </div>
                    )}
                  </div> */}
                </button>
              )
            })}
            {gifs.length === 0 && (
              <div className='flex-center col-span-5 h-full w-full text-gray-500'>
                No GIFs found
              </div>
            )}
          </div>
        </>
      )}
      <div className='mt-4 flex justify-center gap-2'>
        <Button
          size='sm'
          onClick={handlePrevious}
          disabled={offset === 0 || loading}
        >
          <ChevronLeft />
        </Button>

        <Button
          size='sm'
          onClick={handleNext}
          disabled={loading || gifs.length === 0}
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  )
}

export default GifSdk

'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import React, { useCallback, useEffect, useRef,useState } from 'react'
import type { Swiper as SwiperType } from 'swiper'
import { Autoplay, FreeMode } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'

import { getAllCryptoPrices } from '@/api/crypto-prices'

import { useSocket } from '@/context/socket-context'

import { Button } from '@/components/ui/button'

import ArbitrumIcon from '@/assets/currencies/arbitrum.svg'
import AvalancheIcon from '@/assets/currencies/avalanche.svg'
import BnbIcon from '@/assets/currencies/bnb.svg'
import BtcIcon from '@/assets/currencies/btc.svg'
import DogeIcon from '@/assets/currencies/doge.svg'
import EthIcon from '@/assets/currencies/eth.svg'
import LtcIcon from '@/assets/currencies/ltc.svg'
import MaticIcon from '@/assets/currencies/matic.svg'
import SolanaIcon from '@/assets/currencies/sol.svg'
import TetherIcon from '@/assets/currencies/tether.svg'
import TronIcon from '@/assets/currencies/tron.svg'
import XrpIcon from '@/assets/currencies/xrp.svg'
import CryptoPricesIcon from '@/assets/menus/crypto_prices.svg'

interface CryptoPriceData {
  symbol: string
  blockchain: string
  price: number
}

interface CryptoPrice {
  [key: string]: CryptoPriceData
}

const cryptoConfig = [
  { symbol: 'USDT', name: 'Tether', Icon: TetherIcon },
  { symbol: 'TRX', name: 'Tron', Icon: TronIcon },
  { symbol: 'XRP', name: 'Ripple', Icon: XrpIcon },
  { symbol: 'ETH', name: 'Ethereum', Icon: EthIcon },
  { symbol: 'BTC', name: 'Bitcoin', Icon: BtcIcon },
  { symbol: 'BNB', name: 'Binance', Icon: BnbIcon },
  { symbol: 'SOL', name: 'Solana', Icon: SolanaIcon },
  { symbol: 'DOGE', name: 'Dogecoin', Icon: DogeIcon },
  { symbol: 'LTC', name: 'Litecoin', Icon: LtcIcon },
  { symbol: 'MATIC', name: 'Polygon', Icon: MaticIcon },
  { symbol: 'AVAX', name: 'Avalanche', Icon: AvalancheIcon },
  { symbol: 'ARB', name: 'Arbitrum', Icon: ArbitrumIcon },
]

export default function CryptoPrices() {
  const { socket } = useSocket('/price')  // Connect to /price namespace for real crypto prices
  const [cryptoPrices, setCryptoPrices] = useState<CryptoPrice>({})
  const [priceChanges, setPriceChanges] = useState<{ [key: string]: number }>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isBeginning, setIsBeginning] = useState<boolean>(true)
  const [isEnd, setIsEnd] = useState<boolean>(false)
  const swiperRef = useRef<SwiperType | null>(null)

  const getPrices = useCallback(() => {
    if (socket) {
      socket.emit('price:getAll')
    }
  }, [socket])

  // Fetch real prices from API on mount
  useEffect(() => {
    const fetchRealPrices = async () => {
      try {
        const response = await getAllCryptoPrices()
        if (response.success && response.data.length > 0) {
          const pricesMap: CryptoPrice = {}
          const changesMap: { [key: string]: number } = {}
          
          response.data.forEach((item) => {
            pricesMap[item.currency] = {
              symbol: item.currency,
              blockchain: item.currency,
              price: item.price,
            }
            
            // Calculate random price change for display (simulate 24h change)
            // In production, you'd get this from the API as well
            changesMap[item.currency] = (Math.random() * 10 - 5) // Random between -5% and +5%
          })
          
          setCryptoPrices(pricesMap)
          setPriceChanges(changesMap)
          setIsLoading(false)
        }
      } catch (error) {
        console.error('Failed to fetch crypto prices from API:', error)
        setIsLoading(false)
      }
    }

    fetchRealPrices()

    // Refresh prices every 2.5 minutes (150 seconds)
    const refreshInterval = setInterval(fetchRealPrices, 150000)

    return () => {
      clearInterval(refreshInterval)
    }
  }, [])

  // Separate useEffect for socket connection (don't mix with API)
  useEffect(() => {
    if (!socket) return

    // Don't use socket for prices - rely only on API
    // The socket might have incorrect/outdated data
    
    getPrices() // Initial request (but don't use the response)

    return () => {
      // Cleanup if needed
    }
  }, [socket, getPrices])

  const handlePrev = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev()
    }
  }

  const handleNext = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext()
    }
  }

  const handleSwiperUpdate = (swiper: SwiperType) => {
    setIsBeginning(swiper.isBeginning)
    setIsEnd(swiper.isEnd)
  }

  return (
    <div className='space-y-4'>
      {/* Title */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <CryptoPricesIcon className='h-6 w-6' />
          <h2 className='font-satoshi text-xl font-bold text-white'>
            Crypto Prices
          </h2>
        </div>
        {/* Navigation Buttons - Desktop Only */}
        <div className='hidden items-center gap-2 lg:flex'>
          <Button
            className='h-9 w-9 p-0 md:p-0 [&_svg]:size-4'
            onClick={handlePrev}
            disabled={isBeginning}
            aria-label='Previous slide'
            variant={isBeginning ? 'gradient-border' : 'secondary2'}
          >
            <ChevronLeft />
          </Button>
          <Button
            className='h-9 w-9 p-0 md:p-0 [&_svg]:size-4'
            onClick={handleNext}
            disabled={isEnd}
            aria-label='Next slide'
            variant={isEnd ? 'gradient-border' : 'secondary2'}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>

      {/* Desktop Version - Swiper with Auto-scroll */}
      <div className='hidden lg:block'>
        <div className='overflow-hidden rounded-lg'>
          {isLoading ? (
            // Loading skeleton
            <div className='flex gap-3'>
              {[...Array(6)].map((_, i) => (
                <div
                  key={`skeleton-${i}`}
                  className='h-[56px] min-w-[160px] animate-pulse rounded-xl bg-[#1A1A1A]'
                />
              ))}
            </div>
          ) : (
            <Swiper
              modules={[Autoplay, FreeMode]}
              spaceBetween={12}
              slidesPerView='auto'
              freeMode={true}
              onSwiper={(swiper) => {
                swiperRef.current = swiper
                handleSwiperUpdate(swiper)
              }}
              onSlideChange={(swiper) => {
                handleSwiperUpdate(swiper)
              }}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
            >
              {cryptoConfig.map((crypto) => {
                const priceData = cryptoPrices[crypto.symbol]
                if (!priceData) return null

                const change = priceChanges[crypto.symbol] || 0
                const isPositive = change >= 0

                return (
                  <SwiperSlide key={crypto.symbol} style={{ width: 'auto' }}>
                    <div className='flex min-w-fit items-center gap-3 rounded-xl border border-mirage bg-[#1A1A1A] px-4 py-3'>
                      <div className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#2A2A2A]'>
                        <crypto.Icon className='h-5 w-5' />
                      </div>
                      <p className='whitespace-nowrap font-satoshi text-base font-bold text-white'>
                        ${priceData.price.toFixed(2)}
                      </p>
                      <p
                        className={`whitespace-nowrap font-satoshi text-sm font-medium ${
                          isPositive ? 'text-green-500' : 'text-red-500'
                        }`}
                      >
                        {isPositive ? '+' : ''}
                        {change.toFixed(2)}%
                      </p>
                    </div>
                  </SwiperSlide>
                )
              })}
            </Swiper>
          )}
        </div>
      </div>

      {/* Mobile Version - Horizontal Swiper with Auto-scroll */}
      <div className='block lg:hidden'>
        <div className='overflow-hidden rounded-lg'>
          {isLoading ? (
            // Loading skeleton
            <div className='flex gap-3'>
              {[...Array(3)].map((_, i) => (
                <div
                  key={`skeleton-mobile-${i}`}
                  className='h-[56px] min-w-[140px] animate-pulse rounded-xl bg-[#1A1A1A]'
                />
              ))}
            </div>
          ) : (
            <Swiper
              modules={[Autoplay, FreeMode]}
              spaceBetween={12}
              slidesPerView='auto'
              freeMode={true}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
            >
              {cryptoConfig.map((crypto) => {
                const priceData = cryptoPrices[crypto.symbol]
                if (!priceData) return null

                const change = priceChanges[crypto.symbol] || 0
                const isPositive = change >= 0

                return (
                  <SwiperSlide key={`mobile-${crypto.symbol}`} style={{ width: 'auto' }}>
                    <div className='flex min-w-fit items-center gap-3 rounded-xl border border-mirage bg-[#1A1A1A] px-4 py-3'>
                      <div className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#2A2A2A]'>
                        <crypto.Icon className='h-5 w-5' />
                      </div>
                      <p className='whitespace-nowrap font-satoshi text-base font-bold text-white'>
                        ${priceData.price.toFixed(2)}
                      </p>
                      <p
                        className={`whitespace-nowrap font-satoshi text-sm font-medium ${
                          isPositive ? 'text-green-500' : 'text-red-500'
                        }`}
                      >
                        {isPositive ? '+' : ''}
                        {change.toFixed(2)}%
                      </p>
                    </div>
                  </SwiperSlide>
                )
              })}
            </Swiper>
          )}
        </div>
      </div>
    </div>
  )
}

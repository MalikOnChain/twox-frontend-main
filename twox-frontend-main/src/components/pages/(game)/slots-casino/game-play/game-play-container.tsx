'use client'

import { Heart,Maximize2, Minimize2 } from 'lucide-react'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

import { GamePlayMode, ProviderGameType, TProviderGameType } from '@/types/game'
interface GamePlayScreenContainerProps {
  children: React.ReactNode
  gamePlayMode: GamePlayMode
  onChangePlayMode: (mode: GamePlayMode) => void
  type: TProviderGameType
  isFavorite?: boolean
  onToggleFavorite?: () => void
  isTogglingFavorite?: boolean
}

const GamePlayScreenContainer = ({
  children,
  gamePlayMode,
  type,
  onChangePlayMode,
  isFavorite,
  onToggleFavorite,
  isTogglingFavorite,
}: GamePlayScreenContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isIOSSafari, setIsIOSSafari] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(
    'portrait'
  )
  const [viewportHeight, setViewportHeight] = useState(0)

  const isFullscreenRef = useRef(isFullscreen)

  // Standard Fullscreen API handlers
  const handleStandardFullscreen = async () => {
    if (!containerRef.current) return

    try {
      if (!isFullscreen) {
        if (containerRef.current.requestFullscreen) {
          await containerRef.current.requestFullscreen()
        } else if ((containerRef.current as any).webkitRequestFullscreen) {
          await (containerRef.current as any).webkitRequestFullscreen()
        } else if ((containerRef.current as any).msRequestFullscreen) {
          await (containerRef.current as any).msRequestFullscreen()
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen()
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen()
        } else if ((document as any).msExitFullscreen) {
          await (document as any).msExitFullscreen()
        }
      }
    } catch (error) {
      console.error('Fullscreen error:', error)
    }
  }

  // iOS Safari specific fullscreen handlers
  const handleIOSFullscreen = useCallback(
    (forceState?: boolean) => {
      const newState =
        forceState !== undefined ? forceState : !isFullscreenRef.current
      setIsFullscreen(newState)

      if (newState) {
        // Save current scroll position
        const scrollPos = window.pageYOffset
        document.documentElement.style.setProperty(
          '--scroll-pos',
          `${scrollPos}px`
        )

        // Lock body
        document.body.style.position = 'fixed'
        document.body.style.top = `-${scrollPos}px`
        document.body.style.width = '100%'
        document.body.style.height = '100%'
        document.body.style.overflow = 'hidden'

        if (containerRef.current) {
          containerRef.current.style.position = 'fixed'
          containerRef.current.style.top = '0'
          containerRef.current.style.left = '0'
          containerRef.current.style.width = '100%'
          containerRef.current.style.height = '100%'
          containerRef.current.style.zIndex = '9999'
          containerRef.current.style.backgroundColor = '#000'

          // Force viewport height
          containerRef.current.style.height = `${viewportHeight}px`

          // Hide browser UI by scrolling
          setTimeout(() => {
            window.scrollTo(0, 1)
          }, 100)
        }
      } else {
        // Restore scroll position
        const scrollPos = parseInt(
          getComputedStyle(document.documentElement).getPropertyValue(
            '--scroll-pos'
          ) || '0'
        )
        document.body.style.position = ''
        document.body.style.top = ''
        document.body.style.width = ''
        document.body.style.height = ''
        document.body.style.overflow = ''
        window.scrollTo(0, scrollPos)

        if (containerRef.current) {
          containerRef.current.style.position = ''
          containerRef.current.style.top = ''
          containerRef.current.style.left = ''
          containerRef.current.style.width = ''
          containerRef.current.style.height = ''
          containerRef.current.style.zIndex = ''
          containerRef.current.style.backgroundColor = ''
        }
      }
    },
    [viewportHeight]
  )

  const toggleFullscreen = () => {
    if (isIOS) {
      handleIOSFullscreen()
    } else {
      handleStandardFullscreen()
    }
  }

  useEffect(() => {
    isFullscreenRef.current = isFullscreen
  }, [isFullscreen])

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
    document.addEventListener('mozfullscreenchange', handleFullscreenChange)
    document.addEventListener('MSFullscreenChange', handleFullscreenChange)

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener(
        'webkitfullscreenchange',
        handleFullscreenChange
      )
      document.removeEventListener(
        'mozfullscreenchange',
        handleFullscreenChange
      )
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange)
    }
  }, [])

  // Detect browser and device
  useEffect(() => {
    const ua = window.navigator.userAgent
    const iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i)
    const webkit = !!ua.match(/WebKit/i)
    const iOSSafari = iOS && webkit && !ua.match(/CriOS/i)
    setIsIOSSafari(iOSSafari)
    setIsIOS(iOS)

    if (iOSSafari) {
      // Set initial orientation and viewport height
      const updateViewportHeight = () => {
        setViewportHeight(window.innerHeight)
      }

      // updateViewportHeight()
      setOrientation(
        window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
      )

      // Update on resize
      window.addEventListener('resize', updateViewportHeight)
      return () => window.removeEventListener('resize', updateViewportHeight)
    }
  }, [])

  const handleGamePlayModeChange = (value: GamePlayMode) => {
    if (value) {
      onChangePlayMode(value)
    }
  }

  // Handle orientation change
  useEffect(() => {
    const handleOrientationChange = () => {
      const isLandscape = window.innerWidth > window.innerHeight
      setOrientation(isLandscape ? 'landscape' : 'portrait')

      // For iOS Safari, trigger fullscreen in landscape
      if (isIOSSafari && isLandscape) {
        handleIOSFullscreen(true)
      }
    }

    window.addEventListener('resize', handleOrientationChange)
    return () => window.removeEventListener('resize', handleOrientationChange)
  }, [isIOSSafari, handleIOSFullscreen])

  return (
    <div
      ref={containerRef}
      className={`fullscreen-container transition-all duration-300 ${
        isFullscreen ? 'fixed inset-0 z-50 bg-black' : 'relative'
      }`}
    >
      <div className='flex h-12 w-full items-center justify-between bg-dark-grey-gradient px-4'>
        <ToggleGroup
          type='single'
          className='bg-custom-dual-gradient p-1'
          onValueChange={handleGamePlayModeChange}
          value={gamePlayMode}
        >
          <ToggleGroupItem
            value={GamePlayMode.REAL}
            className='h-8 font-medium'
            variant='custom'
          >
            Real
          </ToggleGroupItem>
          {type === ProviderGameType.SLOT && (
            <ToggleGroupItem
              value={GamePlayMode.FUN}
              className='h-8 font-medium'
              variant='custom'
            >
              Fun
            </ToggleGroupItem>
          )}
        </ToggleGroup>
        <div className='flex items-center gap-2'>
          {/* Favorite button - visible on mobile */}
          {onToggleFavorite && (
            <button
              onClick={onToggleFavorite}
              disabled={isTogglingFavorite}
              className={`transition-all duration-200 lg:hidden ${isTogglingFavorite ? 'opacity-50' : 'opacity-100 hover:scale-110'}`}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart 
                size={20} 
                className={`${isFavorite ? 'fill-red-500 text-red-500' : 'text-white'} transition-colors`}
              />
            </button>
          )}
          <Button variant='gradient-border' size='sm' onClick={toggleFullscreen}>
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </Button>
        </div>
      </div>
      <div
        className={cn(
          'relative overflow-hidden',
          isFullscreen ? 'h-game-fullscreen' : 'h-[30rem] md:h-[42rem]'
        )}
      >
        {children}
      </div>

      {/* {!isFullscreen && (
        <Footer
          isFullscreen={isFullscreen}
          toggleFullscreen={toggleFullscreen}
          onChangePlayMode={onChangePlayMode}
          gamePlayMode={gamePlayMode}
          type={type}
        />
      )} */}

      {/* iOS Safari helper overlay */}
      {isIOSSafari && orientation === 'landscape' && !isFullscreen && (
        <div className='fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 transition-opacity'>
          <div className='text-center text-white'>
            <p className='mb-4 text-lg'>Swipe up for fullscreen</p>
            <div className='mx-auto h-16 w-8 animate-bounce rounded-full border-2 border-white' />
          </div>
        </div>
      )}
    </div>
  )
}

export default GamePlayScreenContainer

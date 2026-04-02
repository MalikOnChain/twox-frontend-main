'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'
import React, { memo, Suspense, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { getSiteStats } from '@/api/site'

import { useMenu } from '@/context/menu-context'
import { useModal } from '@/context/modal-context'

import { useNavigationMenu } from '@/lib/menu'
import { cn } from '@/lib/utils'
import { useMediaQuery } from '@/hooks/features/use-media-query'

import LanguageSelector from '@/components/layout/nav-menu/language-selector/language-selector'
import Backdrop from '@/components/templates/backdrop/backdrop'

import gradient from '@/assets/menus/gradient1.png'
import OnlineUserIcon from '@/assets/online-user-icon.svg'
import WageredIcon from '@/assets/wagered.svg'

import { Skeleton } from '../../ui/skeleton'

const NavMenuSection = dynamic(() => import('../nav-menu/nav-menu-section'), {
  ssr: false,
  loading: () => {
    return <Skeleton className='h-10 w-full' />
  },
})

// Fixed bottom section component
const FixedBottomSection = memo(() => {
  const { t } = useTranslation()
  const [stats, setStats] = useState({
    totalWagered: 0,
    onlineUsers: 0,
  })

  useEffect(() => {
    const fetchStats = async () => {
      const response = await getSiteStats()
      if (response.success) {
        setStats(response.data)
      }
    }

    // Initial fetch
    fetchStats()

    // Refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000)

    return () => clearInterval(interval)
  }, [])

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(Math.round(num))
  }

  return (
    <div className='flex flex-col gap-2 py-2'>
      <div className='flex h-[60px] items-center gap-3 bg-[#111014] bg-opacity-50 rounded-lg border border-charcoal-grey p-3'>
        <WageredIcon />
        <div>
          <p className='mb-1 font-satoshi text-sm font-bold text-white'>
            {t('sidebar.bets_wagered')}
          </p>
          <p className='font-satoshi text-sm font-normal text-[#BABABACC]'>
            {formatNumber(stats.totalWagered)}
          </p>
        </div>
      </div>
      <div className='flex h-[60px] items-center gap-3 bg-[#111014] bg-opacity-50 rounded-lg border border-charcoal-grey px-3'>
        <OnlineUserIcon />
        <div>
          <p className='mb-1 font-satoshi text-sm font-bold text-white'>
            {t('sidebar.online_users')}
          </p>
          <p className='font-satoshi text-sm font-normal text-[#BABABACC]'>
            {formatNumber(stats.onlineUsers)}
          </p>
        </div>
      </div>
      <LanguageSelector />
    </div>
  )
})

const SidebarContent = memo(() => {
  const menu = useNavigationMenu()

  return (
    <div className='relative flex h-full flex-col py-3 px-3 overflow-y-auto'>
      {/* Scrollable navigation content */}
      <div className='flex-1 pb-2'>
        <Suspense>
          {/* {isExpanded && <TokenPriceCard />} */}
          {/* {isExpanded && <PromotionCards />} */}
          {menu.map((section, index) => (
            <div key={`nav-wrapper-${index}`}>
              {index && index > 0 ? (
                <div className='my-3 border border-mirage' />
              ) : null}
              <div className='flex flex-col bg-[#111014] bg-opacity-50 rounded-lg border border-charcoal-grey mb-[10px]'>
                <NavMenuSection
                  {...section}
                  index={index}
                />
              </div>
            </div>
          ))}
        </Suspense>
      </div>

      {/* Fixed bottom section */}
      <div className='flex-shrink-0'>
        <FixedBottomSection />
      </div>
    </div>
  )
})

const AppSidebar = () => {
  const { setIsOpen, isOpen } = useMenu()
  const isDesktop = useMediaQuery('lg')
  const { setIsOpen: setIsWheelModalOpen, setType } = useModal()

  useEffect(() => {
    if (isOpen && !isDesktop) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.removeProperty('overflow')
    }
  }, [isOpen, isDesktop])

  return (
    <div className='mt-2.5'>
      {!isDesktop && <Backdrop isOpen={isOpen} setIsOpen={setIsOpen} />}
      <aside
        className={cn(
          'relative !z-40 flex flex-col overflow-x-hidden rounded-[20px] border border-mirage bg-[#0A0A0A] !transition-all duration-300 ease-in',
          'sticky top-0',
          'transition-all',
          // Remove overflow-y-auto from here since we're handling it internally
          {
            'h-[calc(100vh-20px)] w-[252px] min-w-sidebar max-w-sidebar':
              isDesktop,
          },
          {
            'fixed bottom-[calc(66px+env(safe-area-inset-bottom,0px))] top-header-sm z-40 w-[96%] translate-x-0 overflow-y-scroll sm:w-[56%]':
              !isDesktop,
          },
          {
            'ml-2': isOpen,
          },
          { '-translate-x-full': !isDesktop && !isOpen }
        )}
      >
        <Image
          src={gradient}
          alt='gradient'
          className='absolute right-0 top-0 h-full w-full lg:-right-24'
          width={0}
          height={0}
          sizes='100vw'
        />
        <SidebarContent />
      </aside>
    </div>
  )
}

export default AppSidebar

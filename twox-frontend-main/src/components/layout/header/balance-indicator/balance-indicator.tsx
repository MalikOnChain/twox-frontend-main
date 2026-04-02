'use client'

import { ChevronDown } from 'lucide-react'
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useUser } from '@/context/user-context'

import parseCommasToThousands from '@/lib/number'
import {
  PREFERRED_PLAY_STABLE_EVENT,
  PREFERRED_PLAY_STABLE_STORAGE_KEY,
  readPreferredPlayStable,
} from '@/lib/play-stable-preference'
import { cn } from '@/lib/utils'

import { FystackChainBadge } from '@/components/layout/header/deposit-withdraw-modal/fystack-chain-badge'
import {
  parseStableWithdrawValue,
  stableWithdrawChainAbbrev,
  stableWithdrawNetworkBlockchain,
} from '@/components/layout/header/deposit-withdraw-modal/fystack-stablecoins-ui'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import WalletIcon from '@/assets/wallet.svg'

const DEFAULT_PLAY_STABLE = 'USDT:ERC20'

const BalanceIndicator = ({
  openDepositWithdrawModal,
  openBalanceModal,
}: {
  openDepositWithdrawModal: () => void
  openBalanceModal: () => void
}) => {
  const { balance, getLoggedInUser, isAuthenticated } = useUser()
  const totalBalance = parseCommasToThousands(balance?.totalBalance || 0)
  const freeSpinBalance = parseInt(String(balance?.freeSpinBalance)) || 0
  const triggerRef = useRef<HTMLSpanElement>(null)
  // const [triggerWidth, setTriggerWidth] = useState(0)
  const prevBalance = useRef(0)
  const { t } = useTranslation()
  // Animation states
  const [isAnimating, setIsAnimating] = useState(false)
  const [changeAmount, setChangeAmount] = useState(0)
  const [balanceHighlight, setBalanceHighlight] = useState<
    'increase' | 'decrease' | null
  >(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const balanceTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [isTooltipOpen, setIsTooltipOpen] = useState(false)
  const [playStableValue, setPlayStableValue] = useState(DEFAULT_PLAY_STABLE)

  const { chainSlug, chainAbbrev } = useMemo(() => {
    const { network } = parseStableWithdrawValue(playStableValue)
    return {
      chainSlug: stableWithdrawNetworkBlockchain(network),
      chainAbbrev: stableWithdrawChainAbbrev(network),
    }
  }, [playStableValue])

  useLayoutEffect(() => {
    const v = readPreferredPlayStable()
    if (v) setPlayStableValue(v)
  }, [])

  useEffect(() => {
    const sync = () =>
      setPlayStableValue(readPreferredPlayStable() ?? DEFAULT_PLAY_STABLE)
    window.addEventListener(PREFERRED_PLAY_STABLE_EVENT, sync)
    const onStorage = (e: StorageEvent) => {
      if (e.key === PREFERRED_PLAY_STABLE_STORAGE_KEY) sync()
    }
    window.addEventListener('storage', onStorage)
    return () => {
      window.removeEventListener(PREFERRED_PLAY_STABLE_EVENT, sync)
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  useEffect(() => {
    const updatedBalance = balance?.totalBalance || 0
    const changedBalance = updatedBalance - prevBalance.current

    // Only animate if this isn't the first load and there's an actual change
    if (prevBalance.current !== 0 && changedBalance !== 0) {
      setChangeAmount(changedBalance)
      setIsAnimating(true)
      setBalanceHighlight(changedBalance > 0 ? 'increase' : 'decrease')

      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (balanceTimeoutRef.current) {
        clearTimeout(balanceTimeoutRef.current)
      }

      // Set a timeout to remove the animation after 2 seconds
      timeoutRef.current = setTimeout(() => {
        setIsAnimating(false)
      }, 1000)

      // Remove balance highlight after 1 second
      balanceTimeoutRef.current = setTimeout(() => {
        setBalanceHighlight(null)
      }, 500)
    }

    prevBalance.current = updatedBalance

    // Cleanup timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (balanceTimeoutRef.current) {
        clearTimeout(balanceTimeoutRef.current)
      }
    }
  }, [balance?.totalBalance])

  useEffect(() => {
    if (!isAuthenticated) return
    const onVis = () => {
      if (document.visibilityState === 'visible') void getLoggedInUser()
    }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [isAuthenticated, getLoggedInUser])

  // useLayoutEffect(() => {
  //   if (triggerRef.current) {
  //     setTriggerWidth(triggerRef.current.scrollWidth)
  //   }
  // }, [balance])

  return (
    <div
      className='rounded-lg bg-[#391313]'
      style={{
        animation: isAnimating ? 'borderPulse 2s ease-in-out infinite' : 'none',
        border: isAnimating ? '2px solid transparent' : 'none',
      }}
    >
      <style jsx>{`
        @keyframes borderPulse {
          0%,
          100% {
            border-color: #391313;
            border-width: 0px;
          }
          50% {
            border-color: #391313;
            border-width: 5px;
          }
        }
      `}</style>
      <div className='flex items-center gap-2 rounded-lg bg-[#2A1313] p-1.5 md:p-2'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <span
              ref={triggerRef}
              className='relative flex cursor-pointer items-center gap-2 px-2'
            >
              <span className='flex items-center gap-1.5'>
                <span
                  className={cn(
                    'relative font-satoshi text-xs font-medium transition-colors duration-300 md:text-sm',
                    balanceHighlight === 'increase' && 'text-success',
                    balanceHighlight === 'decrease' && 'text-error'
                  )}
                >
                  ${`${totalBalance}`}
                </span>
                <span className='flex items-center gap-1 md:gap-1.5'>
                  <span className='flex size-5 shrink-0 items-center justify-center md:size-6'>
                    <FystackChainBadge blockchain={chainSlug} size={20} />
                  </span>
                  <span className='font-satoshi text-[10px] font-bold uppercase tracking-wide text-white md:text-xs'>
                    {chainAbbrev}
                  </span>
                </span>
              </span>
              <div
                className='flex h-6 w-6 items-center justify-center rounded bg-[#FFFFFF1A]'
                onClick={openBalanceModal}
              >
                <ChevronDown className='size-4' />
              </div>
            </span>
          </DropdownMenuTrigger>

          {/* <DropdownMenuContent
          className='rounded-lg border-none p-0'
          style={{
            width: triggerWidth,
            minWidth: triggerWidth,
            maxWidth: triggerWidth,
          }}
          side='top'
          align='center'
          sideOffset={16}
        >
          <DropdownMenuItem
            className='px-2 hover:bg-secondary-600 focus:bg-secondary-600'
            asChild
          >
            <span className='relative flex cursor-pointer items-center gap-2 border-b border-secondary pb-2'>
              <span className='flex items-center gap-1.5'>
                <Image
                  src={CoinImage}
                  alt='coin'
                  className={cn('h-5 w-5 shadow-lg')}
                  width={0}
                  height={0}
                  sizes='100vw'
                />
                <span
                  className={cn(
                    'flex-1 text-xs font-medium md:text-sm',
                    balanceHighlight === 'increase' && 'text-green-500',
                    balanceHighlight === 'decrease' && 'text-red-500'
                  )}
                >
                  {`${totalBalance}`}
                </span>
              </span>
            </span>
          </DropdownMenuItem>

          <DropdownMenuItem
            className='px-2 hover:bg-secondary-600 focus:bg-secondary-600'
            disabled
            asChild
          >
            <span className='relative flex cursor-pointer items-center gap-2'>
              <span className='flex flex-1 items-center gap-1.5'>
                <Image
                  src='/logo-symbol.webp'
                  alt='coin'
                  className={cn('h-5 w-5 shadow-lg')}
                  width={20}
                  height={20}
                />
                <span className='flex-1 text-xs font-medium md:text-sm'>
                  {parseCommasToThousands(0)}
                </span>
              </span>
              <LockIcon className='size-4' />
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent> */}
        </DropdownMenu>

        <Button
          className={cn(
            'w-8 gap-1',
            'p-0 md:w-auto md:px-3 md:py-2.5 [&_svg]:size-6',
            'max-h-8 max-md:w-10 max-md:min-w-8 max-md:p-0 max-md:[&_svg]:size-5'
          )}
          variant='secondary2'
          onClick={openDepositWithdrawModal}
        >
          <div className='block md:hidden'>
            <WalletIcon />
          </div>
          <span className='hidden md:block'>{t('header.deposit')}</span>
        </Button>
      </div>
      {/* <div className='flex items-center gap-2 rounded-lg bg-background-fourth p-2'>
        <TooltipProvider>
          <Tooltip open={isTooltipOpen} onOpenChange={setIsTooltipOpen}>
            <TooltipTrigger asChild>
              <Image
                src={FreespinImage}
                alt='freespin'
                className='block h-5 w-5 cursor-pointer'
                width={20}
                height={20}
                onClick={() => setIsTooltipOpen(true)}
              />
            </TooltipTrigger>
            <TooltipContent
              className='block data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 sm:hidden'
              side='top'
              sideOffset={8}
            >
              <div className='relative flex w-fit justify-center rounded-lg border border-secondary-600 bg-background-third px-4 py-2.5 text-xs font-medium text-primary-foreground shadow-lg'>
                {t('header.free_spins')}
                <TooltipArrow className='fill-background-third' />
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className='hidden text-sm font-medium uppercase tracking-wide drop-shadow-sm sm:block'>
          {t('header.free_spins')}
        </div>

        <div className='ml-auto rounded-md text-sm font-semibold'>
          {freeSpinBalance}
        </div>
      </div> */}
    </div>
  )
}

export default BalanceIndicator

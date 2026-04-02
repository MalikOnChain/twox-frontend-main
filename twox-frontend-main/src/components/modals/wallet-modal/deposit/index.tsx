'use client'
import React, { useMemo, useState } from 'react'

import { useWalletModal } from '@/context/wallet-modal-context'

import { cn } from '@/lib/utils'

import Coinbase from '@/assets/logos/coinbase.svg'
import Metamask from '@/assets/logos/metamask.svg'
import Phantom from '@/assets/logos/phantom.svg'
import WConnect from '@/assets/logos/w-connect.svg'

import MigrationNotice from './migration-notice'

import { CoinNetworkData } from '@/types/crypto'

export enum DepositTargetType {
  Crypto = 'Crypto',
  Skinsback = 'Skinsback',
  MetaMask = 'MetaMask',
  Coinbase = 'Coinbase',
  Withdraw = 'Widthdraw',
  GiftCards = 'GiftCards',
  Fystack = 'Fystack',
  Other = 'Other',
}

type TDepositTarget = {
  title: string
  icon: any
  status: 0 | 1
  type?: DepositTargetType
  enabled?: boolean
}

type TDepositTargets = {
  label: string
  targets?: TDepositTarget[]
}

export const DepositTargets: TDepositTargets[] = [
  {
    label: 'Cryptocurrency Deposits',
    targets: [
      {
        title: 'Crypto deposit',
        icon: '₿',
        status: 1,
        type: DepositTargetType.Fystack,
        enabled: true,
      },
    ],
  },
  // Legacy wallet connect options (disabled)
  {
    label: 'Legacy Wallet Options (Deprecated)',
    targets: [
      {
        title: 'Metamask',
        icon: Metamask,
        status: 0, // Disabled
        type: DepositTargetType.MetaMask,
        enabled: false,
      },
      {
        title: 'Coinbase',
        icon: Coinbase,
        status: 0, // Disabled
        type: DepositTargetType.Coinbase,
        enabled: false,
      },
      {
        title: 'Phantom',
        icon: Phantom,
        status: 0, // Disabled
        type: DepositTargetType.Other,
        enabled: false,
      },
      {
        title: 'W-Connect',
        icon: WConnect,
        status: 0, // Disabled
        type: DepositTargetType.Other,
        enabled: false,
      },
    ],
  },
  // {
  //   label: 'Deposit from Skinsback',
  //   targets: [
  //     {
  //       label: 'CS2',
  //       icon: CS2,
  //       status: 1,
  //       type: DepositTargetType.Skinsback,
  //       enabled: false,
  //     },
  //     {
  //       label: 'RUST',
  //       icon: Rust,
  //       status: 1,
  //       type: DepositTargetType.Skinsback,
  //       enabled: false,
  //     },
  //     {
  //       label: 'Crypto',
  //       icon: Crypto,
  //       status: 0,
  //       type: DepositTargetType.Skinsback,
  //       enabled: false,
  //     },
  //   ],
  // },
  // {
  //   label: 'Other',
  //   targets: [
  //     {
  //       label: 'Gift Cards',
  //       icon: GiftCard,
  //       status: 1,
  //       type: DepositTargetType.GiftCards,
  //       enabled: false,
  //     },
  //     {
  //       label: 'Credit Card',
  //       icon: CreditCard,
  //       status: 1,
  //       type: DepositTargetType.Other,
  //       enabled: false,
  //     },
  //     {
  //       label: 'Crypto',
  //       icon: Crypto,
  //       status: 0,
  //       type: DepositTargetType.Other,
  //       enabled: false,
  //     },
  //   ],
  // },
]

interface CryptoCardProps<T> {
  onClick?: (item: T) => void
  active?: boolean
  value: T & {
    icon: any
    title: string
    symbol?: string
    status?: number
    enabled?: boolean
  }
  hasActive?: boolean
  iconClass?: string
  iconWrapperClass?: string
}

function CryptoCard<T>({
  onClick,
  value,
  active,
  hasActive = true,
  iconClass,
  iconWrapperClass = '',
}: CryptoCardProps<T>) {
  const handleClick = () => {
    if (value.status === 0 || !value.enabled) {
      return // Don't allow clicks on disabled items
    }
    if (typeof onClick === 'function') {
      onClick(value)
    }
  }
  
  const renderIcon = () => {
    if (typeof value.icon === 'string') {
      // Handle emoji icons
      return (
        <div className={cn(
          'm-2 mr-1 flex items-center justify-center h-[24px] w-[24px] sm:m-3 sm:mr-2 sm:h-[24px] sm:w-[24px] text-lg',
          iconClass
        )}>
          {value.icon}
        </div>
      )
    }
    
    // Handle SVG icons
    return (
      <value.icon
        className={cn(
          'm-2 mr-1 h-[24px] w-[24px] sm:m-3 sm:mr-2 sm:h-[24px] sm:w-[24px]',
          iconClass
        )}
      />
    )
  }
  
  const isDisabled = value.status === 0 || !value.enabled
  
  return (
    <div
      className={cn(
        'group/crypto-token relative box-border flex items-center rounded-lg',
        isDisabled 
          ? 'bg-secondary-800 opacity-50 cursor-not-allowed' 
          : 'bg-secondary-700 hover:cursor-pointer hover:bg-secondary-600 data-[state="active"]:bg-success/[.12]'
      )}
      data-state={active ? 'active' : ''}
      onClick={handleClick}
    >
      <div className={iconWrapperClass}>
        {renderIcon()}
      </div>
      <div className='flex-1 py-[10px]'>
        <div className='text-xs text-foreground drop-shadow-0-12-0-success group-data-[state="active"]/crypto-token:text-success sm:text-sm'>
          {value.title}
        </div>
        {value.symbol && (
          <div className='text-xs font-medium text-secondary-text group-data-[state="active"]/crypto-token:text-foreground sm:text-sm'>
            {value.symbol}
          </div>
        )}
      </div>
      {hasActive && (
        <div className='mr-2 flex h-5 w-5 items-center justify-center self-center rounded-full border-2 border-secondary bg-secondary/20 group-data-[state="active"]/crypto-token:border-none group-data-[state="active"]/crypto-token:bg-success/[.12] sm:mr-3'>
          <div className='hidden h-3 w-3 rounded-full group-data-[state="active"]/crypto-token:block group-data-[state="active"]/crypto-token:bg-success'></div>
        </div>
      )}
      <div className='absolute left-0 top-0 h-full w-full rounded-lg group-data-[state="active"]/crypto-token:border group-data-[state="active"]/crypto-token:border-success/[.36]'></div>
    </div>
  )
}

const DepositContent = () => {
  const { activeCrypto, setActiveCrypto, cryptoList, setActiveTarget } =
    useWalletModal()
  const [searchQuery, setSearchQuery] = useState('')
  const [showAll, setShowAll] = useState(false)

  const filteredItems = useMemo(() => {
    return cryptoList.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [cryptoList, searchQuery])

  const displayedItems = useMemo(() => {
    return showAll ? filteredItems : filteredItems.slice(0, 7)
  }, [filteredItems, showAll])

  const handleCryptoClick = (crypto: CoinNetworkData) => {
    setActiveCrypto(crypto)
    setActiveTarget(DepositTargetType.Crypto)
  }

  const handleTargetClick = (target: any) => {
    if (target.type === DepositTargetType.Fystack) {
      setActiveTarget(DepositTargetType.Fystack)
    }
  }

  return (
    <div className='custom-scrollbar -webkit-overflow-scrolling-touch flex max-h-[calc(100vh-150px)] flex-col overflow-y-auto sm:max-h-none'>
      <MigrationNotice />
      <h6 className='mb-3 text-base text-foreground'>Cryptocurrency Deposits</h6>
      <div className='mb-4 rounded-lg border border-secondary-700 bg-secondary-800 p-3'>
        <p className='text-center text-xs text-gray-400'>
          Deposit with your personal on-chain address (QR). Balance updates after confirmation.
        </p>
      </div>

      {DepositTargets.map((target) => (
        <div key={target.label}>
          <div className='mb-3 mt-[18px] text-base font-medium'>
            {target.label}
          </div>
          <div className='grid grid-cols-2 gap-2 p-[1px]'>
            {target.targets?.map((item, index) => (
              <CryptoCard
                value={item}
                key={index}
                onClick={handleTargetClick}
                hasActive={false}
                iconClass='absolute !h-[44px] !w-[64px] -top-[5px] -left-[15px]'
                iconWrapperClass='relative w-[54px] h-[52px] sm:h-[58px]'
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default DepositContent

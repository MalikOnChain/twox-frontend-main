'use client'

import React from 'react'
import { ChevronDown } from 'lucide-react'

import { useModal, ModalType, AUTH_TABS } from '@/context/modal-context'
import { useUser } from '@/context/user-context'
import { t } from 'i18next'

import { Button } from '@/components/ui/button'

import UsdtIcon from '@/assets/currencies/usdt_white.svg'
import TronIcon from '@/assets/currencies/tron_white.svg'
import XrpIcon from '@/assets/currencies/xrp_white.svg'
import EthIcon from '@/assets/currencies/eth_white.svg'
import BtcIcon from '@/assets/currencies/btc_white.svg'
import BnbIcon from '@/assets/currencies/bnb_white.svg'

export default function CryptoSupportBanner() {
  const { setIsOpen, setType, setActiveTab } = useModal()
  const { isAuthenticated } = useUser()

  const handleDepositClick = () => {
    if (!isAuthenticated) {
      // If not logged in, open the Auth modal on signin tab
      setType(ModalType.Auth)
      setActiveTab(AUTH_TABS.signin)
      setIsOpen(true)
      return
    }
    
    // If logged in, open the deposit modal
    setType(ModalType.DepositWithdraw)
    setIsOpen(true)
  }

  const cryptos = [
    { Icon: UsdtIcon, name: 'USDT' },
    { Icon: TronIcon, name: 'TRX' },
    { Icon: XrpIcon, name: 'XRP' },
    { Icon: EthIcon, name: 'ETH' },
    { Icon: BtcIcon, name: 'BTC' },
    { Icon: BnbIcon, name: 'BNB' },
  ]

  return (
    <>
      {/* Desktop Version */}
      <div className='hidden lg:block'>
        <div className='flex items-center justify-between rounded-2xl border border-mirage bg-[#0C0C0C] px-8 py-6'>
          {/* Left Side - Text */}
          <div className='flex items-baseline gap-2'>
            <span className='font-satoshi text-2xl font-bold text-white'>
              Supporting
            </span>
            <span className='font-satoshi text-2xl font-bold text-arty-red'>
              30+
            </span>
            <span className='font-satoshi text-2xl font-bold text-white'>
              Crypto Currencies
            </span>
          </div>

          {/* Right Side - Crypto Icons + Deposit Button */}
          <div className='flex items-center gap-4'>
            {/* Crypto Icons */}
            <div className='flex items-center gap-3'>
              {cryptos.map((crypto, idx) => (
                <div
                  key={idx}
                  className='flex h-[42px] w-[42px] items-center justify-center rounded-full bg-[#222328] border border-[#2B2C31]'
                >
                  <crypto.Icon className='text-white' />
                </div>
              ))}
            </div>

            {/* Deposit Button */}
            <Button 
              className="flex items-center gap-2 w-[114px] h-[40px]" 
              variant='secondary2'
              onClick={handleDepositClick}
            >
              <span className='text-[15px]'>Deposit</span>
              <ChevronDown className='h-4 w-4' />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Version */}
      <div className='block lg:hidden'>
        <div className='flex flex-col items-center gap-4 rounded-2xl border border-mirage bg-[#0C0C0C] p-5'>
          {/* Text */}
          <div className='text-center'>
            <span className='font-satoshi text-xl font-bold text-white'>
              Supporting{' '}
            </span>
            <span className='font-satoshi text-xl font-bold text-arty-red'>
              30+{' '}
            </span>
            <span className='font-satoshi text-xl font-bold text-white'>
              Crypto Currencies
            </span>
          </div>

          {/* Crypto Icons */}
          <div className='flex items-center justify-between w-full'>
            {cryptos.map((crypto, idx) => (
              <div
                key={idx}
                className='flex h-[32px] w-[32px] items-center justify-center rounded-full bg-[#222328] border border-[#2B2C31]'
              >
                <crypto.Icon className='text-white' />
              </div>
            ))}
          </div>

          {/* Deposit Button */}
          <Button 
            className="flex items-center gap-2 w-full h-[40px]" 
            variant='secondary2'
            onClick={handleDepositClick}
          >
            <span className='text-[15px]'>{t('header.deposit')}</span>
            <ChevronDown className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </>
  )
}


'use client'

import { Info } from 'lucide-react'
import Image from 'next/image'
import React, { memo, useEffect, useState } from 'react'

import { useModal } from '@/context/modal-context'
import { useUser } from '@/context/user-context'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CustomModal } from '@/components/ui/modal'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import BankingIcon from '@/assets/icons/bank-icon.svg'
import CryptoIcon from '@/assets/icons/bitcoin.svg'
import LockIcon from '@/assets/icons/lock-icon.svg'
import masterCardImg from '@/assets/icons/master-card.png'
import visaCardImg from '@/assets/icons/visa-card.png'
import { RoundedCrossIcon } from '@/svg'

import { CryptoDepositFystackFlow } from './crypto-deposit-fystack-flow'
import { CryptoWithdrawPanel } from './crypto-withdraw-panel'

enum TRANSACTION_TABS {
  deposit = 'deposit',
  withdraw = 'withdraw',
}

enum PAYMENT_METHODS {
  crypto = 'crypto',
  fiat = 'fiat',
}

interface DepositWithdrawModalPropsType {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Mock data
const MOCK_DATA = {
  minDeposit: 5,
  currency: 'EUR',
  minWithdraw: 0.0000997,
}

const currencyOptions = [
  {
    value: 'EUR',
    label: 'EUR',
    icon: '🇪🇺',
  },
  {
    value: 'USD',
    label: 'USD',
    icon: '🇺🇸',
  },
]

function DepositWithdrawModal({
  open: _open,
  onOpenChange,
}: DepositWithdrawModalPropsType) {
  const { isOpen, setIsOpen } = useModal()
  const { getLoggedInUser, isAuthenticated } = useUser()

  const [activeTab, setActiveTab] = useState<TRANSACTION_TABS>(
    TRANSACTION_TABS.deposit
  )
  const [activeMethod, setActiveMethod] = useState<PAYMENT_METHODS>(
    PAYMENT_METHODS.crypto
  )
  const [amount, setAmount] = useState('')
  const [selectedCurrency, setSelectedCurrency] = useState('EUR')

  useEffect(() => {
    if (!isOpen || !isAuthenticated) return
    void getLoggedInUser()
    const id = window.setInterval(() => {
      void getLoggedInUser()
    }, 2000)
    return () => clearInterval(id)
  }, [isOpen, isAuthenticated, getLoggedInUser])

  const handleOpenChange = (openFlag: boolean) => {
    onOpenChange(openFlag)
    if (!openFlag) {
      setActiveTab(TRANSACTION_TABS.deposit)
      setActiveMethod(PAYMENT_METHODS.crypto)
      setAmount('')
      void getLoggedInUser()
    }
  }

  const renderCryptoDeposit = () => <CryptoDepositFystackFlow modalOpen={isOpen} />

  const renderFiatDeposit = () => (
    <div className='space-y-4 font-satoshi'>
      <div className='rounded-lg bg-mirage p-4'>
        <h3 className='mb-4 text-sm font-bold text-white'>Choose your Bonus</h3>
        <div className='space-y-3'>
          <div className='flex items-center justify-between'>
            <span className='text-sm font-bold text-white'>
              Now active bonus : First Welcome Bonus
            </span>
            <Info className='h-4 w-4 text-gray-400' />
          </div>
          <Button variant='secondary1' className='w-full'>
            Forfeit
          </Button>
        </div>
      </div>

      <div className='rounded-lg bg-mirage p-4'>
        <div className='space-y-3'>
          <div className='flex gap-2'>
            <Input
              type='number'
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder='10'
              containerClassName='flex-1 w-[150px]'
            />
            <Select
              value={selectedCurrency}
              onValueChange={(value) => {
                setSelectedCurrency(value)
              }}
            >
              <SelectTrigger className='!h-10 !min-h-10 w-24 rounded-lg border-none bg-[#17161B] from-[#242327] to-[#151419] px-2 py-2 font-satoshi text-sm font-medium text-[#ABAAAD] focus:outline-none focus:ring-0 focus:ring-offset-0 [&>svg]:opacity-70'>
                <SelectValue placeholder='EUR'>
                  {selectedCurrency && (
                    <div className='flex items-center gap-2'>
                      <span className='text-base'>
                        {
                          currencyOptions.find(
                            (option) => option.value === selectedCurrency
                          )?.icon
                        }
                      </span>
                      <span className='font-bold text-[#ABAAAD]'>
                        {selectedCurrency}
                      </span>
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent
                className='z-[9999] min-h-[122px] rounded-lg border-none bg-[#141317] p-[5px] shadow-lg'
                sideOffset={8}
              >
                <div className='flex flex-col gap-2'>
                  {currencyOptions.map((option) => (
                    <SelectItem
                      hideIndicator
                      key={option.value}
                      value={option.value}
                      className='min-h-[32px] cursor-pointer rounded px-3 py-2 text-white hover:bg-[#1f1f23] focus:bg-[#1f1f23] data-[highlighted]:bg-[#1f1f23]'
                    >
                      <div className='flex items-center gap-3'>
                        <span className='text-base'>{option.icon}</span>
                        <div className='flex-1 font-satoshi text-sm'>
                          {option.label}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </div>
              </SelectContent>
            </Select>
          </div>
          <p className='text-xs text-[#ABAAAD]'>
            min. deposit {MOCK_DATA.minDeposit} {MOCK_DATA.currency}
          </p>
        </div>

        <div className='mt-4 rounded-lg bg-cinder p-4'>
          <h3 className='mb-3 text-xs font-bold text-white'>Payment method</h3>
          <div className='flex gap-3'>
            <Image
              src={masterCardImg}
              alt='visa'
              width={56}
              height={30}
              className='object-contain'
            />
            <Image
              src={visaCardImg}
              alt='visa'
              width={56}
              height={30}
              className='object-contain'
            />
          </div>
        </div>

        <Button variant='secondary2' className='mt-4 w-full'>
          Deposit
        </Button>
      </div>
    </div>
  )

  const renderCryptoWithdraw = () => <CryptoWithdrawPanel />

  const renderFiatWithdraw = () => (
    <div className='space-y-4 rounded-lg bg-mirage p-4'>
      <div className='space-y-3'>
        <div>
          <label className='mb-2 block text-sm font-medium text-white'>
            Amount
          </label>
          <div className='flex gap-2'>
            <Input
              type='number'
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder='0'
              containerClassName='flex-1'
            />
            <Select
              value={selectedCurrency}
              onValueChange={(value) => {
                setSelectedCurrency(value)
              }}
            >
              <SelectTrigger className='!h-10 !min-h-10 w-24 rounded-lg border-none bg-[#17161B] from-[#242327] to-[#151419] px-2 py-2 font-satoshi text-sm font-medium text-[#ABAAAD] focus:outline-none focus:ring-0 focus:ring-offset-0 [&>svg]:opacity-70'>
                <SelectValue placeholder='EUR'>
                  {selectedCurrency && (
                    <div className='flex items-center gap-2'>
                      <span className='text-base'>
                        {
                          currencyOptions.find(
                            (option) => option.value === selectedCurrency
                          )?.icon
                        }
                      </span>
                      <span className='font-bold text-[#ABAAAD]'>
                        {selectedCurrency}
                      </span>
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent
                className='z-[9999] min-h-[122px] rounded-lg border-none bg-[#141317] p-[5px] shadow-lg'
                sideOffset={8}
              >
                <div className='flex flex-col gap-2'>
                  {currencyOptions.map((option) => (
                    <SelectItem
                      hideIndicator
                      key={option.value}
                      value={option.value}
                      className='min-h-[32px] cursor-pointer rounded px-3 py-2 text-white hover:bg-[#1f1f23] focus:bg-[#1f1f23] data-[highlighted]:bg-[#1f1f23]'
                    >
                      <div className='flex items-center gap-3'>
                        <span className='text-base'>{option.icon}</span>
                        <div className='flex-1 font-satoshi text-sm'>
                          {option.label}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </div>
              </SelectContent>
            </Select>
          </div>
          <p className='mt-1 text-xs font-normal text-[#ABAAAD]'>
            Minimum: {MOCK_DATA.minWithdraw} BTC
          </p>
        </div>

        <div>
          <h3 className='mb-1.5 text-sm font-bold text-white'>
            Payment Method
          </h3>
          <div className='rounded-lg border border-mirage bg-cinder p-4'>
            <p className='mb-3 text-sm text-arty-red'>
              To activate the withdrawal through this payment method, you need
              make a deposit with this method and it will become available for
              withdrawal
            </p>
            <div className='flex transform cursor-pointer justify-center rounded-lg bg-[#47474778] px-3 py-2 duration-300 ease-in-out active:scale-[0.98]'>
              <div className='flex h-7 w-14 items-center justify-center gap-2 rounded-md bg-mirage/90 bg-contain bg-no-repeat'>
                <LockIcon />
              </div>
            </div>
          </div>
        </div>

        <div className='mt-4 space-y-1 text-sm'>
          <div className='flex items-center gap-3'>
            <span className='text-xs font-normal text-white'>
              Processing Fee:
            </span>
            <span className='text-sm font-medium text-white'>0 USDT</span>
          </div>
          <div className='flex items-center gap-3'>
            <span className='text-xs font-normal text-white'>
              Will be charged:
            </span>
            <span className='text-sm font-medium text-white'>10 USDT</span>
          </div>
        </div>

        <Button variant='secondary2' className='mt-4 w-full'>
          Withdraw
        </Button>
      </div>
    </div>
  )

  const renderContent = () => {
    if (activeTab === TRANSACTION_TABS.deposit) {
      return activeMethod === PAYMENT_METHODS.crypto
        ? renderCryptoDeposit()
        : renderFiatDeposit()
    } else {
      return activeMethod === PAYMENT_METHODS.crypto
        ? renderCryptoWithdraw()
        : renderFiatWithdraw()
    }
  }

  return (
    <CustomModal
      isOpen={isOpen}
      onRequestClose={() => handleOpenChange(false)}
      contentLabel='Deposit/Withdraw Modal'
    >
      <div className='w-full overflow-hidden font-satoshi'>
        <div className='flex'>
          <div className='mx-auto flex w-full min-w-[320px] max-w-md max-h-[min(92vh,720px)] flex-1 flex-col overflow-hidden rounded-xl border border-mirage bg-dark-gradient p-4 md:min-w-[480px] md:p-6'>
            <div className='flex min-h-0 flex-1 flex-col gap-3'>
              <div className='shrink-0 space-y-3'>
              <div className='flex items-center justify-end'>
                {/* <h2 className='font-satoshi text-lg font-bold text-white'>
                  {activeTab === TRANSACTION_TABS.deposit
                    ? 'Deposit'
                    : 'Withdraw'}
                </h2> */}
                <RoundedCrossIcon
                  onClick={() => {
                    handleOpenChange(false)
                    setIsOpen(false)
                  }}
                />
              </div>

              {/* Main tabs */}
              <div className='flex rounded-lg bg-cinder p-1.5'>
                <button
                  onClick={() => setActiveTab(TRANSACTION_TABS.deposit)}
                  className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === TRANSACTION_TABS.deposit
                      ? 'bg-mirage text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Deposit
                </button>
                <button
                  onClick={() => setActiveTab(TRANSACTION_TABS.withdraw)}
                  className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === TRANSACTION_TABS.withdraw
                      ? 'bg-mirage text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Withdraw
                </button>
              </div>

              {/* Method tabs */}
              <div className='flex rounded-lg p-1'>
                <button
                  onClick={() => setActiveMethod(PAYMENT_METHODS.crypto)}
                  className={`flex flex-1 items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                    activeMethod === PAYMENT_METHODS.crypto
                      ? 'border-b border-arty-red bg-transparent text-white'
                      : 'border-b border-mirage text-[#FFFFFF80] hover:text-white'
                  }`}
                >
                  <CryptoIcon className='h-4 w-4' />
                  Crypto
                </button>
                {/* FIAT TAB - TEMPORARILY DISABLED - UNCOMMENT TO RE-ENABLE */}
                {/* <button
                  onClick={() => setActiveMethod(PAYMENT_METHODS.fiat)}
                  className={`flex flex-1 items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                    activeMethod === PAYMENT_METHODS.fiat
                      ? 'border-b border-arty-red bg-transparent text-white'
                      : 'border-b border-mirage text-[#FFFFFF80] hover:text-white'
                  }`}
                >
                  <BankingIcon className='h-4 w-4' />
                  Fiat
                </button> */}
                <button
                  disabled
                  className={`flex flex-1 items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors cursor-not-allowed ${
                    activeMethod === PAYMENT_METHODS.fiat
                      ? 'border-b border-arty-red bg-transparent text-white'
                      : 'border-b border-mirage text-[#FFFFFF80] hover:text-white'
                  }`}
                >
                  <BankingIcon className='h-4 w-4 opacity-50' />
                  Fiat
                </button>
              </div>
              </div>

              <div className='min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain pr-0.5 [-webkit-overflow-scrolling:touch]'>
                {renderContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </CustomModal>
  )
}

export default memo(DepositWithdrawModal)


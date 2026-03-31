import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'

const QUICK_AMOUNTS = [
  { value: 20, label: 'R$ 20', extra: '+30 Spins' },
  { value: 50, label: 'R$ 50', hot: true },
  { value: 100, label: 'R$ 100' },
  { value: 250, label: 'R$ 250', hot: true },
  { value: 500, label: 'R$ 500' },
  { value: 1000, label: 'R$ 1.000', hot: true },
]

const BONUS_CODE = 'GOD100'
const BONUS_PERCENT = 100 // 100% bonus for example
const BONUS_SPINS = 30

const DepositContent = ({
  onNext,
  loading,
}: {
  onNext: (amount: number) => void
  loading: boolean
}) => {
  const [amount, setAmount] = useState(50)
  const [selectedQuick, setSelectedQuick] = useState(50)
  const [noBonus, setNoBonus] = useState(false)
  const [bonusCode, setBonusCode] = useState(BONUS_CODE)
  const [amountInputFocused, setAmountInputFocused] = useState(false)
  const { t } = useTranslation()
  // Calculate bonus
  const bonusAmount = noBonus ? 0 : amount
  const totalValue = amount + bonusAmount
  const freeSpins =
    !noBonus && selectedQuick === 20 ? BONUS_SPINS : !noBonus ? BONUS_SPINS : 0

  // Handlers
  const handleAmountChange = (val: number) => {
    setAmount(val)
    setSelectedQuick(val)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value.replace(/\D/g, '')) || 0
    setAmount(val)
    setSelectedQuick(0) // Custom input disables quick select
  }

  const handleQuickSelect = (val: number) => {
    setAmount(val)
    setSelectedQuick(val)
  }

  const handleMinus = () => {
    if (amount > 1) {
      setAmount(amount - 1)
      setSelectedQuick(0)
    }
  }

  const handlePlus = () => {
    setAmount(amount + 1)
    setSelectedQuick(0)
  }

  return (
    <div className='relative mx-auto flex w-full max-w-[400px] flex-col gap-4 p-4 text-white md:p-0'>
      <p className='text-xs text-muted-foreground'>
        {t('pix_modal.deposit_amount')}
      </p>
      <div className='flex flex-col gap-4'>
        <div className='flex flex-col gap-2'>
          <div className='text-xs'>{t('pix_modal.amount_to_be_deposited')}</div>
          <div
            className={`flex w-full items-center rounded-lg border bg-background-secondary py-1 pl-3 pr-1 transition-all ${amountInputFocused ? 'border-success-300' : 'border-secondary-700'}`}
          >
            <span className='mr-2 select-none text-sm text-muted-foreground'>
              R$
            </span>
            <input
              type='text'
              value={amount}
              onChange={handleInputChange}
              className='w-full flex-1 border-none bg-transparent px-0 py-1 text-lg text-white outline-none focus:outline-none focus:ring-0'
              inputMode='numeric'
              pattern='[0-9]*'
              onFocus={() => setAmountInputFocused(true)}
              onBlur={() => setAmountInputFocused(false)}
            />
            <div className='ml-2 flex min-w-16 divide-x divide-background-fifth overflow-hidden rounded-md border border-secondary-700'>
              <button
                type='button'
                onClick={handleMinus}
                className='px-3 py-1 text-muted-foreground hover:text-white disabled:cursor-not-allowed disabled:opacity-50'
                disabled={amount <= 1}
              >
                –
              </button>
              <button
                type='button'
                onClick={handlePlus}
                className='px-3 py-1 text-muted-foreground hover:text-white'
              >
                +
              </button>
            </div>
          </div>
        </div>
        <div className='grid grid-cols-3 gap-2'>
          {QUICK_AMOUNTS.map((item) => (
            <button
              key={item.value}
              type='button'
              className={`text-md relative flex flex-col items-center justify-center rounded-sm border py-4 transition-colors ${selectedQuick === item.value ? 'border-green-400 bg-green-700 text-white' : 'border-background-third bg-background-fourth text-green-200 hover:bg-green-900'} `}
              onClick={() => handleQuickSelect(item.value)}
            >
              <span>{item.label}</span>
              {/* {item.extra && (
                <span className='mt-1 text-xs text-green-300'>
                  {item.extra}
                </span>
              )} */}
              {item.hot && (
                <span className='absolute right-1 top-1 rounded bg-yellow-400 px-0.5 text-[8px] font-semibold text-black'>
                  {t('pix_modal.hot')}
                </span>
              )}
              {selectedQuick === item.value && (
                <span className='absolute left-2 top-1 text-xs text-green-300'>
                  ✓
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
      {/* <div className='mb-4 flex items-center gap-2'>
        <Checkbox
          id='no-bonus'
          checked={noBonus}
          onCheckedChange={() => setNoBonus((v) => !v)}
        />
        <label
          htmlFor='no-bonus'
          className='cursor-pointer select-none text-sm'
        >
          I don't want to receive any bonus
        </label>
      </div> */}
      <div className='rounded-lg bg-background-fourth p-3 !font-rubik text-sm text-muted-foreground'>
        <div className='mb-1 flex items-center'>
          <span>{t('pix_modal.free_spins')}</span>
          <span
            className='mx-2 flex-1 border-b border-dotted border-muted-foreground opacity-40'
            style={{ borderBottomStyle: 'dotted', borderBottomWidth: 2 }}
          ></span>
          <span>{freeSpins}</span>
        </div>
        <div className='mb-1 flex items-center'>
          <span>{t('pix_modal.deposit_amount')}</span>
          <span
            className='mx-2 flex-1 border-b border-dotted border-muted-foreground opacity-40'
            style={{ borderBottomStyle: 'dotted', borderBottomWidth: 2 }}
          ></span>
          <span>R$ {amount.toFixed(2)}</span>
        </div>
        <div className='mb-1 flex items-center'>
          <span>{t('pix_modal.bonus_balance_earnings')}</span>
          <span
            className='mx-2 flex-1 border-b border-dotted border-muted-foreground opacity-40'
            style={{ borderBottomStyle: 'dotted', borderBottomWidth: 2 }}
          ></span>
          <span>R$ {bonusAmount.toFixed(2)}</span>
        </div>
        <div className='mt-2 flex items-center text-[16px] font-semibold'>
          <span>{t('pix_modal.total_value')}</span>
          <span
            className='mx-2 flex-1 border-b border-dotted border-muted-foreground opacity-40'
            style={{ borderBottomStyle: 'dotted', borderBottomWidth: 2 }}
          ></span>
          <span className='text-white'>R$ {totalValue.toFixed(2)}</span>
        </div>
      </div>
      <Button
        loading={loading}
        className='min-h-12 w-full rounded-lg border-none bg-gradient-to-b from-green-500 to-green-600 py-3 text-lg font-bold shadow-2xl shadow-green-700/40 transition-all duration-100 hover:from-green-500 hover:to-green-700 active:translate-y-1 active:from-green-600 active:to-green-800 active:shadow-md'
        style={{ boxShadow: '0 0px 12px 0 #22c55e99, 0 1.5px 0 0 #15803d' }}
        onClick={() => onNext(amount)}
      >
        {t('pix_modal.generate_pix')}
      </Button>
    </div>
  )
}

export default DepositContent

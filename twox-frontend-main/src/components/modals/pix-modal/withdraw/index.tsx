import { motion } from 'framer-motion'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import PhoneInput from 'react-phone-number-input'
import { toast } from 'sonner'

import 'react-phone-number-input/style.css'

import { withdraw } from '@/api/pix'

import { useUser } from '@/context/user-context'

import parseCommasToThousands from '@/lib/number'
import { formatCPF, isValidCPF } from '@/lib/utils'

import CoinIcon from '@/components/templates/icons/coin-icon'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface WithdrawProps {
  onFinish: () => void
}

type PixKeyType = 'email' | 'phone' | 'cpf'

const Withdraw = ({ onFinish }: WithdrawProps) => {
  const { balance, user } = useUser()
  const totalBalance = balance?.totalBalance || 0
  const formattedBalance = parseCommasToThousands(totalBalance)

  const [loading, setLoading] = useState(false)
  const [amount, setAmount] = useState(0)
  const [amountInputFocused, setAmountInputFocused] = useState(false)
  const [pixKeyType, setPixKeyType] = useState<PixKeyType>('cpf')
  const [pixKey, setPixKey] = useState('')
  const { t } = useTranslation()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value.replace(/\D/g, '')) || 0
    setAmount(val)
  }

  const handleMinus = () => {
    if (amount > 1) {
      setAmount(amount - 1)
    }
  }

  const handlePlus = () => {
    setAmount(amount + 1)
  }

  const handleAll = () => {
    setAmount(totalBalance)
  }

  const validateWithdrawAmount = () => {
    if (amount <= 0) {
      return 'Amount must be greater than 0'
    }

    if (amount > totalBalance) {
      return 'Amount must be less than your balance'
    }

    return null
  }

  const validatePixKey = () => {
    if (!pixKey) {
      return 'PIX key is required'
    }

    switch (pixKeyType) {
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(pixKey)) {
          return 'Invalid email format'
        }
        break
      case 'phone':
        if (!/^\+[1-9]\d{6,14}$/.test(pixKey)) {
          return 'Invalid phone number format'
        }
        break
      case 'cpf':
        if (!isValidCPF(pixKey)) {
          return 'Invalid CPF number'
        }
        break
    }

    return null
  }

  const handleWithdraw = async () => {
    if (loading) return

    const amountError = validateWithdrawAmount()
    if (amountError) {
      toast.error(amountError)
      return
    }

    const pixKeyError = validatePixKey()
    if (pixKeyError) {
      toast.error(pixKeyError)
      return
    }

    setLoading(true)
    try {
      await withdraw({
        amount,
        currency: 'BRL',
        pix_key: pixKeyType === 'phone' ? pixKey.replace(/^\+55/, '') : pixKey,
        pix_key_type: pixKeyType,
      })

      toast.success('Withdrawal successful')
      onFinish()
    } catch (error) {
      toast.error((error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      key='step1'
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className='inset-0'
    >
      <div className='relative mx-auto flex w-full max-w-[400px] flex-col gap-4 p-4 text-white md:p-0'>
        <div className='flex flex-col gap-2'>
          <div className='flex items-center justify-between'>
            <p className='text-xs'>{t('pix_modal.enter_amount')}</p>
            <button className='flex items-center gap-1.5' onClick={handleAll}>
              <CoinIcon />
              <span className='relative text-xs font-medium transition-colors duration-300 md:text-sm'>
                {formattedBalance}
              </span>
            </button>
          </div>
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

        <div className='flex flex-col gap-2'>
          <p className='text-xs'>{t('pix_modal.select_pix_key_type')}</p>
          <Select
            value={pixKeyType}
            onValueChange={(value) => {
              setPixKeyType(value as PixKeyType)
              setPixKey('') // Clear the input when changing type
            }}
          >
            <SelectTrigger className='w-full border-secondary-700 bg-background-secondary text-white'>
              <SelectValue placeholder={t('pix_modal.select_pix_key_type')} />
            </SelectTrigger>
            <SelectContent
              position='popper'
              sideOffset={4}
              align='start'
              className='relative z-[1000000] w-[var(--radix-select-trigger-width)] border border-secondary-700 bg-background-secondary text-white'
              side='bottom'
              avoidCollisions={false}
            >
              <SelectItem
                value='email'
                className='cursor-pointer hover:bg-background-third'
              >
                {t('pix_modal.email')}
              </SelectItem>
              <SelectItem
                value='phone'
                className='cursor-pointer hover:bg-background-third'
              >
                {t('pix_modal.phone')}
              </SelectItem>
              <SelectItem
                value='cpf'
                className='cursor-pointer hover:bg-background-third'
              >
                {t('pix_modal.cpf')}
              </SelectItem>
            </SelectContent>
          </Select>

          {pixKeyType === 'phone' ? (
            <PhoneInput
              international={false}
              defaultCountry='BR'
              countries={['BR']}
              limitMaxLength
              addInternationalOption={false}
              value={pixKey}
              countryCallingCodeEditable={false}
              onChange={(value) => setPixKey(value || '')}
              countrySelectProps={{
                className:
                  'bg-background-secondary text-white pointer-events-none',
                modalProps: {
                  visible: false,
                },
              }}
              className='phone-input-custom rounded-lg border border-input bg-background-third pl-2'
            />
          ) : (
            <Input
              type={pixKeyType === 'email' ? 'email' : 'text'}
              placeholder={
                pixKeyType === 'email'
                  ? t('pix_modal.enter_email')
                  : t('pix_modal.enter_cpf')
              }
              value={pixKey}
              onChange={(e) => {
                if (pixKeyType === 'cpf') {
                  const formatted = formatCPF(e.target.value)
                  setPixKey(formatted)
                } else {
                  setPixKey(e.target.value)
                }
              }}
              className='bg-background-secondary text-white'
              maxLength={pixKeyType === 'cpf' ? 14 : undefined}
            />
          )}
        </div>

        <Button
          loading={loading}
          className='min-h-12 w-full rounded-lg border-none bg-gradient-to-b from-green-500 to-green-600 py-3 text-lg font-bold shadow-2xl shadow-green-700/40 transition-all duration-100 hover:from-green-500 hover:to-green-700 active:translate-y-1 active:from-green-600 active:to-green-800 active:shadow-md'
          style={{ boxShadow: '0 0px 12px 0 #22c55e99, 0 1.5px 0 0 #15803d' }}
          onClick={handleWithdraw}
          disabled={loading}
        >
          {t('pix_modal.withdraw')}
        </Button>
      </div>
    </motion.div>
  )
}

export default Withdraw

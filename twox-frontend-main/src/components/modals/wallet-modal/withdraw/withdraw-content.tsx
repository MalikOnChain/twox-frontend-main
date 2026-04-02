import { yupResolver } from '@hookform/resolvers/yup'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as yup from 'yup'

import { getWithdrawConfig, sendCryptoWithdrawRequest } from '@/api/crypto'

import { useModal } from '@/context/modal-context'
import { useSocket } from '@/context/socket-context'
import { useUser } from '@/context/user-context'

import {
  BLOCKCHAIN_PROTOCOL_NAME,
  CRYPTO_TOKENS,
  CRYPTO_WITHDRAW_COINS_TOKENS,
  getCoinNetworkData,
  POPULAR_COINS,
  USDT_NETWORKS,
} from '@/lib/crypto'
import { precisionNumber } from '@/lib/number'
import { SOCKET_NAMESPACES } from '@/lib/socket'

import WithdrawContentLoader from '@/components/templates/loading/withdraw-content-loader'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// import CoinIcon from '@/assets/coin.svg'
import { CryptoPrice, WithdrawConfig } from '@/types/crypto'

// Define the form schema with Yup
const createWithdrawFormSchema = (minAmount: number, maxAmount: number) => {
  return yup.object({
    currency: yup.string().required('Currency is required'),
    network: yup.string().when('currency', {
      is: (val: string) => val === CRYPTO_TOKENS.USDT,
      then: (schema) =>
        schema.required('Network is required for USDT withdrawals'),
      otherwise: (schema) => schema.notRequired(),
    }),
    address: yup.string().required('Withdrawal address is required'),
    amount: yup
      .number()
      .required('Amount is required')
      .min(minAmount, `Amount must be greater than ${minAmount}`)
      .max(maxAmount, `Amount cannot exceed your balance of ${maxAmount}`)
      .typeError('Amount must be a number'),
  })
}

// Define type for the form values
interface WithdrawFormValues {
  currency: string
  network?: string
  address: string
  amount: number
}

const CryptoWithdrawContent: React.FC = () => {
  const [cryptoPrices, setCryptoPrices] = useState<CryptoPrice | null>(null)
  const { user } = useUser()
  const { socket } = useSocket(SOCKET_NAMESPACES.PRICE)
  const [config, setConfig] = useState<WithdrawConfig | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const { setIsOpen } = useModal()

  // Fetch configuration
  const fetchConfig = async () => {
    try {
      const response = await getWithdrawConfig()
      setConfig(response.data)
      setLoading(false)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Failed to fetch withdraw config')
      }
    }
  }

  // Create form schema with dynamic min/max values
  const formSchema = useMemo(() => {
    const minAmount = config?.withdrawMinAmount
      ? config.withdrawMinAmount + config.fee
      : 0
    const maxAmount = user?.balance || 0
    return createWithdrawFormSchema(minAmount, maxAmount)
  }, [config, user])

  // Initialize form with react-hook-form
  const form = useForm<WithdrawFormValues>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      currency: POPULAR_COINS.ethereum,
      network: '',
      address: '',
      amount: 0,
    },
    mode: 'onChange',
  })

  // Watch values from the form
  const selectedCurrency = form.watch('currency')
  const amount = form.watch('amount')

  // Get network data
  const listItems = useMemo(() => {
    return CRYPTO_WITHDRAW_COINS_TOKENS.map((item) => getCoinNetworkData(item))
  }, [])

  const selectedNetworkData = useMemo(() => {
    return getCoinNetworkData(selectedCurrency)
  }, [selectedCurrency])

  // Calculate price in USD
  const priceByAmount = useMemo(() => {
    if (!cryptoPrices) return 0
    if (!cryptoPrices[selectedNetworkData.symbol]) return 0
    return (
      Number(cryptoPrices[selectedNetworkData.symbol].price) * Number(amount)
    )
  }, [amount, cryptoPrices, selectedNetworkData])

  // Max amount handler
  const handleMaxClick = useCallback(() => {
    form.setValue('amount', user?.balance || 0, { shouldValidate: true })
  }, [form, user])

  // Get crypto prices
  const getPriceInUsd = useCallback(() => {
    if (socket) {
      socket.emit('price:getAll')
    }
  }, [socket])

  // Form submission handler
  const onSubmit = async (data: WithdrawFormValues) => {
    try {
      const mapUsdtRail = (n: string) => {
        if (n === USDT_NETWORKS.TRC20) return 'TRC20'
        if (n === USDT_NETWORKS.BEP20) return 'BSC'
        return 'ERC20'
      }
      const networkForNativeCurrency = () => {
        if (data.currency === BLOCKCHAIN_PROTOCOL_NAME.TRON) return 'TRC20'
        if (data.currency === BLOCKCHAIN_PROTOCOL_NAME.BINANCE_SMART_CHAIN) return 'BSC'
        if (data.currency === BLOCKCHAIN_PROTOCOL_NAME.SOLANA) return 'SOL'
        return 'ERC20'
      }

      if (data.currency === CRYPTO_TOKENS.USDT && data.network) {
        const response = await sendCryptoWithdrawRequest({
          symbol: 'USDT',
          network: mapUsdtRail(data.network),
          address: data.address,
          amount: data.amount,
        })
        toast.success(response.message)
      } else {
        const response = await sendCryptoWithdrawRequest({
          symbol: selectedNetworkData.symbol,
          network: networkForNativeCurrency(),
          address: data.address,
          amount: data.amount,
        })
        toast.success(response.message)
      }
      setIsOpen(false)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Failed to withdraw crypto')
      }
    }
  }

  // Socket connection and price updates
  useEffect(() => {
    getPriceInUsd()
    if (socket) {
      socket.on('price:updateAll', (prices: CryptoPrice) => {
        setCryptoPrices(prices)
      })
    }

    return () => {
      if (socket) {
        socket.off('price:updateAll')
      }
    }
  }, [socket, getPriceInUsd])

  // Fetch config on component mount
  useEffect(() => {
    fetchConfig()
  }, [])

  if (loading || !config) {
    return <WithdrawContentLoader />
  }

  return (
    <div className='grid w-full grid-rows-1 gap-3 overflow-hidden bg-background p-0 md:max-w-[575px]'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex h-full w-full flex-col gap-2 overflow-y-auto'
        >
          {/* Currency */}
          <FormField
            control={form.control}
            name='currency'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='px-1 text-xs font-medium text-muted-foreground'>
                  Currency
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className='w-full'>
                      <SelectValue>
                        {selectedNetworkData.icon && (
                          <div className='flex items-start gap-2'>
                            <selectedNetworkData.icon className='h-5 w-5' />
                            <div className='text-start'>
                              <div>{`${selectedNetworkData.title}`}</div>
                            </div>
                          </div>
                        )}
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {listItems?.map((item) => (
                      <SelectItem key={item.network} value={item.network}>
                        <div className='flex items-start gap-2 text-left'>
                          <item.icon className='h-5 w-5' />
                          <div>
                            <div>{`${item.title}`}</div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Network - Only for USDT */}
          {selectedCurrency === CRYPTO_TOKENS.USDT && (
            <FormField
              control={form.control}
              name='network'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='px-1 text-xs font-medium text-muted-foreground'>
                    Network
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Select network' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(USDT_NETWORKS).map((network) => (
                        <SelectItem key={network} value={network}>
                          {network}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Withdrawal Address */}
          <FormField
            control={form.control}
            name='address'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='px-1 text-xs font-medium text-muted-foreground'>
                  Withdrawal Address
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder='Address'
                    className='font-mono'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Amount */}
          <FormField
            control={form.control}
            name='amount'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='px-1 text-xs font-medium text-muted-foreground'>
                  Amount
                </FormLabel>
                <FormControl>
                  <Input
                    className='font-mono'
                    type='number'
                    // startAddon={
                    //   <span>
                    //     <CoinIcon />
                    //   </span>
                    // }
                    endAddon={
                      <span
                        className='cursor-pointer p-1 text-xs hover:text-white'
                        onClick={handleMaxClick}
                      >
                        MAX
                      </span>
                    }
                    {...field}
                    onChange={(e) => {
                      field.onChange(parseFloat(e.target.value) || 0)
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Amount in USD */}
          <div className='mt-2 flex items-center justify-between gap-2 text-sm'>
            <div>You get</div>
            <div className='flex items-center justify-center gap-2'>
              <span>
                {selectedNetworkData.icon && (
                  <span>
                    <selectedNetworkData.icon className='h-5 w-5' />
                  </span>
                )}
              </span>
              <span>{precisionNumber(priceByAmount)}</span>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type='submit'
            loading={form.formState.isSubmitting}
            className='h-full w-full md:py-3'
            disabled={!form.formState.isValid}
          >
            <span className='text-sm'>Withdraw</span>
          </Button>

          {/* Form Hints */}
          <div className='grid grid-cols-1 gap-2 text-sm text-muted-foreground'>
            <div className='flex w-full items-center gap-2'>
              <span className='flex items-center gap-2 max-md:text-xs'>
                * The withdrawal amount must be greater than
                {/* <span className='min-w-4'>
                  <CoinIcon />
                </span> */}
                <span className='text-white'>{`${precisionNumber(config.withdrawMinAmount + config.fee)}`}</span>
              </span>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default CryptoWithdrawContent

'use client'

import { Copy, Info } from 'lucide-react'
import Image from 'next/image'
import React, { memo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useModal } from '@/context/modal-context'
import { getSupportedCurrencies, getMinimumPaymentAmount, getEstimatedPrice, createPayment, getPaymentStatus, type Currency } from '@/api/coinsbuy'
import { getCryptoMetadata } from '@/lib/crypto-metadata'

// Crypto Deposit Component
const CryptoDepositComponent = ({ selectedCurrency }: { selectedCurrency: string }) => {
  const [currencies, setCurrencies] = React.useState<Currency[]>([])
  const [selectedCrypto, setSelectedCryptoCurrency] = React.useState('BTC')
  const [selectedNetwork, setSelectedNetwork] = React.useState<string | null>(null)
  const [nowPaymentsAmount, setNowPaymentsAmount] = React.useState('')
  const [minAmount, setMinAmount] = React.useState('')
  const [estimatedPrice, setEstimatedPrice] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [currenciesLoading, setCurrenciesLoading] = React.useState(true)
  
  const loadSupportedCurrencies = async () => {
    setCurrenciesLoading(true)
    try {
      const response = await getSupportedCurrencies()
      // Coinsbuy returns full currency objects with networks
      const currencyList: Currency[] = response.data.currencies.map((currency: Currency) => {
        const metadata = getCryptoMetadata(currency.code)
        return {
          ...currency,
          code: currency.code.toUpperCase(),
          symbol: currency.symbol.toUpperCase(),
          logo: metadata.logo,
          color: metadata.color,
          popular: metadata.popular,
        } as Currency
      })
      // Sort: popular first, then alphabetically
      currencyList.sort((a: any, b: any) => {
        if (a.popular && !b.popular) return -1
        if (!a.popular && b.popular) return 1
        return a.code.localeCompare(b.code)
      })
      setCurrencies(currencyList)
      
      // Set default crypto if not set or if current selection is not in the list
      if (currencyList.length > 0) {
        const currentCryptoExists = currencyList.some(c => c.code === selectedCrypto)
        if (!selectedCrypto || !currentCryptoExists) {
          setSelectedCryptoCurrency(currencyList[0].code)
        }
      }
    } catch (error: any) {
      console.error('Failed to load currencies:', error)
      const errorMessage = error?.response?.data?.error || error?.message || 'Unknown error'
      if (currencies.length === 0) {
        alert(`Failed to load currencies: ${errorMessage}`)
      }
    } finally {
      setCurrenciesLoading(false)
    }
  }
  
  const fetchMinAmount = async () => {
    if (!selectedCrypto) return
    try {
      const response = await getMinimumPaymentAmount(selectedCurrency, selectedCrypto)
      setMinAmount(response.data.min_amount)
    } catch (error) {
      console.error('Failed to load min amount:', error)
    }
  }
  
  const fetchEstimatedPrice = async () => {
    if (!nowPaymentsAmount || !selectedCrypto) return
    try {
      const response = await getEstimatedPrice(parseFloat(nowPaymentsAmount), selectedCurrency, selectedCrypto)
      setEstimatedPrice(response.data.estimated_amount)
    } catch (error) {
      console.error('Failed to load estimated price:', error)
    }
  }

  const [paymentStep, setPaymentStep] = useState<'amount' | 'payment' | 'status'>('amount')
  const [paymentDetails, setPaymentDetails] = useState<any>(null)
  const [currentPaymentId, setCurrentPaymentId] = useState<string | null>(null)
  const [paymentStatusData, setPaymentStatusData] = useState<any>(null)
  const [statusLoading, setStatusLoading] = useState(false)

  // Load currencies when component mounts
  React.useEffect(() => {
    loadSupportedCurrencies()
  }, [])

  // Load min amount when crypto changes
  React.useEffect(() => {
    if (selectedCrypto) {
      fetchMinAmount()
    }
  }, [selectedCrypto, selectedCurrency])

  // Update estimated price when amount or crypto changes
  React.useEffect(() => {
    if (nowPaymentsAmount && selectedCrypto) {
      fetchEstimatedPrice()
    }
  }, [nowPaymentsAmount, selectedCrypto, selectedCurrency])

  const handleCreatePayment = async () => {
    console.log('Create Payment button clicked', {
      selectedCrypto,
      nowPaymentsAmount,
      selectedCurrencyObj,
      loading,
    })
    
    if (!selectedCrypto || !selectedCurrencyObj) {
      alert('Please select a cryptocurrency')
      return
    }
    
    if (!nowPaymentsAmount || nowPaymentsAmount.trim() === '') {
      alert('Please enter an amount')
      return
    }
    
    const amount = parseFloat(nowPaymentsAmount)
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount greater than 0')
      return
    }
    
    if (loading) {
      console.log('Already processing payment, ignoring click')
      return
    }
    
    setLoading(true)
    try {
      // Use Coinsbuy createPayment function
      // For tokens on specific networks, include network info if selected
      const payCurrencyCode = selectedCrypto
      
      // If a network is selected and it's different from the base currency,
      // we might need to format it as "CURRENCY-NETWORK" or pass it in metadata
      // Coinsbuy typically handles this via the currency code format
      if (selectedNetwork && availableNetworks.length > 1) {
        // Some APIs use format like "USDT-ERC20", others handle it via metadata
        // For now, we'll use the base currency code and let Coinsbuy handle network selection
        // The network info is stored in metadata for tracking
      }
      
      const paymentPayload: any = {
        amount: amount,
        currency: selectedCurrency.toUpperCase(),
        pay_currency: payCurrencyCode,
        order_description: `Deposit of ${nowPaymentsAmount} ${selectedCurrency}`,
      }
      
      // Add network to metadata if selected
      if (selectedNetwork) {
        paymentPayload.network = selectedNetwork
      }
      
      console.log('Creating payment with:', paymentPayload);
      
      const payment = await createPayment(paymentPayload)
      
      console.log('Payment created successfully:', payment);
      
      if (!payment) {
        throw new Error('No response from server')
      }
      
      if (!payment.success) {
        throw new Error(payment.error || 'Payment creation failed')
      }
      
      if (!payment.data) {
        throw new Error('Invalid payment response: missing data')
      }
      
      if (!payment.data.payment_id) {
        throw new Error('Invalid payment response: missing payment_id')
      }
      
      setPaymentDetails(payment)
      setCurrentPaymentId(payment.data.payment_id)
      setPaymentStep('payment')
    } catch (error: any) {
      console.error('Failed to create payment:', error)
      console.error('Error details:', {
        message: error?.message,
        response: error?.response?.data,
        status: error?.response?.status,
      })
      
      let errorMessage = 'Unknown error'
      if (error?.response?.data?.error) {
        errorMessage = error.response.data.error
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error?.message) {
        errorMessage = error.message
      }
      
      alert(`Failed to create payment: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }
  
  // Get selected currency object
  const selectedCurrencyObj = currencies.find(c => c.code === selectedCrypto)
  
  // Get available networks for selected currency
  const availableNetworks = selectedCurrencyObj?.networks || []
  
  // Check if button should be enabled
  const isButtonEnabled = Boolean(
    selectedCrypto && 
    selectedCurrencyObj && 
    nowPaymentsAmount && 
    nowPaymentsAmount.trim() !== '' && 
    !isNaN(parseFloat(nowPaymentsAmount)) && 
    parseFloat(nowPaymentsAmount) > 0 && 
    !loading
  )
  
  // Debug helper - log button state
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Button state:', {
        selectedCrypto,
        hasSelectedCurrencyObj: !!selectedCurrencyObj,
        nowPaymentsAmount,
        parsedAmount: parseFloat(nowPaymentsAmount),
        isValidAmount: !isNaN(parseFloat(nowPaymentsAmount)) && parseFloat(nowPaymentsAmount) > 0,
        loading,
        isButtonEnabled,
      })
    }
  }, [selectedCrypto, selectedCurrencyObj, nowPaymentsAmount, loading, isButtonEnabled])
  
  // Reset network selection when crypto changes
  React.useEffect(() => {
    if (availableNetworks.length > 0) {
      setSelectedNetwork(availableNetworks[0]?.code || null)
    } else {
      setSelectedNetwork(null)
    }
  }, [selectedCrypto, availableNetworks.length])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  if (paymentStep === 'payment' && paymentDetails) {
    return (
      <div className='space-y-4'>
        <div className='rounded-lg bg-mirage p-4'>
          <h3 className='mb-4 text-sm font-bold text-white'>Payment Details</h3>
          <div className='space-y-3'>
            <div>
              <label className='mb-2 block text-xs text-[#ABAAAD]'>
                Send Amount
              </label>
              <div className='flex items-center justify-between rounded-lg bg-[#17161B] p-3'>
                <span className='text-sm font-bold text-white'>
                  {paymentDetails.data?.price_amount || nowPaymentsAmount} {paymentDetails.data?.price_currency?.toUpperCase() || selectedCurrency}
                </span>
                <Button
                  variant='secondary2'
                  size='sm'
                  onClick={() => copyToClipboard((paymentDetails.data?.price_amount || nowPaymentsAmount).toString())}
                >
                  <Copy className='h-4 w-4' />
                </Button>
              </div>
            </div>
            
            <div>
              <label className='mb-2 block text-xs text-[#ABAAAD]'>
                To Address
              </label>
              <div className='flex items-center justify-between rounded-lg bg-[#17161B] p-3'>
                <span className='text-sm font-bold text-white truncate'>
                  {paymentDetails.data?.pay_address || 'Loading...'}
                </span>
                <Button
                  variant='secondary2'
                  size='sm'
                  onClick={() => copyToClipboard(paymentDetails.data?.pay_address || '')}
                  disabled={!paymentDetails.data?.pay_address}
                >
                  <Copy className='h-4 w-4' />
                </Button>
              </div>
              {paymentDetails.data?.pay_address && (
                <p className='mt-1 text-xs text-[#ABAAAD]'>
                  Send {selectedCrypto.toUpperCase()} to this address. The amount will be converted automatically.
                </p>
              )}
            </div>
            
            {paymentDetails.data?.valid_until && (
              <div>
                <label className='mb-2 block text-xs text-[#ABAAAD]'>
                  Valid Until
                </label>
                <div className='rounded-lg bg-[#17161B] p-3'>
                  <span className='text-xs text-yellow-400'>
                    {new Date(paymentDetails.data.valid_until).toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            <Button
              variant='secondary1'
              className='w-full'
              onClick={async () => {
                if (currentPaymentId) {
                  setStatusLoading(true)
                  try {
                    const statusResponse = await getPaymentStatus(currentPaymentId)
                    setPaymentStatusData(statusResponse.data)
                    setPaymentStep('status')
                  } catch (error) {
                    console.error('Failed to check payment status:', error)
                    alert('Failed to check payment status')
                  } finally {
                    setStatusLoading(false)
                  }
                }
              }}
              loading={statusLoading}
            >
              Check Payment Status
            </Button>

            <Button
              variant='secondary2'
              className='w-full'
              onClick={() => setPaymentStep('amount')}
            >
              Back to Amount Selection
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Payment Status View
  if (paymentStep === 'status' && paymentStatusData) {
    const status = paymentStatusData
    const getStatusColor = (statusValue: string) => {
      switch (statusValue) {
        case 'completed': return 'text-green-400'
        case 'failed': case 'expired': case 'cancelled': return 'text-red-400'
        case 'pending': return 'text-yellow-400'
        default: return 'text-blue-400'
      }
    }

    const getStatusMessage = (statusValue: string) => {
      switch (statusValue) {
        case 'completed': return '✅ Payment completed successfully!'
        case 'failed': return '❌ Payment failed'
        case 'expired': return '⏰ Payment expired'
        case 'cancelled': return '❌ Payment cancelled'
        case 'pending': return '⏳ Waiting for payment confirmation'
        default: return `Status: ${statusValue}`
      }
    }

    return (
      <div className='space-y-4'>
        <div className='rounded-lg bg-mirage p-4'>
          <h3 className='mb-4 text-sm font-bold text-white'>Payment Status</h3>
          <div className='space-y-3'>
            <div className='flex items-center justify-between'>
              <span className='text-xs text-[#ABAAAD]'>Status:</span>
              <span className={`text-sm font-bold ${getStatusColor(status.payment_status || 'pending')}`}>
                {getStatusMessage(status.payment_status || 'pending')}
              </span>
            </div>
            
            <div className='flex items-center justify-between'>
              <span className='text-xs text-[#ABAAAD]'>Amount:</span>
              <span className='text-sm font-bold text-white'>
                {status.price_amount || nowPaymentsAmount} {status.price_currency?.toUpperCase() || selectedCurrency}
              </span>
            </div>

            <div className='flex items-center justify-between'>
              <span className='text-xs text-[#ABAAAD]'>Crypto:</span>
              <span className='text-sm font-bold text-white'>
                {status.pay_amount || estimatedPrice || '0'} {status.pay_currency?.toUpperCase() || selectedCrypto?.toUpperCase() || ''}
              </span>
            </div>

            {status.actually_paid && (
              <div className='flex items-center justify-between'>
                <span className='text-xs text-[#ABAAAD]'>Actually Paid:</span>
                <span className='text-sm font-bold text-white'>
                  {status.actually_paid} {status.pay_currency?.toUpperCase() || status.outcome_currency?.toUpperCase() || ''}
                </span>
              </div>
            )}

            <div className='flex items-center justify-between'>
              <span className='text-xs text-[#ABAAAD]'>Payment ID:</span>
              <span className='text-xs font-mono text-white truncate'>
                {status.payment_id}
              </span>
            </div>

            <div className='flex items-center justify-between'>
              <span className='text-xs text-[#ABAAAD]'>Created:</span>
              <span className='text-xs text-white'>
                {new Date(status.created_at).toLocaleString()}
              </span>
            </div>

            {status.updated_at && (
              <div className='flex items-center justify-between'>
                <span className='text-xs text-[#ABAAAD]'>Last Updated:</span>
                <span className='text-xs text-white'>
                  {new Date(status.updated_at).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className='flex gap-2'>
          <Button
            variant='secondary1'
            className='flex-1'
            onClick={async () => {
              if (currentPaymentId) {
                setStatusLoading(true)
                try {
                  const statusResponse = await getPaymentStatus(currentPaymentId)
                  setPaymentStatusData(statusResponse.data)
                } catch (error) {
                  console.error('Failed to check payment status:', error)
                  alert('Failed to refresh status')
                } finally {
                  setStatusLoading(false)
                }
              }
            }}
            loading={statusLoading}
          >
            {statusLoading ? 'Checking...' : 'Refresh Status'}
          </Button>

          <Button
            variant='secondary2'
            className='flex-1'
            onClick={() => setPaymentStep('payment')}
          >
            Back to Payment
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      <div className='rounded-lg bg-mirage p-4'>
        <h3 className='mb-4 text-sm font-bold text-white'>🎉 New Crypto Payment System</h3>
        <div className='space-y-3'>
          <p className='text-xs text-[#ABAAAD]'>
            Now supporting 200+ cryptocurrencies with real-time pricing and instant confirmations!
          </p>
        </div>
      </div>

      <div className='space-y-3 rounded-lg bg-mirage p-4'>
        <div>
          <label className='mb-2 block text-xs text-[#ABAAAD]'>
            Deposit Amount ({selectedCurrency})
          </label>
          <Input
            type='number'
            value={nowPaymentsAmount}
            onChange={(e) => setNowPaymentsAmount(e.target.value)}
            placeholder='10.00'
            className='!h-10 w-full rounded-lg border-none bg-[#17161B] px-3 py-2 font-satoshi text-sm font-medium text-white focus:outline-none focus:ring-0'
          />
        </div>

        <div>
          <label className='mb-2 block text-xs text-[#ABAAAD]'>
            Choose Cryptocurrency
          </label>
          <Select
            value={selectedCrypto || ''}
            onValueChange={(value) => {
              setSelectedCryptoCurrency(value)
              if (value && nowPaymentsAmount) {
                fetchMinAmount()
                fetchEstimatedPrice()
              }
            }}
          >
            <SelectTrigger className='!h-10 !min-h-10 w-full rounded-lg border-none bg-[#17161B] from-[#242327] to-[#151419] px-2 py-2 font-satoshi text-sm font-medium text-[#ABAAAD] focus:outline-none focus:ring-0 focus:ring-offset-0 [&>svg]:opacity-70'>
              <SelectValue placeholder='Select cryptocurrency'>
                {selectedCrypto && selectedCurrencyObj && (
                  <div className='flex items-center gap-2'>
                    <span className='text-lg' style={{ color: selectedCurrencyObj.color || '#6366f1' }}>
                      {selectedCurrencyObj.logo || selectedCurrencyObj.code.charAt(0)}
                    </span>
                    <span className='font-bold text-[#ABAAAD]'>
                      {selectedCurrencyObj.name} ({selectedCurrencyObj.code})
                    </span>
                  </div>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent
              className='z-[9999] max-h-[300px] rounded-lg border-none bg-[#141317] p-[5px] shadow-lg overflow-y-auto'
              sideOffset={8}
            >
              <div className='flex flex-col gap-2'>
                {currenciesLoading ? (
                  <div className='px-3 py-2 text-sm text-gray-400'>
                    Loading currencies...
                  </div>
                ) : currencies && currencies.length > 0 ? (
                  currencies.map((currency) => (
                    <SelectItem
                      hideIndicator
                      key={currency.code}
                      value={currency.code}
                      className='min-h-[40px] cursor-pointer rounded px-3 py-2 text-white hover:bg-[#1f1f23] focus:bg-[#1f1f23] data-[highlighted]:bg-[#1f1f23]'
                    >
                      <div className='flex items-center gap-3'>
                        <div 
                          className='flex h-8 w-8 items-center justify-center rounded-full text-base font-bold text-white'
                          style={{ 
                            backgroundColor: currency.color || '#6366f1',
                            background: currency.color ? undefined : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                          }}
                        >
                          {currency.logo || currency.code.charAt(0)}
                        </div>
                        <div className='flex-1 font-satoshi text-sm'>
                          <div className='font-medium text-white'>{currency.name}</div>
                          <div className='text-xs text-gray-400'>{currency.code}</div>
                          {currency.networks && currency.networks.length > 0 && (
                            <div className='text-xs text-gray-500 mt-0.5'>
                              {currency.networks.length} network{currency.networks.length > 1 ? 's' : ''} available
                            </div>
                          )}
                        </div>
                        {currency.popular && (
                          <span className='rounded bg-arty-red px-2 py-0.5 text-xs text-white'>Popular</span>
                        )}
                      </div>
                    </SelectItem>
                  ))
                ) : (
                  <div className='px-3 py-2 text-sm text-gray-400'>
                    No currencies available
                  </div>
                )}
              </div>
            </SelectContent>
          </Select>
          
          {/* Network Selection (if currency has multiple networks) */}
          {availableNetworks.length > 1 && (
            <div className='mt-2'>
              <label className='mb-2 block text-xs text-[#ABAAAD]'>
                Select Network
              </label>
              <Select
                value={selectedNetwork || availableNetworks[0]?.code || ''}
                onValueChange={setSelectedNetwork}
              >
                <SelectTrigger className='!h-10 !min-h-10 w-full rounded-lg border-none bg-[#17161B] px-2 py-2 font-satoshi text-sm font-medium text-[#ABAAAD] focus:outline-none focus:ring-0'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className='z-[9999] max-h-[200px] rounded-lg border-none bg-[#141317] p-[5px] shadow-lg'>
                  {availableNetworks.map((network) => (
                    <SelectItem
                      key={network.code}
                      value={network.code}
                      className='min-h-[32px] cursor-pointer rounded px-3 py-2 text-white hover:bg-[#1f1f23]'
                    >
                      <div className='flex items-center justify-between w-full'>
                        <span className='font-satoshi text-sm'>{network.name}</span>
                        {network.min_deposit_amount && (
                          <span className='text-xs text-gray-400 ml-2'>
                            Min: {network.min_deposit_amount}
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {selectedCrypto && nowPaymentsAmount && (
          <div className='rounded-lg bg-[#17161B] p-3'>
            <div className='space-y-2 text-xs text-[#ABAAAD]'>
              <div className='flex justify-between'>
                <span>Min Amount:</span>
                <span className='text-white'>
                  {minAmount || '...'}
                </span>
              </div>
              <div className='flex justify-between'>
                <span>Estimated Price:</span>
                <span className='text-white'>
                  {estimatedPrice || '...'} {selectedCrypto.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        )}

        <Button 
          variant='secondary2' 
          className='mt-4 w-full'
          loading={loading}
          disabled={!isButtonEnabled || loading}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            console.log('Button onClick triggered', { isButtonEnabled, loading })
            // Prevent multiple clicks - check loading state again
            if (loading) {
              console.log('Already processing, ignoring click')
              return
            }
            if (isButtonEnabled && !loading) {
              handleCreatePayment()
            }
          }}
        >
          {loading ? 'Creating Payment...' : 'Create Payment'}
        </Button>
      </div>
    </div>
  )
}

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

enum TRANSACTION_TABS {
  deposit = 'deposit',
  withdraw = 'withdraw',
}

enum PAYMENT_METHODS {
  crypto = 'crypto',
  banking = 'banking',
}

interface DepositWithdrawModalPropsType {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Mock data
const MOCK_DATA = {
  cryptoAddress: '0X79349FDSNFHS092584WSANK19523450',
  availableBalance: '0.00000000',
  minDeposit: 5,
  currency: 'EUR',
  cryptoCurrency: 'USDT',
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
  open,
  onOpenChange,
}: DepositWithdrawModalPropsType) {
  const { t } = useTranslation()
  const { isOpen, setIsOpen, setType } = useModal()

  // setType(ModalType.Pix)

  const [activeTab, setActiveTab] = useState<TRANSACTION_TABS>(
    TRANSACTION_TABS.deposit
  )
  const [activeMethod, setActiveMethod] = useState<PAYMENT_METHODS>(
    PAYMENT_METHODS.crypto
  )
  const [amount, setAmount] = useState('')
  const [selectedNetwork, setSelectedNetwork] = useState('ERC20')
  const [selectedCurrency, setSelectedCurrency] = useState('EUR')

  // Remove the hook from here to avoid conditional rendering issues

  const handleOpenChange = (openFlag: boolean) => {
    onOpenChange(openFlag)
    if (!openFlag) {
      // Reset state when closing
      setActiveTab(TRANSACTION_TABS.deposit)
      setActiveMethod(PAYMENT_METHODS.crypto)
      setAmount('')
    }
  }

  const copyAddress = () => {
    navigator.clipboard.writeText(MOCK_DATA.cryptoAddress)
    // Add toast notification here
  }

  const renderCryptoDeposit = () => {
    return <CryptoDepositComponent selectedCurrency={selectedCurrency} />
  }


  const renderBankingDeposit = () => (
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

  const renderCryptoWithdraw = () => (
    <div className='space-y-4'>
      <div className='rounded-lg bg-mirage p-4'>
        <div className='mb-2 flex items-center justify-between'>
          <span className='text-sm font-bold text-white'>
            Available to withdraw
          </span>
          <Info className='h-4 w-4 text-white' />
        </div>
        <div className='text-xl font-bold text-white'>
          {MOCK_DATA.availableBalance} BTC
        </div>
      </div>

      <div className='rounded-lg bg-mirage p-4'>
        <div>
          <label className='mb-2 block text-sm text-gray-300'>Amount</label>
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
          <p className='text-xs text-[#ABAAAD]'>
            Minimum: {MOCK_DATA.minWithdraw} BTC
          </p>
        </div>

        <div>
          <label className='mb-1 mt-3 block text-sm font-medium text-white'>
            Choose Network
          </label>
          <Select
            value={selectedCurrency}
            onValueChange={(value) => {
              setSelectedCurrency(value)
            }}
          >
            <SelectTrigger className='!h-10 !min-h-10 w-full rounded-lg border-none bg-[#17161B] from-[#242327] to-[#151419] px-2 py-2 font-satoshi text-sm font-medium text-[#ABAAAD] focus:outline-none focus:ring-0 focus:ring-offset-0 [&>svg]:opacity-70'>
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
                {['ERC20', 'TRC20', 'BSC'].map((option) => (
                  <SelectItem
                    hideIndicator
                    key={option}
                    value={option}
                    className='min-h-[32px] cursor-pointer rounded px-3 py-2 text-white hover:bg-[#1f1f23] focus:bg-[#1f1f23] data-[highlighted]:bg-[#1f1f23]'
                  >
                    <div className='flex items-center gap-3'>
                      {/* <span className='text-base'>{option.icon}</span> */}
                      <div className='flex-1 font-satoshi text-sm'>
                        {option}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </div>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className='mb-1 mt-3 block text-sm font-medium text-white'>
            Withdrawal address
          </label>
          <Input type='text' value={MOCK_DATA.cryptoAddress} />
        </div>

        <div className='mt-4 space-y-1 text-sm'>
          <div className='flex items-center gap-3'>
            <span className='text-xs font-normal text-white'>
              Processing Fee:
            </span>
            <span className='text-sm font-medium text-white'>0 USDT</span>
          </div>
          <div className='flex items-center gap-3'>
            <span className='text-xs font-normal text-white'>Total:</span>
            <span className='text-sm font-medium text-white'>10 USDT</span>
          </div>
        </div>

        <Button variant='secondary2' className='mt-4 w-full'>
          Withdraw
        </Button>
      </div>
    </div>
  )

  const renderBankingWithdraw = () => (
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
        : renderBankingDeposit()
    } else {
      return activeMethod === PAYMENT_METHODS.crypto
        ? renderCryptoWithdraw()
        : renderBankingWithdraw()
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
          <div className='mx-auto flex w-full min-w-[320px] max-w-md flex-1 flex-col justify-between gap-4 rounded-xl border border-mirage bg-dark-gradient p-6 md:min-w-[480px]'>
            <div className='space-y-4'>
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
                {/* BANKING TAB - TEMPORARILY DISABLED - UNCOMMENT TO RE-ENABLE */}
                {/* <button
                  onClick={() => setActiveMethod(PAYMENT_METHODS.banking)}
                  className={`flex flex-1 items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                    activeMethod === PAYMENT_METHODS.banking
                      ? 'border-b border-arty-red bg-transparent text-white'
                      : 'border-b border-mirage text-[#FFFFFF80] hover:text-white'
                  }`}
                >
                  <BankingIcon className='h-4 w-4' />
                  Banking
                </button> */}
                <button
                  disabled
                  className={`flex flex-1 items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors cursor-not-allowed ${
                    activeMethod === PAYMENT_METHODS.banking
                      ? 'border-b border-arty-red bg-transparent text-white'
                      : 'border-b border-mirage text-[#FFFFFF80] hover:text-white'
                  }`}
                >
                  <BankingIcon className='h-4 w-4 opacity-50' />
                  Banking
                </button>
              </div>

              <div>{renderContent()}</div>
            </div>
          </div>
        </div>
      </div>
    </CustomModal>
  )
}

export default memo(DepositWithdrawModal)


'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { createPayment, getSupportedCurrencies, getMinimumPaymentAmount, getEstimatedPrice, getPaymentStatus } from '@/api/coinsbuy'

import { useUser } from '@/context/user-context'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface CryptoCurrency {
  symbol: string
  name: string
  minAmount?: string
}

interface CoinsbuyContentProps {
  onClose: () => void
}

const CoinsbuyContent = ({ onClose }: CoinsbuyContentProps) => {
  const { user } = useUser()
  const { t } = useTranslation()
  
  const [step, setStep] = useState(1) // 1: Amount/Currency, 2: Payment Details, 3: Payment Status
  const [loading, setLoading] = useState(false)
  const [supportedCurrencies, setSupportedCurrencies] = useState<CryptoCurrency[]>([])
  const [selectedCurrency, setSelectedCurrency] = useState('USD')
  const [selectedCrypto, setSelectedCrypto] = useState('BTC')
  const [amount, setAmount] = useState('')
  const [minAmount, setMinAmount] = useState('')
  const [estimatedAmount, setEstimatedAmount] = useState('')
  const [paymentData, setPaymentData] = useState<any>(null)
  const [paymentStatus, setPaymentStatus] = useState('')
  const [statusCheckInterval, setStatusCheckInterval] = useState<NodeJS.Timeout | null>(null)

  // Load supported currencies on component mount
  useEffect(() => {
    loadSupportedCurrencies()
  }, [])

  // Load minimum amount when crypto currency changes
  useEffect(() => {
    if (selectedCrypto && selectedCurrency) {
      loadMinimumAmount()
    }
  }, [selectedCrypto, selectedCurrency])

  // Update estimated amount when amount or currencies change
  useEffect(() => {
    if (amount && selectedCrypto && selectedCurrency) {
      loadEstimatedAmount()
    }
  }, [amount, selectedCrypto, selectedCurrency])

  // Poll payment status when on step 3
  useEffect(() => {
    if (step === 3 && paymentData?.payment_id) {
      const interval = setInterval(async () => {
        try {
          const response = await getPaymentStatus(paymentData.payment_id)
          const status = response.data.payment_status
          setPaymentStatus(status)
          
          if (status === 'completed' || status === 'expired' || status === 'cancelled') {
            clearInterval(interval)
            if (status === 'completed') {
              toast.success('Payment confirmed!')
            } else {
              toast.error(`Payment ${status}`)
            }
          }
        } catch (error) {
          console.error('Failed to check payment status:', error)
        }
      }, 10000) // Check every 10 seconds
      
      setStatusCheckInterval(interval)
      
      return () => {
        clearInterval(interval)
      }
    }
  }, [step, paymentData])

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (statusCheckInterval) {
        clearInterval(statusCheckInterval)
      }
    }
  }, [statusCheckInterval])

  const loadSupportedCurrencies = async () => {
    try {
      const response = await getSupportedCurrencies()
      const currencies = response.data.currencies.slice(0, 20) // Limit to first 20 for better UX
      setSupportedCurrencies(currencies.map((currency) => ({
        symbol: currency.symbol || currency.code,
        name: currency.name || currency.symbol || currency.code,
      })))
    } catch (error) {
      console.error('Failed to load supported currencies:', error)
      toast.error('Failed to load supported cryptocurrencies')
    }
  }

  const loadMinimumAmount = async () => {
    try {
      const response = await getMinimumPaymentAmount(selectedCurrency, selectedCrypto)
      setMinAmount(response.data.min_amount)
    } catch (error) {
      console.error('Failed to load minimum amount:', error)
    }
  }

  const loadEstimatedAmount = async () => {
    try {
      const response = await getEstimatedPrice(parseFloat(amount), selectedCurrency, selectedCrypto)
      setEstimatedAmount(response.data.estimated_amount)
    } catch (error) {
      console.error('Failed to load estimated amount:', error)
    }
  }

  const handleAmountChange = (value: string) => {
    // Only allow numbers and decimal point
    const cleanValue = value.replace(/[^0-9.]/g, '')
    setAmount(cleanValue)
  }

  const validateAmount = () => {
    const numAmount = parseFloat(amount)
    if (!numAmount || numAmount <= 0) {
      return 'Amount must be greater than 0'
    }
    if (minAmount && numAmount < parseFloat(minAmount)) {
      return `Minimum amount is ${minAmount} ${selectedCurrency}`
    }
    return null
  }

  const handleCreatePayment = async () => {
    const validationError = validateAmount()
    if (validationError) {
      toast.error(validationError)
      return
    }

    setLoading(true)
    try {
      const response = await createPayment({
        amount: parseFloat(amount),
        currency: selectedCurrency,
        pay_currency: selectedCrypto,
        order_description: `Deposit for ${user?.username}`,
      })

      setPaymentData(response.data)
      setStep(2)
    } catch (error: any) {
      toast.error(error.message || 'Failed to create payment')
    } finally {
      setLoading(false)
    }
  }

  const handleStartPayment = () => {
    setStep(3)
    // Start checking payment status
    if (paymentData?.payment_id) {
      checkPaymentStatus()
    }
  }

  const checkPaymentStatus = async () => {
    if (!paymentData?.payment_id) return
    
    try {
      const response = await getPaymentStatus(paymentData.payment_id)
      const status = response.data.payment_status
      setPaymentStatus(status)
      
      if (status === 'completed') {
        toast.success('Payment confirmed!')
      } else if (status === 'expired' || status === 'cancelled') {
        toast.error(`Payment ${status}`)
      }
    } catch (error) {
      console.error('Failed to check payment status:', error)
    }
  }

  const handleCopyAddress = () => {
    if (paymentData?.pay_address) {
      navigator.clipboard.writeText(paymentData.pay_address)
      toast.success('Address copied to clipboard')
    }
  }

  const renderStep1 = () => (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="space-y-4"
    >
      <div className="text-center">
        <h3 className="text-lg font-bold text-white mb-2">Crypto Deposit</h3>
        <p className="text-sm text-gray-400">Choose amount and cryptocurrency</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Amount ({selectedCurrency})</label>
          <Input
            type="text"
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            placeholder="Enter amount"
            className="bg-background-secondary text-white border-secondary-700"
          />
          {minAmount && (
            <p className="text-xs text-gray-400 mt-1">Minimum: {minAmount} {selectedCurrency}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">Currency</label>
          <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
            <SelectTrigger className="bg-background-secondary text-white border-secondary-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-background-secondary border-secondary-700">
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="EUR">EUR</SelectItem>
              <SelectItem value="BRL">BRL</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">Pay with</label>
          <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
            <SelectTrigger className="bg-background-secondary text-white border-secondary-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-background-secondary border-secondary-700">
              {supportedCurrencies.map((crypto) => (
                <SelectItem key={crypto.symbol} value={crypto.symbol}>
                  {crypto.symbol}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {estimatedAmount && (
          <div className="bg-secondary-700 rounded-lg p-3">
            <p className="text-sm text-gray-400">Estimated amount:</p>
            <p className="text-lg font-bold text-white">{estimatedAmount} {selectedCrypto}</p>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={onClose}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          onClick={handleCreatePayment}
          loading={loading}
          disabled={!amount || loading}
          className="flex-1 bg-gradient-to-b from-green-500 to-green-600 hover:from-green-500 hover:to-green-700"
        >
          Create Payment
        </Button>
      </div>
    </motion.div>
  )

  const renderStep2 = () => (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="space-y-4"
    >
      <div className="text-center">
        <h3 className="text-lg font-bold text-white mb-2">Payment Details</h3>
        <p className="text-sm text-gray-400">Send cryptocurrency to the address below</p>
      </div>

      <div className="space-y-4">
        <div className="bg-secondary-700 rounded-lg p-4">
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-400">Amount:</p>
              <p className="text-lg font-bold text-white">{amount} {selectedCurrency}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Payment address:</p>
              <div className="bg-black rounded p-2 mt-1">
                <code className="text-xs text-green-400 break-all">{paymentData.pay_address}</code>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="mt-2"
                onClick={handleCopyAddress}
              >
                Copy Address
              </Button>
            </div>
            <div>
              <p className="text-sm text-gray-400">Payment ID:</p>
              <code className="text-xs text-gray-300">{paymentData.payment_id}</code>
            </div>
            {paymentData.valid_until && (
              <div>
                <p className="text-sm text-gray-400">Valid until:</p>
                <p className="text-xs text-yellow-400">{new Date(paymentData.valid_until).toLocaleString()}</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3">
          <p className="text-xs text-yellow-400">
            ⚠️ Send cryptocurrency to the address above. The amount will be converted automatically.
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => setStep(1)}
          className="flex-1"
        >
          Back
        </Button>
        <Button
          onClick={handleStartPayment}
          className="flex-1 bg-gradient-to-b from-green-500 to-green-600 hover:from-green-500 hover:to-green-700"
        >
          I've Sent Payment
        </Button>
      </div>
    </motion.div>
  )

  const renderStep3 = () => (
    <motion.div
      key="step3"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="space-y-4"
    >
      <div className="text-center">
        <h3 className="text-lg font-bold text-white mb-2">Payment Status</h3>
        <p className="text-sm text-gray-400">Waiting for payment confirmation...</p>
      </div>

      <div className="bg-secondary-700 rounded-lg p-4">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
          <div>
            <p className="text-sm text-gray-400">Status:</p>
            <p className="text-lg font-bold text-white capitalize">
              {paymentStatus || 'Waiting for payment...'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Amount:</p>
            <p className="text-lg font-bold text-white">{amount} {selectedCurrency}</p>
          </div>
        </div>
      </div>

      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
        <p className="text-xs text-blue-400">
          💡 Payment confirmation usually takes 10-30 minutes depending on the cryptocurrency network.
        </p>
      </div>

      <Button
        variant="outline"
        onClick={onClose}
        className="w-full"
      >
        Close
      </Button>
    </motion.div>
  )

  return (
    <div className="space-y-4">
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
    </div>
  )
}

export default CoinsbuyContent


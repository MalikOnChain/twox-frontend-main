'use client'
import { Calendar, Search } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect,useState } from 'react'

import { getAllTransactions, Transaction } from '@/api/transactions'
import { FYSTACK_TRANSACTION_FILTER_UNITS } from '@/components/layout/header/deposit-withdraw-modal/fystack-stablecoins-ui'

import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import ARBIcon from '@/assets/currencies/arbitrum.svg'
import AvaxIcon from '@/assets/currencies/avalanche.svg'
import BNBIcon from '@/assets/currencies/bnb.svg'
import BTCIcon from '@/assets/currencies/btc.svg'
import DOGEIcon from '@/assets/currencies/doge.svg'
import ETHIcon from '@/assets/currencies/eth.svg'
import LTCIcon from '@/assets/currencies/ltc.svg'
import MATICIcon from '@/assets/currencies/matic.svg'
import SOLIcon from '@/assets/currencies/sol.svg'
import TRONIcon from '@/assets/currencies/tron.svg'
import USDCIcon from '@/assets/currencies/usdc.svg'
import USDTIcon from '@/assets/currencies/usdt.svg'
import XRPIcon from '@/assets/currencies/xrp.svg'
import LeftArrow from '@/assets/icons/arrow-back.svg'
import RightArrow from '@/assets/icons/arrow-next.svg'
import transactionIcon from '@/assets/icons/transaction-icon.png'

/** Resolve amount column currency from merged transaction shapes (API may send `unit` / metadata). */
function resolveTransactionDisplayCurrency(
  transaction: Transaction & { unit?: string }
): string {
  const meta = transaction.metadata as Record<string, unknown> | undefined
  const fromMeta = meta?.currency ?? meta?.unit ?? meta?.symbol
  const raw =
    (transaction.currency && String(transaction.currency).trim()) ||
    (transaction.unit && String(transaction.unit).trim()) ||
    (typeof fromMeta === 'string' ? fromMeta.trim() : '')
  if (raw) return raw.toUpperCase()
  return 'USDT'
}

// Currency icon mapping (extend as new custody / game currencies appear)
const getCurrencyIcon = (currency: string) => {
  const currencyUpper = currency?.trim().toUpperCase()
  switch (currencyUpper) {
    case 'USDT':
    case 'USD':
    case 'USD₮':
    case 'TETHER':
      return <USDTIcon className='h-4 w-4 shrink-0' />
    case 'USDC':
    case 'DAI':
    case 'BUSD':
    case 'FDUSD':
      return <USDCIcon className='h-4 w-4 shrink-0' />
    case 'BTC':
      return <BTCIcon className='h-4 w-4 shrink-0' />
    case 'ETH':
    case 'ETHEREUM':
      return <ETHIcon className='h-4 w-4' />
    case 'BNB':
    case 'BSC':
      return <BNBIcon className='h-4 w-4' />
    case 'MATIC':
    case 'POLYGON':
      return <MATICIcon className='h-4 w-4' />
    case 'SOL':
    case 'SOLANA':
      return <SOLIcon className='h-4 w-4' />
    case 'DOGE':
      return <DOGEIcon className='h-4 w-4' />
    case 'LTC':
      return <LTCIcon className='h-4 w-4' />
    case 'TRX':
    case 'TRON':
      return <TRONIcon className='h-4 w-4' />
    case 'XRP':
      return <XRPIcon className='h-4 w-4' />
    case 'AVAX':
    case 'AVALANCHE':
      return <AvaxIcon className='h-4 w-4' />
    case 'ARB':
    case 'ARBITRUM':
      return <ARBIcon className='h-4 w-4' />
    case 'EUR':
      return (
        <span className='flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white'>
          €
        </span>
      )
    case 'BRL':
      return (
        <span className='flex h-4 w-4 items-center justify-center rounded-full bg-green-600 text-[10px] font-bold text-white'>
          R$
        </span>
      )
    default:
      return (
        <span className='flex h-4 w-4 items-center justify-center rounded-full bg-gray-600 text-[10px] font-bold text-white'>
          {currency?.charAt(0) || '?'}
        </span>
      )
  }
}

const filterOptions = [
  { value: 'all', label: 'All bets' },
  { value: 'deposits', label: 'Deposits' },
  { value: 'withdrawals', label: 'Withdrawals' },
  { value: 'bonus', label: 'Bonus' },
]

const currencyOptions = [
  { value: 'all', label: 'All Currencies' },
  ...FYSTACK_TRANSACTION_FILTER_UNITS.map((symbol) => ({
    value: symbol,
    label: symbol,
  })),
]

function FystackCurrencyFilterIcons({ value }: { value: string }) {
  if (value === 'all') return null
  return getCurrencyIcon(value)
}

const timeRangeOptions = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'week', label: 'Last 7 days' },
  { value: 'month', label: 'Last 30 days' },
  {
    value: 'current-month',
    label: new Date().toLocaleString('default', { month: 'long' }),
  },
  { value: 'year', label: 'Current Year' },
  { value: 'all-time', label: 'All Time' },
]

const TransactionHistory = () => {
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [selectedCurrency, setSelectedCurrency] = useState('all')
  const [selectedTimeRange, setSelectedTimeRange] = useState('all-time')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  // Calculate date range based on selected time range
  const getDateRange = () => {
    const now = new Date()
    let dateFrom: Date | undefined
    let dateTo: Date | undefined = new Date(now.getTime())

    switch (selectedTimeRange) {
      case 'today': {
        dateFrom = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
        break
      }
      case 'yesterday': {
        const y = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)
        dateFrom = new Date(y.getFullYear(), y.getMonth(), y.getDate(), 0, 0, 0, 0)
        dateTo = new Date(y.getFullYear(), y.getMonth(), y.getDate(), 23, 59, 59, 999)
        break
      }
      case 'week': {
        dateFrom = new Date(now.getTime())
        dateFrom.setDate(dateFrom.getDate() - 7)
        dateFrom.setHours(0, 0, 0, 0)
        break
      }
      case 'month': {
        dateFrom = new Date(now.getTime())
        dateFrom.setDate(dateFrom.getDate() - 30)
        dateFrom.setHours(0, 0, 0, 0)
        break
      }
      case 'current-month': {
        dateFrom = new Date(now.getFullYear(), now.getMonth(), 1)
        break
      }
      case 'year': {
        dateFrom = new Date(now.getFullYear(), 0, 1)
        break
      }
      case 'all-time':
      default: {
        dateFrom = undefined
        dateTo = undefined
      }
    }

    return {
      dateFrom: dateFrom?.toISOString(),
      dateTo: dateTo?.toISOString(),
    }
  }

  // Fetch transactions (only when currency, time range, or page changes - NOT filter type)
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true)
        const { dateFrom, dateTo } = getDateRange()
        
        // Always fetch all data, filtering will be done client-side
        const response = await getAllTransactions({
          page: currentPage,
          limit: 100, // Fetch more to ensure we have enough for filtering
          type: 'all', // Always fetch all types
          currency: selectedCurrency === 'all' ? undefined : selectedCurrency,
          dateFrom,
          dateTo,
        })

        setTransactions(response.transactions)
      } catch (error) {
        console.error('Failed to fetch transactions:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [selectedCurrency, selectedTimeRange, currentPage]) // Removed selectedFilter from dependencies

  // Client-side filtering (type, currency, search)
  const allFilteredTransactions = transactions.filter((transaction) => {
    // Type filter
    let matchesType = true
    if (selectedFilter !== 'all') {
      const txType = transaction.type?.toLowerCase()
      if (selectedFilter === 'deposits') {
        matchesType = txType === 'deposit' || txType === 'transaction'
      } else if (selectedFilter === 'withdrawals') {
        matchesType = txType === 'withdrawal' || txType === 'withdraw'
      } else if (selectedFilter === 'bonus') {
        matchesType = txType === 'bonus'
      }
    }
    
    const txCurrency = resolveTransactionDisplayCurrency(transaction)
    const matchesCurrency =
      selectedCurrency === 'all' || txCurrency === selectedCurrency.toUpperCase()
    
    // Search filter
    let matchesSearch = true
    if (searchQuery !== '') {
      const searchLower = searchQuery.toLowerCase()
      matchesSearch = !!(
        transaction.type?.toLowerCase().includes(searchLower) ||
        transaction.gameName?.toLowerCase().includes(searchLower) ||
        transaction.status?.toString().toLowerCase().includes(searchLower) ||
        transaction.method?.toLowerCase().includes(searchLower) ||
        txCurrency.toLowerCase().includes(searchLower)
      )
    }
    
    return matchesType && matchesCurrency && matchesSearch
  })

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedFilter, selectedCurrency, selectedTimeRange])

  // Client-side pagination
  const itemsPerPage = 20
  const totalPages = Math.ceil(allFilteredTransactions.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const filteredTransactions = allFilteredTransactions.slice(startIndex, startIndex + itemsPerPage)

  return (
    <div className='flex h-full flex-col py-6'>
      {/* Header */}
      <div className='mb-6 flex items-center gap-3'>
        <Image
          src={transactionIcon}
          alt='transaction-icon'
          width={24}
          height={24}
        />
        <h1 className='font-satoshi text-xl font-bold text-foreground'>
          Transactions
        </h1>
      </div>
      {/* Left side - Filter tabs */}
      <div className='flex flex-col items-start gap-6 sm:flex-row'>
        <div className='flex w-full gap-2 rounded-2xl border border-mirage p-2.5 sm:w-[20%] sm:flex-col 3xl:w-[14%]'>
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setSelectedFilter(option.value)}
              className={cn(
                'rounded-lg px-2.5 py-2 text-start font-satoshi text-sm font-normal text-white',
                selectedFilter === option.value && 'bg-cinder'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className='flex w-full flex-col gap-6 sm:w-[80%] 3xl:w-[86%]'>
          <div className='flex flex-col gap-3 xm:flex-row'>
            {/* Currency Select */}
            <Select
              value={selectedCurrency}
              onValueChange={setSelectedCurrency}
            >
              <SelectTrigger className='w-full bg-cinder xm:w-[20%]'>
                {/* SelectValue mirrors selected SelectItem (icon + label), do not add a second icon here */}
                <SelectValue className='min-w-0 flex-1' />
              </SelectTrigger>
              <SelectContent className='bg-[#141317]'>
                {currencyOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className='min-h-[24px] cursor-pointer rounded py-2 pl-2 text-white hover:bg-[#1f1f23] focus:bg-[#1f1f23] data-[highlighted]:bg-[#1f1f23]'
                  >
                    <span className='flex items-center gap-2 pr-6'>
                      <FystackCurrencyFilterIcons value={option.value} />
                      <span>{option.label}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Time Range Select */}
            <Select
              value={selectedTimeRange}
              onValueChange={setSelectedTimeRange}
            >
              <SelectTrigger className='w-full bg-cinder xm:w-[40%]'>
                <div className='flex items-center gap-2'>
                  <Calendar className='h-4 w-4' />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent className='bg-[#141317]'>
                {timeRangeOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className='min-h-[24px] cursor-pointer rounded py-2 text-white hover:bg-[#1f1f23] focus:bg-[#1f1f23] data-[highlighted]:bg-[#1f1f23]'
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Search Input */}
            <div className='relative h-12 w-full xm:w-[40%]'>
              <Input
                type='search'
                placeholder='Search'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='min-h-12 w-full border-none'
                startAddon={<Search className='size-4 !text-white' />}
                wrapperClassName='border border-mirage h-12'
              />
            </div>
          </div>

          <div className='min-h-[175px] rounded-xl border border-mirage bg-[#090909] p-1 font-satoshi'>
            {loading ? (
              <div className='flex h-full min-h-[175px] items-center justify-center'>
                <div className='h-8 w-8 animate-spin rounded-full border-4 border-gray-600 border-t-white' />
              </div>
            ) : filteredTransactions.length > 0 ? (
              <Table className='min-w-[700px] bg-[#090909]'>
                <TableHeader className=''>
                  <TableRow className='border-mirage bg-mirage'>
                    <TableHead className='h-14 rounded-tl-xl text-sm font-bold capitalize text-white'>
                      Date/Time
                    </TableHead>
                    <TableHead className='text-sm font-bold capitalize text-white'>
                      Type
                    </TableHead>
                    <TableHead className='text-sm font-bold capitalize text-white'>
                      Amount
                    </TableHead>
                    <TableHead className='text-sm font-bold capitalize text-white'>
                      Description
                    </TableHead>
                    <TableHead className='rounded-tr-xl text-sm font-bold capitalize text-white'>
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className='[&_tr:last-child]:border-0'>
                  {filteredTransactions.map((transaction, index) => {
                    const date = new Date(transaction.createdAt)
                    const formattedDate = date.toLocaleString('en-US', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })

                    // Map status number to readable label
                    const getStatusLabel = (status: string | number) => {
                      // If status is already a string, return it
                      if (typeof status === 'string') {
                        return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
                      }
                      
                      // Map numeric status to label
                      const statusMap: Record<number, string> = {
                        0: 'Created',
                        1: 'Paid',
                        2: 'Rejected',
                        3: 'Expired',
                        4: 'Refunded',
                        5: 'Waiting',
                      }
                      
                      return statusMap[status] || 'Unknown'
                    }

                    const statusLabel = getStatusLabel(transaction.status)
                    
                    // Determine status color
                    const getStatusColor = () => {
                      const status = transaction.status
                      const statusStr = typeof status === 'string' ? status.toLowerCase() : ''
                      
                      // Green for success statuses
                      if (status === 1 || statusStr === 'completed' || statusStr === 'paid' || statusStr === 'active') {
                        return 'text-[#59E830]'
                      }
                      // Yellow for pending statuses
                      if (status === 0 || status === 5 || statusStr === 'pending' || statusStr === 'created' || statusStr === 'waiting') {
                        return 'text-yellow-500'
                      }
                      // Red for failed statuses
                      return 'text-red-500'
                    }
                    
                    const statusColor = getStatusColor()

                    // Get description
                    const description = 
                      transaction.gameName || 
                      transaction.method?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 
                      transaction.metadata?.description ||
                      transaction.type?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) ||
                      'N/A'

                    return (
                    <TableRow
                        key={transaction._id}
                      className='border-b border-mirage transition-colors'
                    >
                      <TableCell
                        className={`py-5 font-medium text-[#FFFFFFCC] ${index === filteredTransactions.length - 1 ? 'rounded-bl-xl' : ''}`}
                      >
                          {formattedDate}
                      </TableCell>
                        <TableCell className='text-[#FFFFFFCC] capitalize'>
                          {transaction.type?.replace(/_/g, ' ')}
                      </TableCell>
                      <TableCell className='text-[#FFFFFFCC]'>
                        <div className='flex items-center gap-2'>
                            <span>
                              {typeof transaction.amount === 'number' 
                                ? transaction.amount.toFixed(2) 
                                : parseFloat(transaction.amount || '0').toFixed(2)}
                            </span>
                            {getCurrencyIcon(resolveTransactionDisplayCurrency(transaction))}
                        </div>
                      </TableCell>
                        <TableCell className='text-[#FFFFFFCC] max-w-[200px] truncate'>
                          {description}
                      </TableCell>
                        <TableCell className={statusColor}>
                          {statusLabel}
                      </TableCell>
                    </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className='flex h-full min-h-[175px] items-center justify-center'>
                <p className='font-satoshi text-sm text-white'>
                  No transactions found
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className='flex items-center justify-between gap-2'>
            <Button
              variant='secondary1'
              size='sm'
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1 || loading}
              className='flex items-center gap-1'
            >
              <LeftArrow className='!h-4 w-4' />
              Previous
            </Button>
            <div className='text-sm text-white'>
              Page {currentPage} of {totalPages || 1} ({allFilteredTransactions.length} total)
            </div>
            <Button
              variant='secondary1'
              size='sm'
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage >= totalPages || loading}
              className='flex items-center gap-1'
            >
              Next
              <RightArrow className='!h-4 w-4' />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TransactionHistory

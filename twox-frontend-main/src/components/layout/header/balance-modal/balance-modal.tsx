import { SearchIcon } from 'lucide-react'
import React, { useEffect, useMemo, useState } from 'react'

import { getWalletAddresses, GroupedWalletAddresses, getMultipleBalances } from '@/api/wallet-balances'

import { Input } from '@/components/ui/input'
import { CustomModal } from '@/components/ui/modal'
import Radio from '@/components/ui/radio'

// Import wallet icons
import MetaMaskIcon from '@/assets/wallets/metamask.svg'
import PhantomIcon from '@/assets/wallets/phantom.svg'

// Import crypto icons from currencies folder (better quality)
import ArbitrumIcon from '@/assets/currencies/arbitrum.svg'
import AvalancheIcon from '@/assets/currencies/avalanche.svg'
import BaseIcon from '@/assets/currencies/base.svg'
import BNBIcon from '@/assets/currencies/bnb.svg'
import BTCIcon from '@/assets/currencies/btc.svg'
import DOGEIcon from '@/assets/currencies/doge.svg'
import ETHIcon from '@/assets/currencies/eth.svg'
import LTCIcon from '@/assets/currencies/ltc.svg'
import MaticIcon from '@/assets/currencies/matic.svg'
import SOLIcon from '@/assets/currencies/sol.svg'
import TronIcon from '@/assets/currencies/tron.svg'
import USDTIcon from '@/assets/currencies/usdt.svg'
import XRPIcon from '@/assets/currencies/xrp.svg'

// Fallback imports from crypto-icons
import BCH from '@/assets/crypto-icons/bch.svg'
import EUR from '@/assets/crypto-icons/eur.svg'

// Map blockchain names to icons
const BLOCKCHAIN_ICONS: Record<string, any> = {
  ethereum: ETHIcon,
  'binance-smart-chain': BNBIcon,
  polygon: MaticIcon,
  avalanche: AvalancheIcon,
  arbitrum: ArbitrumIcon,
  optimism: ETHIcon, // Use ETH icon as placeholder
  base: BaseIcon,
  linea: ETHIcon, // Use ETH icon as placeholder
  fantom: ETHIcon, // Use ETH icon as placeholder
  solana: SOLIcon,
  bitcoin: BTCIcon,
  'bitcoin-cash': BCH,
  litecoin: LTCIcon,
  dogecoin: DOGEIcon,
  tron: TronIcon,
  xrp: XRPIcon,
  sui: USDTIcon, // Use USDT as placeholder for Sui (no icon available)
  usdt: USDTIcon,
}

interface BalanceModalPropsType {
  open: boolean
  onOpenChange: (open: boolean) => void
}

enum BALANCE_TABS {
  CRYPTO = 'crypto',
  BANKING = 'banking',
}

enum WALLET_TYPE_FILTER {
  ALL = 'all',
  METAMASK = 'metamask',
  PHANTOM = 'phantom',
  VAULTODY = 'vaultody',
  MANUAL = 'manual',
}

const BalanceModal = ({ open, onOpenChange }: BalanceModalPropsType) => {
  const [activeTab, setActiveTab] = useState<BALANCE_TABS>(BALANCE_TABS.CRYPTO)
  const [hideZeroBalances, setHideZeroBalances] = useState(false)
  const [cryptoFlat, setCryptoFlat] = useState(false)
  const [hideFiatBalances, setHideFiatBalances] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [_loading, setLoading] = useState(false)
  const [walletAddresses, setWalletAddresses] = useState<GroupedWalletAddresses | null>(null)
  const [walletTypeFilter, setWalletTypeFilter] = useState<WALLET_TYPE_FILTER>(WALLET_TYPE_FILTER.ALL)
  const [balances, setBalances] = useState<Record<string, number>>({}) // key: blockchain-address
  const [fetchingBalances, setFetchingBalances] = useState(false)

  // Fetch wallet addresses when modal opens
  useEffect(() => {
    if (open) {
      fetchWalletAddresses()
    }
  }, [open])

  // Auto-select first available wallet type when addresses are loaded (only once)
  useEffect(() => {
    if (walletAddresses) {
      // Only select if still on default "ALL" - prevents re-selection
      if (walletTypeFilter === WALLET_TYPE_FILTER.ALL) {
        // Select first available wallet type with mainnet addresses
        const metamaskMainnet = walletAddresses.metamask.filter(a => a.network === 'mainnet')
        const phantomMainnet = walletAddresses.phantom.filter(a => a.network === 'mainnet')
        const vaultodyMainnet = walletAddresses.vaultody.filter(a => a.network === 'mainnet')
        const manualMainnet = walletAddresses.manual.filter(a => a.network === 'mainnet')
        
        if (metamaskMainnet.length > 0) {
          setWalletTypeFilter(WALLET_TYPE_FILTER.METAMASK)
        } else if (phantomMainnet.length > 0) {
          setWalletTypeFilter(WALLET_TYPE_FILTER.PHANTOM)
        } else if (vaultodyMainnet.length > 0) {
          setWalletTypeFilter(WALLET_TYPE_FILTER.VAULTODY)
        } else if (manualMainnet.length > 0) {
          setWalletTypeFilter(WALLET_TYPE_FILTER.MANUAL)
        }
      }
    }
  }, [walletAddresses, walletTypeFilter])

  const fetchWalletAddresses = async () => {
    try {
      setLoading(true)
      const response = await getWalletAddresses()
      setWalletAddresses(response.grouped)
      
      // Fetch balances for all addresses
      fetchAllBalances(response.grouped)
    } catch (error) {
      console.error('Failed to load wallet addresses:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAllBalances = async (grouped: GroupedWalletAddresses) => {
    try {
      setFetchingBalances(true)
      const newBalances: Record<string, number> = {}
      
      // Collect all mainnet addresses
      const allAddresses = [
        ...grouped.metamask,
        ...grouped.phantom,
        ...grouped.vaultody,
        ...grouped.manual,
      ].filter(addr => addr.network === 'mainnet')

      // Use backend API to fetch all balances (avoids CORS and rate limiting)
      const addressList = allAddresses.map(addr => ({
        blockchain: addr.blockchain,
        address: addr.address,
      }))

      const results = await getMultipleBalances(addressList)
      
      // Convert results to balance map
      results.forEach(result => {
        const key = `${result.blockchain}-${result.address}`
        newBalances[key] = result.balance
      })
      
      setBalances(newBalances)
    } catch (error) {
      console.error('❌ Failed to fetch balances:', error)
    } finally {
      setFetchingBalances(false)
    }
  }

  // Convert wallet addresses to balance format, filtered by wallet type
  const cryptoBalancesData = useMemo(() => {
    if (!walletAddresses) {
      // Return dummy data if no wallet addresses loaded yet
      return [
        { id: 1, name: 'USDT', amount: 10, icon: USDTIcon },
        { id: 2, name: 'BTC', amount: 0.0, icon: BTCIcon },
        { id: 3, name: 'ETH', amount: 0.0, icon: ETHIcon },
        { id: 4, name: 'DOGE', amount: 0.0, icon: DOGEIcon },
        { id: 5, name: 'LTC', amount: 0.0, icon: LTCIcon },
        { id: 6, name: 'BCH', amount: 0.0, icon: BCH },
      ]
    }

    const balanceItems: any[] = []

    // Filter addresses based on selected wallet type
    let addressesToShow: any[] = []
    
    switch (walletTypeFilter) {
      case WALLET_TYPE_FILTER.METAMASK:
        addressesToShow = walletAddresses.metamask
        break
      case WALLET_TYPE_FILTER.PHANTOM:
        addressesToShow = walletAddresses.phantom
        break
      case WALLET_TYPE_FILTER.VAULTODY:
        addressesToShow = walletAddresses.vaultody
        break
      case WALLET_TYPE_FILTER.MANUAL:
        addressesToShow = walletAddresses.manual
        break
      case WALLET_TYPE_FILTER.ALL:
      default:
        addressesToShow = [
          ...walletAddresses.metamask,
          ...walletAddresses.phantom,
          ...walletAddresses.vaultody,
          ...walletAddresses.manual,
        ]
        break
    }

    // Only show mainnet addresses
    addressesToShow
      .filter(addr => addr.network === 'mainnet')
      .forEach((addr, index) => {
        const balanceKey = `${addr.blockchain}-${addr.address}`
        const currentBalance = balances[balanceKey] || 0
        
        // Debug log for Solana
        if (addr.blockchain === 'solana') {
          console.log(`🔍 Solana balance lookup:`, {
            blockchain: addr.blockchain,
            address: addr.address,
            balanceKey,
            currentBalance,
            allBalances: balances,
          })
        }
        
        balanceItems.push({
          id: index + 1,
          name: addr.blockchain.toUpperCase(),
          amount: currentBalance,
          icon: BLOCKCHAIN_ICONS[addr.blockchain] || ETHIcon,
        })
      })

    return balanceItems.length > 0 ? balanceItems : [
      { id: 1, name: 'USDT', amount: 10, icon: USDTIcon },
      { id: 2, name: 'BTC', amount: 0.0, icon: BTCIcon },
      { id: 3, name: 'ETH', amount: 0.0, icon: ETHIcon },
    ]
  }, [walletAddresses, walletTypeFilter, balances])

  // Filter crypto balances based on search query
  const filteredCryptoBalances = useMemo(() => {
    if (!searchQuery.trim()) return cryptoBalancesData

    const query = searchQuery.toLowerCase()
    return cryptoBalancesData.filter((item) => {
      const matchesName = item.name.toLowerCase().includes(query)
      const matchesAmount = item.amount.toString().includes(query)
      return matchesName || matchesAmount
    })
  }, [searchQuery, cryptoBalancesData])

  // Filter fiat balances based on search query
  const filteredFiatBalances = useMemo(() => {
    if (!searchQuery.trim()) return FIAT_BALANCES

    const query = searchQuery.toLowerCase()
    return FIAT_BALANCES.filter((item) => {
      const matchesName = item.name.toLowerCase().includes(query)
      const matchesAmount = item.amount.toString().includes(query)
      return matchesName || matchesAmount
    })
  }, [searchQuery])

  // Apply zero balance hiding filter
  const displayedCryptoBalances = useMemo(() => {
    if (hideZeroBalances) {
      return filteredCryptoBalances.filter((item) => item.amount > 0)
    }
    return filteredCryptoBalances
  }, [filteredCryptoBalances, hideZeroBalances])

  const displayedFiatBalances = useMemo(() => {
    if (hideFiatBalances) {
      return filteredFiatBalances.filter((item) => item.amount > 0)
    }
    return filteredFiatBalances
  }, [filteredFiatBalances, hideFiatBalances])

  // Clear search when switching tabs
  const handleTabChange = (tab: BALANCE_TABS) => {
    setActiveTab(tab)
    setSearchQuery('')
  }

  return (
    <CustomModal
      isOpen={open}
      onRequestClose={() => onOpenChange(false)}
      contentLabel='Balance Modal'
    >
      <div className='w-full overflow-hidden font-satoshi'>
        <div className='flex'>
          <div className='mx-auto flex w-full min-w-[320px] max-w-md flex-1 flex-col justify-between gap-4 rounded-xl border border-mirage bg-dark-gradient p-6 md:min-w-[480px]'>
            <div className='space-y-4'>
              <Input
                type='search'
                placeholder={`Search ${activeTab === BALANCE_TABS.CRYPTO ? 'crypto' : 'fiat'} balances...`}
                startAddon={<SearchIcon />}
                wrapperClassName='bg-cinder'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className='flex rounded-lg bg-cinder p-1.5'>
                <button
                  onClick={() => handleTabChange(BALANCE_TABS.CRYPTO)}
                  className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === BALANCE_TABS.CRYPTO
                      ? 'bg-mirage text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Crypto
                </button>
                {/* <button
                  onClick={() => handleTabChange(BALANCE_TABS.BANKING)}
                  className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === BALANCE_TABS.BANKING
                      ? 'bg-mirage text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Banking
                </button> */}
                <button
                  disabled
                  className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors opacity-50 cursor-not-allowed ${
                    activeTab === BALANCE_TABS.BANKING
                      ? 'bg-mirage text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Banking
                </button>
              </div>
              {activeTab === BALANCE_TABS.CRYPTO ? (
                <div>
                  {/* Wallet Type Filter - Only show connected wallet types (mainnet only) */}
                  {/* Loading indicator */}
                  {fetchingBalances && (
                    <div className='mb-2 text-xs text-gray-400'>
                      ⏳ Fetching balances from blockchain...
                    </div>
                  )}
                  
                  {walletAddresses && (
                    <div className='mb-4 flex gap-2 overflow-x-auto'>
                      {walletAddresses.metamask.filter(a => a.network === 'mainnet').length > 0 && (
                        <button
                          onClick={() => setWalletTypeFilter(WALLET_TYPE_FILTER.METAMASK)}
                          className={`whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-colors flex items-center gap-1.5 ${
                            walletTypeFilter === WALLET_TYPE_FILTER.METAMASK
                              ? 'bg-mirage text-white'
                              : 'bg-cinder text-gray-400 hover:text-white'
                          }`}
                        >
                          <MetaMaskIcon className='size-3.5' />
                          MetaMask
                        </button>
                      )}
                      {walletAddresses.phantom.filter(a => a.network === 'mainnet').length > 0 && (
                        <button
                          onClick={() => setWalletTypeFilter(WALLET_TYPE_FILTER.PHANTOM)}
                          className={`whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-colors flex items-center gap-1.5 ${
                            walletTypeFilter === WALLET_TYPE_FILTER.PHANTOM
                              ? 'bg-mirage text-white'
                              : 'bg-cinder text-gray-400 hover:text-white'
                          }`}
                        >
                          <PhantomIcon className='size-3.5' />
                          Phantom
                        </button>
                      )}
                      {walletAddresses.vaultody.filter(a => a.network === 'mainnet').length > 0 && (
                        <button
                          onClick={() => setWalletTypeFilter(WALLET_TYPE_FILTER.VAULTODY)}
                          className={`whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                            walletTypeFilter === WALLET_TYPE_FILTER.VAULTODY
                              ? 'bg-mirage text-white'
                              : 'bg-cinder text-gray-400 hover:text-white'
                          }`}
                        >
                          🔐 Vaultody
                        </button>
                      )}
                      {walletAddresses.manual.filter(a => a.network === 'mainnet').length > 0 && (
                        <button
                          onClick={() => setWalletTypeFilter(WALLET_TYPE_FILTER.MANUAL)}
                          className={`whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                            walletTypeFilter === WALLET_TYPE_FILTER.MANUAL
                              ? 'bg-mirage text-white'
                              : 'bg-cinder text-gray-400 hover:text-white'
                          }`}
                        >
                          📝 Manual
                        </button>
                      )}
                    </div>
                  )}
                  <div className='!my-9 space-y-2.5 max-h-[300px] overflow-y-auto pr-2'>
                    {displayedCryptoBalances.length === 0 ? (
                      <div className='py-4 text-center'>
                        <p className='text-sm text-gray-400'>
                          {searchQuery
                            ? 'No crypto balances found matching your search.'
                            : 'No crypto balances available.'}
                        </p>
                      </div>
                    ) : (
                      displayedCryptoBalances.map((item) => (
                        <div
                          key={item.id}
                          className='grid grid-cols-2 items-center gap-2.5 font-satoshi'
                        >
                          <span className='text-sm font-medium text-white'>
                            {item.amount > 0 && item.amount < 0.01 
                              ? item.amount.toFixed(6)  // Show 6 decimals for small amounts
                              : item.amount.toFixed(4)  // Show 4 decimals normally
                            }
                          </span>
                          <div className='flex items-center gap-2.5'>
                            <item.icon className='size-4' />
                            <p className='text-sm font-medium text-white'>
                              {item.name}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className='flex flex-col gap-4'>
                    <Radio
                      name='hide-balance'
                      label='Hide zero balances'
                      subLabel="Your zero balances won't appear in your wallet"
                      isOn={hideZeroBalances}
                      onChange={setHideZeroBalances}
                    />
                    <Radio
                      name='crypto-flat'
                      label='Display crypto in flat'
                      subLabel='All bets & transactions will be settled in the crypto equivalent'
                      isOn={cryptoFlat}
                      onChange={setCryptoFlat}
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <div className='!my-9 space-y-2.5'>
                    {displayedFiatBalances.length === 0 ? (
                      <div className='py-4 text-center'>
                        <p className='text-sm text-gray-400'>
                          {searchQuery
                            ? 'No fiat balances found matching your search.'
                            : 'No fiat balances available.'}
                        </p>
                      </div>
                    ) : (
                      displayedFiatBalances.map((item) => (
                        <div
                          key={item.id}
                          className='grid grid-cols-2 items-center gap-2.5 font-satoshi'
                        >
                          <span className='text-sm font-medium text-white'>
                            {item.amount.toFixed(2)}
                          </span>
                          <div className='flex items-center gap-2.5'>
                            <item.icon />
                            <p className='text-sm font-medium text-white'>
                              {item.name}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <Radio
                    name='hide-balance'
                    label='Hide zero balances'
                    subLabel="Your zero balances won't appear in your wallet"
                    isOn={hideFiatBalances}
                    onChange={setHideFiatBalances}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </CustomModal>
  )
}

export default BalanceModal

const FIAT_BALANCES = [
  {
    id: 1,
    name: 'EUR',
    amount: 0,
    icon: EUR,
  },
]

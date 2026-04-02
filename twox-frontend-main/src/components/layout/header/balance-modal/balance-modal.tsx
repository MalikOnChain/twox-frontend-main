import type { WithdrawStablePayoutOption } from '@/types/crypto'

import { SearchIcon } from 'lucide-react'
import React, { useEffect, useMemo, useState } from 'react'

import { getWithdrawConfig } from '@/api/crypto'
import {
  getMultipleBalances,
  getWalletAddresses,
  type GroupedWalletAddresses,
  type WalletAddress,
} from '@/api/wallet-balances'

import { enableVaultodyLegacyUI } from '@/lib/feature-flags'
import {
  readPreferredPlayStable,
  writePreferredPlayStable,
} from '@/lib/play-stable-preference'
import { cn } from '@/lib/utils'

import { Input } from '@/components/ui/input'
import { CustomModal } from '@/components/ui/modal'
import Radio from '@/components/ui/radio'

import { FystackChainBadge } from '@/components/layout/header/deposit-withdraw-modal/fystack-chain-badge'
import {
  getStableWithdrawPayoutChoices,
  parseStableWithdrawValue,
  stableWithdrawNetworkBlockchain,
  stableWithdrawRailOnly,
} from '@/components/layout/header/deposit-withdraw-modal/fystack-stablecoins-ui'
import {
  StablecoinSegmentedTabs,
  type StablecoinTab,
} from '@/components/layout/header/deposit-withdraw-modal/stablecoin-segmented-tabs'

import EUR from '@/assets/crypto-icons/eur.svg'

/** Short chain title for balance rows: `Tron (USDT)`. */
function stableRailChainTitle(network: string): string {
  const n = network.toUpperCase()
  if (n === 'TRC20' || n === 'TRON' || n === 'TRX') return 'Tron'
  if (n === 'BSC' || n === 'BEP20' || n === 'BEP-20') return 'BSC'
  if (n === 'ERC20' || n === 'ETH' || n === 'ETHEREUM') return 'Ethereum'
  if (n === 'SOL' || n === 'SOLANA' || n === 'SPL') return 'Solana'
  if (n === 'POLYGON' || n === 'MATIC') return 'Polygon'
  if (n === 'ARBITRUM' || n === 'ARB') return 'Arbitrum'
  if (n === 'OPTIMISM' || n === 'OP') return 'Optimism'
  if (n === 'BASE') return 'Base'
  if (n === 'AVAX' || n === 'AVALANCHE') return 'Avalanche'
  if (n === 'FANTOM' || n === 'FTM') return 'Fantom'
  if (n === 'LINEA') return 'Linea'
  return network
}

function formatStablePlayRowLabel(network: string, symbol: string): string {
  const sym = symbol.toUpperCase() === 'USDC' ? 'USDC' : 'USDT'
  return `${stableRailChainTitle(network)} (${sym})`
}

interface BalanceModalPropsType {
  open: boolean
  onOpenChange: (open: boolean) => void
}

enum BALANCE_TABS {
  CRYPTO = 'crypto',
  FIAT = 'fiat',
}

enum WALLET_TYPE_FILTER {
  ALL = 'all',
  FYSTACK = 'fystack',
  VAULTODY = 'vaultody',
  MANUAL = 'manual',
}

const BalanceModal = ({ open, onOpenChange }: BalanceModalPropsType) => {
  const [activeTab, setActiveTab] = useState<BALANCE_TABS>(BALANCE_TABS.CRYPTO)
  const [hideZeroBalances, setHideZeroBalances] = useState(false)
  const [hideFiatBalances, setHideFiatBalances] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [_loading, setLoading] = useState(false)
  const [walletAddresses, setWalletAddresses] = useState<GroupedWalletAddresses | null>(null)
  const [walletTypeFilter, setWalletTypeFilter] = useState<WALLET_TYPE_FILTER>(WALLET_TYPE_FILTER.ALL)
  const [balances, setBalances] = useState<Record<string, number>>({}) // key: blockchain-address
  const [withdrawStableOptions, setWithdrawStableOptions] = useState<WithdrawStablePayoutOption[]>(() =>
    getStableWithdrawPayoutChoices().map((o) => ({
      value: o.value,
      label: o.label,
      symbol: o.symbol,
      network: o.network,
    }))
  )
  const [selectedPlayStable, setSelectedPlayStable] = useState<string>('')
  const [stableBalanceTab, setStableBalanceTab] = useState<StablecoinTab>('USDT')

  useEffect(() => {
    if (!open) return
    ;(async () => {
      try {
        const cfg = await getWithdrawConfig()
        const api = cfg.data?.withdrawStablePayoutOptions
        if (api?.length) {
          setWithdrawStableOptions(api)
        } else {
          setWithdrawStableOptions(
            getStableWithdrawPayoutChoices().map((o) => ({
              value: o.value,
              label: o.label,
              symbol: o.symbol,
              network: o.network,
            }))
          )
        }
      } catch {
        setWithdrawStableOptions(
          getStableWithdrawPayoutChoices().map((o) => ({
            value: o.value,
            label: o.label,
            symbol: o.symbol,
            network: o.network,
          }))
        )
      }
    })()
  }, [open])

  useEffect(() => {
    if (!open || withdrawStableOptions.length === 0) return
    const saved = readPreferredPlayStable()
    const pick =
      saved && withdrawStableOptions.some((o) => o.value === saved)
        ? saved
        : withdrawStableOptions[0].value
    setSelectedPlayStable(pick)
    const { symbol } = parseStableWithdrawValue(pick)
    if (symbol === 'USDT' || symbol === 'USDC') setStableBalanceTab(symbol)
  }, [open, withdrawStableOptions])

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
        const fystackMainnet = (walletAddresses.fystack ?? []).filter(a => a.network === 'mainnet')
        const vaultodyMainnet = enableVaultodyLegacyUI
          ? walletAddresses.vaultody.filter(a => a.network === 'mainnet')
          : []
        if (fystackMainnet.length > 0) {
          setWalletTypeFilter(WALLET_TYPE_FILTER.FYSTACK)
        } else if (vaultodyMainnet.length > 0) {
          setWalletTypeFilter(WALLET_TYPE_FILTER.VAULTODY)
        }
        // Manual-only: keep ALL so addresses stay visible without a separate Manual filter.
      }
    }
  }, [walletAddresses, walletTypeFilter])

  useEffect(() => {
    if (walletTypeFilter === WALLET_TYPE_FILTER.MANUAL) {
      setWalletTypeFilter(WALLET_TYPE_FILTER.ALL)
    }
  }, [walletTypeFilter])

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
      const newBalances: Record<string, number> = {}
      
      // Collect all mainnet addresses
      const allAddresses = [
        ...(grouped.fystack ?? []),
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
    }
  }

  const addressesToShow = useMemo((): WalletAddress[] => {
    if (!walletAddresses) return []
    switch (walletTypeFilter) {
      case WALLET_TYPE_FILTER.FYSTACK:
        return walletAddresses.fystack ?? []
      case WALLET_TYPE_FILTER.VAULTODY:
        return walletAddresses.vaultody
      case WALLET_TYPE_FILTER.MANUAL:
        return walletAddresses.manual
      case WALLET_TYPE_FILTER.ALL:
      default:
        return [
          ...(walletAddresses.fystack ?? []),
          ...walletAddresses.vaultody,
          ...walletAddresses.manual,
        ]
    }
  }, [walletAddresses, walletTypeFilter])

  const stableChainRows = useMemo(() => {
    const mainnet = addressesToShow.filter((a) => a.network === 'mainnet')
    return withdrawStableOptions.map((opt) => {
      const chainSlug = stableWithdrawNetworkBlockchain(opt.network).toLowerCase()
      let onChain = 0
      for (const addr of mainnet) {
        if (addr.blockchain.toLowerCase() === chainSlug) {
          const key = `${addr.blockchain}-${addr.address}`
          onChain += balances[key] ?? 0
        }
      }
      const sym = opt.symbol?.toUpperCase() === 'USDC' ? 'USDC' : 'USDT'
      const displayLabel = formatStablePlayRowLabel(opt.network, sym)
      return {
        value: opt.value,
        displayLabel,
        network: opt.network,
        sym,
        chainSlug,
        onChainBalance: onChain,
      }
    })
  }, [withdrawStableOptions, addressesToShow, balances])

  const displayedStableRows = useMemo(() => {
    let rows = stableChainRows
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      rows = rows.filter(
        (r) =>
          r.displayLabel.toLowerCase().includes(q) ||
          stableWithdrawRailOnly(r.network).toLowerCase().includes(q) ||
          r.network.toLowerCase().includes(q) ||
          r.onChainBalance.toString().includes(q) ||
          r.sym.toLowerCase().includes(q)
      )
    }
    if (hideZeroBalances) {
      rows = rows.filter((r) => r.onChainBalance > 0)
    }
    return rows
  }, [stableChainRows, searchQuery, hideZeroBalances])

  const tabFilteredStableRows = useMemo(
    () => displayedStableRows.filter((r) => r.sym === stableBalanceTab),
    [displayedStableRows, stableBalanceTab]
  )

  useEffect(() => {
    if (tabFilteredStableRows.length === 0) return
    if (!tabFilteredStableRows.some((r) => r.value === selectedPlayStable)) {
      const next = tabFilteredStableRows[0].value
      setSelectedPlayStable(next)
      writePreferredPlayStable(next)
    }
  }, [tabFilteredStableRows, selectedPlayStable])

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
          <div className='mx-auto flex w-full min-w-[320px] max-w-md flex-1 flex-col justify-between gap-4 rounded-xl border border-mirage bg-dark-gradient px-6 pb-8 pt-6 md:min-w-[480px]'>
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
                  onClick={() => handleTabChange(BALANCE_TABS.FIAT)}
                  className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === BALANCE_TABS.FIAT
                      ? 'bg-mirage text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Fiat
                </button> */}
                <button
                  disabled
                  className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors opacity-50 cursor-not-allowed ${
                    activeTab === BALANCE_TABS.FIAT
                      ? 'bg-mirage text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Fiat
                </button>
              </div>
              {activeTab === BALANCE_TABS.CRYPTO ? (
                <div>
                  {/* Wallet Type Filter - Only show connected wallet types (mainnet only) */}
                  {walletAddresses && (
                    <div className='mb-4 flex gap-2 overflow-x-auto'>
                      {(walletAddresses.fystack ?? []).filter(a => a.network === 'mainnet').length > 0 && (
                        <button
                          onClick={() => setWalletTypeFilter(WALLET_TYPE_FILTER.FYSTACK)}
                          className={`whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                            walletTypeFilter === WALLET_TYPE_FILTER.FYSTACK
                              ? 'bg-mirage text-white'
                              : 'bg-cinder text-gray-400 hover:text-white'
                          }`}
                        >
                          Custody
                        </button>
                      )}
                      {enableVaultodyLegacyUI &&
                        walletAddresses.vaultody.filter(a => a.network === 'mainnet').length > 0 && (
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
                    </div>
                  )}
                  <div className='mt-4 flex flex-col gap-3'>
                    {withdrawStableOptions.length > 0 ? (
                      <div className='rounded-lg bg-mirage p-3'>
                        <StablecoinSegmentedTabs
                          value={stableBalanceTab}
                          onChange={setStableBalanceTab}
                        />
                        <p className='mb-1.5 mt-3 text-[11px] font-medium uppercase tracking-wide text-[#ABAAAD]'>
                          Network
                        </p>
                        <div className='grid max-h-[min(300px,45vh)] grid-cols-1 gap-1.5 overflow-y-auto pr-0.5 sm:grid-cols-2'>
                          {displayedStableRows.length === 0 ? (
                            <div className='col-span-full py-6 text-center'>
                              <p className='text-sm text-[#ABAAAD]'>
                                {searchQuery
                                  ? 'No chains found matching your search.'
                                  : hideZeroBalances
                                    ? 'No non-zero on-chain balances for this wallet filter.'
                                    : 'No stablecoin rails configured.'}
                              </p>
                            </div>
                          ) : tabFilteredStableRows.length === 0 ? (
                            <div className='col-span-full py-6 text-center'>
                              <p className='text-sm text-[#ABAAAD]'>
                                No {stableBalanceTab} networks in this list. Try the other asset tab or adjust
                                filters.
                              </p>
                            </div>
                          ) : (
                            tabFilteredStableRows.map((row) => {
                              const isSelected = selectedPlayStable === row.value
                              const amountStr = row.onChainBalance.toFixed(2)
                              return (
                                <button
                                  key={row.value}
                                  type='button'
                                  aria-pressed={isSelected}
                                  onClick={() => {
                                    setSelectedPlayStable(row.value)
                                    writePreferredPlayStable(row.value)
                                  }}
                                  className={cn(
                                    'rounded-lg border px-2.5 py-2 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50',
                                    isSelected
                                      ? 'border-red-500/55 bg-[#17161B] shadow-[0_0_0_1px_rgba(239,68,68,0.2)]'
                                      : 'border-[#2a2830] bg-[#141318] hover:border-[#3d3a45] hover:bg-[#17161B]'
                                  )}
                                >
                                  <div className='flex min-w-0 items-center justify-between gap-2'>
                                    <span className='flex min-w-0 items-center gap-2'>
                                      <FystackChainBadge blockchain={row.chainSlug} size={22} />
                                      <span className='truncate text-sm text-white'>
                                        {stableWithdrawRailOnly(row.network)}
                                      </span>
                                    </span>
                                    <span className='shrink-0 text-[10px] font-medium text-[#ABAAAD]'>
                                      {row.sym}
                                    </span>
                                  </div>
                                  <div className='mt-1.5 flex items-center justify-between border-t border-white/[0.06] pt-1.5'>
                                    <span className='text-[10px] text-[#ABAAAD]'>Balance</span>
                                    <span className='text-xs font-semibold tabular-nums text-white'>
                                      {amountStr}
                                    </span>
                                  </div>
                                </button>
                              )
                            })
                          )}
                        </div>
                      </div>
                    ) : null}
                  </div>
                  <div className='mt-1 border-t border-white/[0.08] pt-5'>
                    <Radio
                      name='hide-balance'
                      label='Hide zero balances'
                      subLabel="Your zero balances won't appear in your wallet"
                      isOn={hideZeroBalances}
                      onChange={setHideZeroBalances}
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
                  <div className='mt-4 border-t border-white/[0.08] pt-5'>
                    <Radio
                      name='hide-balance'
                      label='Hide zero balances'
                      subLabel="Your zero balances won't appear in your wallet"
                      isOn={hideFiatBalances}
                      onChange={setHideFiatBalances}
                    />
                  </div>
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

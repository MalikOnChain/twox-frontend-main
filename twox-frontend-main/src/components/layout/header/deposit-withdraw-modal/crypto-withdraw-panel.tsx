'use client'

import React from 'react'

import { getWithdrawConfig, sendCryptoWithdrawRequest } from '@/api/crypto'

import type { WithdrawNetworkOption, WithdrawStablePayoutOption } from '@/types/crypto'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { FystackChainBadge } from './fystack-chain-badge'
import {
  getStableWithdrawPayoutChoices,
  parseStableWithdrawValue,
  stableWithdrawNetworkBlockchain,
  stableWithdrawPayoutDisplayLabel,
  stableWithdrawRailOnly,
} from './fystack-stablecoins-ui'
import { StablecoinSegmentedTabs, type StablecoinTab } from './stablecoin-segmented-tabs'
import {
  readWithdrawDestAddress,
  withdrawDestStorageKey,
  writeWithdrawDestAddress,
} from './withdraw-dest-memory'
import { cn } from '@/lib/utils'

function StablePayoutOptionRow({
  option,
  railOnly,
}: {
  option: { symbol: string; network: string }
  railOnly?: boolean
}) {
  const chainSlug = stableWithdrawNetworkBlockchain(option.network)
  return (
    <span className='flex min-w-0 items-center gap-2'>
      <FystackChainBadge blockchain={chainSlug} />
      <span className='truncate'>
        {railOnly ? stableWithdrawRailOnly(option.network) : stableWithdrawPayoutDisplayLabel(option)}
      </span>
    </span>
  )
}

const allDisplayCurrencies = [
  { value: 'USD', label: 'USD', icon: '🇺🇸' },
  { value: 'EUR', label: 'EUR', icon: '🇪🇺' },
]

const stableDisplayCurrencies = [{ value: 'USD', label: 'USD', icon: '🇺🇸' }]

const fallbackNetworks: WithdrawNetworkOption[] = [
  { value: 'ERC20', label: 'ERC20 (Ethereum) · USDT' },
  { value: 'TRC20', label: 'TRC20 (Tron) · USDT' },
  { value: 'BSC', label: 'BSC (BEP-20) · USDT' },
]

export function CryptoWithdrawPanel() {
  const [amount, setAmount] = React.useState('')
  const [displayCurrency, setDisplayCurrency] = React.useState('USD')
  const [withdrawNetwork, setWithdrawNetwork] = React.useState<string>('ERC20')
  const [networkOptions, setNetworkOptions] =
    React.useState<WithdrawNetworkOption[]>(fallbackNetworks)
  const [stablePayoutOptions, setStablePayoutOptions] = React.useState<WithdrawStablePayoutOption[]>(() =>
    getStableWithdrawPayoutChoices()
  )
  const [payoutChoice, setPayoutChoice] = React.useState<string>('USDT:ERC20')
  /** Mirrors backend `FYSTACK_UI_STABLECOINS_ONLY` via `withdrawStablePayoutOptions` on config. */
  const [useStablePayoutUi, setUseStablePayoutUi] = React.useState(true)
  const [destAddress, setDestAddress] = React.useState('')
  const [availableBalance, setAvailableBalance] = React.useState<number>(0)
  const [withdrawFee, setWithdrawFee] = React.useState(0)
  const [loading, setLoading] = React.useState(false)
  const [cfgLoading, setCfgLoading] = React.useState(true)

  React.useEffect(() => {
    ;(async () => {
      try {
        const cfg = await getWithdrawConfig()
        setAvailableBalance(cfg.data?.currentBalance ?? 0)
        setWithdrawFee(cfg.data?.withdrawalFee ?? 0)
        const apiStable = cfg.data?.withdrawStablePayoutOptions
        const nets = cfg.data?.withdrawNetworks
        if (apiStable?.length) {
          setUseStablePayoutUi(true)
          setStablePayoutOptions(apiStable)
          setPayoutChoice((prev) =>
            apiStable.some((o) => o.value === prev) ? prev : apiStable[0].value
          )
        } else if (nets?.length) {
          setUseStablePayoutUi(false)
          setNetworkOptions(nets)
          setWithdrawNetwork((prev) =>
            nets.some((n) => n.value === prev) ? prev : nets[0].value
          )
        } else {
          const local = getStableWithdrawPayoutChoices()
          setUseStablePayoutUi(true)
          setStablePayoutOptions(local)
          setPayoutChoice((prev) =>
            local.some((o) => o.value === prev) ? prev : local[0].value
          )
        }
      } catch {
        setAvailableBalance(0)
      } finally {
        setCfgLoading(false)
      }
    })()
  }, [])

  const withdrawStableTab: StablecoinTab =
    parseStableWithdrawValue(payoutChoice).symbol === 'USDC' ? 'USDC' : 'USDT'

  const filteredStablePayoutOptions = React.useMemo(() => {
    if (!useStablePayoutUi) return stablePayoutOptions
    return stablePayoutOptions.filter((o) => o.symbol === withdrawStableTab)
  }, [useStablePayoutUi, stablePayoutOptions, withdrawStableTab])

  const handleWithdrawStableTab = React.useCallback(
    (tab: StablecoinTab) => {
      const { network } = parseStableWithdrawValue(payoutChoice)
      const n = network.toUpperCase()
      const match = stablePayoutOptions.find(
        (o) => o.symbol === tab && o.network.toUpperCase() === n
      )
      if (match) {
        setPayoutChoice(match.value)
        return
      }
      const first = stablePayoutOptions.find((o) => o.symbol === tab)
      if (first) setPayoutChoice(first.value)
    },
    [payoutChoice, stablePayoutOptions]
  )

  const withdrawDestKey = React.useMemo(
    () => withdrawDestStorageKey(useStablePayoutUi, payoutChoice, withdrawNetwork),
    [useStablePayoutUi, payoutChoice, withdrawNetwork]
  )

  const withdrawDestKeySeenRef = React.useRef<string | null>(null)
  React.useEffect(() => {
    if (cfgLoading) return
    const key = withdrawDestKey
    const firstReady = withdrawDestKeySeenRef.current === null
    const keyChanged = withdrawDestKeySeenRef.current !== key
    if (!firstReady && !keyChanged) return
    withdrawDestKeySeenRef.current = key
    setDestAddress(readWithdrawDestAddress(key))
  }, [withdrawDestKey, cfgLoading])

  const numAmount = parseFloat(amount)
  const feeAmount = Number.isFinite(numAmount) ? numAmount * withdrawFee : 0
  const totalOut = Number.isFinite(numAmount) ? numAmount + feeAmount : 0

  const submit = async () => {
    if (!Number.isFinite(numAmount) || numAmount <= 0) {
      alert('Enter a valid amount')
      return
    }
    if (!destAddress.trim()) {
      alert('Enter a destination address')
      return
    }
    if (numAmount > availableBalance) {
      alert('Insufficient balance')
      return
    }
    setLoading(true)
    try {
      if (useStablePayoutUi) {
        const { symbol, network } = parseStableWithdrawValue(payoutChoice)
        await sendCryptoWithdrawRequest({
          symbol,
          network,
          address: destAddress.trim(),
          amount: numAmount,
        })
      } else {
        await sendCryptoWithdrawRequest({
          symbol: 'USDT',
          network: withdrawNetwork,
          address: destAddress.trim(),
          amount: numAmount,
        })
      }
      writeWithdrawDestAddress(withdrawDestKey, destAddress)
      alert('Withdrawal request submitted for review.')
      setAmount('')
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Withdrawal failed')
    } finally {
      setLoading(false)
    }
  }

  const displayCurrencyOptions = useStablePayoutUi ? stableDisplayCurrencies : allDisplayCurrencies

  const selectedStable = useStablePayoutUi ? parseStableWithdrawValue(payoutChoice) : null
  const destPlaceholder = selectedStable
    ? `External ${selectedStable.symbol} address (${selectedStable.network})`
    : 'Wallet address for the network above'

  return (
    <div className='space-y-3 pb-1'>
      <div className='rounded-lg bg-mirage p-3'>
        <div className='mb-1 flex items-center justify-between'>
          <span className='text-sm font-bold text-white'>Total withdrawable</span>
        </div>
        <div className='text-lg font-bold tabular-nums text-white md:text-xl'>
          {cfgLoading ? '…' : `${availableBalance.toFixed(2)} ${displayCurrency}`}
        </div>
        <p className='mt-1.5 text-[11px] leading-snug text-[#ABAAAD] md:text-xs'>
          One shared balance in USD, pick the <span className='text-white'>asset &amp; chain</span> for your
          external wallet.
        </p>
      </div>

      <div className='rounded-lg bg-mirage p-3'>
        <h3 className='text-sm font-bold text-white'>Choose asset &amp; network</h3>
        <p className='mt-0.5 text-[11px] text-[#ABAAAD] md:text-xs'>
          Match the stablecoin and chain to your destination before entering an amount.
        </p>

        {useStablePayoutUi ? (
          <>
            <StablecoinSegmentedTabs
              value={withdrawStableTab}
              onChange={handleWithdrawStableTab}
              className='mt-3'
            />
            <p className='mb-1.5 mt-2 text-[11px] font-medium uppercase tracking-wide text-[#ABAAAD]'>
              Network
            </p>
            <div className='grid grid-cols-1 gap-1.5 sm:grid-cols-2'>
              {filteredStablePayoutOptions.map((o) => {
                const selected = payoutChoice === o.value
                return (
                  <button
                    key={o.value}
                    type='button'
                    onClick={() => setPayoutChoice(o.value)}
                    className={cn(
                      'rounded-lg border px-2.5 py-2 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50',
                      selected
                        ? 'border-red-500/55 bg-[#17161B] shadow-[0_0_0_1px_rgba(239,68,68,0.2)]'
                        : 'border-[#2a2830] bg-[#141318] hover:border-[#3d3a45] hover:bg-[#17161B]'
                    )}
                  >
                    <div className='flex min-w-0 items-center justify-between gap-2'>
                      <span className='flex min-w-0 items-center gap-2'>
                        <StablePayoutOptionRow option={o} railOnly />
                      </span>
                      <span className='shrink-0 text-[10px] font-medium text-[#ABAAAD]'>{o.symbol}</span>
                    </div>
                    <div className='mt-1.5 flex items-center justify-between border-t border-white/[0.06] pt-1.5'>
                      <span className='text-[10px] text-[#ABAAAD]'>Withdrawable</span>
                      <span className='text-xs font-semibold tabular-nums text-white'>
                        {cfgLoading ? '…' : `${availableBalance.toFixed(2)} USD`}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </>
        ) : (
          <>
            <p className='mb-1.5 mt-3 text-[11px] font-medium uppercase tracking-wide text-[#ABAAAD]'>
              Payout network
            </p>
            <div className='grid grid-cols-1 gap-1.5 sm:grid-cols-2'>
              {networkOptions.map((n) => {
                const selected = withdrawNetwork === n.value
                return (
                  <button
                    key={n.value}
                    type='button'
                    onClick={() => setWithdrawNetwork(n.value)}
                    className={cn(
                      'rounded-lg border px-2.5 py-2 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50',
                      selected
                        ? 'border-red-500/55 bg-[#17161B] shadow-[0_0_0_1px_rgba(239,68,68,0.2)]'
                        : 'border-[#2a2830] bg-[#141318] hover:border-[#3d3a45] hover:bg-[#17161B]'
                    )}
                  >
                    <span className='block text-sm text-white'>{n.label}</span>
                    <div className='mt-1.5 flex items-center justify-between border-t border-white/[0.06] pt-1.5'>
                      <span className='text-[10px] text-[#ABAAAD]'>Withdrawable</span>
                      <span className='text-xs font-semibold tabular-nums text-white'>
                        {cfgLoading ? '…' : `${availableBalance.toFixed(2)} USD`}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
            <p className='mt-3 text-xs leading-relaxed text-[#ABAAAD]'>
              Deposits may arrive on different chains; this balance is still shared. Choose the network that
              matches your <span className='text-white'>external</span> destination.
            </p>
          </>
        )}

        {useStablePayoutUi ? (
          <p className='mt-3 rounded-md border border-amber-500/35 bg-amber-500/10 px-2.5 py-2 text-[11px] leading-snug text-[#f5e6c8] md:text-xs'>
            Withdraw only <span className='font-semibold text-white'>{withdrawStableTab}</span> to an address
            that supports the exact network you select. Sending the wrong asset or using the wrong blockchain
            can result in <span className='font-semibold text-white'>permanent loss</span>, those transfers
            cannot be reversed or recovered.
          </p>
        ) : null}

        <h3 className='mb-1.5 mt-4 text-sm font-bold text-white'>Amount</h3>
        <div className='flex gap-2'>
          <Input
            type='number'
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder='0'
            containerClassName='flex-1'
          />
          <Select value={displayCurrency} onValueChange={setDisplayCurrency}>
            <SelectTrigger className='!h-10 !min-h-10 w-28 rounded-lg border-none bg-[#17161B] px-2 text-[#ABAAAD]'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className='z-[9999] border-none bg-[#141317]'>
              {displayCurrencyOptions.map((o) => (
                <SelectItem key={o.value} value={o.value} hideIndicator>
                  <span className='flex items-center gap-2'>
                    <span>{o.icon}</span>
                    {o.label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <h3 className='mb-1.5 mt-4 text-sm font-bold text-white'>Destination address</h3>
        <Input
          type='text'
          value={destAddress}
          onChange={(e) => setDestAddress(e.target.value)}
          onBlur={() => writeWithdrawDestAddress(withdrawDestKey, destAddress)}
          placeholder={destPlaceholder}
        />

        <div className='mt-3 space-y-0.5 text-sm'>
          <div className='flex justify-between text-[11px] text-white md:text-xs'>
            <span>Est. fee ({(withdrawFee * 100).toFixed(1)}%)</span>
            <span className='tabular-nums'>{feeAmount.toFixed(2)}</span>
          </div>
          <div className='flex justify-between text-xs font-medium text-white md:text-sm'>
            <span>Total deducted</span>
            <span className='tabular-nums'>{totalOut.toFixed(2)}</span>
          </div>
        </div>

        <Button variant='secondary2' className='mt-3 w-full' loading={loading} onClick={submit}>
          Withdraw
        </Button>
      </div>
    </div>
  )
}

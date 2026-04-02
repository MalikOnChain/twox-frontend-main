'use client'

import React from 'react'

import { getCryptoDepositAddresses } from '@/api/wallet'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { cn } from '@/lib/utils'

import { CryptoDepositFystack } from './crypto-deposit-fystack'
import { FystackChainBadge } from './fystack-chain-badge'
import { fystackDepositOptionLabel, fystackDepositPickerLabel } from './fystack-deposit-labels'
import {
  buildFystackDepositPickerEntries,
  FYSTACK_UI_STABLECOINS_ONLY,
  type FystackDepositPickerEntry,
} from './fystack-stablecoins-ui'
import { StablecoinSegmentedTabs, type StablecoinTab } from './stablecoin-segmented-tabs'
import { StablecoinTokenIcon } from './stablecoin-token-icon'

const MIN_DEPOSIT = 10

const fiatOptions = [{ value: 'USD', label: 'USD', icon: '🇺🇸' }] as const

type CryptoDepositFystackFlowProps = {
  /** Wallet modal: return to deposit method list (e.g. clear Fystack target). */
  onExit?: () => void
  /** When the parent modal closes, reset to step 1 (header deposit/withdraw modal). */
  modalOpen?: boolean
}

export function CryptoDepositFystackFlow({
  onExit,
  modalOpen,
}: CryptoDepositFystackFlowProps) {
  const [step, setStep] = React.useState<1 | 2>(1)
  const [entries, setEntries] = React.useState<FystackDepositPickerEntry[]>([])
  const [loading, setLoading] = React.useState(true)
  const [loadError, setLoadError] = React.useState<string | null>(null)
  const [amount, setAmount] = React.useState('')
  const [fiat, setFiat] = React.useState<string>('USD')
  const [cryptoIndex, setCryptoIndex] = React.useState(0)
  const [stableTab, setStableTab] = React.useState<StablecoinTab>('USDT')
  const [formError, setFormError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (modalOpen === false) {
      setStep(1)
      setAmount('')
      setFiat('USD')
      setCryptoIndex(0)
      setStableTab('USDT')
      setFormError(null)
    }
  }, [modalOpen])

  React.useEffect(() => {
    setCryptoIndex(0)
  }, [stableTab])

  const visibleEntries = React.useMemo(() => {
    if (!FYSTACK_UI_STABLECOINS_ONLY) return entries
    return entries.filter((e) => e.symbol === stableTab)
  }, [entries, stableTab])

  const safeListIdx = Math.min(cryptoIndex, Math.max(0, visibleEntries.length - 1))
  const selectedVisible = visibleEntries[safeListIdx]
  const initialPickGlobal =
    selectedVisible && FYSTACK_UI_STABLECOINS_ONLY
      ? Math.max(0, entries.indexOf(selectedVisible))
      : safeListIdx

  React.useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const data = await getCryptoDepositAddresses()
        if (!cancelled) {
          setEntries(buildFystackDepositPickerEntries(data))
          setCryptoIndex(0)
        }
      } catch (e: unknown) {
        if (!cancelled) {
          setLoadError(e instanceof Error ? e.message : 'Failed to load networks')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const parsedDepositAmount = Number.parseFloat(amount.replace(',', '.'))
  const depositMeetsMinimum =
    Number.isFinite(parsedDepositAmount) && parsedDepositAmount >= MIN_DEPOSIT

  const handleCreatePayment = () => {
    setFormError(null)
    const n = Number.parseFloat(amount.replace(',', '.'))
    if (!Number.isFinite(n) || n < MIN_DEPOSIT) {
      setFormError(`Minimum deposit is ${MIN_DEPOSIT} USD.`)
      return
    }
    if (!visibleEntries.length) {
      setFormError('No deposit networks available yet.')
      return
    }
    setStep(2)
  }

  if (loading) {
    return <p className='p-4 text-sm text-[#ABAAAD]'>Loading deposit options…</p>
  }
  if (loadError) {
    return <p className='p-4 text-sm text-red-400'>{loadError}</p>
  }

  if (step === 2) {
    return (
      <CryptoDepositFystack
        onBack={() => setStep(1)}
        initialPick={Math.max(0, initialPickGlobal)}
        depositSummary={{
          amount: amount.replace(',', '.').trim(),
          currency: fiat,
        }}
      />
    )
  }

  const enteredAmountDisplay = (() => {
    const n = Number.parseFloat(amount.replace(',', '.'))
    if (!amount.trim() || !Number.isFinite(n)) return '—'
    return `${n.toFixed(2)} ${fiat}`
  })()

  return (
    <div className='space-y-3 pb-1'>
      {onExit ? (
        <Button type='button' variant='secondary1' className='w-full' onClick={onExit}>
          ← Back
        </Button>
      ) : null}

      <div className='rounded-lg bg-mirage p-3'>
        <h3 className='text-sm font-bold text-white'>Amount</h3>
        <p className='mt-0.5 text-[11px] text-[#ABAAAD] md:text-xs'>
          Enter how much you want to deposit in {fiat}. Minimum {MIN_DEPOSIT} {fiat}.
        </p>
        <div className='mt-3 flex gap-2'>
          <Input
            type='text'
            inputMode='decimal'
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder='10.00'
            containerClassName='flex-1 min-w-0'
            className='h-10 rounded-lg border border-[#17161B] bg-[#17161B] text-white'
          />
          <Select value={fiat} onValueChange={setFiat}>
            <SelectTrigger className='!h-10 !min-h-10 w-28 rounded-lg border-none bg-[#17161B] px-2 text-[#ABAAAD]'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className='z-[9999] border-none bg-[#141317]'>
              {fiatOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} hideIndicator>
                  <span className='flex items-center gap-2'>
                    <span>{opt.icon}</span>
                    {opt.label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <h3 className='mb-0.5 mt-5 text-sm font-bold text-white'>
          {FYSTACK_UI_STABLECOINS_ONLY ? <>Choose asset &amp; network</> : 'Choose network'}
        </h3>
        <p className='text-[11px] text-[#ABAAAD] md:text-xs'>
          {FYSTACK_UI_STABLECOINS_ONLY
            ? 'Then pick the stablecoin and chain that match the wallet or exchange you send from.'
            : 'Then pick the network that matches the wallet or exchange you send from.'}
        </p>

        {FYSTACK_UI_STABLECOINS_ONLY ? (
          <>
            <StablecoinSegmentedTabs value={stableTab} onChange={setStableTab} className='mt-3' />
            <p className='mb-1.5 mt-2 text-[11px] font-medium uppercase tracking-wide text-[#ABAAAD]'>
              Network
            </p>
            {!visibleEntries.length ? (
              <p className='text-sm text-[#ABAAAD]'>
                No networks yet. If you just registered, wait a moment and try again or contact support.
              </p>
            ) : (
              <div className='grid grid-cols-1 gap-1.5 sm:grid-cols-2'>
                {visibleEntries.map((e, i) => {
                  const selected = i === safeListIdx
                  const sym = e.symbol ?? stableTab
                  return (
                    <button
                      key={`${e.row.blockchain}-${e.row.network}-${e.symbol ?? 'legacy'}-${i}`}
                      type='button'
                      onClick={() => setCryptoIndex(i)}
                      className={cn(
                        'rounded-lg border px-2.5 py-2 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50',
                        selected
                          ? 'border-red-500/55 bg-[#17161B] shadow-[0_0_0_1px_rgba(239,68,68,0.2)]'
                          : 'border-[#2a2830] bg-[#141318] hover:border-[#3d3a45] hover:bg-[#17161B]'
                      )}
                    >
                      <div className='flex min-w-0 items-center justify-between gap-2'>
                        <span className='flex min-w-0 items-center gap-2'>
                          <FystackChainBadge blockchain={e.row.blockchain} />
                          <span className='truncate text-sm text-white'>
                            {fystackDepositOptionLabel(e.row)}
                          </span>
                        </span>
                        <span className='shrink-0 text-[10px] font-medium text-[#ABAAAD]'>{sym}</span>
                      </div>
                      <div className='mt-1.5 flex items-center justify-between border-t border-white/[0.06] pt-1.5'>
                        <span className='text-[10px] text-[#ABAAAD]'>Deposit ({fiat})</span>
                        <span className='text-xs font-semibold tabular-nums text-white'>
                          {enteredAmountDisplay}
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </>
        ) : (
          <>
            <p className='mb-1.5 mt-3 text-[11px] font-medium uppercase tracking-wide text-[#ABAAAD]'>
              Network
            </p>
            {!visibleEntries.length ? (
              <p className='text-sm text-[#ABAAAD]'>
                No networks yet. If you just registered, wait a moment and try again or contact support.
              </p>
            ) : (
              <div className='grid grid-cols-1 gap-1.5 sm:grid-cols-2'>
                {visibleEntries.map((e, i) => {
                  const selected = i === safeListIdx
                  return (
                    <button
                      key={`${e.row.blockchain}-${e.row.network}-${e.symbol ?? 'legacy'}-${i}`}
                      type='button'
                      onClick={() => setCryptoIndex(i)}
                      className={cn(
                        'rounded-lg border px-2.5 py-2 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50',
                        selected
                          ? 'border-red-500/55 bg-[#17161B] shadow-[0_0_0_1px_rgba(239,68,68,0.2)]'
                          : 'border-[#2a2830] bg-[#141318] hover:border-[#3d3a45] hover:bg-[#17161B]'
                      )}
                    >
                      <div className='flex min-w-0 items-center justify-between gap-2'>
                        <span className='flex min-w-0 items-center gap-2'>
                          <FystackChainBadge blockchain={e.row.blockchain} />
                          {e.symbol ? <StablecoinTokenIcon symbol={e.symbol} /> : null}
                          <span className='truncate text-sm text-white'>{fystackDepositPickerLabel(e)}</span>
                        </span>
                      </div>
                      <div className='mt-1.5 flex items-center justify-between border-t border-white/[0.06] pt-1.5'>
                        <span className='text-[10px] text-[#ABAAAD]'>Deposit ({fiat})</span>
                        <span className='text-xs font-semibold tabular-nums text-white'>
                          {enteredAmountDisplay}
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
            <p className='mt-3 text-xs leading-relaxed text-[#ABAAAD]'>
              Pick the network that matches the wallet or exchange you send from. The address on the next step is
              only valid for that chain.
            </p>
          </>
        )}

        {FYSTACK_UI_STABLECOINS_ONLY && visibleEntries.length ? (
          <p className='mt-3 rounded-md border border-amber-500/35 bg-amber-500/10 px-2.5 py-2 text-[11px] leading-snug text-[#f5e6c8] md:text-xs'>
            Send only <span className='font-semibold text-white'>{stableTab}</span> to the address on the next step,
            on the exact network you select. Sending the wrong asset or using the wrong blockchain can result in{' '}
            <span className='font-semibold text-white'>permanent loss</span>, those transfers cannot be reversed or
            recovered.
          </p>
        ) : null}

        {formError ? <p className='mt-3 text-sm text-red-400'>{formError}</p> : null}

        <Button
          type='button'
          variant='secondary2'
          className='mt-3 w-full'
          disabled={!visibleEntries.length || !depositMeetsMinimum}
          onClick={handleCreatePayment}
        >
          Create Payment
        </Button>
      </div>
    </div>
  )
}

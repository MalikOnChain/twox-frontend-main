'use client'

import { Copy } from 'lucide-react'
import React from 'react'

import { getCryptoDepositAddresses } from '@/api/wallet'

import { Button } from '@/components/ui/button'

import { FystackChainBadge } from './fystack-chain-badge'
import { fystackDepositOptionLabel, fystackDepositPickerLabel } from './fystack-deposit-labels'
import {
  buildFystackDepositPickerEntries,
  FYSTACK_UI_STABLECOINS_ONLY,
  type FystackDepositPickerEntry,
} from './fystack-stablecoins-ui'
import { StablecoinTokenIcon } from './stablecoin-token-icon'

type CryptoDepositFystackProps = {
  /** When set (e.g. wallet modal), shows a back control to return to the deposit picker. */
  onBack?: () => void
  /** Pre-select row after addresses load (e.g. from deposit form step). */
  initialPick?: number
  /** Optional reminder of the fiat amount the user entered on the previous step. */
  depositSummary?: { amount: string; currency: string }
}

export function CryptoDepositFystack({
  onBack,
  initialPick,
  depositSummary,
}: CryptoDepositFystackProps) {
  const [entries, setEntries] = React.useState<FystackDepositPickerEntry[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const data = await getCryptoDepositAddresses()
        if (!cancelled) {
          setEntries(buildFystackDepositPickerEntries(data))
        }
      } catch (e: unknown) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Failed to load addresses')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  /** Sync with parent `initialPick` in the same render as `entries`, no flash where `pick` was 0 and labels read a missing row. */
  const resolvedPick = React.useMemo(() => {
    if (!entries.length) return 0
    const cap = entries.length - 1
    const raw = initialPick != null && Number.isFinite(initialPick) ? initialPick : 0
    return Math.max(0, Math.min(raw, cap))
  }, [entries, initialPick])

  if (loading) {
    return <p className='p-4 text-sm text-[#ABAAAD]'>Loading your deposit addresses…</p>
  }
  if (error) {
    return <p className='p-4 text-sm text-red-400'>{error}</p>
  }
  if (!entries.length) {
    return (
      <p className='p-4 text-sm text-[#ABAAAD]'>
        No deposit addresses found. If you just registered, refresh in a moment or contact support.
      </p>
    )
  }

  const curEntry = entries[resolvedPick]
  const cur = curEntry?.row

  if (!curEntry || !cur) {
    return (
      <p className='p-4 text-sm text-[#ABAAAD]'>
        Could not load this deposit address. Go back and pick the network again, or refresh.
      </p>
    )
  }

  return (
    <div className='space-y-4'>
      {onBack ? (
        <Button type='button' variant='secondary1' className='w-full' onClick={onBack}>
          ← Back
        </Button>
      ) : null}
      {depositSummary?.amount ? (
        <div className='rounded-lg border border-[#17161B] bg-[#17161B]/60 px-3 py-2 text-center text-xs text-[#ABAAAD]'>
          Deposit amount:{' '}
          <span className='font-medium text-white'>
            {depositSummary.amount} {depositSummary.currency}
          </span>
          <span className='block pt-1 text-[10px] text-[#ABAAAD]'>
            {curEntry.symbol
              ? `Send only ${curEntry.symbol} on this network. Amount may differ from this fiat estimate.`
              : FYSTACK_UI_STABLECOINS_ONLY
                ? 'Send the asset shown for this address on this network only. Amount may differ from this fiat estimate.'
                : 'Send on the network shown for this address; on-chain amount may differ from this fiat estimate.'}
          </span>
        </div>
      ) : null}
      <div className='rounded-lg bg-mirage p-3'>
        <p className='mb-1.5 text-[11px] font-medium uppercase tracking-wide text-[#ABAAAD]'>
          {FYSTACK_UI_STABLECOINS_ONLY ? 'Network' : 'Deposit network'}
        </p>
        <div className='rounded-lg border border-red-500/55 bg-[#17161B] px-2.5 py-2 shadow-[0_0_0_1px_rgba(239,68,68,0.2)]'>
          <div className='flex min-w-0 items-center justify-between gap-2'>
            <span className='flex min-w-0 items-center gap-2'>
              <FystackChainBadge blockchain={cur.blockchain} />
              {!FYSTACK_UI_STABLECOINS_ONLY && curEntry.symbol ? (
                <StablecoinTokenIcon symbol={curEntry.symbol} />
              ) : null}
              <span className='truncate text-sm text-white'>
                {FYSTACK_UI_STABLECOINS_ONLY && curEntry.symbol
                  ? fystackDepositOptionLabel(cur)
                  : fystackDepositPickerLabel(curEntry)}
              </span>
            </span>
            {curEntry.symbol ? (
              <span className='shrink-0 text-[10px] font-medium text-[#ABAAAD]'>{curEntry.symbol}</span>
            ) : null}
          </div>
          {cur.network ? (
            <p className='mt-1 truncate text-[10px] capitalize text-[#ABAAAD]'>{cur.network}</p>
          ) : null}
        </div>
      </div>

      <div className='rounded-lg bg-mirage p-3'>
        {cur.qrCode ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cur.qrCode} alt='' className='mx-auto h-44 w-44 rounded-lg bg-white p-2' />
        ) : null}
        <p className='mt-3 break-all text-center text-sm font-medium text-white'>{cur.address}</p>
        <Button
          type='button'
          variant='secondary2'
          className='mt-3 w-full'
          onClick={() => navigator.clipboard.writeText(cur.address)}
        >
          <Copy className='mr-2 h-4 w-4' />
          Copy address
        </Button>
      </div>
    </div>
  )
}

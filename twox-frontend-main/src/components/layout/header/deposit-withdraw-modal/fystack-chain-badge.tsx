'use client'

import * as React from 'react'

import ArbitrumIcon from '@/assets/currencies/arbitrum.svg'
import AvalancheIcon from '@/assets/currencies/avalanche.svg'
import BaseIcon from '@/assets/currencies/base.svg'
import BnbIcon from '@/assets/currencies/bnb.svg'
import BtcIcon from '@/assets/currencies/btc.svg'
import DogeIcon from '@/assets/currencies/doge.svg'
import EthIcon from '@/assets/currencies/eth.svg'
import LtcIcon from '@/assets/currencies/ltc.svg'
import MaticIcon from '@/assets/currencies/matic.svg'
import SolIcon from '@/assets/currencies/sol.svg'
import TronIcon from '@/assets/currencies/tron.svg'
import XrpIcon from '@/assets/currencies/xrp.svg'
import BchIcon from '@/assets/crypto-icons/bch.svg'

import { fystackChainEmoji } from './fystack-deposit-labels'

type SvgComponent = React.FunctionComponent<React.SVGProps<SVGSVGElement>>

/**
 * SVGR turns *.svg imports into React components, do not pass them to next/image.
 *
 * Icons for BTC, DOGE, XRP, etc. remain for non-stable UI (`NEXT_PUBLIC_FYSTACK_UI_STABLECOINS_ONLY=false`)
 * and legacy deposit rows; stable-only flow filters most native-coin rails in `fystack-stablecoins-ui.ts`.
 */
function resolveChainIcon(blockchain: string): SvgComponent | null {
  const b = blockchain.toLowerCase()
  if (b.includes('bitcoin-cash')) return BchIcon
  if (b === 'bitcoin' || (b.includes('bitcoin') && !b.includes('cash'))) return BtcIcon
  if (b.includes('litecoin')) return LtcIcon
  if (b.includes('dogecoin')) return DogeIcon
  if (b.includes('xrp')) return XrpIcon
  if (b.includes('tron')) return TronIcon
  if (b.includes('binance-smart-chain') || b.includes('bsc')) return BnbIcon
  if (b.includes('polygon') || b.includes('matic')) return MaticIcon
  if (b.includes('avalanche')) return AvalancheIcon
  if (b.includes('arbitrum')) return ArbitrumIcon
  if (b.includes('base')) return BaseIcon
  if (b.includes('solana')) return SolIcon
  /* EVM L2 / sidechains without dedicated assets in repo */
  if (
    b === 'ethereum' ||
    b.includes('ethereum') ||
    b.includes('optimism') ||
    b.includes('linea') ||
    b.includes('fantom')
  ) {
    return EthIcon
  }
  return null
}

export function FystackChainBadge({
  blockchain,
  size = 22,
}: {
  blockchain: string
  size?: number
}) {
  const Icon = resolveChainIcon(blockchain)
  if (Icon) {
    return <Icon width={size} height={size} className='shrink-0' aria-hidden />
  }
  return (
    <span
      className='flex h-[22px] w-[22px] shrink-0 items-center justify-center leading-none'
      aria-hidden
      style={{ fontSize: size * 0.85 }}
    >
      {fystackChainEmoji(blockchain)}
    </span>
  )
}

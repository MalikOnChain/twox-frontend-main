import { type DepositAddressRow } from '@/api/wallet'

import { FYSTACK_UI_STABLECOINS_ONLY } from './fystack-stablecoins-ui'

/** Mongo ObjectId or similar internal id mistakenly stored in `label`. */
function isOpaqueInternalLabel(s: string): boolean {
  const t = s.trim()
  if (!t) return true
  if (/^[a-f0-9]{24}$/i.test(t)) return true
  if (/^[a-f0-9]{32,64}$/i.test(t)) return true
  return false
}

/**
 * @deprecated Use only when `FYSTACK_UI_STABLECOINS_ONLY` is false, full chain names (BTC, ETH native, etc.).
 */
export function legacyLabelFromBlockchainNetwork(row: DepositAddressRow): string {
  if (!row?.blockchain) return 'Unknown network'
  const b = row.blockchain.toLowerCase()
  const n = (row.network || '').toLowerCase()
  if (b.includes('ethereum') || b === 'eth') {
    return 'Ethereum (ERC-20)'
  }
  if (b.includes('tron') || b === 'trx') {
    return 'Tron (TRC-20)'
  }
  if (b.includes('bsc') || b.includes('binance')) {
    return 'BNB Smart Chain (BEP-20)'
  }
  if (b.includes('polygon') || b.includes('matic')) {
    return 'Polygon'
  }
  if (b.includes('arbitrum')) return 'Arbitrum'
  if (b.includes('optimism')) return 'Optimism'
  if (b.includes('base')) return 'Base'
  if (b.includes('linea')) return 'Linea'
  if (b.includes('avalanche')) return 'Avalanche'
  if (b.includes('fantom')) return 'Fantom'
  if (b.includes('bitcoin-cash')) return 'Bitcoin Cash'
  if (b.includes('bitcoin') && !b.includes('cash')) return 'Bitcoin'
  if (b.includes('litecoin')) return 'Litecoin'
  if (b.includes('dogecoin')) return 'Dogecoin'
  if (b.includes('solana')) return 'Solana'
  if (b.includes('sui')) return 'Sui'
  if (b.includes('xrp')) return 'XRP'
  return `${row.blockchain} · ${row.network || n || 'mainnet'}`
}

/** Rail name for USDT/USDC copy (same mapping as legacy, without re-exporting “Bitcoin” etc. as primary). */
function stableRailNameForDeposit(row: DepositAddressRow): string {
  return legacyLabelFromBlockchainNetwork(row)
}

/**
 * Human-readable label for a Fystack-backed deposit row (chain + network from our DB).
 * Never surfaces raw userId / ObjectId / custodian ids stored in `label`.
 */
export function fystackDepositOptionLabel(row: DepositAddressRow): string {
  if (!row?.blockchain) return 'Unknown network'
  if (FYSTACK_UI_STABLECOINS_ONLY) {
    return stableRailNameForDeposit(row)
  }
  const raw = row.label?.trim()
  if (raw && !isOpaqueInternalLabel(raw)) return raw
  return legacyLabelFromBlockchainNetwork(row)
}

/** Stable UI: one row per chain + stablecoin, `{rail} · {USDT|USDC}`. Legacy: same as `fystackDepositOptionLabel`. */
export function fystackDepositPickerLabel(entry: {
  row: DepositAddressRow
  symbol?: 'USDT' | 'USDC'
}): string {
  if (!entry?.row?.blockchain) return 'Unknown network'
  if (entry.symbol) {
    return `${stableRailNameForDeposit(entry.row)} · ${entry.symbol}`
  }
  return fystackDepositOptionLabel(entry.row)
}

/** Emoji fallback when we have no SVG for the chain (matches `blockchain` enum values from API). */
export function fystackChainEmoji(blockchain: string): string {
  const b = blockchain.toLowerCase()
  if (b.includes('ethereum') || b === 'eth') return '⟠'
  if (b.includes('tron')) return '🔴'
  if (b.includes('bitcoin') && !b.includes('cash')) return '₿'
  if (b.includes('litecoin')) return 'Ł'
  if (b.includes('dogecoin')) return 'Ð'
  if (b.includes('polygon') || b.includes('matic')) return '⬡'
  if (b.includes('binance')) return '⬢'
  if (b.includes('arbitrum')) return '🔵'
  if (b.includes('optimism')) return '🔴'
  if (b.includes('base')) return '🔷'
  if (b.includes('solana')) return '◎'
  if (b.includes('avalanche')) return '🔺'
  if (b.includes('sui')) return '💧'
  return '◈'
}

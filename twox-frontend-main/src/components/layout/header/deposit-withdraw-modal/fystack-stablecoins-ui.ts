import type { DepositAddressRow } from '@/api/wallet'

/**
 * When true (default): deposit flow filters native-coin rails and uses USDT/USDC copy.
 * Set `NEXT_PUBLIC_FYSTACK_UI_STABLECOINS_ONLY=false` to show all chains and legacy labels.
 *
 * Withdraw uses `withdrawStablePayoutOptions` from `GET /crypto/withdraw-config` when the server has
 * `FYSTACK_UI_STABLECOINS_ONLY` unset (default on); set `FYSTACK_UI_STABLECOINS_ONLY=false` on the API
 * to return only `withdrawNetworks` and the legacy payout picker.
 *
 * Legacy: `legacyLabelFromBlockchainNetwork` (fystack-deposit-labels.ts), `legacyListWithdrawNetworksForCurrency` (CryptoWithdrawal.service.ts).
 */
export const FYSTACK_UI_STABLECOINS_ONLY =
  process.env.NEXT_PUBLIC_FYSTACK_UI_STABLECOINS_ONLY !== 'false'

/** Native / non-USDT-USDC-primary rails we hide from the deposit picker while stable UI is on. */
const STABLE_UI_EXCLUDED_BLOCKCHAINS = new Set([
  'bitcoin',
  'bitcoin-cash',
  'litecoin',
  'dogecoin',
  'xrp',
])

export function filterDepositRowsForStableUi<T extends { blockchain: string }>(rows: T[]): T[] {
  if (!FYSTACK_UI_STABLECOINS_ONLY) return rows
  return rows.filter((r) => !STABLE_UI_EXCLUDED_BLOCKCHAINS.has(r.blockchain.toLowerCase()))
}

/** One picker row: legacy = one per chain; stable UI = USDT and USDC rows per chain (same address). */
export type FystackDepositPickerEntry = {
  row: DepositAddressRow
  symbol?: 'USDT' | 'USDC'
}

export function buildFystackDepositPickerEntries(rows: DepositAddressRow[]): FystackDepositPickerEntry[] {
  const sane = Array.isArray(rows)
    ? rows.filter((r): r is DepositAddressRow => Boolean(r?.blockchain && typeof r.blockchain === 'string'))
    : []
  const filtered = FYSTACK_UI_STABLECOINS_ONLY ? filterDepositRowsForStableUi(sane) : sane
  if (!FYSTACK_UI_STABLECOINS_ONLY) {
    return filtered.map((row) => ({ row }))
  }
  const out: FystackDepositPickerEntry[] = []
  for (const row of filtered) {
    out.push({ row, symbol: 'USDT' }, { row, symbol: 'USDC' })
  }
  return out
}

/** Matches backend `NETWORK_LABELS` for stable withdraw rails (`CryptoWithdrawal.service.ts`). */
export const STABLE_WITHDRAW_RAIL_LABELS: Record<string, string> = {
  ERC20: 'ERC20 (Ethereum)',
  TRC20: 'TRC20 (Tron)',
  BSC: 'BSC (BEP-20)',
}

/** Human-readable line: rail first, then a single stablecoin (avoids “USDT / USDC” on every row). */
export function stableWithdrawPayoutDisplayLabel(option: { symbol: string; network: string }): string {
  const n = option.network.toUpperCase()
  const rail = STABLE_WITHDRAW_RAIL_LABELS[n] || n
  const sym = option.symbol.toUpperCase() === 'USDC' ? 'USDC' : 'USDT'
  return `${rail} · ${sym}`
}

/** Rail label only, use with USDT/USDC tabs so rows are not redundant. */
export function stableWithdrawRailOnly(network: string): string {
  const n = network.toUpperCase()
  return STABLE_WITHDRAW_RAIL_LABELS[n] || n
}

/** Maps withdraw rail codes to a `FystackChainBadge` blockchain slug (lowercase). */
export function stableWithdrawNetworkBlockchain(network: string): string {
  const n = network.toUpperCase()
  if (n === 'TRC20' || n === 'TRON' || n === 'TRX') return 'tron'
  if (n === 'BSC' || n === 'BEP20' || n === 'BEP-20') return 'binance-smart-chain'
  if (n === 'SOL' || n === 'SOLANA' || n === 'SPL') return 'solana'
  if (n === 'POLYGON' || n === 'MATIC') return 'polygon'
  if (n === 'ARBITRUM' || n === 'ARB') return 'arbitrum'
  if (n === 'OPTIMISM' || n === 'OP') return 'optimism'
  if (n === 'BASE') return 'base'
  if (n === 'AVAX' || n === 'AVALANCHE') return 'avalanche'
  if (n === 'FANTOM' || n === 'FTM') return 'fantom'
  if (n === 'LINEA') return 'linea'
  return 'ethereum'
}

/** Short ticker for header / compact UI (matches common explorer symbols). */
export function stableWithdrawChainAbbrev(network: string): string {
  const n = network.toUpperCase()
  if (n === 'ERC20' || n === 'ETH' || n === 'ETHEREUM') return 'ETH'
  if (n === 'TRC20' || n === 'TRON' || n === 'TRX') return 'TRX'
  if (n === 'BSC' || n === 'BEP20' || n === 'BEP-20') return 'BSC'
  if (n === 'SOL' || n === 'SOLANA' || n === 'SPL') return 'SOL'
  if (n === 'POLYGON' || n === 'MATIC') return 'MATIC'
  if (n === 'ARBITRUM' || n === 'ARB') return 'ARB'
  if (n === 'OPTIMISM' || n === 'OP') return 'OP'
  if (n === 'BASE') return 'BASE'
  if (n === 'AVAX' || n === 'AVALANCHE') return 'AVAX'
  if (n === 'FANTOM' || n === 'FTM') return 'FTM'
  if (n === 'LINEA') return 'LINEA'
  return n.length <= 5 ? n : n.slice(0, 4)
}

export type StableWithdrawPayoutChoice = {
  value: string
  label: string
  symbol: 'USDT' | 'USDC'
  network: string
}

/** Fixed USDT/USDC × ERC20 · TRC20 · BSC, matches typical FYSTACK_WITHDRAW_ASSET_MAP keys (`USDT_ERC20`, …). */
export function getStableWithdrawPayoutChoices(): StableWithdrawPayoutChoice[] {
  const rails = [
    { network: 'ERC20' as const, label: STABLE_WITHDRAW_RAIL_LABELS.ERC20 },
    { network: 'TRC20' as const, label: STABLE_WITHDRAW_RAIL_LABELS.TRC20 },
    { network: 'BSC' as const, label: STABLE_WITHDRAW_RAIL_LABELS.BSC },
  ]
  const symbols: ('USDT' | 'USDC')[] = ['USDT', 'USDC']
  const out: StableWithdrawPayoutChoice[] = []
  for (const symbol of symbols) {
    for (const { network, label } of rails) {
      out.push({
        value: `${symbol}:${network}`,
        label: `${label} · ${symbol}`,
        symbol,
        network,
      })
    }
  }
  return out
}

export function parseStableWithdrawValue(value: string): { symbol: 'USDT' | 'USDC'; network: string } {
  const [symbol, network] = value.split(':')
  const s = symbol?.toUpperCase() === 'USDC' ? 'USDC' : 'USDT'
  const n = network?.toUpperCase() || 'ERC20'
  return { symbol: s, network: n }
}

/**
 * `CryptoTransaction.unit` values for the Fystack stablecoin product (matches withdraw/deposit picker).
 * Use for transaction history currency filter, not legacy chains (BTC, native ETH, etc.).
 */
export const FYSTACK_TRANSACTION_FILTER_UNITS = ['USDT', 'USDC'] as const

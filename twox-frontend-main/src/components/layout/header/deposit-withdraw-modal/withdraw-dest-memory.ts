/**
 * Remember last withdrawal destination per chain (browser localStorage).
 * Stable UI: key = `USDT:ERC20` style; legacy: `USDT` + network value.
 */
const LS_PREFIX = 'twox:withdraw-dest:v1:'

function stableKey(payoutValue: string): string {
  return `${LS_PREFIX}${payoutValue.trim().toUpperCase()}`
}

function legacyKey(network: string): string {
  return `${LS_PREFIX}USDT:${network.trim().toUpperCase()}`
}

export function withdrawDestStorageKey(
  useStablePayoutUi: boolean,
  payoutChoice: string,
  withdrawNetwork: string
): string {
  return useStablePayoutUi ? stableKey(payoutChoice) : legacyKey(withdrawNetwork)
}

export function readWithdrawDestAddress(key: string): string {
  if (typeof window === 'undefined') return ''
  try {
    return localStorage.getItem(key) ?? ''
  } catch {
    return ''
  }
}

export function writeWithdrawDestAddress(key: string, address: string): void {
  if (typeof window === 'undefined') return
  try {
    const t = address.trim()
    if (t) localStorage.setItem(key, t)
    else localStorage.removeItem(key)
  } catch {
    /* quota / private mode */
  }
}

export const isPhantomInstalled = (): boolean => {
  if (typeof window === 'undefined') return false
  if (!window.solana) return false
  if (typeof window.solana.isPhantom !== 'boolean') return false
  return window.solana.isPhantom
}

/**
 * Set up Phantom wallet event listeners
 */
export const setupPhantomEventListeners = (
  onDisconnect: () => void
): (() => void) => {
  if (typeof window !== 'undefined' && window.solana) {
    window.solana.on('disconnect', onDisconnect)
    return () => {
      window?.solana?.removeListener('disconnect', onDisconnect)
    }
  }
  return () => {
    console.error('No Phantom wallet found')
  }
}

/**
 * Get Phantom wallet connection from localStorage
 */
export const getSavedSolanaConnection = (): boolean => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('solanaConnected') === 'true'
  }
  return false
}

/**
 * Save Solana connection state to localStorage
 */
export const saveSolanaConnection = (isConnected: boolean): void => {
  if (typeof window !== 'undefined') {
    if (isConnected) {
      localStorage.setItem('solanaConnected', 'true')
    } else {
      localStorage.removeItem('solanaConnected')
    }
  }
}

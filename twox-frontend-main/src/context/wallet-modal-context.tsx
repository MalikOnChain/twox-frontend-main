'use client'

import React, { createContext, useContext, useMemo, useState } from 'react'

import { useUser } from '@/context/user-context'

import {
  CRYPTO_SYMBOLS,
  CRYPTO_TOKENS,
  getCoinNetworkData,
  WALLET_MODAL_TABS,
} from '@/lib/crypto'

import { CoinNetworkData } from '@/types/crypto'

// Define the context type
interface WalletModalContextType {
  activeTarget: string | null
  activeTab: WALLET_MODAL_TABS
  setActiveTarget: (target: string | null) => void
  setActiveTab: (tab: WALLET_MODAL_TABS) => void
  activeCrypto: CoinNetworkData | null
  setActiveCrypto: (crypto: CoinNetworkData | null) => void
  cryptoList: CoinNetworkData[]
}

const WalletModalContext = createContext<WalletModalContextType | undefined>(
  undefined
)

export function WalletModalProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [activeTarget, setActiveTarget] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<WALLET_MODAL_TABS>(
    WALLET_MODAL_TABS.deposit
  )
  const [activeCrypto, setActiveCrypto] = useState<CoinNetworkData | null>(null)

  // Coinsbuy integration - no need for deposit addresses
  // The cryptoList is now populated from Coinsbuy supported currencies
  const cryptoList = useMemo(() => {
    // Return empty array - Coinsbuy handles currency selection dynamically
    // This maintains compatibility with existing components while using Coinsbuy
    return []
  }, [])

  const value = useMemo(
    () => ({
      activeTarget,
      activeTab,
      activeCrypto,
      cryptoList,
      setActiveTarget,
      setActiveTab,
      setActiveCrypto,
    }),
    [
      activeTarget,
      activeTab,
      activeCrypto,
      cryptoList,
      setActiveTarget,
      setActiveTab,
      setActiveCrypto,
    ]
  )

  return (
    <WalletModalContext.Provider value={value}>
      {children}
    </WalletModalContext.Provider>
  )
}

// Custom hook for using the VIP context
export function useWalletModal() {
  const context = useContext(WalletModalContext)
  if (context === undefined) {
    throw new Error('useWalletModal must be used within a WalletModalProvider')
  }
  return context
}

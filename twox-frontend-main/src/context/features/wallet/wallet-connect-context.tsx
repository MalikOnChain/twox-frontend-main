'use client'

import { createContext, ReactNode, useContext, useMemo } from 'react'
import { WagmiProvider } from 'wagmi'

import { wagmiConfig } from '@/lib/wagmi'

import { useEthereum } from './ethereum/use-ethereum'
import { truncateAddress } from './ethereum/utils'
import { useSolana } from './solana/use-solana'
import { EthereumWallet, SolanaWallet, WalletProviderProps } from './types'

// Define the context type to include both wallet types
interface WalletContextValue {
  ethereum: EthereumWallet
  solana: SolanaWallet
  truncateAddress: (address: string) => string
}

// Create the context with default values
const WalletContext = createContext<WalletContextValue | undefined>(undefined)

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  return (
    <WagmiProvider config={wagmiConfig}>
      <WalletProviderContent>{children}</WalletProviderContent>
    </WagmiProvider>
  )
}

const WalletProviderContent: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Get wallet implementations
  const ethereum = useEthereum()
  const solana = useSolana()

  // Create the context value
  const contextValue = useMemo<WalletContextValue>(
    () => ({
      ethereum,
      solana,
      truncateAddress,
    }),
    [ethereum, solana]
  )

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  )
}

export const useSolanaWallet = (): SolanaWallet => {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error('useSolanaWallet must be used within a WalletProvider')
  }
  return context.solana
}

export const useEthereumWallet = (): EthereumWallet => {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error('useEthereumWallet must be used within a WalletProvider')
  }
  return context.ethereum
}

export const useAddressFormatter = (): ((address: string) => string) => {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error('useAddressFormatter must be used within a WalletProvider')
  }
  return context.truncateAddress
}

export default WalletContext

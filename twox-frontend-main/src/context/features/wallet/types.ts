import { ReactNode } from 'react'

import { EVM_CURRENCY } from '@/lib/crypto'
import { supportedChains } from '@/lib/wagmi'

export type EthereumConnectorId =
  | 'metaMask'
  | 'coinbaseWallet'
  | 'walletConnect'
  | 'injected'

export interface WalletConnectionResult {
  address: string
  chainId: number
}

export interface WalletProviderProps {
  children: ReactNode
  appName?: string
}

export interface EthereumWalletState {
  address: string
  connected: boolean
  chainId: number | undefined
  walletType: string
  isConnecting: boolean
}

export interface EthereumWalletActions {
  connectWallet: (
    connectorId: EthereumConnectorId
  ) => Promise<WalletConnectionResult | undefined>
  disconnectWallet: () => Promise<void>
  loginWithWallet: (connectorId: EthereumConnectorId) => Promise<unknown>
  switchNetwork: (chainId: number) => Promise<void>
  depositToken: ({
    currency,
    amount,
    depositAddress,
    decimals,
    walletType,
    network,
  }: {
    currency: EVM_CURRENCY
    amount: string
    depositAddress: `0x${string}`
    decimals?: number
    walletType: EthereumConnectorId
    network: string
  }) => Promise<{
    success: boolean
    txHash?: string
    message?: string
  }>
}

export interface EthereumWallet
  extends EthereumWalletState,
    EthereumWalletActions {
  isNetworkSupported: (chainId: number | undefined) => boolean
  supportedChains: typeof supportedChains
}

export interface SolanaWalletState {
  address: string
  connected: boolean
}

export interface SolanaWalletActions {
  connectWallet: () => Promise<{ address: string | undefined } | undefined>
  disconnectWallet: () => Promise<void>
  loginWithWallet: () => Promise<unknown>
}

export interface SolanaWallet extends SolanaWalletState, SolanaWalletActions {}

export interface WalletContextType {
  // Ethereum wallet properties
  address: string
  connected: boolean
  chainId: number | undefined
  walletType: string
  isConnecting: boolean
  connectWallet: (
    connectorId: EthereumConnectorId
  ) => Promise<WalletConnectionResult | undefined>
  disconnectWallet: () => Promise<void>
  authWallet: (params: { address: string }) => Promise<unknown>
  loginWithWallet: (connectorId: EthereumConnectorId) => Promise<unknown>
  switchNetwork: (chainId: number) => Promise<void>
  isNetworkSupported: (chainId: number | undefined) => boolean
  supportedChains: typeof supportedChains

  // Solana wallet properties
  solanaAddress: string
  solanaConnected: boolean
  connectPhantom: () => Promise<{ address: string | undefined } | undefined>
  loginWithPhantomWallet: () => Promise<unknown>

  // Utility functions
  truncateAddress: (address: string) => string
}

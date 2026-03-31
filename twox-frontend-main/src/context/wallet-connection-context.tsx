'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAccount, useConnect, useDisconnect, useChainId } from 'wagmi'
import { toast } from 'sonner'
import { useUser } from './user-context'
import api from '@/lib/api'

interface WalletConnectionContextType {
  isConnected: boolean
  address: string | undefined
  chainId: number | undefined
  isConnecting: boolean
  connect: () => void
  disconnect: () => void
  saveWalletAddresses: () => Promise<void>
}

const WalletConnectionContext = createContext<WalletConnectionContextType | undefined>(undefined)

export function WalletConnectionProvider({ children }: { children: React.ReactNode }) {
  const { address, isConnected: wagmiConnected } = useAccount()
  const { connectAsync, connectors } = useConnect()
  const { disconnectAsync } = useDisconnect()
  const chainId = useChainId()
  const { user, isAuthenticated } = useUser()
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)

  // Update connection status
  useEffect(() => {
    setIsConnected(wagmiConnected && !!address)
  }, [wagmiConnected, address])

  const connect = useCallback(async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in first to connect your wallet')
      return
    }

    try {
      setIsConnecting(true)
      
      // Try to connect with the first available connector (usually MetaMask/injected)
      const connector = connectors[0]
      if (!connector) {
        toast.error('No wallet connector found. Please install MetaMask or another Web3 wallet.')
        return
      }

      await connectAsync({ connector })
      toast.success('Wallet connected successfully!')
      
    } catch (error: any) {
      console.error('Failed to connect wallet:', error)
      if (error.message?.includes('User rejected')) {
        toast.error('Wallet connection rejected')
      } else {
        toast.error('Failed to connect wallet')
      }
    } finally {
      setIsConnecting(false)
    }
  }, [connectAsync, connectors, isAuthenticated])

  const disconnect = useCallback(async () => {
    try {
      await disconnectAsync()
      toast.success('Wallet disconnected')
    } catch (error) {
      console.error('Failed to disconnect wallet:', error)
      toast.error('Failed to disconnect wallet')
    }
  }, [disconnectAsync])

  const saveWalletAddresses = useCallback(async () => {
    if (!address || !isAuthenticated) {
      return
    }

    try {
      // For EVM-compatible chains, the same address works across all chains
      // Save the address for all supported EVM chains
      const evmChains = [
        { blockchain: 'ethereum', network: 'mainnet', label: 'Ethereum Mainnet' },
        { blockchain: 'binance-smart-chain', network: 'mainnet', label: 'BSC Mainnet' },
        { blockchain: 'polygon', network: 'mainnet', label: 'Polygon Mainnet' },
        { blockchain: 'avalanche', network: 'mainnet', label: 'Avalanche C-Chain' },
        { blockchain: 'arbitrum', network: 'mainnet', label: 'Arbitrum One' },
        { blockchain: 'optimism', network: 'mainnet', label: 'Optimism Mainnet' },
        { blockchain: 'base', network: 'mainnet', label: 'Base Mainnet' },
        { blockchain: 'linea', network: 'mainnet', label: 'Linea Mainnet' },
        { blockchain: 'fantom', network: 'mainnet', label: 'Fantom Opera' },
      ]

      // Save address for all EVM chains
      const savePromises = evmChains.map(({ blockchain, network, label }) =>
        api.post('/user/wallet/connect', {
          address,
          blockchain,
          network,
          chainId: chainId || 1,
          label: `${label} - MetaMask`,
          walletType: 'metamask',
        })
      )

      const responses = await Promise.allSettled(savePromises)
      
      const successCount = responses.filter(r => r.status === 'fulfilled').length
      console.log(`Wallet addresses saved: ${successCount}/${evmChains.length} chains`)

      if (successCount > 0) {
        console.log('Wallet addresses saved successfully across multiple chains')
      }
    } catch (error) {
      console.error('Failed to save wallet addresses:', error)
      // Don't show error to user as this is background operation
    }
  }, [address, chainId, isAuthenticated])

  // Auto-save wallet addresses when wallet is connected
  useEffect(() => {
    if (isConnected && address && isAuthenticated) {
      saveWalletAddresses()
    }
  }, [isConnected, address, isAuthenticated, saveWalletAddresses])

  const value = {
    isConnected,
    address,
    chainId,
    isConnecting,
    connect,
    disconnect,
    saveWalletAddresses,
  }

  return (
    <WalletConnectionContext.Provider value={value}>
      {children}
    </WalletConnectionContext.Provider>
  )
}

export function useWalletConnection() {
  const context = useContext(WalletConnectionContext)
  if (!context) {
    throw new Error('useWalletConnection must be used within WalletConnectionProvider')
  }
  return context
}


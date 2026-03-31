'use client'

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { toast } from 'sonner'

import { useUser } from '@/context/user-context'

import api from '@/lib/api'

// Declare Phantom types
declare global {
  interface Window {
    phantom?: {
      solana?: {
        isPhantom: boolean
        connect: (options?: any) => Promise<{ publicKey: { toString: () => string } }>
        disconnect: () => Promise<void>
        on: (event: string, callback: (args: any) => void) => void
        isConnected: boolean
        publicKey?: { toString: () => string }
      }
      ethereum?: any
      bitcoin?: any
      sui?: any
    }
  }
}

interface PhantomAddresses {
  solana?: string
  ethereum?: string
  bitcoin?: string
  sui?: string
}

interface SolanaWalletContextType {
  isConnected: boolean
  address: string | undefined
  addresses: PhantomAddresses
  isConnecting: boolean
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  saveWalletAddresses: () => Promise<void>
}

const SolanaWalletContext = createContext<SolanaWalletContextType | undefined>(undefined)

export function SolanaWalletProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useUser()
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string | undefined>(undefined)
  const [addresses, setAddresses] = useState<PhantomAddresses>({})

  // Check if Phantom is installed
  const getPhantom = useCallback(() => {
    if (typeof window === 'undefined') return null
    
    // Check for Phantom in multiple ways
    if (window.phantom?.solana?.isPhantom) {
      return window.phantom.solana
    }
    
    // Check for Solana in window (alternative detection)
    if ((window as any).solana?.isPhantom) {
      return (window as any).solana
    }
    
    console.log('Phantom wallet not detected. Available providers:', {
      hasPhantom: !!window.phantom,
      hasSolana: !!window.phantom?.solana,
      hasWindowSolana: !!(window as any).solana,
    })
    
    return null
  }, [])

  // Initialize connection status
  useEffect(() => {
    const phantom = getPhantom()
    if (phantom && phantom.isConnected && phantom.publicKey) {
      setIsConnected(true)
      setAddress(phantom.publicKey.toString())
    }
  }, [getPhantom])

  const connect = useCallback(async () => {
    console.log('🔵 Phantom connect called. isAuthenticated:', isAuthenticated)
    
    if (!isAuthenticated) {
      toast.error('Please sign in first to connect your wallet')
      return
    }

    try {
      setIsConnecting(true)
      
      const phantom = getPhantom()
      console.log('🔵 Phantom wallet instance:', phantom)
      
      if (!phantom) {
        console.error('❌ Phantom wallet not found')
        toast.error('Phantom wallet not found. Please install Phantom wallet extension.')
        window.open('https://phantom.app/', '_blank')
        return
      }

      console.log('🔵 Attempting to connect to Phantom...')
      
      // Log all available Phantom providers
      const phantomProviders = (window as any).phantom
      if (phantomProviders) {
        console.log('🔍 Available Phantom providers:', Object.keys(phantomProviders))
        console.log('🔍 Phantom provider details:', {
          hasSolana: !!phantomProviders.solana,
          hasEthereum: !!phantomProviders.ethereum,
          hasBitcoin: !!phantomProviders.bitcoin,
          hasSui: !!phantomProviders.sui,
        })
      }
      
      const response = await phantom.connect()
      console.log('🔵 Phantom connection response:', response)
      
      // Get Solana address
      const solanaAddress = response.publicKey.toString()
      console.log('🔵 Phantom Solana address:', solanaAddress)
      
      const phantomAddresses: PhantomAddresses = {
        solana: solanaAddress,
      }
      
      // Try to get Ethereum address if Phantom supports it
      try {
        if ((window as any).phantom?.ethereum) {
          const ethAccounts = await (window as any).phantom.ethereum.request({ 
            method: 'eth_requestAccounts' 
          })
          if (ethAccounts && ethAccounts.length > 0) {
            phantomAddresses.ethereum = ethAccounts[0]
            console.log('🔵 Phantom Ethereum address:', ethAccounts[0])
          }
        }
      } catch (err) {
        console.log('ℹ️ Phantom Ethereum not available or not enabled')
      }
      
      // Try to get Bitcoin address if Phantom supports it
      try {
        if ((window as any).phantom?.bitcoin) {
          console.log('🔵 Phantom Bitcoin provider found, attempting to connect...')
          
          try {
            // Use the connect method with silent flag first to check if already connected
            const btcConnect = await (window as any).phantom.bitcoin.connect({ onlyIfTrusted: true })
            console.log('🔵 Bitcoin silent connect response:', btcConnect)
            
            if (btcConnect?.address) {
              phantomAddresses.bitcoin = btcConnect.address
              console.log('🔵 Phantom Bitcoin address (already connected):', btcConnect.address)
            } else if (btcConnect?.addresses && btcConnect.addresses.length > 0) {
              phantomAddresses.bitcoin = btcConnect.addresses[0].address || btcConnect.addresses[0]
              console.log('🔵 Phantom Bitcoin address (addresses array):', phantomAddresses.bitcoin)
            }
          } catch (silentErr) {
            // If silent connect fails, try regular connect (will prompt user)
            console.log('ℹ️ Bitcoin not auto-connected, will prompt user later if needed')
            console.log('Silent error:', silentErr)
          }
        } else {
          console.log('ℹ️ Phantom Bitcoin provider not found')
        }
      } catch (err: any) {
        console.error('❌ Phantom Bitcoin error:', err.message || err)
      }
      
      // Try to get Sui address if Phantom supports it
      try {
        if ((window as any).phantom?.sui) {
          console.log('🔵 Phantom Sui provider found, attempting to connect...')
          
          try {
            // Use silent connect first
            const suiConnect = await (window as any).phantom.sui.connect({ onlyIfTrusted: true })
            console.log('🔵 Sui silent connect response:', suiConnect)
            
            if (suiConnect?.address) {
              phantomAddresses.sui = suiConnect.address
              console.log('🔵 Phantom Sui address (already connected):', suiConnect.address)
            } else if (suiConnect?.accounts && suiConnect.accounts.length > 0) {
              phantomAddresses.sui = suiConnect.accounts[0].address || suiConnect.accounts[0]
              console.log('🔵 Phantom Sui address (accounts array):', phantomAddresses.sui)
            }
          } catch (silentErr) {
            console.log('ℹ️ Sui not auto-connected, will prompt user later if needed')
            console.log('Silent error:', silentErr)
          }
        } else {
          console.log('ℹ️ Phantom Sui provider not found')
        }
      } catch (err: any) {
        console.error('❌ Phantom Sui error:', err.message || err)
      }
      
      setIsConnected(true)
      setAddress(solanaAddress)
      setAddresses(phantomAddresses)
      
      console.log('✅ Final Phantom addresses:', phantomAddresses)
      
      // Show success message
      const connectedChains = Object.keys(phantomAddresses).length
      toast.success(`Phantom wallet connected! ${connectedChains} blockchain(s) detected.`)
      
      // Prompt user to connect Bitcoin and Sui if not already connected
      setTimeout(async () => {
        // Try to connect Bitcoin if not already connected
        if (!phantomAddresses.bitcoin && (window as any).phantom?.bitcoin) {
          try {
            console.log('🔔 Prompting for Bitcoin connection...')
            const btcConnect = await (window as any).phantom.bitcoin.connect()
            if (btcConnect?.address || btcConnect?.addresses?.[0]) {
              const btcAddr = btcConnect.address || btcConnect.addresses[0].address || btcConnect.addresses[0]
              phantomAddresses.bitcoin = btcAddr
              setAddresses({...phantomAddresses})
              console.log('✅ Bitcoin connected:', btcAddr)
              toast.success('Bitcoin chain added to Phantom!')
            }
          } catch (btcErr) {
            console.log('ℹ️ User declined Bitcoin connection or not available')
          }
        }
        
        // Try to connect Sui if not already connected
        if (!phantomAddresses.sui && (window as any).phantom?.sui) {
          try {
            console.log('🔔 Prompting for Sui connection...')
            const suiConnect = await (window as any).phantom.sui.connect()
            if (suiConnect?.address || suiConnect?.accounts?.[0]) {
              const suiAddr = suiConnect.address || suiConnect.accounts[0].address || suiConnect.accounts[0]
              phantomAddresses.sui = suiAddr
              setAddresses({...phantomAddresses})
              console.log('✅ Sui connected:', suiAddr)
              toast.success('Sui chain added to Phantom!')
            }
          } catch (suiErr) {
            console.log('ℹ️ User declined Sui connection or not available')
          }
        }
      }, 1000) // Wait 1 second after main connection
      
    } catch (error: any) {
      console.error('❌ Failed to connect Phantom wallet:', error)
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        stack: error.stack,
      })
      
      if (error.code === 4001) {
        toast.error('Wallet connection rejected')
      } else if (error.message) {
        toast.error(`Failed to connect: ${error.message}`)
      } else {
        toast.error('Failed to connect Phantom wallet')
      }
    } finally {
      setIsConnecting(false)
    }
  }, [getPhantom, isAuthenticated])

  const disconnect = useCallback(async () => {
    try {
      const phantom = getPhantom()
      if (phantom) {
        await phantom.disconnect()
      }
      setIsConnected(false)
      setAddress(undefined)
      setAddresses({})
      toast.success('Phantom wallet disconnected')
    } catch (error) {
      console.error('Failed to disconnect Phantom wallet:', error)
      toast.error('Failed to disconnect Phantom wallet')
    }
  }, [getPhantom])

  const saveWalletAddresses = useCallback(async () => {
    if (!isAuthenticated || Object.keys(addresses).length === 0) {
      return
    }

    try {
      console.log('💾 Saving Phantom wallet addresses:', addresses)
      
      // Phantom now supports multiple blockchains
      // Save addresses for all chains that Phantom has
      const savePromises: Promise<any>[] = []
      
      // Solana (primary Phantom chain)
      if (addresses.solana) {
        savePromises.push(
          api.post('/user/wallet/connect', {
            address: addresses.solana,
            blockchain: 'solana',
            network: 'mainnet',
            chainId: 0,
            label: 'Solana Mainnet - Phantom',
            walletType: 'phantom',
          })
        )
      }
      
      // Ethereum (Phantom supports EVM chains)
      if (addresses.ethereum) {
        // Phantom's Ethereum address works for all EVM chains
        const evmChains = [
          { blockchain: 'ethereum', label: 'Ethereum Mainnet' },
          { blockchain: 'base', label: 'Base Mainnet' },
          { blockchain: 'polygon', label: 'Polygon Mainnet' },
        ]
        
        evmChains.forEach(({ blockchain, label }) => {
          savePromises.push(
            api.post('/user/wallet/connect', {
              address: addresses.ethereum,
              blockchain,
              network: 'mainnet',
              chainId: 0,
              label: `${label} - Phantom`,
              walletType: 'phantom',
            })
          )
        })
      }
      
      // Bitcoin (Phantom supports Bitcoin)
      if (addresses.bitcoin) {
        savePromises.push(
          api.post('/user/wallet/connect', {
            address: addresses.bitcoin,
            blockchain: 'bitcoin',
            network: 'mainnet',
            chainId: 0,
            label: 'Bitcoin Mainnet - Phantom',
            walletType: 'phantom',
          })
        )
      }
      
      // Sui (if Phantom supports it)
      if (addresses.sui) {
        savePromises.push(
          api.post('/user/wallet/connect', {
            address: addresses.sui,
            blockchain: 'sui',
            network: 'mainnet',
            chainId: 0,
            label: 'Sui Mainnet - Phantom',
            walletType: 'phantom',
          })
        )
      }

      const responses = await Promise.allSettled(savePromises)
      const successCount = responses.filter(r => r.status === 'fulfilled').length
      
      console.log(`💾 Phantom wallet addresses saved: ${successCount}/${savePromises.length} chains`)
      console.log('Saved chains:', {
        solana: !!addresses.solana,
        ethereum: !!addresses.ethereum,
        bitcoin: !!addresses.bitcoin,
        sui: !!addresses.sui,
      })

      if (successCount > 0) {
        console.log('✅ Phantom wallet addresses saved successfully')
      }
    } catch (error) {
      console.error('Failed to save Phantom wallet addresses:', error)
      // Don't show error to user as this is background operation
    }
  }, [addresses, isAuthenticated])

  // Auto-save wallet addresses when connected
  useEffect(() => {
    if (isConnected && Object.keys(addresses).length > 0 && isAuthenticated) {
      saveWalletAddresses()
    }
  }, [isConnected, addresses, isAuthenticated, saveWalletAddresses])

  const value = {
    isConnected,
    address,
    addresses,
    isConnecting,
    connect,
    disconnect,
    saveWalletAddresses,
  }

  return (
    <SolanaWalletContext.Provider value={value}>
      {children}
    </SolanaWalletContext.Provider>
  )
}

export function useSolanaWallet() {
  const context = useContext(SolanaWalletContext)
  if (!context) {
    throw new Error('useSolanaWallet must be used within SolanaWalletProvider')
  }
  return context
}


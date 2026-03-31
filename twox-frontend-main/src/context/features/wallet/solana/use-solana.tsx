import { useCallback, useEffect, useState } from 'react'

import { fetchWalletLoginNonce, walletLogin } from '@/api/auth'

import {
  getSavedSolanaConnection,
  isPhantomInstalled,
  saveSolanaConnection,
  setupPhantomEventListeners,
} from './utils'
import { SolanaWallet } from '../types'

export const useSolana = (): SolanaWallet => {
  // Local state
  const [address, setAddress] = useState('')
  const [connected, setConnected] = useState(false)

  // Connect wallet function
  const connectWallet = useCallback(async () => {
    if (!isPhantomInstalled()) {
      throw new Error('Phantom wallet is not installed')
    }

    try {
      const response = await window.solana?.connect()
      const walletAddress = response?.publicKey?.toString()

      setAddress(walletAddress || '')
      setConnected(true)
      saveSolanaConnection(true)

      return { address: walletAddress }
    } catch (error) {
      console.error('Error connecting to Phantom wallet:', error)
      throw error
    }
  }, [])

  // Handle disconnect event
  const disconnectWallet = useCallback(async () => {
    setAddress('')
    setConnected(false)
    saveSolanaConnection(false)
  }, [])

  // Login with wallet function
  const loginWithWallet = useCallback(async () => {
    try {
      // First connect the Phantom wallet
      const connectionResult = await connectWallet()

      if (!connectionResult || !connectionResult.address) {
        throw new Error('Failed to connect Phantom wallet')
      }

      // Then authenticate
      const { nonce } = await fetchWalletLoginNonce({
        address: connectionResult.address,
      })

      if (!nonce) {
        throw new Error('Invalid nonce received')
      }

      // Sign the message using Phantom wallet
      const encodedMessage = new TextEncoder().encode(nonce)
      const signedMessage = await window.solana?.signMessage?.(
        encodedMessage,
        'utf8'
      )

      if (!signedMessage) {
        throw new Error('Failed to sign message')
      }

      // Convert signature to hex string
      const signature = Buffer.from(signedMessage.signature).toString('hex')

      // Login with the signature
      const response = await walletLogin({
        address: connectionResult.address,
        signature,
        chain: 'solana',
      })

      return response
    } catch (error) {
      console.error('Phantom wallet login failed:', error)
      throw error
    }
  }, [connectWallet])

  // Set up event listeners
  useEffect(() => {
    const cleanup = setupPhantomEventListeners(disconnectWallet)
    return cleanup
  }, [disconnectWallet])

  // Restore connection on mount
  useEffect(() => {
    const restoreConnection = async () => {
      if (isPhantomInstalled() && getSavedSolanaConnection()) {
        try {
          await connectWallet()
        } catch (error) {
          console.error('Failed to restore Phantom connection:', error)
        }
      }
    }
    restoreConnection()
  }, [connectWallet])

  return {
    address,
    connected,
    disconnectWallet,
    connectWallet,
    loginWithWallet,
  }
}

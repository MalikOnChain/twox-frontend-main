import { getBalance, simulateContract, writeContract } from '@wagmi/core'
import { useCallback, useEffect, useState } from 'react'
import { erc20Abi, parseEther, parseUnits } from 'viem'
import {
  useAccount,
  useConnect,
  useDisconnect,
  useSendTransaction,
  useSignMessage,
} from 'wagmi'

import {
  fetchWalletDepositNonce,
  fetchWalletLoginNonce,
  walletLogin,
} from '@/api/auth'

import { useUser } from '@/context/user-context'

import {
  Currency,
  EVM_CURRENCY,
  getChainIdByNativeCurrency,
  getChainIdByNetwork,
  getTokenContractAddress,
  isERC20,
} from '@/lib/crypto'
import { supportedChains, wagmiConfig } from '@/lib/wagmi'

import { isNetworkSupported, switchNetwork } from './utils'
import {
  EthereumConnectorId,
  EthereumWallet,
  WalletConnectionResult,
} from '../types'

export const useEthereum = (): EthereumWallet => {
  // Wagmi hooks
  const { address, isConnected, chainId } = useAccount()
  const { connectAsync, connectors, isPending } = useConnect()
  const { disconnectAsync } = useDisconnect()
  const { signMessageAsync } = useSignMessage()
  const { sendTransactionAsync } = useSendTransaction()

  const { checkAuth } = useUser()
  const [_isWalletAuthenticated, setIsWalletAuthenticated] = useState(false)

  // Local state
  const [walletType, setWalletType] = useState('')

  // Connect wallet function
  const connectWallet = useCallback(
    async (
      connectorId: EthereumConnectorId
    ): Promise<WalletConnectionResult | undefined> => {
      try {
        // Find the right connector based on ID
        const connector = connectors.find((c) => {
          if (connectorId === 'metaMask' && c.name === 'MetaMask') return true
          if (connectorId === 'coinbaseWallet' && c.name === 'Coinbase Wallet')
            return true
          if (connectorId === 'walletConnect' && c.name === 'WalletConnect')
            return true
          if (connectorId === 'injected' && c.name === 'Injected') return true
          return false
        })

        if (!connector) {
          console.error(`${connectorId} connector not found`)
          throw new Error(`${connectorId} connector not found`)
        }

        let result
        try {
          // Try to connect using the connector
          result = await connectAsync({ connector })
        } catch (error: any) {
          // If the error is ConnectorAlreadyConnectedError, get the current connection
          if (error.name === 'ConnectorAlreadyConnectedError') {
            // Return current connection details
            return {
              address: address || '',
              chainId: chainId || 0,
            }
          }
          throw error
        }

        if (!result.accounts[0]) {
          throw new Error('No account found')
        }

        const connected = {
          address: result.accounts[0] as `0x${string}`,
          chainId: result.chainId,
        }

        // Set wallet type based on connector ID
        setWalletType(connectorId)

        // Store connection state
        localStorage.setItem('walletConnected', 'true')
        localStorage.setItem('walletType', connectorId)

        return connected
      } catch (error) {
        console.error(`Error connecting ${connectorId}:`, error)
        throw error
      }
    },
    [connectors, connectAsync, address, chainId]
  )

  const disconnectWallet = useCallback(async (): Promise<void> => {
    try {
      await disconnectAsync()

      // Reset wallet type
      setWalletType('')

      // Clear localStorage
      localStorage.removeItem('walletConnected')
      localStorage.removeItem('walletType')
    } catch (error) {
      console.error('Error disconnecting wallet:', error)
    }
  }, [disconnectAsync])

  const signWallet = useCallback(
    async (
      address: string,
      type: 'login' | 'deposit' = 'login',
      currency?: string,
      amount?: string,
      chain?: string
    ): Promise<string> => {
      let walletNonce: string | null = null
      if (type === 'login') {
        const { nonce } = await fetchWalletLoginNonce({
          address: address,
        })
        walletNonce = nonce || null
      } else if (type === 'deposit') {
        const { nonce } = await fetchWalletDepositNonce({
          address: address,
          amount: amount || '1',
          currency: currency || 'USDC',
          chain: chain || 'ethereum',
        })
        walletNonce = nonce || null
      }

      if (!walletNonce) {
        console.error('Invalid nonce received')
        throw new Error('Nonce is invalid')
      }

      const signature = await signMessageAsync({ message: walletNonce })
      return signature
    },
    [signMessageAsync]
  )

  const authWallet = useCallback(
    async ({ address }: { address: string }): Promise<unknown> => {
      if (!address) {
        console.error('Wallet not connected')
        throw new Error('Wallet not connected')
      }

      try {
        const signature = await signWallet(address)
        const response = await walletLogin({
          address,
          signature,
        })

        return response
      } catch (err) {
        console.error('Authentication error:', err)
        throw err
      }
    },
    [signWallet]
  )

  const loginWithWallet = useCallback(
    async (connectorId: EthereumConnectorId): Promise<unknown> => {
      try {
        // First connect the wallet
        const connectionResult = await connectWallet(connectorId)

        if (!connectionResult || !connectionResult.address) {
          throw new Error('Failed to connect wallet')
        }

        // Then authenticate
        const response: any = await authWallet({
          address: connectionResult.address,
        })

        if (response?.identifier) {
          await checkAuth(response.identifier)
          setIsWalletAuthenticated(true)
        } else if (response?.error) {
          throw new Error(response.error)
        }

        return response
      } catch (error) {
        console.error('Login failed:', error)
        throw error
      }
    },
    [connectWallet, authWallet, checkAuth]
  )

  const depositToken = useCallback(
    async ({
      amount,
      currency,
      depositAddress,
      decimals = 18,
      walletType: requestedWalletType,
      network = null,
    }: {
      currency: EVM_CURRENCY
      amount: string
      depositAddress: `0x${string}`
      decimals?: number
      walletType: EthereumConnectorId
      network: string | null
    }): Promise<{
      success: boolean
      txHash?: string
      message?: string
    }> => {
      try {
        if (!depositAddress) throw new Error('Missing deposit address')
        let walletAddress = address

        if (!isConnected || walletType !== requestedWalletType) {
          const connectionResult = await connectWallet(
            requestedWalletType as EthereumConnectorId
          )
          walletAddress = connectionResult?.address as `0x${string}`
        }

        if (!walletAddress) throw new Error('Wallet not connected')

        // Add balance check before proceeding with transaction

        let txHash = ''

        if (!isERC20(currency)) {
          let currencyChainId = 0
          if (network) {
            currencyChainId = getChainIdByNetwork(network)
          } else {
            currencyChainId = getChainIdByNativeCurrency(currency)
          }

          if (currencyChainId === 0) {
            throw new Error('Invalid network')
          }

          if (chainId !== currencyChainId) {
            await switchNetwork(currencyChainId)
          }

          const balance = await getBalance(wagmiConfig, {
            address: walletAddress,
            chainId: currencyChainId as 1 | 5 | 42161 | 43114 | 137 | 56,
          })

          const value = parseEther(amount)
          if (Number(balance) < Number(value)) {
            return {
              success: false,
              message: 'Insufficient funds for transaction',
            }
          }

          setTimeout(async () => {
            const tx = await sendTransactionAsync({
              to: depositAddress,
              value: parseEther(amount),
              chainId: currencyChainId,
              account: walletAddress,
            })

            txHash = tx
          }, 1000)
        } else {
          const tokenContractAddress = getTokenContractAddress(
            currency as Currency,
            'ethereum'
          )

          if (currency === 'USDT') {
            const tokenDecimals = 6 // USDT specifically uses 6 decimals
            await writeContract(wagmiConfig, {
              address: tokenContractAddress as `0x${string}`,
              abi: erc20Abi,
              functionName: 'approve',
              args: [depositAddress, parseUnits(amount, tokenDecimals)],
            })

            const txHashResponse = await writeContract(wagmiConfig, {
              abi: erc20Abi,
              address: tokenContractAddress as `0x${string}`,
              functionName: 'transferFrom',
              args: [
                walletAddress,
                depositAddress,
                parseUnits(amount, tokenDecimals),
              ],
            })
            txHash = txHashResponse
          } else {
            // ✅ Use simulateContract for other ERC-20 tokens
            const { request } = await simulateContract(wagmiConfig, {
              abi: erc20Abi,
              address: tokenContractAddress as `0x${string}`,
              functionName: 'transferFrom',
              args: [
                walletAddress,
                depositAddress,
                parseUnits(amount, decimals),
              ],
            })

            txHash = await writeContract(wagmiConfig, request)
          }
        }

        return {
          success: true,
          txHash,
          message: 'Deposit submitted successfully',
        }
      } catch (err: any) {
        return {
          success: false,
          message: err.message || 'Failed to send deposit',
        }
      }
    },
    [
      isConnected,
      walletType,
      connectWallet,
      sendTransactionAsync,
      chainId,
      address,
    ]
  )

  useEffect(() => {
    if (isConnected) {
      const savedWalletType = localStorage.getItem('walletType')
      if (savedWalletType) {
        setWalletType(savedWalletType as EthereumConnectorId)
      }
    }
  }, [isConnected])

  return {
    address: address || '',
    connected: isConnected,
    chainId,
    walletType,
    isConnecting: isPending,

    connectWallet,
    disconnectWallet,
    loginWithWallet,
    switchNetwork,

    depositToken,

    // Utils
    isNetworkSupported,
    supportedChains,
  }
}

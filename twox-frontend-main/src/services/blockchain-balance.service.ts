/**
 * Blockchain Balance Service
 * Fetches real-time balances for wallet addresses across different blockchains
 */

import { createPublicClient, formatEther,http } from 'viem'
import {
  arbitrum,
  avalanche,
  base,
  bsc,
  fantom,
  linea,
  mainnet,
  optimism,
  polygon,
} from 'viem/chains'

// Chain configurations
const CHAIN_CONFIGS = {
  ethereum: mainnet,
  polygon: polygon,
  arbitrum: arbitrum,
  avalanche: avalanche,
  'binance-smart-chain': bsc,
  optimism: optimism,
  base: base,
  linea: linea,
  fantom: fantom,
}

// RPC endpoints (you can replace with your own Infura/Alchemy keys)
const getRpcUrl = (blockchain: string): string => {
  const infuraKey = process.env.NEXT_PUBLIC_INFURA_ID || ''
  
  switch (blockchain) {
    case 'ethereum':
      return `https://mainnet.infura.io/v3/${infuraKey}`
    case 'polygon':
      return `https://polygon-mainnet.infura.io/v3/${infuraKey}`
    case 'arbitrum':
      return `https://arbitrum-mainnet.infura.io/v3/${infuraKey}`
    case 'avalanche':
      return `https://avalanche-mainnet.infura.io/v3/${infuraKey}`
    case 'binance-smart-chain':
      return 'https://bsc-dataseed.binance.org'
    case 'optimism':
      return `https://optimism-mainnet.infura.io/v3/${infuraKey}`
    case 'base':
      return 'https://mainnet.base.org'
    case 'linea':
      return 'https://rpc.linea.build'
    case 'fantom':
      return 'https://rpc.ankr.com/fantom'
    default:
      return ''
  }
}

/**
 * Get EVM chain balance using viem
 */
export const getEvmBalance = async (
  blockchain: string,
  address: string
): Promise<{ balance: string; balanceFormatted: number }> => {
  try {
    const chain = CHAIN_CONFIGS[blockchain as keyof typeof CHAIN_CONFIGS]
    if (!chain) {
      console.warn(`Chain not supported: ${blockchain}`)
      return { balance: '0', balanceFormatted: 0 }
    }

    const client = createPublicClient({
      chain,
      transport: http(getRpcUrl(blockchain)),
    })

    const balance = await client.getBalance({
      address: address as `0x${string}`,
    })

    const balanceFormatted = parseFloat(formatEther(balance))

    return {
      balance: balance.toString(),
      balanceFormatted,
    }
  } catch (error) {
    console.error(`Failed to fetch balance for ${blockchain}:`, error)
    return { balance: '0', balanceFormatted: 0 }
  }
}

/**
 * Get Solana balance using Solana Web3.js
 */
export const getSolanaBalance = async (
  address: string
): Promise<{ balance: string; balanceFormatted: number }> => {
  try {
    console.log(`🔍 Fetching Solana balance for: ${address}`)
    
    // Try multiple RPC endpoints for better reliability
    const rpcEndpoints = [
      'https://mainnet.helius-rpc.com/?api-key=',  // Helius (works without key for basic calls)
      'https://rpc.ankr.com/solana',
      'https://solana-mainnet.rpc.extrnode.com',
      'https://api.mainnet-beta.solana.com',
    ]
    
    let data = null
    let lastError = null
    
    // Try each endpoint until one succeeds
    for (const endpoint of rpcEndpoints) {
      try {
        console.log(`Trying Solana RPC: ${endpoint}`)
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'getBalance',
            params: [address],
          }),
        })

        data = await response.json()
        console.log('🔍 Solana RPC response:', data)
        
        // Check for successful response
        if (data.result && data.result.value !== undefined) {
          console.log(`✅ Successfully fetched from ${endpoint}`)
          break // Success, exit loop
        }
        
        // Check for error response
        if (data.error) {
          console.warn(`RPC returned error from ${endpoint}:`, data.error)
          lastError = new Error(data.error.message || 'RPC error')
          continue
        }
      } catch (err) {
        console.warn(`Failed to fetch from ${endpoint}:`, err)
        lastError = err
        continue // Try next endpoint
      }
    }
    
    if (!data || !data.result) {
      console.error('❌ All Solana RPC endpoints failed')
      throw lastError || new Error('All Solana RPC endpoints failed')
    }
    
    if (data.result && data.result.value !== undefined) {
      const lamports = data.result.value
      const sol = lamports / 1_000_000_000 // Convert lamports to SOL
      
      console.log(`✅ Solana balance: ${sol} SOL (${lamports} lamports)`)
      
      return {
        balance: lamports.toString(),
        balanceFormatted: sol,
      }
    }

    if (data.error) {
      console.error('Solana RPC error:', data.error)
    }

    return { balance: '0', balanceFormatted: 0 }
  } catch (error) {
    console.error('Failed to fetch Solana balance:', error)
    return { balance: '0', balanceFormatted: 0 }
  }
}

/**
 * Get Bitcoin balance using blockchain API
 */
export const getBitcoinBalance = async (
  address: string
): Promise<{ balance: string; balanceFormatted: number }> => {
  try {
    // Use blockchain.info API (free, no API key needed)
    const response = await fetch(`https://blockchain.info/q/addressbalance/${address}`)
    const satoshis = await response.text()
    const btc = parseInt(satoshis) / 100_000_000 // Convert satoshis to BTC
    
    return {
      balance: satoshis,
      balanceFormatted: btc,
    }
  } catch (error) {
    console.error('Failed to fetch Bitcoin balance:', error)
    return { balance: '0', balanceFormatted: 0 }
  }
}

/**
 * Get Sui balance
 */
export const getSuiBalance = async (
  address: string
): Promise<{ balance: string; balanceFormatted: number }> => {
  try {
    // Use Sui mainnet RPC
    const response = await fetch('https://fullnode.mainnet.sui.io:443', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'suix_getBalance',
        params: [address],
      }),
    })

    const data = await response.json()
    
    if (data.result?.totalBalance) {
      const balance = parseInt(data.result.totalBalance)
      const sui = balance / 1_000_000_000 // Convert MIST to SUI
      
      return {
        balance: balance.toString(),
        balanceFormatted: sui,
      }
    }

    return { balance: '0', balanceFormatted: 0 }
  } catch (error) {
    console.error('Failed to fetch Sui balance:', error)
    return { balance: '0', balanceFormatted: 0 }
  }
}

/**
 * Main function to get balance for any blockchain
 */
export const getBlockchainBalance = async (
  blockchain: string,
  address: string
): Promise<{ balance: string; balanceFormatted: number }> => {
  const normalizedBlockchain = blockchain.toLowerCase()

  // EVM chains
  const evmChains = [
    'ethereum',
    'polygon',
    'arbitrum',
    'avalanche',
    'binance-smart-chain',
    'optimism',
    'base',
    'linea',
    'fantom',
  ]

  if (evmChains.includes(normalizedBlockchain)) {
    return getEvmBalance(normalizedBlockchain, address)
  }

  // Solana
  if (normalizedBlockchain === 'solana') {
    return getSolanaBalance(address)
  }

  // Bitcoin
  if (normalizedBlockchain === 'bitcoin') {
    return getBitcoinBalance(address)
  }

  // Sui
  if (normalizedBlockchain === 'sui') {
    return getSuiBalance(address)
  }

  // Unsupported blockchain
  console.warn(`Balance fetching not implemented for: ${blockchain}`)
  return { balance: '0', balanceFormatted: 0 }
}


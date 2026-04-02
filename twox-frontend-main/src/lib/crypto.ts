'use client'

import ARB from '@/assets/currencies/arbitrum.svg'
import Avax from '@/assets/currencies/avalanche.svg'
import BNB from '@/assets/currencies/bnb.svg'
import BTC from '@/assets/currencies/btc.svg'
import DOGE from '@/assets/currencies/doge.svg'
import ETH from '@/assets/currencies/eth.svg'
import LTC from '@/assets/currencies/ltc.svg'
import Matic from '@/assets/currencies/matic.svg'
import TRON from '@/assets/currencies/tron.svg'
import USDT from '@/assets/currencies/usdt.svg'
import XRP from '@/assets/currencies/xrp.svg'
import Coinbase from '@/assets/logos/coinbase.svg'
import CreditCard from '@/assets/logos/credit-card.svg'
import Crypto from '@/assets/logos/crypto.svg'
import CS2 from '@/assets/logos/cs2.svg'
import GiftCard from '@/assets/logos/gift-card.svg'
import Metamask from '@/assets/logos/metamask.svg'
import Rust from '@/assets/logos/rust.svg'

import { CoinNetworkData } from '@/types/crypto'

export enum WALLET_MODAL_TABS {
  deposit = 'Deposit',
  // coupons = 'Coupons',
  // giftCard = 'Gift Card',
  withdraw = 'Withdraw',
}

export interface UsdtDepositAddress {
  address: string
  qrCode: string
}

type Tlogo = {
  [key: string]: any
}

export const LOGOS: Tlogo = {
  coinbase: Coinbase,
  'credit-card': CreditCard,
  crypto: Crypto,
  cs2: CS2,
  'gift-card': GiftCard,
  metamask: Metamask,
  rust: Rust,
}

export const BLOCKCHAIN_PROTOCOL_NAME = {
  BITCOIN: 'bitcoin',
  LITE_COIN: 'litecoin',
  DOGE_COIN: 'dogecoin',
  ETHEREUM: 'ethereum',
  XRP: 'xrp',
  BINANCE_SMART_CHAIN: 'binance-smart-chain',
  TRON: 'tron',
  POLYGON: 'polygon',
  AVALANCHE: 'avalanche',
  ARBITRUM: 'arbitrum',
  SOLANA: 'solana',
}

export enum USDT_NETWORKS {
  ERC20 = 'ERC20',
  BEP20 = 'BEP20',
  TRC20 = 'TRC20',
}

export enum ETH_NETWORKS {
  MAINNET = 'mainnet',
  SEPOLIA = 'sepolia',
  POLYGON = 'polygon',
  ARBITRUM = 'arbitrum',
  BASE = 'base',
  OPTIMISM = 'optimism',
}

export enum ETH_NETWORKS_IDS {
  mainnet = 1,
  sepolia = 11155111,
  polygon = 137,
  arbitrum = 42161,
  base = 8453,
  optimism = 10,
}

export const CRYPTO_TOKENS = {
  USDT: 'USDT',
}

export const CRYPTO_SYMBOLS = {
  [BLOCKCHAIN_PROTOCOL_NAME.BITCOIN]: 'BTC',
  [BLOCKCHAIN_PROTOCOL_NAME.LITE_COIN]: 'LTC',
  [BLOCKCHAIN_PROTOCOL_NAME.DOGE_COIN]: 'DOGE',
  [BLOCKCHAIN_PROTOCOL_NAME.ETHEREUM]: 'ETH',
  [BLOCKCHAIN_PROTOCOL_NAME.XRP]: 'XRP',
  [BLOCKCHAIN_PROTOCOL_NAME.BINANCE_SMART_CHAIN]: 'BNB',
  [BLOCKCHAIN_PROTOCOL_NAME.TRON]: 'TRX',
  [BLOCKCHAIN_PROTOCOL_NAME.POLYGON]: 'MATIC',
  [BLOCKCHAIN_PROTOCOL_NAME.AVALANCHE]: 'AVAX',
  [BLOCKCHAIN_PROTOCOL_NAME.ARBITRUM]: 'ARB',
}

export type Currency =
  | 'USDT'
  | 'BTC'
  | 'LTC'
  | 'DOGE'
  | 'XRP'
  | 'BNB'
  | 'TRX'
  | 'MATIC'
  | 'AVAX'
  | 'ARB'

export type EVM_CURRENCY = 'USDT' | 'AVAX' | 'ARB' | 'MATIC' | 'BNB' | 'ETH'

export const isERC20 = (currency: EVM_CURRENCY): boolean => {
  if (currency === 'USDT') return true
  return false
}

export const getTokenContractAddress = (
  currency: Currency,
  network: 'ethereum' | 'binance-smart-chain' | 'tron'
): `0x${string}` | string => {
  if (currency === 'USDT' && network === 'ethereum')
    return '0xdac17f958d2ee523a2206206994597c13d831ec7'
  if (currency === 'USDT' && network === 'binance-smart-chain')
    return '0x55d398326f99059ff775485246999027b3197955'
  if (currency === 'USDT' && network === 'tron')
    return 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'
  return ''
}

export const getChainIdByNetwork = (network: string): number => {
  if (network === 'mainnet') return 1
  if (network === 'sepolia') return 11155111
  if (network === 'polygon') return 137
  if (network === 'arbitrum') return 42161
  if (network === 'base') return 8453
  if (network === 'optimism') return 10
  return 0
}

export const getChainIdByNativeCurrency = (currency: EVM_CURRENCY): number => {
  if (currency === 'AVAX') return 43114
  if (currency === 'ARB') return 42161
  if (currency === 'MATIC') return 137
  if (currency === 'BNB') return 56
  if (currency === 'ETH') return 1
  return 0
}

export const getLogo = (name: string): { icon: any; title: string } => {
  return {
    icon: LOGOS[name.toLowerCase()],
    title: name,
  }
}

export const getCoinNetworkData = (blockchain: string): CoinNetworkData => {
  switch (blockchain) {
    case BLOCKCHAIN_PROTOCOL_NAME.ETHEREUM:
      return {
        icon: ETH,
        title: 'Ethereum',
        network: BLOCKCHAIN_PROTOCOL_NAME.ETHEREUM,
        symbol: CRYPTO_SYMBOLS[blockchain],
      }
    case BLOCKCHAIN_PROTOCOL_NAME.BITCOIN:
      return {
        icon: BTC,
        title: 'Bitcoin',
        symbol: CRYPTO_SYMBOLS[blockchain],
        network: BLOCKCHAIN_PROTOCOL_NAME.BITCOIN,
      }
    case BLOCKCHAIN_PROTOCOL_NAME.LITE_COIN:
      return {
        icon: LTC,
        title: 'Litecoin',
        symbol: CRYPTO_SYMBOLS[blockchain],
        network: BLOCKCHAIN_PROTOCOL_NAME.LITE_COIN,
      }
    case BLOCKCHAIN_PROTOCOL_NAME.DOGE_COIN:
      return {
        icon: DOGE,
        title: 'Dogecoin',
        symbol: CRYPTO_SYMBOLS[blockchain],
        network: BLOCKCHAIN_PROTOCOL_NAME.DOGE_COIN,
      }
    case BLOCKCHAIN_PROTOCOL_NAME.XRP:
      return {
        icon: XRP,
        title: 'XRP',
        symbol: CRYPTO_SYMBOLS[blockchain],
        network: BLOCKCHAIN_PROTOCOL_NAME.XRP,
      }
    case BLOCKCHAIN_PROTOCOL_NAME.BINANCE_SMART_CHAIN:
      return {
        icon: BNB,
        title: 'BNB',
        symbol: CRYPTO_SYMBOLS[blockchain],
        network: BLOCKCHAIN_PROTOCOL_NAME.BINANCE_SMART_CHAIN,
      }
    case BLOCKCHAIN_PROTOCOL_NAME.TRON:
      return {
        icon: TRON,
        title: 'TRON',
        symbol: CRYPTO_SYMBOLS[blockchain],
        network: BLOCKCHAIN_PROTOCOL_NAME.TRON,
      }
    case BLOCKCHAIN_PROTOCOL_NAME.POLYGON:
      return {
        icon: Matic,
        title: 'Polygon',
        symbol: CRYPTO_SYMBOLS[blockchain],
        network: BLOCKCHAIN_PROTOCOL_NAME.POLYGON,
      }
    case BLOCKCHAIN_PROTOCOL_NAME.AVALANCHE:
      return {
        icon: Avax,
        title: 'Avalanche',
        symbol: CRYPTO_SYMBOLS[blockchain],
        network: BLOCKCHAIN_PROTOCOL_NAME.AVALANCHE,
      }
    case BLOCKCHAIN_PROTOCOL_NAME.ARBITRUM:
      return {
        icon: ARB,
        title: 'Arbitrum',
        symbol: CRYPTO_SYMBOLS[blockchain],
        network: BLOCKCHAIN_PROTOCOL_NAME.ARBITRUM,
      }
    case CRYPTO_TOKENS.USDT:
      return {
        icon: USDT,
        title: 'USDT',
        symbol: 'USDT',
        network: 'USDT',
      }
    default:
      return {} as CoinNetworkData
  }
}

export const CRYPTO_WITHDRAW_COINS_TOKENS = [
  BLOCKCHAIN_PROTOCOL_NAME.BITCOIN,
  BLOCKCHAIN_PROTOCOL_NAME.ETHEREUM,
  BLOCKCHAIN_PROTOCOL_NAME.TRON,
  CRYPTO_TOKENS.USDT,
]

export const POPULAR_COINS = {
  usdt: CRYPTO_TOKENS.USDT,
  bitcoin: BLOCKCHAIN_PROTOCOL_NAME.BITCOIN,
  ethereum: BLOCKCHAIN_PROTOCOL_NAME.ETHEREUM,
}

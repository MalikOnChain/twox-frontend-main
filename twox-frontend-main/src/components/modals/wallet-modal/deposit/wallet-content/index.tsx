'use client'
import Image from 'next/image'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import { useEthereumWallet } from '@/context/features/wallet/wallet-connect-context'
import { useSocket } from '@/context/socket-context'
import { useUser } from '@/context/user-context'

import {
  BLOCKCHAIN_PROTOCOL_NAME,
  CRYPTO_SYMBOLS,
  CRYPTO_TOKENS,
  Currency,
  ETH_NETWORKS,
  EVM_CURRENCY,
  getCoinNetworkData,
  POPULAR_COINS,
  USDT_NETWORKS,
} from '@/lib/crypto'
import { SOCKET_NAMESPACES } from '@/lib/socket'

import Calculator from '@/components/modals/wallet-modal/deposit/wallet-content/calculator'
import QrCodeSection from '@/components/modals/wallet-modal/deposit/wallet-content/qr-code-section'
import { Button } from '@/components/ui/button'

import CurrencyContainer from './currency-container'
import DepositAddress from './deposit-address'

import { CryptoPrice } from '@/types/crypto'
interface UsdtDepositAddress {
  address: string
  qrCode: string
}

export default function WalletContent({
  depositType,
}: {
  depositType: string
}) {
  const { socket } = useSocket(SOCKET_NAMESPACES.PRICE)
  const { depositToken } = useEthereumWallet()

  const { depositAddresses } = useUser()
  const [cryptoPrices, setCryptoPrices] = useState<CryptoPrice | null>(null)
  const [selectedBlockchain, setSelectedBlockchain] = useState<string>(
    POPULAR_COINS.usdt
  )
  const [selectedUsdtNetwork] = useState<USDT_NETWORKS>(USDT_NETWORKS.ERC20)
  const listItems = useMemo(() => {
    if (!depositAddresses) return []
    const items = depositAddresses.map((addr) => {
      const networkData = getCoinNetworkData(addr.blockchain)
      return {
        ...networkData,
        symbol: CRYPTO_SYMBOLS[addr.blockchain],
        blockchain: addr.blockchain,
      }
    })
    return [
      ...items,
      {
        ...getCoinNetworkData(CRYPTO_TOKENS.USDT),
        symbol: CRYPTO_TOKENS.USDT,
        blockchain: CRYPTO_TOKENS.USDT,
      },
    ]
  }, [depositAddresses])

  const usdtDepositAddresses: UsdtDepositAddress | null = useMemo(() => {
    if (!depositAddresses) return null
    const ethereumAddress = depositAddresses.find(
      (addr) => addr.blockchain === BLOCKCHAIN_PROTOCOL_NAME.ETHEREUM
    )
    return {
      address: ethereumAddress?.address || '',
      qrCode: ethereumAddress?.qrCode || '',
    }
  }, [depositAddresses])

  const selectedAddress = useMemo(() => {
    if (selectedBlockchain === CRYPTO_TOKENS.USDT && usdtDepositAddresses) {
      return usdtDepositAddresses
    }

    if (!depositAddresses) return null
    return depositAddresses.find(
      (addr) => addr.blockchain === selectedBlockchain
    )
  }, [selectedBlockchain, usdtDepositAddresses, depositAddresses])

  const selectedNetworkData = useMemo(() => {
    const data = getCoinNetworkData(selectedBlockchain)
    let symbol = CRYPTO_SYMBOLS[selectedBlockchain]
    if (selectedBlockchain === CRYPTO_TOKENS.USDT) {
      symbol = CRYPTO_TOKENS.USDT
    }
    return { ...data, symbol }
  }, [selectedBlockchain])

  const [depositAmount, setDepositAmount] = useState('1')
  const [selectedNetwork, setSelectedNetwork] = useState<any>(() => {
    if (CRYPTO_SYMBOLS[selectedBlockchain] === 'ETH') {
      return ETH_NETWORKS.MAINNET // Always default to MAINNET for ETH
    } else if (CRYPTO_SYMBOLS[selectedBlockchain] === 'USDT') {
      return USDT_NETWORKS.ERC20 // Always default to ERC20 for USDT
    }
    return null
  })

  const handleCopy = (): void => {
    if (selectedAddress?.address) {
      navigator.clipboard.writeText(selectedAddress.address)
      toast.success(`Address was copied successfully`)
    }
  }

  const handleDeposit = useCallback(async () => {
    const evmCurrencies: EVM_CURRENCY[] = [
      'USDT',
      'AVAX',
      'ARB',
      'MATIC',
      'BNB',
      'ETH',
    ]
    const symbol = selectedNetworkData.symbol as Currency

    if (depositToken && evmCurrencies.includes(symbol as EVM_CURRENCY)) {
      try {
        await depositToken({
          depositAddress: selectedAddress?.address as `0x${string}`,
          currency: symbol as EVM_CURRENCY,
          network: selectedNetwork,
          amount: depositAmount,
          walletType:
            depositType === 'Coinbase' ? 'coinbaseWallet' : 'metaMask',
        })
      } catch (error) {
        console.error(error)
        toast.error('Failed to deposit token')
      }
    } else {
      toast.error('Selected currency is not supported for direct deposit')
    }
  }, [
    selectedNetwork,
    depositToken,
    selectedAddress,
    selectedNetworkData,
    depositAmount,
    depositType,
  ])

  useEffect(() => {
    setSelectedNetwork(
      CRYPTO_SYMBOLS[selectedBlockchain] === 'ETH'
        ? ETH_NETWORKS.MAINNET
        : CRYPTO_SYMBOLS[selectedBlockchain] === 'USDT'
          ? USDT_NETWORKS.ERC20
          : null
    )
  }, [selectedBlockchain])

  useEffect(() => {
    if (socket) {
      socket.emit('price:getAll')
      socket.on('price:updateAll', (prices: CryptoPrice) => {
        setCryptoPrices(prices)
      })
    }
  }, [socket])

  return (
    <div className='grid w-full grid-cols-1 gap-3'>
      <div className='col-span-1 flex items-center justify-center'>
        <div className='relative'>
          <div className='flex size-[100px] items-center justify-center rounded-lg bg-secondary-700 md:size-[124px]'>
            {depositType === 'Coinbase' ? (
              <Image
                width={0}
                height={0}
                sizes='100vw'
                alt={depositType}
                className='size-[100px] md:size-[124px]'
                src='/wallets/coinbase.svg'
              />
            ) : (
              <Image
                width={0}
                height={0}
                sizes='100vw'
                alt={depositType}
                className='size-[100px] md:size-[124px]'
                src='/wallets/metamask.svg'
              />
            )}
          </div>
        </div>
      </div>

      <CurrencyContainer
        selectedBlockchain={selectedBlockchain}
        setSelectedBlockchain={setSelectedBlockchain}
        selectedNetworkData={selectedNetworkData}
        listItems={listItems}
        selectedNetwork={selectedNetwork}
        setSelectedNetwork={setSelectedNetwork}
      />

      <DepositAddress
        selectedAddress={selectedAddress}
        handleCopy={handleCopy}
      />

      {selectedAddress?.qrCode && (
        <QrCodeSection
          selectedAddress={selectedAddress}
          selectedBlockchain={selectedBlockchain}
          selectedUsdtNetwork={selectedUsdtNetwork}
          selectedNetworkData={selectedNetworkData}
        />
      )}

      <Calculator
        selectedNetworkData={selectedNetworkData}
        cryptoPrices={cryptoPrices}
        depositAmount={depositAmount}
        setDepositAmount={setDepositAmount}
      />

      <Button
        onClick={handleDeposit}
        className='flex h-full w-full items-center gap-2 rounded-md bg-primary md:py-3 md:text-base'
      >
        Deposit
      </Button>
    </div>
  )
}

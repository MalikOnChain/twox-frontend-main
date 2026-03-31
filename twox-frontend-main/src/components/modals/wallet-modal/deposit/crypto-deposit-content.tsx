import Image from 'next/image'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import { useInitialSettingsContext } from '@/context/initial-settings-context'
import { useSocket } from '@/context/socket-context'
import { useUser } from '@/context/user-context'
import { useWalletModal } from '@/context/wallet-modal-context'

import {
  BLOCKCHAIN_PROTOCOL_NAME,
  CRYPTO_SYMBOLS,
  CRYPTO_TOKENS,
  USDT_NETWORKS,
} from '@/lib/crypto'
import { SOCKET_NAMESPACES } from '@/lib/socket'

import { Input } from '@/components/ui/input'

import ClipboardIcon from '@/assets/clipboard.svg'
import ExchangeIcon from '@/assets/deposits/icons/exchange-icon.svg'
import InformationIcon from '@/assets/deposits/icons/information.svg'

import { CryptoPrice } from '@/types/crypto'

const formatPrice = (price: number, symbol: string) => {
  if (symbol === CRYPTO_SYMBOLS[BLOCKCHAIN_PROTOCOL_NAME.BITCOIN]) {
    return Number(price).toFixed(8)
  }
  return Number(price).toFixed(6)
}

interface UsdtDepositAddress {
  address: string
  qrCode: string
}

const CryptoDepositContent: React.FC = () => {
  const { depositAddresses } = useUser()
  const { activeCrypto } = useWalletModal()
  const [cryptoPrices, setCryptoPrices] = useState<CryptoPrice | null>(null)
  const { settings } = useInitialSettingsContext()
  const usdtDepositAddresses: Record<USDT_NETWORKS, UsdtDepositAddress> | null =
    useMemo(() => {
      if (!depositAddresses) return null
      const ethereumAddress = depositAddresses.find(
        (addr) => addr.blockchain === BLOCKCHAIN_PROTOCOL_NAME.ETHEREUM
      )
      const bnbAddress = depositAddresses.find(
        (addr) =>
          addr.blockchain === BLOCKCHAIN_PROTOCOL_NAME.BINANCE_SMART_CHAIN
      )
      const tronAddress = depositAddresses.find(
        (addr) => addr.blockchain === BLOCKCHAIN_PROTOCOL_NAME.TRON
      )
      return {
        [USDT_NETWORKS.ERC20]: {
          address: ethereumAddress?.address || '',
          qrCode: ethereumAddress?.qrCode || '',
        },
        [USDT_NETWORKS.BEP20]: {
          address: bnbAddress?.address || '',
          qrCode: bnbAddress?.qrCode || '',
        },
        [USDT_NETWORKS.TRC20]: {
          address: tronAddress?.address || '',
          qrCode: tronAddress?.qrCode || '',
        },
      }
    }, [depositAddresses])

  const { socket } = useSocket(SOCKET_NAMESPACES.PRICE)

  const selectedAddress = useMemo(() => {
    if (!activeCrypto) return null

    if (activeCrypto.network === CRYPTO_TOKENS.USDT && usdtDepositAddresses) {
      return usdtDepositAddresses[USDT_NETWORKS.ERC20]
    }

    if (!depositAddresses) return null
    return depositAddresses.find(
      (addr) => addr.blockchain === activeCrypto.network
    )
  }, [usdtDepositAddresses, depositAddresses, activeCrypto])

  const handleCopy = (): void => {
    if (selectedAddress?.address) {
      navigator.clipboard.writeText(selectedAddress.address)
      toast.success(`Address was copied successfully`)
    }
  }

  const getPriceInUsd = useCallback(() => {
    if (socket) {
      socket.emit('price:getAll')
    }
  }, [socket])

  useEffect(() => {
    getPriceInUsd()
    if (socket) {
      socket.on('price:updateAll', (prices: CryptoPrice) => {
        setCryptoPrices(prices)
      })
    }
  }, [socket, getPriceInUsd])

  const minDepositAmount = useMemo(() => {
    if (
      !activeCrypto ||
      !settings ||
      !cryptoPrices ||
      !cryptoPrices[activeCrypto.symbol]
    )
      return 1
    return formatPrice(
      settings.depositMinAmount *
        Number(cryptoPrices[activeCrypto.symbol].price) || 1,
      activeCrypto.symbol
    )
  }, [activeCrypto, settings, cryptoPrices])

  if (!activeCrypto) return <></>

  return (
    <div className='grid w-full grid-rows-1 gap-3 p-0'>
      <div className='flex items-center rounded-xl bg-background p-3'>
        <activeCrypto.icon className='mr-[10px] h-[46px] w-[46px]' />
        <div className='flex-1'>
          <div className='text-base text-foreground'>{activeCrypto.title}</div>
          <div className='text-sm font-medium text-secondary-text'>
            {activeCrypto.symbol}
          </div>
        </div>
      </div>

      <div className='flex h-full w-full flex-col gap-2 overflow-y-auto px-[1px]'>
        {/* Currency */}

        {selectedAddress?.qrCode && (
          <div className='my-2 flex w-full justify-center md:my-4'>
            <Image
              width={0}
              height={0}
              src={selectedAddress?.qrCode || ''}
              alt={`QR Code for ${activeCrypto.title}`}
              className='h-[150px] w-[150px] rounded-lg'
            />
          </div>
        )}

        {/* Deposit Address */}
        <div>
          <div className='mb-[6px] text-xs font-medium text-muted-foreground'>
            Your {activeCrypto.title} deposit address
          </div>
          <Input
            readOnly
            value={selectedAddress?.address || ''}
            placeholder='Address'
            className='font-mono'
            wrapperClassName='!h-[46px]'
            endAddon={
              <span
                className='translate-x-[2px] cursor-pointer hover:text-primary'
                onClick={handleCopy}
              >
                <ClipboardIcon className='h-[34px] w-[34px] text-primary hover:text-primary-600 active:text-primary-400' />
              </span>
            }
          />

          <div className='mt-2 flex items-center justify-between text-xs'>
            <span className='text-muted-foreground'>
              Minimum deposit value:
            </span>
            <span className='font-medium text-foreground'>
              {minDepositAmount}
              &nbsp;
              {activeCrypto.symbol}
            </span>
          </div>
        </div>

        <div className='mt-4 flex flex-col gap-2'>
          <div className='text-base font-medium text-muted-foreground text-white'>
            Token Calculator
          </div>
          <div className='grid grid-cols-11 gap-2'>
            <div className='col-span-5 space-y-1'>
              <div className='text-xs font-medium text-muted-foreground'>
                BST Token
              </div>
              <Input value={cryptoPrices ? '1' : ''} />
            </div>
            <div className='col-span-1 mt-4 flex items-center justify-center space-y-1'>
              <ExchangeIcon />
            </div>
            <div className='col-span-5 space-y-1'>
              <div className='text-xs font-medium text-muted-foreground'>
                {activeCrypto.title}&nbsp;({activeCrypto.symbol})
              </div>
              <Input
                startAddon={
                  <>
                    {activeCrypto.icon && (
                      <span>
                        <activeCrypto.icon className='h-5 w-5' />
                      </span>
                    )}
                  </>
                }
                value={
                  cryptoPrices
                    ? formatPrice(
                        Number(cryptoPrices[activeCrypto.symbol]?.price) * 1,
                        activeCrypto.symbol
                      )
                    : ''
                }
              />
            </div>
          </div>

          <div className='flex items-center gap-1'>
            <span>
              <InformationIcon />
            </span>
            <span className='text-xs tracking-tight text-muted-foreground sm:tracking-normal md:text-xs'>
              The exchange rate shown above is an estimate.
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CryptoDepositContent

import React, { memo } from 'react'

import { CRYPTO_SYMBOLS, CRYPTO_TOKENS } from '@/lib/crypto'
import { ETH_NETWORKS } from '@/lib/crypto'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const CurrencyContainer = ({
  selectedBlockchain,
  setSelectedBlockchain,
  selectedNetworkData,
  listItems,
  selectedNetwork,
  setSelectedNetwork,
}: {
  selectedBlockchain: string
  setSelectedBlockchain: (blockchain: string) => void
  selectedNetworkData: any
  listItems: any
  selectedNetwork: string
  setSelectedNetwork: (network: string) => void
}) => {
  const evmListItems = listItems?.filter((item: any) => {
    let symbol = CRYPTO_SYMBOLS[item.blockchain]
    if (!symbol) {
      symbol = CRYPTO_TOKENS.USDT
    }

    return ['ETH', 'BNB', 'MATIC', 'AVAX', 'ARB', 'USDT'].includes(symbol)
  })

  // Get current currency symbol
  const currentSymbol = CRYPTO_SYMBOLS[selectedBlockchain] || CRYPTO_TOKENS.USDT

  // Determine if we need to show network selection
  const showNetworkSelect = currentSymbol === 'ETH' // Only show network select for ETH, not for USDT

  // Get network options based on currency
  const networkOptions =
    currentSymbol === 'ETH' ? Object.values(ETH_NETWORKS) : [] // Empty array for USDT since we only use ERC20

  return (
    <div className='space-y-2'>
      <div>
        <div className='px-1 text-xs font-medium text-muted-foreground'>
          Currency
        </div>
        <Select
          value={selectedBlockchain}
          onValueChange={setSelectedBlockchain}
        >
          <SelectTrigger className='w-full'>
            <SelectValue>
              {selectedNetworkData.icon && (
                <div className='flex items-start gap-2'>
                  <selectedNetworkData.icon className='h-5 w-5' />
                  <div className='text-start'>
                    <div>{`${selectedNetworkData.title}`}</div>
                  </div>
                </div>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {evmListItems?.map((item: any) => (
              <SelectItem key={item.blockchain} value={item.blockchain}>
                <div className='flex items-start gap-2 text-left'>
                  <item.icon className='h-5 w-5' />
                  <div>
                    <div>{`${item.title}`}</div>
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {showNetworkSelect && (
        <div>
          <div className='px-1 text-xs font-medium text-muted-foreground'>
            Network
          </div>
          <Select value={selectedNetwork} onValueChange={setSelectedNetwork}>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Select network' />
            </SelectTrigger>
            <SelectContent>
              {networkOptions.map((network) => (
                <SelectItem key={network} value={network}>
                  {network}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Display fixed ERC-20 for USDT */}
      {currentSymbol === 'USDT' && (
        <div>
          <div className='px-1 text-xs font-medium text-muted-foreground'>
            Network
          </div>
          <div className='flex h-10 w-full items-center rounded-md border border-input bg-background px-3 py-2 text-sm'>
            ERC-20
          </div>
        </div>
      )}
    </div>
  )
}

export default memo(CurrencyContainer)

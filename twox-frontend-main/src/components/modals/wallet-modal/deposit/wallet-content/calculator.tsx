import React, { memo, useEffect, useState } from 'react'

import CoinIcon from '@/components/templates/icons/coin-icon'
import { Input } from '@/components/ui/input'

import ExchangeIcon from '@/assets/deposits/icons/exchange-icon.svg'

const Calculator = ({
  selectedNetworkData,
  cryptoPrices,
  depositAmount,
  setDepositAmount,
}: {
  selectedNetworkData: any
  cryptoPrices: any
  depositAmount: string
  setDepositAmount: (amount: string) => void
}) => {
  const [networkAmount, setNetworkAmount] = useState(depositAmount)
  const [bscAmount, setBscAmount] = useState('')

  useEffect(() => {
    if (cryptoPrices && cryptoPrices[selectedNetworkData.symbol]?.price) {
      const price = cryptoPrices[selectedNetworkData.symbol].price
      const calculatedBsc = (Number(networkAmount) / Number(price)).toFixed(6)
      setBscAmount(calculatedBsc)
    }
  }, [networkAmount, cryptoPrices, selectedNetworkData.symbol])

  const handleNetworkAmountChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNetworkAmount(e.target.value)
    setDepositAmount(e.target.value)
  }

  return (
    <div className='flex flex-col gap-2'>
      <div className='text-base font-medium text-muted-foreground text-white'>
        Coin Calculator
      </div>
      <div className='grid grid-cols-11 gap-2'>
        <div className='col-span-5 space-y-1'>
          <div className='text-xs font-medium text-muted-foreground'>
            {selectedNetworkData.title}
          </div>
          <Input
            startAddon={
              <>
                {selectedNetworkData.icon && (
                  <span>
                    <selectedNetworkData.icon className='h-5 w-5' />
                  </span>
                )}
              </>
            }
            value={networkAmount}
            onChange={handleNetworkAmountChange}
            type='number'
          />
        </div>
        <div className='col-span-1 mt-4 flex items-center justify-center space-y-1'>
          <ExchangeIcon />
        </div>
        <div className='col-span-5 space-y-1'>
          <div className='text-xs font-medium text-muted-foreground'>
            BSC Token
          </div>
          <Input
            startAddon={
              <span>
                <CoinIcon />
              </span>
            }
            value={bscAmount}
            readOnly
          />
        </div>
      </div>
    </div>
  )
}

export default memo(Calculator)

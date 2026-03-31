import Image from 'next/image'
import { memo } from 'react'

import { CRYPTO_TOKENS } from '@/lib/crypto'

const QRCodeSection = ({
  selectedAddress,
  selectedBlockchain,
  selectedUsdtNetwork,
  selectedNetworkData,
}: {
  selectedAddress: any
  selectedBlockchain: string
  selectedUsdtNetwork: string
  selectedNetworkData: any
}) => {
  return (
    <div className='grid grid-rows-1 gap-3'>
      <div className='flex w-full items-center gap-2'>
        <Image
          width={0}
          height={0}
          src={selectedAddress?.qrCode || ''}
          alt={`QR Code for ${
            selectedBlockchain === CRYPTO_TOKENS.USDT
              ? `USDT ${selectedUsdtNetwork}`
              : selectedNetworkData.title
          }`}
          className='h-[100px] w-[100px] rounded-lg bg-secondary md:h-[124px] md:w-[124px]'
        />
        <div className='grid h-full flex-1 grid-cols-1 gap-2 rounded-md bg-background-secondary px-2 py-2 md:grid-rows-1 md:py-3'>
          <span className='text-xs text-muted-foreground md:text-sm'>
            Send the amount of Ethereum of your choice to the following address
            to receive the equivalent in coins.
          </span>
          <span className='w-full text-xs text-muted-foreground text-white md:text-base'>
            Minimum deposit: $10.00 US
            <br />
            Required confirmations: 12
          </span>
        </div>
      </div>
    </div>
  )
}

export default memo(QRCodeSection)

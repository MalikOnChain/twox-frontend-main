import { Copy } from 'lucide-react'
import React from 'react'

import { Input } from '@/components/ui/input'

const DepositAddress = ({
  selectedAddress,
  handleCopy,
}: {
  selectedAddress: any
  handleCopy: () => void
}) => {
  return (
    <div>
      <div className='px-1 text-xs font-medium text-muted-foreground'>
        Deposit Address
      </div>
      <Input
        readOnly
        value={selectedAddress?.address || ''}
        placeholder='Address'
        className='font-mono'
        endAddon={
          <span
            className='cursor-pointer hover:text-primary'
            onClick={handleCopy}
          >
            <Copy className='h-4 w-4' />
          </span>
        }
      />
    </div>
  )
}

export default DepositAddress

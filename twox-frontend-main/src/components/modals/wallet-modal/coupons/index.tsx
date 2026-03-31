import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import BitStakeIcon from '@/assets/deposits/bitstake.svg'

export default function CouponsContent() {
  return (
    <>
      <div className='grid w-full grid-cols-1 gap-3 overflow-hidden'>
        <div className='col-span-1 flex flex-col items-center justify-center rounded-md'>
          <BitStakeIcon className='h-20 w-auto md:h-44' />
          <div className='text-base'>Redeem Coupon Code</div>
        </div>
        <Input placeholder='Enter coupon code' />
        <Button className='mb-3 flex h-full w-full items-center gap-2 rounded-md py-2 text-base'>
          <span className='text-sm'>Redeem</span>
        </Button>
      </div>
    </>
  )
}

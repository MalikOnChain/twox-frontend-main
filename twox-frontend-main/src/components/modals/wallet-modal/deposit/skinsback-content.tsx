import { Button } from '@/components/ui/button'

import DepositIcon from '@/assets/deposits/icons/deposit.svg'
import SkinsbackIcon from '@/assets/logos/skinsback.svg'

export default function SkinsbackContent() {
  return (
    <>
      <div className='grid w-full grid-cols-1 gap-3'>
        <div className='col-span-1 flex items-center justify-center rounded-md bg-secondary-700 px-12 py-3'>
          <SkinsbackIcon className='h-10 w-auto' />
        </div>
        <div className='col-span-1 flex items-center justify-start'>
          <div className='text-sm'>
            Click the button below to open a new tab and deposit skins using
            Skinsback.
          </div>
        </div>
        <Button className='flex h-full w-full items-center gap-2 rounded-md py-3 text-base'>
          <DepositIcon className='h-4 w-4' />
          <span>Deposit Skins</span>
        </Button>
      </div>
    </>
  )
}

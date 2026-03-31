'use client'

import { memo } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface GameDepositModal {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function GameDepositModal({ open, onOpenChange }: GameDepositModal) {
  const handleOpenChange = (open: boolean) => {
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild className='hidden'>
        <Button variant='outline'>Deposit via Game</Button>
      </DialogTrigger>
      <DialogContent
        aria-describedby='wallet modal'
        className='w-full overflow-hidden px-4 md:max-w-[450px]'
      >
        <DialogTitle>Deposit via Game</DialogTitle>
        <div className='w-full'>
          <iframe
            src='https://skinsback.com/_/pay/61caaa62956ba5b8bc4134acfc8cfefd'
            style={{ width: '850px', height: '600px', border: 'none' }}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default memo(GameDepositModal)

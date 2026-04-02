'use client'

import { X } from 'lucide-react'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import { CustomModal } from '@/components/ui/modal'

import closedIcon from '@/assets/landing-page/closed.png'

interface RegistrationClosedModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function RegistrationClosedModal({ open, onOpenChange }: RegistrationClosedModalProps) {
  return (
    <CustomModal
      isOpen={open}
      onRequestClose={() => onOpenChange(false)}
      contentLabel='Registration Closed Modal'
      isCentered={true}
    >
      <div
        className='relative flex flex-col rounded-xl bg-[#1a1a1d] md:p-8 p-4'
        style={{
          width: '448px',
          height: 'auto',
          minHeight: '300px',
          maxHeight: '80vh',
          maxWidth: '90vw',
        }}
      >
        {/* Close Button */}
        <Button
          variant='icon'
          size='icon'
          onClick={() => onOpenChange(false)}
          className='absolute right-2 top-2 z-10 h-8 w-8 p-2 rounded-full text-white hover:bg-white/10 md:right-4 md:top-4'
        >
          <X className='h-4 w-4' />
        </Button>

        {/* Scrollable Content */}
        <div className='flex-1 overflow-y-auto pr-2 md:pr-0'>
          {/* Icon */}
          <div className='mb-4 flex justify-center md:mb-6'>
            <div className='relative h-20 w-20 md:h-24 md:w-24'>
              <Image src={closedIcon} alt='Registration Closed' fill className='object-contain' quality={90} />
            </div>
          </div>

          {/* Title */}
          <h2
            className='mb-3 text-center text-xl font-bold text-white md:mb-4 md:text-2xl'
            style={{
              fontFamily: 'var(--font-stolzl), sans-serif',
              fontWeight: 700,
            }}
          >
            Registration closed
          </h2>

          {/* Message */}
          <p
            className='text-center text-sm text-white md:text-base'
            style={{
              fontFamily: 'var(--font-satoshi), sans-serif',
              fontWeight: 400,
              fontSize: 'inherit',
              lineHeight: '150%',
            }}
          >
            If you have filled out the form, please wait for access to the Beta - your benefits and rewards are waiting
            for you
          </p>
        </div>
      </div>
    </CustomModal>
  )
}


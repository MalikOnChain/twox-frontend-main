'use client'

import { X } from 'lucide-react'
import Image from 'next/image'

import { CustomModal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'

import crownIcon from '@/assets/landing-page/crown.png'
import TelegramIcon from '@/assets/social/telegram-colored.svg'

interface ThanksForRegisteringModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function ThanksForRegisteringModal({ open, onOpenChange }: ThanksForRegisteringModalProps) {
  const handleTelegramClick = () => {
    window.open('https://t.me/twoxggcasino', '_blank', 'noopener,noreferrer')
  }

  return (
    <CustomModal
      isOpen={open}
      onRequestClose={() => onOpenChange(false)}
      contentLabel='Thanks for Registering Modal'
      isCentered={true}
    >
      <div
        className='relative flex flex-col rounded-xl bg-[#1a1a1d] md:p-8 p-4'
        style={{
          width: '640px',
          height: '80vh',
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
          {/* Content */}
          <div className='flex flex-col items-center text-center'>
            {/* Golden Crown Icon */}
            <div className='relative mb-4 h-20 w-20 md:mb-6 md:h-32 md:w-32'>
            <Image
              src={crownIcon}
              alt='Golden Crown'
              fill
              className='object-contain'
              quality={90}
            />
          </div>

            {/* Main Title */}
            <h2
              className='mb-3 text-xl font-bold text-white md:mb-4 md:text-3xl'
              style={{
                fontFamily: 'var(--font-stolzl), sans-serif',
                fontWeight: 700,
              }}
            >
              🎉 Thanks for Registering for the Beta!
            </h2>

            {/* Confirmation Message */}
            <div className='mb-4 space-y-2 md:mb-6'>
              <p
                className='text-sm text-white md:text-lg'
                style={{
                  fontFamily: 'var(--font-satoshi), sans-serif',
                  fontWeight: 400,
                  lineHeight: '150%',
                }}
              >
                You&apos;re officially on the list!
              </p>
              <p
                className='text-sm text-white md:text-lg'
                style={{
                  fontFamily: 'var(--font-satoshi), sans-serif',
                  fontWeight: 400,
                  lineHeight: '150%',
                }}
              >
                We&apos;ll be rolling out beta access in phases, and you&apos;ll be
              </p>
              <p
                className='text-sm text-white md:text-lg'
                style={{
                  fontFamily: 'var(--font-satoshi), sans-serif',
                  fontWeight: 400,
                  lineHeight: '150%',
                }}
              >
                among the first to know.
              </p>
            </div>

            {/* Call to Action Header */}
            <h3
              className='mb-3 text-base font-bold text-white md:mb-4 md:text-xl'
              style={{
                fontFamily: 'var(--font-stolzl), sans-serif',
                fontWeight: 700,
              }}
            >
              To stay up to date:
            </h3>

            {/* Instructions */}
            <div className='mb-6 space-y-2 text-left md:mb-8 md:space-y-3'>
              <div className='flex items-start gap-2 md:gap-3'>
                <span className='mt-1 text-white'>•</span>
                <p
                  className='flex-1 text-sm text-white md:text-lg'
                  style={{
                    fontFamily: 'var(--font-satoshi), sans-serif',
                    fontWeight: 400,
                    lineHeight: '150%',
                  }}
                >
                  Join our Telegram channel for real-time announcements
                </p>
              </div>
              <div className='flex items-start gap-2 md:gap-3'>
                <span className='mt-1 text-white'>•</span>
                <p
                  className='flex-1 text-sm text-white md:text-lg'
                  style={{
                    fontFamily: 'var(--font-satoshi), sans-serif',
                    fontWeight: 400,
                    lineHeight: '150%',
                  }}
                >
                  Keep an eye on your email for beta access and updates
                </p>
              </div>
            </div>

            {/* Telegram Button */}
            <Button
              onClick={handleTelegramClick}
              size='lg'
              className='w-full min-h-11 flex items-center justify-center gap-2'
              variant='secondary2'
            >
              <span>Telegram</span>
              <TelegramIcon className='h-5 w-5 fill-white' />
            </Button>
          </div>
        </div>
      </div>
    </CustomModal>
  )
}


'use client'

import { X } from 'lucide-react'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import { CustomModal } from '@/components/ui/modal'

import diceIcon from '@/assets/landing-page/dice.png'
import goldIcon from '@/assets/landing-page/gold.png'
import moneyIcon from '@/assets/landing-page/money.png'

interface ExtraPointsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function ExtraPointsModal({ open, onOpenChange }: ExtraPointsModalProps) {
  return (
    <CustomModal
      isOpen={open}
      onRequestClose={() => onOpenChange(false)}
      contentLabel='Extra Points in Beta Modal'
      isCentered={true}
    >
      <div
        className='relative flex flex-col rounded-xl bg-[#1a1a1d] md:p-8 p-4'
        style={{
          width: '710px',
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
          {/* Title */}
          <h2
            className='mb-3 pr-8 text-xl font-bold text-white border-b border-gray-400/30 pb-3 md:mb-4 md:pr-12 md:text-2xl md:pb-4'
            style={{
              fontFamily: 'var(--font-stolzl), sans-serif',
              fontWeight: 700,
            }}
          >
            Enjoy 25% Extra Points in Beta
          </h2>

          {/* Subtitle */}
          <p
            className='mb-6 text-sm text-white md:mb-8 md:text-base'
            style={{
              fontFamily: 'var(--font-satoshi), sans-serif',
              fontWeight: 400,
              fontSize: 'inherit',
              lineHeight: '150%',
            }}
          >
            Join the Two X drop under the best conditions and earn more Two X tokens.
          </p>

          {/* Main Section Title */}
          <h3
            className='mb-4 text-lg font-bold text-white md:mb-6 md:text-xl'
            style={{
              fontFamily: 'var(--font-stolzl), sans-serif',
              fontWeight: 700,
            }}
          >
            Unlock unique benefits of the Two X token
          </h3>

          {/* Benefit Cards */}
          <div className='space-y-3 md:space-y-4'>
            {/* Benefit Card 1: Profit-sharing model */}
            <div
              className='flex items-start gap-3 rounded-lg p-3 border border-gray-400/30 md:gap-4 md:p-4'
              style={{
                backgroundColor: '#2a2a2d',
              }}
            >
              <div className='relative h-12 w-12 flex-shrink-0 md:h-16 md:w-16'>
                <Image src={goldIcon} alt='Gold Bars' fill className='object-contain' quality={90} />
              </div>
              <div className='flex-1'>
                <h4
                  className='mb-1 text-base font-bold text-white md:mb-2 md:text-lg'
                  style={{
                    fontFamily: 'var(--font-stolzl), sans-serif',
                    fontWeight: 700,
                  }}
                >
                  Profit-sharing model
                </h4>
                <p
                  className='text-sm text-white md:text-base'
                  style={{
                    fontFamily: 'var(--font-satoshi), sans-serif',
                    fontWeight: 400,
                    fontSize: 'inherit',
                    lineHeight: '150%',
                  }}
                >
                  Two X will allocate 50% of its Net Gaming Revenue (NGR) in USDT to Two X token holders on a regular
                  basis.
                </p>
              </div>
            </div>

            {/* Benefit Card 2: Exclusive products featuring 100% RTP */}
            <div
              className='flex items-start gap-3 rounded-lg p-3 border border-gray-400/30 md:gap-4 md:p-4'
              style={{
                backgroundColor: '#2a2a2d',
              }}
            >
              <div className='relative h-12 w-12 flex-shrink-0 md:h-16 md:w-16'>
                <Image src={diceIcon} alt='Dice' fill className='object-contain' quality={90} />
              </div>
              <div className='flex-1'>
                <h4
                  className='mb-1 text-base font-bold text-white md:mb-2 md:text-lg'
                  style={{
                    fontFamily: 'var(--font-stolzl), sans-serif',
                    fontWeight: 700,
                  }}
                >
                  Exclusive products featuring 100% RTP
                </h4>
                <p
                  className='text-sm text-white md:text-base'
                  style={{
                    fontFamily: 'var(--font-satoshi), sans-serif',
                    fontWeight: 400,
                    fontSize: 'inherit',
                    lineHeight: '150%',
                  }}
                >
                  Two X token holders will gain access to unique products with 100% RTP.
                </p>
              </div>
            </div>

            {/* Benefit Card 3: Long-term benefits for holding Two X */}
            <div
              className='flex items-start gap-3 rounded-lg p-3 border border-gray-400/30 md:gap-4 md:p-4'
              style={{
                backgroundColor: '#2a2a2d',
              }}
            >
              <div className='relative h-12 w-12 flex-shrink-0 md:h-16 md:w-16'>
                <Image src={moneyIcon} alt='Money' fill className='object-contain' quality={90} />
              </div>
              <div className='flex-1'>
                <h4
                  className='mb-1 text-base font-bold text-white md:mb-2 md:text-lg'
                  style={{
                    fontFamily: 'var(--font-stolzl), sans-serif',
                    fontWeight: 700,
                  }}
                >
                  Long-term benefits for holding Two X.
                </h4>
                <p
                  className='text-sm text-white md:text-base'
                  style={{
                    fontFamily: 'var(--font-satoshi), sans-serif',
                    fontWeight: 400,
                    fontSize: 'inherit',
                    lineHeight: '150%',
                  }}
                >
                  Two X will allocate 50% of its Net Gaming Revenue (NGR) in USDT to Two X token holders on a regular
                  basis.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CustomModal>
  )
}


'use client'

import { X, Info } from 'lucide-react'

import { CustomModal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'

interface BugBountyModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function BugBountyModal({ open, onOpenChange }: BugBountyModalProps) {
  return (
    <CustomModal
      isOpen={open}
      onRequestClose={() => onOpenChange(false)}
      contentLabel='Bug Bounty Program Modal'
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
            className='mb-4 pr-8 text-xl font-bold text-white md:mb-6 md:pr-12 md:text-2xl'
            style={{
              fontFamily: 'var(--font-stolzl), sans-serif',
              fontWeight: 700,
            }}
          >
            Two X Bug Bounty Program
          </h2>

          {/* Introductory Text */}
          <p
            className='mb-6 text-sm text-white md:mb-8 md:text-base'
            style={{
              fontFamily: 'var(--font-satoshi), sans-serif',
              fontWeight: 400,
              fontSize: 'inherit',
              lineHeight: '150%',
            }}
          >
            Join Two X&apos;s bug bounty program and earn rewards for every bug you report to our team. Two X uses a clear
            three-level system to classify bugs by their severity and impact.
          </p>

          {/* Level 1 Section */}
          <div className='mb-4 border-t border-gray-700 pt-4 md:mb-6 md:pt-6'>
            <div className='mb-3 flex items-center justify-between md:mb-4'>
              <h3
                className='text-lg font-bold text-white md:text-xl'
                style={{
                  fontFamily: 'var(--font-stolzl), sans-serif',
                  fontWeight: 700,
                }}
              >
                Up to $1,000 rewards
              </h3>
            <div
              className='rounded px-[19px] py-[8px] rounded text-sm font-medium text-white'
              style={{
                backgroundColor: 'white',
                fontFamily: 'var(--font-satoshi), sans-serif',
                color: '#000',
              }}
            >
              Level 1
            </div>
          </div>
          <ul className='space-y-2'>
                <li
                  className='text-sm text-gray-300 md:text-base'
                  style={{
                    fontFamily: 'var(--font-satoshi), sans-serif',
                    fontWeight: 400,
                    fontSize: 'inherit',
                    lineHeight: '150%',
                  }}
                >
                  • Medium functional bugs
                </li>
              </ul>
            </div>

          {/* Level 2 Section */}
          <div className='mb-4 border-t border-gray-700 pt-4 md:mb-6 md:pt-6'>
            <div className='mb-3 flex items-center justify-between md:mb-4'>
              <h3
                className='text-lg font-bold text-white md:text-xl'
                style={{
                  fontFamily: 'var(--font-stolzl), sans-serif',
                  fontWeight: 700,
                }}
              >
                Up to $15,000 rewards
              </h3>
            <div
              className='rounded px-[19px] py-[8px] rounded text-sm font-medium text-white'
              style={{
                backgroundColor: 'white',
                fontFamily: 'var(--font-satoshi), sans-serif',
                color: '#000',
              }}
            >
              Level 2
            </div>
          </div>
          <ul className='space-y-2'>
                <li
                  className='text-sm text-gray-300 md:text-base'
                  style={{
                    fontFamily: 'var(--font-satoshi), sans-serif',
                    fontWeight: 400,
                    fontSize: 'inherit',
                    lineHeight: '150%',
                  }}
                >
                  • Platform&apos;s bonuses abuse
                </li>
                <li
                  className='text-sm text-gray-300 md:text-base'
                  style={{
                    fontFamily: 'var(--font-satoshi), sans-serif',
                    fontWeight: 400,
                    fontSize: 'inherit',
                    lineHeight: '150%',
                  }}
                >
                  • Bugs/exploits in the Integrated games
                </li>
                <li
                  className='text-sm text-gray-300 md:text-base'
                  style={{
                    fontFamily: 'var(--font-satoshi), sans-serif',
                    fontWeight: 400,
                    fontSize: 'inherit',
                    lineHeight: '150%',
                  }}
                >
                  • Server vulnerability
                </li>
                <li
                  className='text-sm text-gray-300 md:text-base'
                  style={{
                    fontFamily: 'var(--font-satoshi), sans-serif',
                    fontWeight: 400,
                    fontSize: 'inherit',
                    lineHeight: '150%',
                  }}
                >
                  • Original game bugs/exploits
                </li>
              </ul>
            </div>

          {/* Level 3 Section */}
          <div className='mb-4 border-t border-gray-700 pt-4 md:mb-6 md:pt-6'>
            <div className='mb-3 flex items-center justify-between md:mb-4'>
              <h3
                className='text-lg font-bold text-white md:text-xl'
                style={{
                  fontFamily: 'var(--font-stolzl), sans-serif',
                  fontWeight: 700,
                }}
              >
                Up to $35,000 rewards
              </h3>
            <div
              className='rounded px-[19px] py-[8px] rounded text-sm font-medium text-white'
              style={{
                backgroundColor: 'white',
                fontFamily: 'var(--font-satoshi), sans-serif',
                color: '#000',
              }}
            >
              Level 3
            </div>
          </div>
          <ul className='space-y-2'>
                <li
                  className='text-sm text-gray-300 md:text-base'
                  style={{
                    fontFamily: 'var(--font-satoshi), sans-serif',
                    fontWeight: 400,
                    fontSize: 'inherit',
                    lineHeight: '150%',
                  }}
                >
                  • Balance manipulation
                </li>
                <li
                  className='text-sm text-gray-300 md:text-base'
                  style={{
                    fontFamily: 'var(--font-satoshi), sans-serif',
                    fontWeight: 400,
                    fontSize: 'inherit',
                    lineHeight: '150%',
                  }}
                >
                  • Account penetration
                </li>
                <li
                  className='text-sm text-gray-300 md:text-base'
                  style={{
                    fontFamily: 'var(--font-satoshi), sans-serif',
                    fontWeight: 400,
                    fontSize: 'inherit',
                    lineHeight: '150%',
                  }}
                >
                  • Hot wallet accessibility
                </li>
              </ul>
            </div>

          {/* Informational Note */}
          <div className='mt-6 flex items-center gap-3 rounded-lg bg-[#2a2a2d] p-3 md:mt-8 md:p-4'>
            <Info className='mt-0.5 h-4 w-4 flex-shrink-0 text-white' />
            <p
              className='text-sm text-white md:text-base'
              style={{
                fontFamily: 'var(--font-satoshi), sans-serif',
                fontWeight: 400,
                fontSize: 'inherit',
                lineHeight: '150%',
              }}
            >
              After you gain access to the platform, you&apos;ll receive detailed instructions on how to properly report a
              bug.
            </p>
          </div>
        </div>
      </div>
    </CustomModal>
  )
}


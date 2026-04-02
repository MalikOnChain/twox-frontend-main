'use client'

import Image from 'next/image'
import { useState } from 'react'

import { TawkChatModal } from '@/components/modals/tawk-chat-modal'
import { Button } from '@/components/ui/button'

import chatIcon from '@/assets/icons/chat.png'
import footerBack from '@/assets/landing-page/footer-back.png'

export default function LandingFooter() {
  const [chatModalOpen, setChatModalOpen] = useState(false)

  const handleChatClick = () => {
    setChatModalOpen(true)
  }

  return (
    <div className='relative w-full h-[710px] overflow-hidden md:h-[810px]' style={{ backgroundColor: '#0A0A0A' }}>
      {/* Background Layer */}
      <div className='absolute inset-0 z-0'>
        <Image
          src={footerBack}
          alt='Footer Background'
          fill
          className='object-cover opacity-100'
          quality={90}
        />
      </div>

      {/* Footer Section */}
      <section className='relative z-10 mx-auto w-full px-4 py-8 md:px-[100px] md:pt-[165px]'>
        <div className='mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-start md:justify-between md:gap-12'>
          {/* Left Section - About Us Links */}
          <div className='flex w-full flex-1 flex-col items-center md:items-start'>
            <h3
              className='mb-4 text-center font-bold text-white md:mb-6 md:text-left'
              style={{
                fontFamily: 'var(--font-stolzl), sans-serif',
                fontWeight: 700,
                fontSize: 'clamp(16px, 4vw, 18px)',
              }}
            >
              About Us
            </h3>
            <nav className='flex w-full flex-col gap-3 md:gap-4'>
              <a
                href='https://two-x.gitbook.io/two-x-docs/responsible-gaming'
                target='_blank'
                rel='noopener noreferrer'
                className='text-left text-sm text-white/70 transition-colors hover:text-white md:text-base'
                style={{
                  fontFamily: 'var(--font-satoshi), sans-serif',
                  fontWeight: 400,
                  fontSize: 'inherit',
                }}
              >
                Responsible Gaming
              </a>
              <a
                href='https://two-x.gitbook.io/two-x-docs/terms-and-conditions'
                target='_blank'
                rel='noopener noreferrer'
                className='text-left text-sm text-white/70 transition-colors hover:text-white md:text-base'
                style={{
                  fontFamily: 'var(--font-satoshi), sans-serif',
                  fontWeight: 400,
                  fontSize: 'inherit',
                }}
              >
                Terms and conditions
              </a>
              <a
                href='https://two-x.gitbook.io/two-x-docs/privacy-policy'
                target='_blank'
                rel='noopener noreferrer'
                className='text-left text-sm text-white/70 transition-colors hover:text-white md:text-base'
                style={{
                  fontFamily: 'var(--font-satoshi), sans-serif',
                  fontWeight: 400,
                  fontSize: 'inherit',
                }}
              >
                Privacy Policy
              </a>
            </nav>
          </div>

          {/* Right Section - Age Restriction and Disclaimer */}
          <div className='flex w-full flex-1 flex-col md:max-w-md'>
            {/* 18+ Icon */}
            <div className='mb-4 flex justify-start md:mb-6 md:justify-start'>
              <div
                className='flex h-12 w-12 items-center justify-center rounded-full border-2 border-white text-white md:h-[53px] md:w-[53px]'
                style={{
                  fontFamily: 'var(--font-stolzl), sans-serif',
                  fontWeight: 600,
                  fontSize: 'clamp(16px, 4vw, 20px)',
                }}
              >
                18+
              </div>
            </div>

            {/* Disclaimer Text */}
            <p
              className='text-left text-[16px] text-white/70 md:text-sm'
              style={{
                fontFamily: 'var(--font-satoshi), sans-serif',
                fontWeight: 400,
                fontSize: 'inherit',
                lineHeight: '150%',
              }}
            >
              This website offers gaming with risk experience. To be a user of our site you must be over 18 y.o. We are not responsible for the violation of your local laws related to i-gaming. Play responsibly and have fun on Two X.
            </p>
          </div>
        </div>
      </section>

      {/* Support Chat Icon - Bottom Right */}
      <div className='absolute bottom-4 right-4 z-20 md:bottom-8 md:right-8'>
        <Button
          variant='outline'
          size='icon'
          className='flex h-10 w-10 items-center justify-center rounded-full border border-[#404044] bg-dark-grey-gradient hover:bg-dark-gradient md:h-12 md:w-12'
          onClick={handleChatClick}
          aria-label='Open live chat'
        >
          <Image
            src={chatIcon}
            alt='Chat Icon'
            width={16}
            height={21}
            className='h-4 w-4 object-contain md:h-4 md:w-4'
          />
        </Button>
      </div>

      {/* Chat Modal */}
      <TawkChatModal open={chatModalOpen} onOpenChange={setChatModalOpen} />
    </div>
  )
}


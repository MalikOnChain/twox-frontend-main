'use client'

import Image from 'next/image'

import { SectionLabel, SectionTitle, SectionDescription } from '@/components/landing/common'

import securityBack from '@/assets/landing-page/security-back.png'
import goldSecurityIcon from '@/assets/landing-page/gold-security-icon.png'
import gamingKeyboard from '@/assets/landing-page/gaming-keyboard.png'
import probably from '@/assets/landing-page/probably.png'

export default function LandingSecurity() {
  return (
    <div className='relative w-full overflow-hidden' style={{ backgroundColor: '#0A0A0A' }}>
      {/* Background Layer */}
      <div className='absolute inset-0 z-0'>
        <Image
          src={securityBack}
          alt='Security Background with Golden Grid Pattern'
          fill
          className='object-cover opacity-100'
          quality={90}
        />
      </div>

      {/* Security & Fairness Section */}
      <section id='compliance' className='relative z-10 mx-auto w-full px-4 py-8 md:px-[100px] md:py-16 lg:py-20'>
        <div className='mx-auto flex max-w-7xl flex-col items-center gap-8 md:flex-row md:items-start md:gap-12 lg:gap-16'>
          {/* Left Column */}
          <div className='flex w-full flex-col items-center md:flex-1 md:items-start'>
            <SectionLabel className='mb-4 justify-center md:mb-6 md:justify-start'>
              Security & Fairness
            </SectionLabel>
            <SectionTitle align='center' className='mb-6 max-w-xl md:mb-[50px] md:text-left'>
              We're Building A Trusted, Secure, And Compliant Ecosystem.
            </SectionTitle>

            {/* Golden Shield Icon */}
            <div className='relative h-[200px] w-[200px] md:h-[270px] md:w-[270px]'>
              <Image
                src={goldSecurityIcon}
                alt='Golden Shield with Padlock - Security Icon'
                fill
                className='object-contain object-center md:object-left'
                quality={90}
              />
            </div>
          </div>

          {/* Right Column */}
          <div className='flex w-full flex-1 flex-col items-center gap-8 md:items-start md:gap-12'>
            {/* Top Right Section: Responsible Gaming */}
            <div className='flex w-full flex-col items-center gap-4 md:items-start md:gap-6'>
              {/* Icon */}
              <div className='relative h-12 w-12 md:h-16 md:w-16'>
                <Image
                  src={gamingKeyboard}
                  alt='Computer Keyboard Icon - Responsible Gaming'
                  fill
                  className='object-contain'
                  quality={90}
                />
              </div>

              {/* Heading */}
              <h3
                className='text-xl font-bold text-white md:text-2xl'
                style={{
                  fontFamily: 'var(--font-stolzl), sans-serif',
                  fontWeight: 700,
                }}
              >
                Responsible Gaming
              </h3>

              {/* Description */}
              <p
                className='text-center text-sm text-white/90 md:text-left md:text-base'
                style={{
                  fontFamily: 'var(--font-satoshi), sans-serif',
                  fontWeight: 400,
                  fontSize: 'inherit',
                  lineHeight: '120%',
                }}
              >
                We're building a trusted, secure, and compliant ecosystem.
              </p>
            </div>

            {/* Middle Right Section: Provably Fair Play */}
            <div className='flex w-full flex-col items-center gap-4 md:items-start md:gap-6'>
              {/* Icon */}
              <div className='relative h-12 w-12 md:h-16 md:w-16'>
                <Image
                  src={probably}
                  alt='Two Thumbs Up Icon - Provably Fair Play'
                  fill
                  className='object-contain'
                  quality={90}
                />
              </div>

              {/* Heading */}
              <h3
                className='text-xl font-bold text-white md:text-2xl'
                style={{
                  fontFamily: 'var(--font-stolzl), sans-serif',
                  fontWeight: 700,
                }}
              >
                Provably Fair Play
              </h3>

              {/* Description */}
              <p
                className='text-center text-sm text-white/90 md:text-left md:text-base'
                style={{
                  fontFamily: 'var(--font-satoshi), sans-serif',
                  fontWeight: 400,
                  fontSize: 'inherit',
                  lineHeight: '120%',
                }}
              >
                All games on Two X are built around transparent and verifiable fairness, ensuring outcomes are unbiased, auditable, and consistent for every player.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}


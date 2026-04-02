'use client'

import Image from 'next/image'

import { SectionDescription,SectionLabel, SectionTitle } from '@/components/landing/common'

import faces from '@/assets/landing-page/faces.png'
import mapBackground from '@/assets/landing-page/map-background.png'
import TelegramIcon from '@/assets/social/telegram-colored.svg'

export default function LandingCommunity() {
  return (
    <div className='relative w-full h-[600px] overflow-hidden md:h-[830px] lg:h-[1100px]' style={{ backgroundColor: '#0A0A0A' }}>
      {/* Background Layer with Map */}
      <div className='absolute inset-0 z-0'>
        <Image
          src={mapBackground}
          alt='World Map Background'
          fill
          className='w-full h-full object-cover opacity-100 md:object-contain'
          quality={90}
        />
      </div>

      {/* Community Section */}
      <section className='relative z-10 mx-auto w-full px-4 py-[150px] md:px-[100px] md:pt-[250px]'>
        <div className='mx-auto flex max-w-4xl flex-col items-center text-center'>
          <SectionLabel className='mb-6 md:mb-8'>Join Us Now</SectionLabel>
          <SectionTitle className='mb-4 md:mb-6'>Join The Two X Community</SectionTitle>
          <SectionDescription className='mb-8 max-w-2xl px-4 md:mb-12' style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Connect with players, get updates, and be the first to know about new drops and events.
          </SectionDescription>

          {/* Social Media Buttons */}
          <div className='mb-12 flex w-full flex-row items-center justify-center gap-3 md:mb-16 md:gap-4'>
            {/* Twitter X Button */}
            <a
              href='https://x.com/twoxgg'
              target='_blank'
              rel='noopener noreferrer'
              className='relative flex h-10 w-full max-w-[200px] items-center justify-center gap-2 rounded-lg border border-white bg-black px-4 text-xs font-medium text-white transition-colors hover:bg-gray-900 md:h-12 md:w-[200px] md:px-6 md:text-sm'
              style={{
                fontFamily: 'var(--font-satoshi), sans-serif',
              }}
            >
              <span>Twitter</span>
              <span className='text-base font-bold md:text-lg'>X</span>
            </a>

            {/* Telegram Button */}
            <a
              href='https://t.me/twoxggcasino'
              target='_blank'
              rel='noopener noreferrer'
              className='relative flex h-10 w-full max-w-[200px] items-center justify-center gap-2 rounded-lg border border-white px-4 text-xs font-medium text-white transition-colors hover:opacity-90 md:h-12 md:w-[200px] md:px-6 md:text-sm'
              style={{
                fontFamily: 'var(--font-satoshi), sans-serif',
                background: 'linear-gradient(to bottom, rgba(37, 150, 190, 1), rgba(0, 136, 204, 1))',
              }}
            >
              <span>Telegram</span>
              <TelegramIcon className='h-4 w-4 fill-white md:h-5 md:w-5' />
            </a>
          </div>

          {/* Profile Icons */}
          <div className='flex items-center justify-center gap-2 md:gap-4'>
            <div className='relative h-[82px] w-[317px] overflow-hidden rounded-full'>
              <Image
                src={faces}
                alt='Community Member Avatars'
                fill
                className='object-cover object-left'
                quality={90}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}


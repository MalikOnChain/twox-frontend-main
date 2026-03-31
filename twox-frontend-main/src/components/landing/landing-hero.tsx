'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import { LandingHeader, CTAButton } from '@/components/landing/common'
import LandingAuthModal from '@/components/landing/landing-auth-modal'
import JoinBetaModal from '@/components/landing/join-beta-modal'
import { Button } from '@/components/ui/button'
import { MainLogo } from '@/lib/logo'

import gradientBackground from '@/assets/landing-page/gradient-background.png'
import gradientBackgroundSp from '@/assets/landing-page/gradient-background-sp.png'
import casinoGraphics from '@/assets/landing-page/Group_1281.png'

export default function LandingHero() {
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [joinBetaModalOpen, setJoinBetaModalOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className='relative h-screen w-full overflow-hidden md:h-[850px]' style={{ backgroundColor: '#0A0A0A' }}>
      {/* Gradient Background Layer */}
      <div className='absolute inset-0 z-0'>
        {/* Mobile Background */}
        <Image
          src={gradientBackgroundSp}
          alt='Gradient Background'
          fill
          className='object-cover opacity-100 md:hidden'
          priority
          quality={90}
        />
        {/* Desktop Background */}
        <Image
          src={gradientBackground}
          alt='Gradient Background'
          fill
          className='hidden object-cover opacity-100 md:block'
          priority
          quality={90}
        />
      </div>

      {/* Header */}
      <LandingHeader 
        onLoginClick={() => setAuthModalOpen(true)} 
        onMenuClick={() => setMobileMenuOpen(true)}
      />

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className='h-[370px] fixed inset-0 z-50 bg-black/90 backdrop-blur-sm rounded-b-2xl md:hidden'>
          {/* Header with Logo, Login Button, and Close Icon */}
          <div className='relative z-10 flex items-center justify-between px-4 py-4'>
            {/* Logo */}
            <Link href='/' className='flex items-center' onClick={() => setMobileMenuOpen(false)}>
              <Image
                src={MainLogo}
                alt='TWOX Logo'
                width={125}
                height={48}
                className='h-6 w-auto object-contain'
                priority
              />
            </Link>

            {/* Right Side - Login Button and Close Icon */}
            <div className='flex items-center gap-2'>
              <Button
                variant='secondary2'
                size='default'
                className='flex items-center gap-2 text-xs'
                onClick={() => {
                  setMobileMenuOpen(false)
                  setAuthModalOpen(true)
                }}
              >
                <span>Log In</span>
                <ArrowRight className='h-3 w-3' />
              </Button>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className='text-white'
                aria-label='Close menu'
              >
                <svg className='h-6 w-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
            </div>
          </div>

          {/* Navigation Links - Left Aligned */}
          <div className='flex h-[calc(100vh-80px)] flex-col justify-start px-4 pt-8'>
            <nav className='flex flex-col items-center space-y-6' style={{ fontFamily: 'var(--font-stolzl), sans-serif' }}>
              <Link
                href='#early-rewards'
                className='text-[16px] font-medium text-gray-400 transition-colors hover:text-red-500'
                onClick={(e) => {
                  e.preventDefault()
                  setMobileMenuOpen(false)
                  const element = document.getElementById('early-rewards')
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }
                }}
              >
                Early Rewards
              </Link>
              <Link
                href='#beta-launch'
                className='text-[16px] font-medium text-gray-400 transition-colors hover:text-red-500'
                onClick={(e) => {
                  e.preventDefault()
                  setMobileMenuOpen(false)
                  const element = document.getElementById('beta-launch')
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }
                }}
              >
                Beta Launch
              </Link>
              <Link
                href='#about'
                className='text-[16px] font-medium text-gray-400 transition-colors hover:text-red-500'
                onClick={(e) => {
                  e.preventDefault()
                  setMobileMenuOpen(false)
                  const element = document.getElementById('about')
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }
                }}
              >
                About us
              </Link>
              <Link
                href='#compliance'
                className='text-[16px] font-medium text-gray-400 transition-colors hover:text-red-500'
                onClick={(e) => {
                  e.preventDefault()
                  setMobileMenuOpen(false)
                  const element = document.getElementById('compliance')
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }
                }}
              >
                Compliance
              </Link>
              <Link
                href='#faq'
                className='text-[16px] font-medium text-gray-400 transition-colors hover:text-red-500'
                onClick={(e) => {
                  e.preventDefault()
                  setMobileMenuOpen(false)
                  const element = document.getElementById('faq')
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }
                }}
              >
                FAQ
              </Link>
            </nav>

          </div>
        </div>
      )}

      {/* Main Content Section */}
      <div className='relative z-10 mx-auto flex w-full flex-col items-center justify-center gap-4 px-4 pt-4 md:flex-row md:items-center md:justify-center md:gap-12 md:px-[100px] md:pt-16 lg:px-[100px] lg:pt-20'>

        {/* Left Side - Text Content */}
        <div className='relative z-10 w-full flex-1 max-w-2xl px-4 py-[64px] text-center md:px-0 md:py-[66px] md:text-left'>
          {/* Red gradient glow effect */}
          <div
            className='absolute -left-20 -top-20 hidden h-96 w-96 rounded-full opacity-30 blur-3xl md:block'
          />

          {/* Headline */}
          <h1
            className='relative z-10 mb-[26px] text-[24px] font-bold leading-[130%] tracking-[0%] text-white min-[375px]:text-[32px] md:mb-[30px] md:text-[60px] md:leading-[130%] min-[1441px]:text-[64px]'
            style={{
              fontFamily: 'var(--font-stolzl), sans-serif',
              fontWeight: 700,
              fontStyle: 'normal',
              letterSpacing: '0%',
              textTransform: 'none',
            }}
          >
            Get Early Access &<br />
            Exclusive Rewards
          </h1>

          {/* Body Text */}
          <p
            className='relative z-10 mx-auto mb-[40px] max-w-lg text-[16px] text-white/90 min-[375px]:text-[18px] md:mb-[40px] md:text-base md:mx-0'
            style={{
              fontFamily: 'var(--font-satoshi), sans-serif',
              fontWeight: 400,
              fontStyle: 'normal',
              lineHeight: '130%',
              letterSpacing: '0%',
            }}
          >
            Be among the first to experience Two X — secure your spot in our early access phase and earn special launch
            rewards just for joining our community.
          </p>

          {/* Join Beta Button - Mobile: Centered, Desktop: Left aligned */}
          <div className='relative z-10 flex justify-center md:justify-start'>
            <CTAButton onClick={() => setJoinBetaModalOpen(true)}>Join Beta</CTAButton>
          </div>
        </div>

        {/* Right Side - 3D Graphics */}
        <div className='relative z-10 w-full flex-1 max-w-2xl md:flex-shrink-0'>
          <div className='relative h-[300px] w-full md:h-[500px] lg:h-[500px]'>
            <Image
              src={casinoGraphics}
              alt='Casino 3D Graphics - Roulette Wheel, Playing Cards, Slot Machine, Casino Chips, Dice, Gift Box'
              fill
              className='object-contain object-center md:object-right'
              priority
              quality={90}
            />
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <LandingAuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />

      {/* Join Beta Modal */}
      <JoinBetaModal open={joinBetaModalOpen} onOpenChange={setJoinBetaModalOpen} />
    </div>
  )
}


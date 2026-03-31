import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { MainLogo } from '@/lib/logo'

interface LandingHeaderProps {
  onLoginClick?: () => void
  onMenuClick?: () => void
}

export default function LandingHeader({ onLoginClick, onMenuClick }: LandingHeaderProps) {
  return (
    <header className='relative z-10 flex items-center justify-between px-6 py-4 md:px-[100px] md:py-6 min-[1450px]:px-[230px]'>
      {/* Logo */}
      <Link href='/' className='flex items-center'>
        <Image
          src={MainLogo}
          alt='TWOX Logo'
          width={125}
          height={48}
          className='h-6 w-auto object-contain md:h-8 lg:h-10'
          priority
        />
      </Link>

      {/* Navigation Links - Desktop Only */}
      <nav className='hidden items-center gap-6 md:flex lg:gap-8' style={{ fontFamily: 'var(--font-stolzl), sans-serif' }}>
        <Link
          href='#early-rewards'
          className='text-sm font-medium text-white transition-colors hover:text-red-500 lg:text-base'
          onClick={(e) => {
            e.preventDefault()
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
          className='text-sm font-medium text-white transition-colors hover:text-red-500 lg:text-base'
          onClick={(e) => {
            e.preventDefault()
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
          className='text-sm font-medium text-white transition-colors hover:text-red-500 lg:text-base'
          onClick={(e) => {
            e.preventDefault()
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
          className='text-sm font-medium text-white transition-colors hover:text-red-500 lg:text-base'
          onClick={(e) => {
            e.preventDefault()
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
          className='text-sm font-medium text-white transition-colors hover:text-red-500 lg:text-base'
          onClick={(e) => {
            e.preventDefault()
            const element = document.getElementById('faq')
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }
          }}
        >
          FAQ
        </Link>
      </nav>

      {/* Right Side - Login Button and Hamburger Menu */}
      <div className='flex items-center gap-2'>
        {/* Login Button */}
        {onLoginClick ? (
          <Button
            variant='secondary2'
            size='default'
            className='flex items-center gap-2 text-xs md:text-sm'
            onClick={onLoginClick}
          >
            <span>Log In</span>
            <ArrowRight className='h-3 w-3 md:h-4 md:w-4' />
          </Button>
        ) : (
          <Link href='/login'>
            <Button variant='secondary2' size='default' className='flex items-center gap-2 text-xs md:text-sm'>
              <span>Log In</span>
              <ArrowRight className='h-3 w-3 md:h-4 md:w-4' />
            </Button>
          </Link>
        )}

        {/* Hamburger Menu Button - Mobile Only */}
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className='text-white md:hidden'
            aria-label='Open menu'
          >
            <svg className='h-6 w-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
            </svg>
          </button>
        )}
      </div>
    </header>
  )
}


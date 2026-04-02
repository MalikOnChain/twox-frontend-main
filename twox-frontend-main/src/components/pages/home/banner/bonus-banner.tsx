'use client'

import { Check } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Swiper as SwiperType } from 'swiper'
import { Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'

import { oAuthLogin } from '@/api/auth'

import { useBanner } from '@/context/features/banner-context'
import { AUTH_TABS,ModalType, useModal } from '@/context/modal-context'

import TelegramLoginWidget from '@/components/modals/telegram-login-widget'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

import spinImg from '@/assets/images/spin_img.png'
import DiscordIcon from '@/assets/social/discord-colored.svg'
import GoogleIcon from '@/assets/social/google.svg'
import TelegramIcon from '@/assets/social/telegram-colored.svg'

import { AUTH_PROVIDER_KEYS } from '@/types/auth'
import { BannerSection } from '@/types/banner'

interface BonusBannerProps {
  onSwiperInit?: (swiper: SwiperType) => void
  onSlideChange?: (index: number) => void
  onBannersLoad?: (count: number) => void
}

// Interface for banner data used in BonusBanner component
interface BonusBannerData {
  _id: string
  title: string
  subtitle: string
  highlight: string
  image: string
  features: string[]
}

export default function BonusBanner({
  onSwiperInit,
  onSlideChange,
  onBannersLoad,
}: BonusBannerProps = {}) {
  const { t } = useTranslation()
  const { setIsOpen, setType, setActiveTab } = useModal()
  const { banners: rawBanners, isLoading } = useBanner({ section: BannerSection.BONUSES })
  const [banners, setBanners] = useState<BonusBannerData[]>([])
  const [showTelegramModal, setShowTelegramModal] = useState(false)

  // Transform banners from banners table to BonusBanner format
  useEffect(() => {
    if (rawBanners && rawBanners.length > 0) {
      const transformedBanners: BonusBannerData[] = rawBanners
        .filter((banner) => banner.bannerData) // Only include banners with bannerData
        .map((banner) => ({
          _id: banner._id,
          title: banner.bannerData?.title || banner.title || 'Join Twox & Get',
          subtitle: banner.bannerData?.subtitle || '100% BONUS',
          highlight: banner.bannerData?.highlight || 'UP TO 1 BTC!',
          image: banner.image || spinImg.src,
          features: banner.bannerData?.features || ['Anonymous', 'Zero fee & Limit', 'VPN Friendly'],
        }))

      if (transformedBanners.length > 0) {
        setBanners(transformedBanners)
        onBannersLoad?.(transformedBanners.length)
        console.log(`✅ BonusBanner - Loaded ${transformedBanners.length} banners from banners table`)
      } else {
        // Fallback if no banners with bannerData found
        console.warn('⚠️ BonusBanner - No banners with bannerData found. Using fallback.')
        const defaultBanner: BonusBannerData = {
          _id: 'default',
          title: 'Join Twox & Get',
          subtitle: '100% BONUS',
          highlight: 'UP TO 1 BTC!',
          image: spinImg.src,
          features: ['Anonymous', 'Zero fee & Limit', 'VPN Friendly'],
        }
        setBanners([defaultBanner])
        onBannersLoad?.(1)
      }
    } else if (!isLoading) {
      // Only show fallback if not loading and no banners found
      console.warn('⚠️ BonusBanner - No banners found. Using fallback.')
      const defaultBanner: BonusBannerData = {
        _id: 'default',
        title: 'Join Twox & Get',
        subtitle: '100% BONUS',
        highlight: 'UP TO 1 BTC!',
        image: spinImg.src,
        features: ['Anonymous', 'Zero fee & Limit', 'VPN Friendly'],
      }
      setBanners([defaultBanner])
      onBannersLoad?.(1)
    }
  }, [rawBanners, isLoading, onBannersLoad])

  const handleJoinNowClick = () => {
    setType(ModalType.Auth)
    setActiveTab(AUTH_TABS.signup)
    setIsOpen(true)
  }

  const handleSocialLogin = (provider: AUTH_PROVIDER_KEYS) => {
    try {
      if (provider === AUTH_PROVIDER_KEYS.TELEGRAM) {
        // Telegram uses a widget, not a redirect
        setShowTelegramModal(true)
      } else {
        oAuthLogin(provider)
      }
    } catch (error) {
      console.error(`Failed to login with ${provider}:`, error)
    }
  }

  const socialLogins = [
    { name: 'Google', Icon: GoogleIcon, provider: AUTH_PROVIDER_KEYS.GOOGLE },
    { name: 'Discord', Icon: DiscordIcon, provider: AUTH_PROVIDER_KEYS.DISCORD },
    { name: 'Telegram', Icon: TelegramIcon, provider: AUTH_PROVIDER_KEYS.TELEGRAM },
  ]

  const steps = [
    { number: '01', text: 'Register an account' },
    { number: '02', text: 'Make a Deposit & Play' },
    { number: '03', text: 'Get 10% Weekly Cashback' },
  ]

  if (isLoading) {
    return (
      <div className='mb-8'>
        <Skeleton className='w-full rounded-2xl min-h-[clamp(17.5rem,12rem+28vw,32rem)] lg:min-h-[32rem]' />
      </div>
    )
  }

  return (
    <>
      {/* Desktop Version — min-height + autoHeight avoids clipping; fluid type scales with viewport */}
      <div className='hidden lg:block'>
        <div className='relative min-h-[512px] overflow-x-hidden rounded-2xl border border-mirage bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A]'>
          <Swiper
            modules={[Autoplay]}
            spaceBetween={0}
            slidesPerView={1}
            autoHeight
            autoplay={{
              delay: 8000,
              disableOnInteraction: false,
            }}
            loop={banners.length > 1}
            onSwiper={(swiper) => {
              onSwiperInit?.(swiper)
            }}
            onSlideChange={(swiper) => {
              onSlideChange?.(swiper.realIndex)
            }}
            className='w-full'
          >
            {banners.map((banner) => (
              <SwiperSlide key={banner._id}>
                <div className='grid min-h-[512px] grid-cols-2 pb-[5.75rem] lg:px-2 xl:px-0'>
                  {/* Left: top-aligned so title is never clipped by overflow */}
                  <div className='relative z-10 flex min-h-0 flex-col justify-start px-6 py-6 min-[1100px]:px-10 min-[1100px]:py-8'>
                    <h2 className='mb-1.5 font-satoshi font-medium leading-tight text-white min-[1100px]:mb-2 text-[clamp(0.9375rem,0.65rem+0.55vw,1.25rem)]'>
                      {banner.title}
                    </h2>
                    <h3 className='mb-1.5 font-satoshi font-bold leading-[1.1] text-white min-[1100px]:mb-2 text-[clamp(1.625rem,1.1rem+1.6vw,2.25rem)]'>
                      {banner.subtitle}
                    </h3>
                    <h3 className='mb-4 font-satoshi font-extrabold leading-[1.05] text-arty-red min-[1100px]:mb-6 text-[clamp(1.875rem,1.15rem+2.4vw,3.75rem)]'>
                      {banner.highlight}
                    </h3>

                    {/* Features */}
                    <div className='mb-5 flex flex-wrap items-center gap-x-2 gap-y-2 min-[1100px]:mb-[30px] min-[1100px]:gap-3'>
                      {banner.features.map((feature, idx) => (
                        <div key={idx} className='flex min-w-0 max-w-full items-center gap-1.5 min-[1100px]:gap-2'>
                          <div className='flex h-3 w-3 shrink-0 items-center justify-center rounded-full border border-arty-red min-[1100px]:h-[15px] min-[1100px]:w-[15px]'>
                            <Check className='h-2.5 w-2.5 text-arty-red min-[1100px]:h-3 min-[1100px]:w-3' />
                          </div>
                          <span className='font-satoshi text-white text-[clamp(0.6875rem,0.55rem+0.35vw,0.875rem)]'>
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Join Now Button */}
                    <Button 
                      className='mb-[clamp(0.5rem,0.35rem+0.6vw,1rem)] w-full max-w-sm px-[clamp(0.75rem,0.5rem+1.2vw,1.25rem)] py-0 min-[1100px]:mb-4 h-[clamp(2.375rem,2rem+1.35vw,3rem)]' 
                      variant='secondary2'
                      onClick={handleJoinNowClick}
                    >
                      <span className='text-[clamp(0.75rem,0.62rem+0.45vw,0.9375rem)]'>
                        {t('header.join_now')}
                      </span>
                    </Button>

                    {/* Social Logins — extra bottom padding so the absolute steps bar never overlaps */}
                    <div className='max-w-sm pb-2'>
                      <p className='mb-[clamp(0.5rem,0.35rem+0.55vw,0.75rem)] text-center font-satoshi text-white text-[clamp(0.6875rem,0.55rem+0.5vw,0.875rem)]'>
                        Or continue with
                      </p>
                      <div className='grid grid-cols-3 gap-[clamp(0.375rem,0.2rem+0.85vw,0.75rem)]'>
                        {socialLogins.map((social, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSocialLogin(social.provider)}
                            className='flex flex-col items-center gap-[clamp(0.25rem,0.12rem+0.55vw,0.5rem)] rounded-[clamp(0.375rem,0.25rem+0.45vw,0.5rem)] border border-gray-600 bg-transparent py-[clamp(0.45rem,0.28rem+0.9vw,0.85rem)] transition-colors hover:border-gray-400 hover:bg-gray-800/30'
                          >
                            <social.Icon className='h-[clamp(1.125rem,0.75rem+1.85vw,1.5rem)] w-[clamp(1.125rem,0.75rem+1.85vw,1.5rem)]' />
                            <span className='font-satoshi text-gray-400 text-[clamp(0.5625rem,0.45rem+0.55vw,0.75rem)]'>
                              {social.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Casino Graphics */}
                  <div className='relative z-0 flex min-h-0 items-center justify-center px-2 py-4 min-[1100px]:px-4'>
                    <Image
                      src={banner.image || spinImg}
                      alt='Casino Games'
                      width={475}
                      height={414}
                      className='h-auto w-full max-h-[min(380px,42vw)] object-contain min-[1100px]:max-h-none min-[1100px]:w-auto'
                      priority
                    />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Bottom Steps — grid + fluid type for narrow lg widths */}
          <div className='absolute bottom-0 left-0 right-0 z-20 border-t border-gray-800 bg-[#0A0A0A]/80 px-3 py-2.5 backdrop-blur-sm min-[1100px]:px-8 min-[1100px]:py-4'>
            <div className='grid grid-cols-3 gap-2 min-[1100px]:gap-4'>
              {steps.map((step, idx) => (
                <div
                  key={idx}
                  className='flex min-w-0 items-center gap-1.5 min-[1100px]:gap-3 min-[1100px]:border-r min-[1100px]:border-gray-700 min-[1100px]:pr-4 min-[1100px]:last:border-r-0 min-[1100px]:last:pr-0'
                >
                  <span className='shrink-0 font-satoshi font-bold text-arty-red text-[clamp(1.125rem,0.9rem+0.7vw,1.875rem)]'>
                    {step.number}
                  </span>
                  <span className='min-w-0 font-satoshi font-medium leading-tight text-white text-[clamp(0.625rem,0.5rem+0.35vw,0.875rem)]'>
                    {step.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile — continuous vw-based clamp() scaling (no breakpoint jumps); layout props ease on resize */}
      <div className='block lg:hidden'>
        <div className='relative overflow-x-hidden rounded-[clamp(0.75rem,0.55rem+1vw,1rem)] border border-mirage bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] motion-safe:transition-[border-radius] motion-safe:duration-300 motion-safe:ease-out'>
          <Swiper
            modules={[Autoplay]}
            spaceBetween={0}
            slidesPerView={1}
            autoHeight
            autoplay={{
              delay: 8000,
              disableOnInteraction: false,
            }}
            loop={banners.length > 1}
            onSwiper={(swiper) => {
              onSwiperInit?.(swiper)
            }}
            onSlideChange={(swiper) => {
              onSlideChange?.(swiper.realIndex)
            }}
            className='w-full pb-[clamp(0.65rem,0.45rem+1vw,1rem)] motion-safe:transition-[padding] motion-safe:duration-300 motion-safe:ease-out'
          >
            {banners.map((banner) => (
              <SwiperSlide key={banner._id}>
                <div
                  className='flex flex-col motion-safe:transition-[padding,gap] motion-safe:duration-300 motion-safe:ease-[cubic-bezier(0.33,1,0.68,1)]'
                  style={{
                    gap: 'clamp(0.65rem, 0.35rem + 1.85vw, 1.5rem)',
                    paddingLeft: 'clamp(0.55rem, 0.28rem + 1.65vw, 1.5rem)',
                    paddingRight: 'clamp(0.55rem, 0.28rem + 1.65vw, 1.5rem)',
                    paddingTop: 'clamp(0.55rem, 0.3rem + 1.1vw, 1.5rem)',
                    paddingBottom: 'clamp(0.55rem, 0.35rem + 1.1vw, 1rem)',
                  }}
                >
                  {/* Text and CTA — all type scales with vw; margins scale too (no sm: jumps) */}
                  <div className='relative z-10 text-center'>
                    <div className='text-left'>
                      <h2
                        className='font-satoshi font-medium leading-tight text-white motion-safe:transition-[font-size,margin-bottom] motion-safe:duration-300 motion-safe:ease-out'
                        style={{
                          fontSize: 'clamp(0.6875rem, 0.52rem + 0.85vw, 1.125rem)',
                          marginBottom: 'clamp(0.2rem, 0.1rem + 0.45vw, 0.5rem)',
                        }}
                      >
                        {banner.title}
                      </h2>
                      <h3
                        className='font-satoshi font-bold leading-[1.1] text-white motion-safe:transition-[font-size,margin-bottom] motion-safe:duration-300 motion-safe:ease-out'
                        style={{
                          fontSize: 'clamp(1rem, 0.78rem + 1.85vw, 1.875rem)',
                          marginBottom: 'clamp(0.2rem, 0.1rem + 0.45vw, 0.5rem)',
                        }}
                      >
                        {banner.subtitle}
                      </h3>
                      <h3
                        className='font-satoshi font-extrabold leading-[1.05] text-arty-red motion-safe:transition-[font-size,margin-bottom] motion-safe:duration-300 motion-safe:ease-out'
                        style={{
                          fontSize: 'clamp(1.0625rem, 0.62rem + 3.1vw, 3rem)',
                          marginBottom: 'clamp(0.65rem, 0.4rem + 1.1vw, 1.5rem)',
                        }}
                      >
                        {banner.highlight}
                      </h3>
                    </div>

                    {/* Features — 3-col grid; icon + label scale fluidly */}
                    <div
                      className='grid grid-cols-3 motion-safe:transition-[margin-bottom,gap] motion-safe:duration-300 motion-safe:ease-out'
                      style={{
                        marginBottom: 'clamp(0.65rem, 0.4rem + 1.1vw, 1.5rem)',
                        columnGap: 'clamp(0.2rem, 0.08rem + 0.85vw, 0.75rem)',
                        rowGap: 'clamp(0.25rem, 0.12rem + 0.65vw, 0.5rem)',
                      }}
                    >
                      {banner.features.map((feature, idx) => (
                        <div
                          key={idx}
                          className='flex min-w-0 flex-col items-center motion-safe:transition-[gap] motion-safe:duration-300 motion-safe:ease-out'
                          style={{ gap: 'clamp(0.1rem, 0.04rem + 0.35vw, 0.35rem)' }}
                        >
                          <div
                            className='flex shrink-0 items-center justify-center rounded-full border border-arty-red motion-safe:transition-[width,height] motion-safe:duration-300 motion-safe:ease-out'
                            style={{
                              width: 'clamp(0.5625rem, 0.38rem + 0.95vw, 0.75rem)',
                              height: 'clamp(0.5625rem, 0.38rem + 0.95vw, 0.75rem)',
                            }}
                          >
                            <Check
                              className='text-arty-red motion-safe:transition-[width,height] motion-safe:duration-300 motion-safe:ease-out'
                              style={{
                                width: 'clamp(0.4375rem, 0.3rem + 0.65vw, 0.625rem)',
                                height: 'clamp(0.4375rem, 0.3rem + 0.65vw, 0.625rem)',
                              }}
                            />
                          </div>
                          <span
                            className='text-center font-satoshi leading-tight text-white line-clamp-2 motion-safe:transition-[font-size] motion-safe:duration-300 motion-safe:ease-out'
                            style={{
                              fontSize: 'clamp(0.5rem, 0.36rem + 0.95vw, 0.75rem)',
                            }}
                          >
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Join Now — height + label scale together */}
                    <Button
                      className='w-full px-[clamp(0.65rem,0.4rem+1.4vw,1.25rem)] py-0 motion-safe:transition-[height,margin-bottom] motion-safe:duration-300 motion-safe:ease-out'
                      style={{
                        height: 'clamp(2.25rem, 1.85rem + 1.65vw, 3rem)',
                        marginBottom: 'clamp(0.45rem, 0.3rem + 0.65vw, 1rem)',
                      }}
                      variant='secondary2'
                      onClick={handleJoinNowClick}
                    >
                      <span
                        className='motion-safe:transition-[font-size] motion-safe:duration-300 motion-safe:ease-out'
                        style={{ fontSize: 'clamp(0.6875rem, 0.58rem + 0.55vw, 0.9375rem)' }}
                      >
                        {t('header.join_now')}
                      </span>
                    </Button>

                    {/* Social Logins */}
                    <div>
                      <p
                        className='font-satoshi text-white motion-safe:transition-[font-size,margin-bottom] motion-safe:duration-300 motion-safe:ease-out'
                        style={{
                          fontSize: 'clamp(0.625rem, 0.5rem + 0.65vw, 0.875rem)',
                          marginBottom: 'clamp(0.35rem, 0.2rem + 0.55vw, 0.75rem)',
                        }}
                      >
                        Or continue with
                      </p>
                      <div
                        className='grid grid-cols-3 motion-safe:transition-[gap] motion-safe:duration-300 motion-safe:ease-out'
                        style={{ gap: 'clamp(0.2rem, 0.08rem + 0.75vw, 0.75rem)' }}
                      >
                        {socialLogins.map((social, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSocialLogin(social.provider)}
                            className='flex flex-col items-center rounded-lg border border-gray-600 bg-transparent transition-colors hover:border-gray-400 hover:bg-gray-800/30 motion-safe:transition-[padding,gap,border-radius] motion-safe:duration-300 motion-safe:ease-out'
                            style={{
                              gap: 'clamp(0.15rem, 0.06rem + 0.45vw, 0.5rem)',
                              paddingTop: 'clamp(0.35rem, 0.18rem + 0.85vw, 0.85rem)',
                              paddingBottom: 'clamp(0.35rem, 0.18rem + 0.85vw, 0.85rem)',
                              borderRadius: 'clamp(0.375rem, 0.28rem + 0.35vw, 0.5rem)',
                            }}
                          >
                            <social.Icon
                              className='shrink-0 motion-safe:transition-[width,height] motion-safe:duration-300 motion-safe:ease-out'
                              style={{
                                width: 'clamp(0.9375rem, 0.62rem + 1.65vw, 1.5rem)',
                                height: 'clamp(0.9375rem, 0.62rem + 1.65vw, 1.5rem)',
                              }}
                            />
                            <span
                              className='font-satoshi text-gray-400 motion-safe:transition-[font-size] motion-safe:duration-300 motion-safe:ease-out'
                              style={{ fontSize: 'clamp(0.5rem, 0.4rem + 0.55vw, 0.75rem)' }}
                            >
                              {social.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Casino Graphics — max-height ramps smoothly with viewport */}
                  <div
                    className='relative z-0 flex w-full shrink-0 justify-center motion-safe:transition-[padding-top] motion-safe:duration-300 motion-safe:ease-out'
                    style={{ paddingTop: 'clamp(0.15rem, 0.05rem + 0.55vw, 0.5rem)' }}
                  >
                    <Image
                      src={banner.image || spinImg}
                      alt='Casino Games'
                      width={350}
                      height={250}
                      className='h-auto w-full object-contain motion-safe:transition-[max-height] motion-safe:duration-300 motion-safe:ease-out'
                      style={{
                        maxHeight: 'clamp(7.25rem, 3.75rem + 30vw, 16.25rem)',
                      }}
                      priority
                    />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Bottom Steps Section - Mobile */}
          {/* <div className='absolute bottom-0 left-0 right-0 border-t border-gray-800 bg-[#0A0A0A]/80 px-4 py-3 backdrop-blur-sm'>
            <div className='flex flex-col gap-2'>
              {steps.map((step, idx) => (
                <React.Fragment key={idx}>
                  <div className='flex items-center gap-3'>
                    <span className='font-satoshi text-2xl font-bold text-arty-red'>
                      {step.number}
                    </span>
                    <span className='font-satoshi text-xs font-medium text-white'>
                      {step.text}
                    </span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className='h-px w-full bg-gray-700' />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div> */}
        </div>
      </div>

      {/* Telegram Login Modal */}
      {showTelegramModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
          <div className='relative w-full max-w-md rounded-lg border border-gray-700 bg-[#1A1A1A] p-6 shadow-xl'>
            <button
              onClick={() => setShowTelegramModal(false)}
              className='absolute right-4 top-4 text-gray-400 hover:text-white'
            >
              ✕
            </button>
            <TelegramLoginWidget
              botUsername='twox_login_bot'
              state={typeof window !== 'undefined' 
                ? btoa(JSON.stringify({
                    redirect: window.location.pathname,
                    ref: '',
                  }))
                : ''}
              onSuccess={() => setShowTelegramModal(false)}
              onError={(error) => {
                console.error('Telegram login error:', error)
              }}
            />
          </div>
        </div>
      )}
    </>
  )
}


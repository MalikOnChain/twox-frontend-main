'use client'

import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Check } from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperType } from 'swiper'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'

import { useModal, ModalType, AUTH_TABS } from '@/context/modal-context'
import { useBanner } from '@/context/features/banner-context'
import { BannerSection } from '@/types/banner'
import { oAuthLogin } from '@/api/auth'
import { AUTH_PROVIDER_KEYS } from '@/types/auth'
import TelegramLoginWidget from '@/components/modals/telegram-login-widget'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import spinImg from '@/assets/images/spin_img.png'
import GoogleIcon from '@/assets/social/google.svg'
import DiscordIcon from '@/assets/social/discord-colored.svg'
import TelegramIcon from '@/assets/social/telegram-colored.svg'

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
          image: banner.image || '/images/bonus/spin.png',
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
          image: '/images/bonus/spin.png',
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
        image: '/images/bonus/spin.png',
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
        <Skeleton className='h-[512px] w-full rounded-2xl lg:h-[512px]' />
      </div>
    )
  }

  return (
    <>
      {/* Desktop Version */}
      <div className='hidden lg:block'>
        <div className='relative h-[512px] overflow-hidden rounded-2xl border border-mirage bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A]'>
          <Swiper
            modules={[Autoplay]}
            spaceBetween={0}
            slidesPerView={1}
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
            className='h-full'
          >
            {banners.map((banner) => (
              <SwiperSlide key={banner._id}>
                <div className='grid h-full grid-cols-2 pb-16'>
                  {/* Left Column - Text and CTA */}
                  <div className='flex flex-col justify-center px-10 py-8'>
                    <h2 className='mb-2 font-satoshi text-xl font-medium text-white'>
                      {banner.title}
                    </h2>
                    <h3 className='mb-2 font-satoshi text-4xl font-bold text-white'>
                      {banner.subtitle}
                    </h3>
                    <h3 className='mb-6 font-satoshi text-6xl font-extrabold text-arty-red'>
                      {banner.highlight}
                    </h3>

                    {/* Features */}
                    <div className='mb-[30px] flex items-center gap-2'>
                      {banner.features.map((feature, idx) => (
                        <div key={idx} className='flex items-center gap-2'>
                          <div className='flex h-[15px] w-[15px] items-center justify-center rounded-full border border-arty-red'>
                            <Check className='h-[12px] w-[12px] text-arty-red' />
                          </div>
                          <span className='font-satoshi text-sm text-white'>{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Join Now Button */}
                    <Button 
                      className='mb-4 w-full max-w-sm h-[48px]' 
                      variant='secondary2'
                      onClick={handleJoinNowClick}
                    >
                      <span className='text-[15px]'>{t('header.join_now')}</span>
                    </Button>

                    {/* Social Logins */}
                    <div className='max-w-sm'>
                      <p className='mb-3 text-center font-satoshi text-sm text-white'>
                        Or continue with
                      </p>
                      <div className='grid grid-cols-3 gap-3'>
                        {socialLogins.map((social, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSocialLogin(social.provider)}
                            className='flex flex-col items-center gap-2 rounded-lg border border-gray-600 bg-transparent py-3 transition-colors hover:border-gray-400 hover:bg-gray-800/30'
                          >
                            <social.Icon className='h-6 w-6' />
                            <span className='font-satoshi text-xs text-gray-400'>
                              {social.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Casino Graphics */}
                  <div className='relative flex items-center justify-center px-4'>
                    <Image
                      src={banner.image || spinImg}
                      alt='Casino Games'
                      width={475}
                      height={414}
                      className='h-auto w-auto object-contain'
                      priority
                    />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Bottom Steps Section - Absolute positioned at bottom */}
          <div className='absolute bottom-0 left-0 right-0 border-t border-gray-800 bg-[#0A0A0A]/80 px-8 py-4 backdrop-blur-sm'>
            <div className='flex items-center justify-between'>
              {steps.map((step, idx) => (
                <React.Fragment key={idx}>
                  <div className='flex items-center gap-3'>
                    <span className='font-satoshi text-3xl font-bold text-arty-red'>
                      {step.number}
                    </span>
                    <span className='font-satoshi text-sm font-medium text-white'>
                      {step.text}
                    </span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className='h-px w-48 bg-gray-700' />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Version */}
      <div className='block lg:hidden'>
        <div className='relative min-h-[600px] overflow-hidden rounded-2xl border border-mirage bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A]'>
          <Swiper
            modules={[Autoplay]}
            spaceBetween={0}
            slidesPerView={1}
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
            className='h-full pb-16'
          >
            {banners.map((banner) => (
              <SwiperSlide key={banner._id}>
                <div className='flex flex-col p-6'>
                  {/* Text and CTA */}
                  <div className='text-center'>
                    <div className='text-left'>
                      <h2 className='mb-2 font-satoshi text-lg font-medium text-white'>
                        {banner.title}
                      </h2>
                      <h3 className='mb-2 font-satoshi text-3xl font-bold text-white'>
                        {banner.subtitle}
                      </h3>
                      <h3 className='mb-6 font-satoshi text-5xl font-extrabold text-arty-red'>
                        {banner.highlight}
                      </h3>
                    </div>

                    {/* Features - Horizontal on mobile */}
                    <div className='mb-6 flex flex-wrap items-center justify-between'>
                      {banner.features.map((feature, idx) => (
                        <div key={idx} className='flex items-center gap-2'>
                          <div className='flex h-[12px] w-[12px] items-center justify-center rounded-full border border-arty-red'>
                            <Check className='h-[10px] w-[10px] text-arty-red' />
                          </div>
                          <span className='font-satoshi text-xs text-white'>{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Join Now Button */}
                    <Button 
                      className='mb-4 w-full h-[48px]' 
                      variant='secondary2'
                      onClick={handleJoinNowClick}
                    >
                      <span className='text-[15px]'>{t('header.join_now')}</span>
                    </Button>

                    {/* Social Logins */}
                    <div className='mb-6'>
                      <p className='mb-3 font-satoshi text-sm text-white'>
                        Or continue with
                      </p>
                      <div className='grid grid-cols-3 gap-3'>
                        {socialLogins.map((social, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSocialLogin(social.provider)}
                            className='flex flex-col items-center gap-2 rounded-lg border border-gray-600 bg-transparent py-3 transition-colors hover:border-gray-400 hover:bg-gray-800/30'
                          >
                            <social.Icon className='h-6 w-6' />
                            <span className='font-satoshi text-xs text-gray-400'>
                              {social.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Casino Graphics - Mobile (Bottom) */}
                  <div className='mt-auto flex justify-center'>
                    <Image
                      src={banner.image || spinImg}
                      alt='Casino Games'
                      width={350}
                      height={250}
                      className='h-auto w-full object-contain'
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


'use client'

import { ChevronRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useInitialSettingsContext } from '@/context/initial-settings-context'

import { TawkChatModal } from '@/components/modals/tawk-chat-modal'

// Cryptocurrency logos
import bitcoinLogo from '@/assets/footer/bitcoin.png'
import bitcoincashLogo from '@/assets/footer/bitcoincash.png'
import dogecoinLogo from '@/assets/footer/dogecoin.png'
import etheriumLogo from '@/assets/footer/etherium.png'
import litecoinLogo from '@/assets/footer/litecoin.png'
import solanaLogo from '@/assets/footer/solana.png'
import tetherLogo from '@/assets/footer/tether.png'
import chatIcon from '@/assets/icons/chat.png'
import FacebookIcon from '@/assets/social/facebook.svg'
import InstagramIcon from '@/assets/social/instagram.svg'
import LinkedinIcon from '@/assets/social/linked-in.svg'
import XIcon from '@/assets/social/x.svg'

import { Button } from '../../ui/button'

const Footer = () => {
  const { t } = useTranslation()
  // const year = new Date().getFullYear()
  const { settings } = useInitialSettingsContext()
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [chatModalOpen, setChatModalOpen] = useState(false)

  // Handle chat button click
  const handleChatClick = () => {
    setChatModalOpen(true)
  }

  const footerMenu = [
    // {
    //   title: t('footer.support.support'),
    //   items: [
    //     {
    //       label: t('footer.support.live_support'),
    //       link: '#',
    //     },
    //     {
    //       label: t('footer.support.responsible_gaming'),
    //       link: '#',
    //     },
    //     {
    //       label: t('footer.support.faq'),
    //       link: '#',
    //     },
    //   ],
    // },
    {
      title: t('title.casino'),
      items: [
        {
          label: t('footer.casino.home'),
          link: '#',
        },
        {
          label: t('footer.casino.slots'),
          link: '#',
        },
        {
          label: t('footer.casino.top_games'),
          link: '#',
        },
        {
          label: t('footer.casino.live_games'),
          link: '#',
        },
        {
          label: t('footer.casino.blackjack'),
          link: '#',
        },
        {
          label: t('footer.casino.roulette'),
          link: '#',
        },
      ],
    },
    {
      title: t('footer.support.support'),
      items: [
        {
          label: t('footer.support.live_support'),
          link: '#',
        },
        {
          label: 'support@twox.com',
          link: '#',
        },
      ],
    },
    {
      title: t('footer.policy.our_policy'),
      items: [
        {
          label: t('footer.policy.terms_and_conditions'),
          link: '/terms',
        },
        {
          label: t('footer.support.responsible_gaming'),
          link: '#',
        },
        {
          label: t('footer.policy.self_exclusion'),
          link: '#',
        },
        {
          label: t('footer.policy.dispute_resolution'),
          link: '#',
        },
        {
          label: t('footer.policy.aml_policy'),
          link: '#',
        },
        {
          label: t('footer.policy.privacy_policy'),
          link: '#',
        },
      ],
    },
    // {
    //   title: t('footer.community.community'),
    //   items: [
    //     {
    //       label: t('footer.community.twitter'),
    //       link: 'https://twitter.com/twox',
    //       icon: 'twitter',
    //     },
    //     {
    //       label: t('footer.community.discord'),
    //       link: 'https://discord.gg/twox',
    //       icon: 'discord',
    //     },
    //     {
    //       label: t('footer.community.telegram'),
    //       link: 'https://t.me/twox',
    //       icon: 'telegram',
    //     },
    //   ],
    // },
  ]

  const socialsMedia = [
    {
      icon: FacebookIcon,
      link: '#',
    },
    {
      icon: XIcon,
      link: '#',
    },
    {
      icon: InstagramIcon,
      link: '#',
    },
    {
      icon: LinkedinIcon,
      link: '#',
    },
  ]

  const cryptocurrencies = [
    {
      name: 'SOLANA',
      logo: solanaLogo,
    },
    {
      name: 'Litecoin',
      logo: litecoinLogo,
    },
    {
      name: 'ethereum',
      logo: etheriumLogo,
    },
    {
      name: 'bitcoin',
      logo: bitcoinLogo,
    },
    {
      name: 'tether',
      logo: tetherLogo,
    },
    {
      name: 'dogecoin',
      logo: dogecoinLogo,
    },
    {
      name: 'bitcoincash',
      logo: bitcoincashLogo,
    },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <footer className='mt-10 flex flex-col gap-5 border-t border-background-third bg-[#0A0A0A] p-4 font-satoshi text-sm text-gray-300 sm:p-8'>
      <div className='flex flex-col gap-7'>
        <div className='flex flex-col justify-between gap-[8%] xl:flex-row 2xl:gap-[12%]'>
          <div className='max-w-[400px] space-y-4'>
            <Link href='/' className='inline-block cursor-pointer'>
              <Image
                src={settings.socialMediaSetting.logo}
                width={0}
                height={0}
                alt='logo'
                sizes='100vw'
                className='h-auto w-[132px]'
              />
            </Link>

            {/* Compliance Badges */}
            <div className='flex items-center gap-2'>
              <Link
                href='https://www.gambleaware.org'
                target='_blank'
                rel='noopener noreferrer'
                className='flex h-10 items-center justify-center rounded-lg bg-[#1A1A1A] px-3 transition-opacity hover:opacity-80'
              >
                <span className='font-satoshi text-xs font-medium text-white'>{t('footer_compliance.gamble_aware')}</span>
              </Link>
              <Link
                href='https://www.gambleaware.org'
                target='_blank'
                rel='noopener noreferrer'
                className='flex h-10 w-10 items-center justify-center rounded-lg bg-[#1A1A1A] transition-opacity hover:opacity-80'
              >
                <div className='flex h-7 w-7 items-center justify-center rounded-full border-2 border-white'>
                  <span className='font-satoshi text-xs font-bold text-white'>{t('footer_compliance.age_restriction')}</span>
                </div>
              </Link>
            </div>

            <div>
              <h6 className='text-bold text-sm text-white'>{t('footer_compliance.follow_us')}</h6>
              <div className='mt-3 flex items-center gap-1.5'>
                {socialsMedia.map((social, index) => (
                  <Link
                    href={social.link}
                    target='_blank'
                    key={index}
                    className='flex h-8 w-8 items-center justify-center rounded-full bg-mirage hover:scale-110 hover:cursor-pointer'
                  >
                    <social.icon className='' />
                  </Link>
                ))}
              </div>
            </div>

            <p className='text-left text-sm text-gray-400'>
              {t('footer_compliance.description')}
            </p>

            {/* <div className='mx-auto grid grid-cols-2 text-xs md:max-w-[80%] xl:hidden'>
              <div className='flex flex-col'>
                <span className='font-medium'>Support</span>
                <Link href='mailto:support@twox.gg' className='text-white'>
                  support@twox.gg
                </Link>
              </div>
              <div className='flex flex-col'>
                <span className='font-medium'>Partners</span>
                <Link href='mailto:partners@twox.gg' className='text-white'>
                  partners@twox.gg
                </Link>
              </div>
            </div> */}

            <div className='pt-2'>
              {/* <div className='text-xs xl:hidden'>{`©${year} tuabet.io | All Rights Reserved`}</div> */}
            </div>
          </div>

          <div className='grid flex-1 grid-cols-2 justify-end gap-6 md:grid-cols-3 md:gap-12'>
            {/* Menu Sections */}
            {footerMenu.map((section) => (
              <div key={section.title} className='min-w-[120px] space-y-3'>
                <h6 className='text-lg font-bold text-white'>
                  {section.title}
                </h6>
                <ul className='space-y-2.5'>
                  {section.items.map((item) => (
                    <li key={item.label} className='flex items-center gap-1'>
                      <ChevronRight size={16} />
                      <Link
                        href={item.link}
                        target={
                          section.title === 'Community' ? '_blank' : '_self'
                        }
                        className='text-sm font-medium text-[#FFFFFFCC] transition-colors duration-200 hover:text-white'
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Cryptocurrency Logos Section - Desktop Only */}
          <div className='hidden lg:flex flex-wrap items-center justify-between bg-[#0D0D0D] rounded-lg gap-6 md:gap-8 lg:gap-12 px-[60px] py-[15px]'>
            {cryptocurrencies.map((crypto, index) => (
              <div key={index} className='flex items-center gap-2'>
                <Image
                  src={crypto.logo}
                  alt={crypto.name}
                  width={120}
                  height={40}
                  className='h-auto w-auto object-contain'
                />
            </div>
            ))}
        </div>
      </div>

      {/* <Separator className='bg-background-third' /> */}

      {/* Bottom Section */}
      <div className='flex flex-col items-center gap-4'>
        {/* <div className='hidden xl:block'>{`©${year} tuabet.io | All Rights Reserved`}</div> */}

        {/* <div className='flex flex-wrap justify-center xl:hidden'>
          {Object.values(BLOCKCHAIN_PROTOCOL_NAME).map((blockchain) => {
            const Icon = getCoinNetworkData(blockchain).icon
            return (
              <span
                key={`footer-${blockchain}-item`}
                className='flex size-[45px] items-center justify-center'
                title={blockchain}
              >
                <Icon className='w-8' />
              </span>
            )
          })}
        </div> */}
        <Button
          variant='outline'
          size='icon'
          className='fixed bottom-20 right-8 z-30 flex h-12 w-12 items-center justify-center rounded-full border border-[#404044] bg-dark-grey-gradient hover:bg-dark-gradient lg:bottom-8'
          onClick={handleChatClick}
          aria-label='Open live chat'
        >
          <Image
            src={chatIcon}
            alt='Chat Icon'
            width={16}
            height={21}
            className='object-contain'
          />
        </Button>

        {/* {showScrollTop && (
          <Button
            variant='outline'
            size='icon'
            className='fixed bottom-8 right-8 z-50 rounded-full bg-background-seventh hover:bg-background-third'
            onClick={scrollToTop}
            aria-label='Scroll to top'
          >
            <ChevronUp size={16} />
          </Button>
        )} */}

        {/* Tawk.to Chat Modal */}
        <TawkChatModal open={chatModalOpen} onOpenChange={setChatModalOpen} />
      </div>
    </footer>
  )
}

export default Footer

'use client'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import React from 'react'
import { useTranslation } from 'react-i18next'

import blackjackImage from '@/assets/banner/icon/blackjack.png'
import bonusIcon from '@/assets/banner/icon/bonus.png'
import favoritesImage from '@/assets/banner/icon/favorites.png'
import featureImage from '@/assets/banner/icon/feature.png'
import gameShowImage from '@/assets/banner/icon/Isolation_Mode.png'
import gameIcon from '@/assets/banner/icon/live-game.png'
import popularIcon from '@/assets/banner/icon/popular.png'
import promotionImage from '@/assets/banner/icon/promotion.png'
import recentsImage from '@/assets/banner/icon/recent.png'
import recommendedImage from '@/assets/banner/icon/recommended.png'
import rouletteImage from '@/assets/banner/icon/roulette.png'
import slotIcon from '@/assets/banner/icon/slots.png'
import tableGameImage from '@/assets/banner/icon/tableGames.png'
import bannerImage from '@/assets/header-img.png'

const Banner = () => {
  const { t } = useTranslation()
  const pathname = usePathname()

  // write function with switch case that will return title and icon based on pathname
  const getBanner = () => {
    switch (pathname) {
      case '/popular':
        return {
          title: `${t('navbar.popular')}`,
          icon: popularIcon,
        }
      case '/live-casino':
        return {
          title: `${t('navbar.live_games')}`,
          icon: gameIcon,
        }
      case '/slots':
        return {
          title: `${t('navbar.slots')}`,
          icon: slotIcon,
        }
      case '/promotions':
        return {
          title: `${t('navbar.promotions')}`,
          icon: promotionImage,
        }
      case '/vip':
        return {
          title: `${t('navbar.vip_program')}`,
          icon: slotIcon,
        }
      case '/bonus':
        return {
          title: `${t('navbar.bonus_hub')}`,
          icon: bonusIcon,
        }
      case '/feature':
        return {
          title: `${t('navbar.feature_buy_in')}`,
          icon: featureImage,
        }
      case '/game-show':
        return {
          title: `${t('navbar.game_show')}`,
          icon: gameShowImage,
        }
      case '/recommended':
        return {
          title: `${t('navbar.recommended')}`,
          icon: recommendedImage,
        }
      case '/table-games':
        return {
          title: `${t('navbar.table_games')}`,
          icon: tableGameImage,
        }
      case '/roulette':
        return {
          title: `${t('navbar.roulette')}`,
          icon: rouletteImage,
        }
      case '/blackjack':
        return {
          title: `${t('navbar.blackjack')}`,
          icon: blackjackImage,
        }
      case '/favorites':
        return {
          title: `${t('navbar.favorites')}`,
          icon: favoritesImage,
        }
      case '/recent':
        return {
          title: `${t('navbar.recent')}`,
          icon: recentsImage,
        }
      default:
        return {
          title: 'Home',
          icon: bannerImage,
        }
    }
  }

  return (
    <div className='mb-7 rounded-2xl bg-custom-dual-gradient'>
      <div className='mb-6 flex h-24 w-full items-center justify-between rounded-2xl border border-mirage bg-[url("/background/banner-bg.png")] bg-cover bg-center bg-no-repeat pl-4 pr-3 md:h-[133px] md:pl-8'>
        <div className='flex items-center gap-4'>
          <Image src={getBanner().icon} alt='popular' width={36} height={36} />
          <h1 className='font-satoshi text-2xl font-bold text-white md:text-[32px]'>
            {getBanner().title}
          </h1>
        </div>
        <Image
          src={bannerImage}
          alt='banner'
          width={119}
          height={123}
          className='md:h[123px] h-20 w-20 bg-contain object-contain md:w-[119px]'
        />
      </div>
    </div>
  )
}

export default Banner

import { useTranslation } from 'react-i18next'

import { ProfileTabs } from '@/lib/profile'

import BlackjackColorIcon from '@/assets/menus/colored/Blackjack.svg'
import FavoritesColorIcon from '@/assets/menus/colored/Favorites.svg'
import FeatureColorIcon from '@/assets/menus/colored/feature-buy-In.svg'
import GameColorIcon from '@/assets/menus/colored/game-shows.svg'
import ColorHome from '@/assets/menus/colored/home.svg'
import ColorLiveGames from '@/assets/menus/colored/Live Games.svg'
import LiveSupportColorIcon from '@/assets/menus/colored/Live Support.svg'
import ColoredBonusBuy from '@/assets/menus/colored/My Bonuses.svg'
import ColorPopular from '@/assets/menus/colored/popular-slots.svg'
import ColoredPromotions from '@/assets/menus/colored/Promotions.svg'
import RecentColorIcon from '@/assets/menus/colored/Recent.svg'
import RecommendedColoredIcon from '@/assets/menus/colored/Recommended.svg'
import ReferEarnColorIcon from '@/assets/menus/colored/refer-earn.svg'
import RedeemColorIcon from '@/assets/menus/colored/redeem.svg'
import RouletteColorIcon from '@/assets/menus/colored/Roulette.svg'
import TableGameColorIcon from '@/assets/menus/colored/TableGames.svg'
import TwoXColoredClub from '@/assets/menus/colored/vip-program-red.svg'
import BlackjackIcon from '@/assets/menus/white/Blackjack.svg'
import FavoritesIcon from '@/assets/menus/white/Favorites.svg'
import FeatureIcon from '@/assets/menus/white/Feature Buy-In.svg'
import GameShowIcon from '@/assets/menus/white/Game shows.svg'
import Home from '@/assets/menus/white/home.svg'
import LiveGames from '@/assets/menus/white/Live Games.svg'
import LiveSportIcon from '@/assets/menus/white/Live Support.svg'
import BonusBuy from '@/assets/menus/white/My Bonuses.svg'
import Popular from '@/assets/menus/white/popular slots.svg'
import Promotions from '@/assets/menus/white/Promotions.svg'
import RecentIcon from '@/assets/menus/white/Recent.svg'
import RecommendedIcon from '@/assets/menus/white/Recommended.svg'
import RouletteIcon from '@/assets/menus/white/Roulette.svg'
import TableGameIcon from '@/assets/menus/white/Table Games.svg'
import TwoXClub from '@/assets/menus/white/vip prgram.svg'
import ReferEarnIcon from '@/assets/menus/white/refer-earn.svg'
import RedeemIcon from '@/assets/menus/white/redeem.svg'
import BonusIcon from '@/assets/profile/bonus.svg'
import LiveSupportIcon from '@/assets/profile/live-support.svg'
import LogoutIcon from '@/assets/profile/logout.svg'
import NotificationsIcon from '@/assets/profile/notification.svg'
import SettingsIcon from '@/assets/profile/settings.svg'
import TransactionsIcon from '@/assets/profile/transactions.svg'
import WalletIcon from '@/assets/profile/wallet.svg'

import { NavigationMenu, NavItem } from '@/types/menu'

export function useNavigationMenu(): NavigationMenu[] {
  const { t } = useTranslation()
  return [
    {
      section: t('navbar.games'),
      iconClassName: 'text-primary',
      type: 'list',
      items: [
        // {
        //   name: 'All Games',
        //   icon: AllGames,
        //   to: '/all-games',
        // },
        // {
        //   name: 'Providers',
        //   icon: Providers,
        //   to: '/providers',
        // },
        {
          name: t('navbar.home'),
          icon: Home,
          coloredIcon: ColorHome,
          to: '/',
        },
        {
          name: t('navbar.popular'),
          icon: Popular,
          coloredIcon: ColorPopular,
          to: '/popular',
        },
        {
          name: t('navbar.live_games'),
          icon: LiveGames,
          coloredIcon: ColorLiveGames,
          to: '/live-casino',
        },
        {
          name: t('navbar.feature_buy_in'),
          icon: FeatureIcon,
          coloredIcon: FeatureColorIcon,
          to: '/feature',
        },
        {
          name: t('navbar.game_show'),
          icon: GameShowIcon,
          coloredIcon: GameColorIcon,
          to: '/game-show',
        },
        {
          name: t('navbar.recommended'),
          icon: RecommendedIcon,
          coloredIcon: RecommendedColoredIcon,
          to: '/recommended',
        },
        {
          name: t('navbar.table_games'),
          icon: TableGameIcon,
          coloredIcon: TableGameColorIcon,
          to: '/table-games',
        },
        {
          name: t('navbar.roulette'),
          icon: RouletteIcon,
          coloredIcon: RouletteColorIcon,
          to: '/roulette',
        },
        {
          name: t('navbar.blackjack'),
          icon: BlackjackIcon,
          coloredIcon: BlackjackColorIcon,
          to: '/blackjack',
        },

        // {
        //   name: t('navbar.slots'),
        //   icon: Slots,
        //   coloredIcon: ColoredSlot,
        //   to: '/slots',
        // },
      ],
    },
    {
      section: t('navbar.other'),
      type: 'list',
      iconClassName: 'text-success',
      items: [
        {
          name: t('navbar.favorites'),
          icon: FavoritesIcon,
          coloredIcon: FavoritesColorIcon,
          to: '/favorites',
        },
        {
          name: t('navbar.recent'),
          icon: RecentIcon,
          coloredIcon: RecentColorIcon,
          to: '/recent',
        },
        {
          name: t('header.my_bonuses'),
          to: '/bonus',
          icon: BonusBuy,
          coloredIcon: ColoredBonusBuy,
        },
      ],
    },
    {
      section: t('navbar.other'),
      type: 'list',
      iconClassName: 'text-success',
      items: [
        {
          name: t('navbar.two_x_club'),
          to: '/vip',
          icon: TwoXClub,
          coloredIcon: TwoXColoredClub,
        },
        {
          name: t('navbar.promotions'),
          to: '/promotions',
          icon: Promotions,
          coloredIcon: ColoredPromotions,
        },
        {
          name: t('navbar.refer_earn'),
          action: 'open-refer-earn',
          icon: ReferEarnIcon,
          coloredIcon: ReferEarnColorIcon,
        },
        {
          name: t('navbar.redeem'),
          action: 'open-redeem',
          icon: RedeemIcon,
          coloredIcon: RedeemColorIcon,
        },
      ],
    },
    {
      section: t('navbar.other'),
      type: 'list',
      iconClassName: 'text-success',
      items: [
        {
          name: t('navbar.live_support'),
          icon: LiveSportIcon,
          coloredIcon: LiveSupportColorIcon,
          to: '/live-support',
        },
      ],
    },
  ]
}

export const useUserMenu = (isWalletConnected?: boolean): NavItem[] => {
  const { t } = useTranslation()
  
  // Build menu items conditionally
  const menuItems: NavItem[] = []
  
  // Always show "Connect Wallet" option
  menuItems.push({
    icon: WalletIcon,
    name: t('header.connect_wallet') || 'Connect Wallet',
    to: ``,
    action: 'connect-wallet',
  })
  
  // Show "Wallet" button only if connected
  if (isWalletConnected) {
    menuItems.push({
      icon: WalletIcon,
      name: t('header.wallet'),
      to: ``,
    })
  }
  
  // Add the rest of the menu items
  menuItems.push(
    {
      icon: BonusIcon,
      name: t('header.my_bonuses'),
      to: `/bonus`,
    },
    {
      icon: TransactionsIcon,
      name: t('header.transactions'),
      to: '/transaction-history',
    },
    {
      icon: SettingsIcon,
      name: t('header.settings'),
      to: `/settings`,
    },
    {
      icon: LiveSupportIcon,
      name: t('navbar.live_support'),
      to: `/live-support`,
    },
    {
      icon: NotificationsIcon,
      name: t('header.notifications'),
      action: 'open-notifications',
    },
    {
      icon: LogoutIcon,
      name: t('header.logout'),
    }
  )
  
  return menuItems
}

const footerMenu = [
  {
    title: 'Support',
    items: [
      {
        label: 'Live Support',
        link: '#',
      },
      {
        label: 'Responsible Gambling',
        link: '#',
      },
      {
        label: 'FAQ',
        link: '#',
      },
    ],
  },
  {
    title: 'Platform',
    items: [
      {
        label: 'Provably Fair',
        link: '#',
      },
      {
        label: 'Affiliate Program',
        link: '#',
      },
      {
        label: 'Redeem Code',
        link: '#',
      },
      {
        label: 'VIP Program',
        link: '#',
      },
    ],
  },
  {
    title: 'Policy',
    items: [
      {
        label: 'Terms & Conditions',
        link: '/terms',
      },
      {
        label: 'Privacy Policy',
        link: '#',
      },
      {
        label: 'AML Policy',
        link: '#',
      },
    ],
  },
]

export default footerMenu

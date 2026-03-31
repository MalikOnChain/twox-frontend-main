export enum BannerSection {
  HOME = 'home',
  PROMOTIONS = 'promotions',
  GAMES = 'games',
  SPORTS = 'sports',
  CASINO = 'casino',
  BONUSES = 'bonuses',
  RESPONSIBLE_GAMBLING = 'responsible-gambling',
  NEW_USER_REGISTRATION = 'new-user-registration',
  PAYMENT_METHODS = 'payment-methods',
  MOBILE_APP = 'mobile-app',
  LIVE_BETTING = 'live-betting',
  VIP_PROGRAM = 'vip-program',
  EVENTS = 'events',
  AFFILIATE = 'affiliate',
  BLOG_NEWS = 'blog-news',
  FOOTER = 'footer',
}

enum BannerDevice {
  DESKTOP = 'desktop',
  MOBILE = 'mobile',
  TABLET = 'tablet',
  SMARTWATCH = 'smartwatch',
}

export interface Banner {
  _id: string
  title: string
  image: string
  section: BannerSection
  position: number | string // Backend stores as string, but we convert to number for sorting
  device: BannerDevice
  language?: {
    code: string
    name: string
  }
  bannerData?: {
    title?: string
    subtitle?: string
    highlight?: string
    features?: string[]
  }
}

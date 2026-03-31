export interface SiteSettings {
  depositMinAmount: number
  withdrawMinAmount: number
  withdrawMaxAmount: number
  termsCondition: string
  socialMediaSetting: {
    logo: string
    logoSymbol: string
    logoStyle: {
      height: number
      top: number
      left: number
    }
    logoSymbolStyle: {
      height: number
      top: number
      left: number
    }
    title: string
    slogan: string
    instagram: string
    facebook: string
    twitter: string
    whatspp: string
    discord: string
    telegram: string
  }
  xpSetting: {
    status: string
    depositXpAmount: number
    lossXpAmount: number
    wagerXpSetting: {
      gameCategory: string
      wagerXpAmount: number
      _id: string
    }[]
  }
}

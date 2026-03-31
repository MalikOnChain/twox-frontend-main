import GoogleSvg from '@/assets/social/google.svg'

import { AUTH_PROVIDER_KEYS } from '@/types/auth'
// import Steam from '@/assets/social/steam.svg'

export const AUTH_PROVIDERS = [
  {
    provider: AUTH_PROVIDER_KEYS.GOOGLE,
    name: 'Google',
    icon: GoogleSvg,
  },
  // {
  //   provider: AUTH_PROVIDER_KEYS.WALLET_CONNECT,
  //   name: 'Wallet Connect',
  //   icon: WalletConnect,
  // },
  // {
  //   provider: AUTH_PROVIDER_KEYS.METAMASK,
  //   name: 'Metamask',
  //   icon: Metamask,
  // },
  // {
  //   provider: AUTH_PROVIDER_KEYS.COINBASE,
  //   name: 'Coinbase',
  //   icon: Coinbase,
  // },
  // {
  //   provider: AUTH_PROVIDER_KEYS.PHANTOM,
  //   name: 'Phantom',
  //   icon: Phantom,
  // },
  // {
  //   provider: AUTH_PROVIDER_KEYS.STEAM,
  //   name: 'Steam',
  //   icon: Steam,
  // },
]

export const getTokenFromLink = (link: string): string | null => {
  const params = new URLSearchParams(link.split('?')[1])
  const token = params.get('token')
  return token
}

export const getIdentifierFromLink = (link: string): string | null => {
  const params = new URLSearchParams(link.split('?')[1])
  const identifier = params.get('identifier')
  return identifier
}

export enum AUTH_TABS {
  signin = 'signin',
  signup = 'signup',
  forgotPassword = 'forgot_password',
}

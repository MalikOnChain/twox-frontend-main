import React, { MouseEvent, useState } from 'react'
import { toast } from 'sonner'

import { oAuthLogin } from '@/api/auth'

import { useEthereumWallet } from '@/context/features/wallet/wallet-connect-context'

import { AUTH_PROVIDERS } from '@/lib/auth'
import { cn } from '@/lib/utils'

import { Button } from '../../ui/button'

import { AUTH_PROVIDER_KEYS } from '@/types/auth'

const AuthProviders = ({
  className = '',
  handleOpenChange,
  buttonVariant = 'outline',
  buttonClassName = '',
  hideProviders = [],
}: {
  hideSeparator?: boolean
  className?: string
  buttonVariant?: 'secondary1' | 'dark-primary' | 'outline'
  handleOpenChange?: (open: boolean) => void
  buttonClassName?: string
  hideProviders?: AUTH_PROVIDER_KEYS[]
}) => {
  const [loading, setLoading] = useState<string | null>(null)
  const [_error, setError] = useState<string | null>(null)
  const { loginWithWallet: loginWithEthereumWallet } = useEthereumWallet()
  // const { loginWithWallet: loginWithSolanaWallet } = useSolanaWallet()

  const providerActions = {
    [AUTH_PROVIDER_KEYS.GOOGLE]: async () => {
      await oAuthLogin(AUTH_PROVIDER_KEYS.GOOGLE)
    },
    // [AUTH_PROVIDER_KEYS.WALLET_CONNECT]: async () => {
    //   await loginWithEthereumWallet('walletConnect')
    // },
    // [AUTH_PROVIDER_KEYS.COINBASE]: async () => {
    //   await loginWithEthereumWallet('coinbaseWallet')
    // },
    [AUTH_PROVIDER_KEYS.METAMASK]: async () => {
      await loginWithEthereumWallet('metaMask')
    },
    // [AUTH_PROVIDER_KEYS.PHANTOM]: async () => {
    //   await loginWithSolanaWallet()
    // },
  }

  const handleClick = async (e: MouseEvent<HTMLButtonElement>) => {
    const provider = e.currentTarget.dataset
      .provider as keyof typeof providerActions

    if (!provider || !providerActions[provider]) {
      toast.error('Selected authentication provider is not supported')
      return
    }

    setLoading(provider)
    setError(null)

    try {
      await providerActions[provider]()
      setLoading(null)
      handleOpenChange && handleOpenChange(false)
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Authentication failed'
      setLoading(null)
      setError(errorMessage)
      toast.error(errorMessage)
    }
  }

  return (
    <>
      <div className={cn('flex w-full justify-between gap-2', className)}>
        {AUTH_PROVIDERS.map((social) => {
          const Icon = social.icon
          if (hideProviders.includes(social.provider)) return null
          return (
            <Button
              data-provider={social.provider}
              key={`login${social.provider}`}
              onClick={handleClick}
              variant={buttonVariant}
              className={cn(
                'min-h-11 flex-1 rounded-xl border-none bg-background-fourth',
                buttonClassName
              )}
              disabled={Boolean(loading)}
              loading={loading === social.provider}
            >
              <Icon />
            </Button>
          )
        })}
      </div>
    </>
  )
}

export default AuthProviders

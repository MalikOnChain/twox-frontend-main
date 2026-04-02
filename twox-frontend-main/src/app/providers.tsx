'use client'

import { FpjsProvider } from '@fingerprintjs/fingerprintjs-pro-react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { usePathname } from 'next/navigation'
import React, { ReactNode, useEffect } from 'react'
import { WagmiProvider } from 'wagmi'
import '../i18n'

import { BettingStatusProvider } from '@/context/data/betting-status-context'
import { ProfileProvider } from '@/context/data/profile-context'
import TransactionHistoryProvider from '@/context/data/transaction-history-context'
import { EventProvider } from '@/context/event-context'
import { BannerProvider } from '@/context/features/banner-context'
import { ChatProvider } from '@/context/features/chat-context'
import { NotificationProvider } from '@/context/features/notification-context'
import { PromotionsProvider } from '@/context/features/promotions-context'
import { RewardsProvider } from '@/context/features/rewards-context'
import { TriviaProvider } from '@/context/features/trivia-context'
import { WalletProvider } from '@/context/features/wallet/wallet-connect-context'
import { FingerprintProvider } from '@/context/fingerprint-context'
import { LoadingProvider } from '@/context/loading-context'
import { MenuProvider } from '@/context/menu-context'
import { ModalProvider } from '@/context/modal-context'
import { RedeemModalProvider } from '@/context/redeem-modal-context'
import { ReferEarnModalProvider } from '@/context/refer-earn-modal-context'
import { SocketProvider } from '@/context/socket-context'
import { SocketHandlerProvider } from '@/context/socket-handler-context'
import { UserProvider } from '@/context/user-context'
import { VipProvider } from '@/context/vip-context'

import * as gtag from '@/lib/gtag'
import { wagmiConfig } from '@/lib/wagmi'
import { useAppSetup } from '@/hooks/features/use-app-setup'

import BlueOceanSync from '@/components/blueocean-sync'
import GeoRestrictionChecker from '@/components/geo-restriction-checker'
import { I18nProvider } from '@/components/i18n-provider'
import { Toaster } from '@/components/ui/sonner'

import storageHandler from '../lib/storage-utils'

const queryClient = new QueryClient()

const Providers = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname()
  const queryParams = React.useMemo(() => {
    return typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search)
      : new URLSearchParams()
  }, [])

  useEffect(() => {
    if (queryParams.get('ref')) {
      const { setValue } = storageHandler({ key: 'ref' })
      setValue(queryParams.get('ref') || '')
    }
  }, [queryParams])

  useEffect(() => {
    gtag.pageview(pathname)
  }, [pathname])

  useAppSetup()

  // FingerprintJS configuration
  const fingerprintApiKey = process.env.NEXT_PUBLIC_FINGERPRINT_API_KEY || ''
  const fingerprintRegion = (process.env.NEXT_PUBLIC_FINGERPRINT_REGION || 'eu') as 'us' | 'eu' | 'ap'

  // Build FingerprintProvider with FpjsProvider wrapper
  const fingerprintProviderContent = fingerprintApiKey ? (
    <FpjsProvider
      loadOptions={{
        apiKey: fingerprintApiKey,
        region: fingerprintRegion,
      }}
    >
      <FingerprintProvider>
        <SocketProvider>
          <EventProvider>
            <RewardsProvider>
              <PromotionsProvider>
                <BannerProvider>
                  <SocketHandlerProvider>
                    <WalletProvider>
                      <NotificationProvider>
                        <ChatProvider>
                          <TriviaProvider>
                            <BettingStatusProvider>
                              <TransactionHistoryProvider>
                                <VipProvider>
                                  <ModalProvider>
                                    <ReferEarnModalProvider>
                                      <RedeemModalProvider>
                                        <MenuProvider>
                                          <BlueOceanSync />
                                          <GeoRestrictionChecker />
                                          {children}
                                        </MenuProvider>
                                      </RedeemModalProvider>
                                    </ReferEarnModalProvider>
                                  </ModalProvider>
                                </VipProvider>
                              </TransactionHistoryProvider>
                            </BettingStatusProvider>
                          </TriviaProvider>
                        </ChatProvider>
                      </NotificationProvider>
                    </WalletProvider>
                  </SocketHandlerProvider>
                </BannerProvider>
              </PromotionsProvider>
            </RewardsProvider>
          </EventProvider>
        </SocketProvider>
      </FingerprintProvider>
    </FpjsProvider>
  ) : (
    <FingerprintProvider>
      <SocketProvider>
        <EventProvider>
          <RewardsProvider>
            <PromotionsProvider>
              <BannerProvider>
                <SocketHandlerProvider>
                  <WalletProvider>
                    <NotificationProvider>
                      <ChatProvider>
                        <TriviaProvider>
                          <BettingStatusProvider>
                            <TransactionHistoryProvider>
                              <VipProvider>
                                <ModalProvider>
                                  <ReferEarnModalProvider>
                                    <RedeemModalProvider>
                                      <MenuProvider>
                                        <BlueOceanSync />
                                        <GeoRestrictionChecker />
                                        {children}
                                      </MenuProvider>
                                    </RedeemModalProvider>
                                  </ReferEarnModalProvider>
                                </ModalProvider>
                              </VipProvider>
                            </TransactionHistoryProvider>
                          </BettingStatusProvider>
                        </TriviaProvider>
                      </ChatProvider>
                    </NotificationProvider>
                  </WalletProvider>
                </SocketHandlerProvider>
              </BannerProvider>
            </PromotionsProvider>
          </RewardsProvider>
        </EventProvider>
      </SocketProvider>
    </FingerprintProvider>
  )

  return (
    <>
      <I18nProvider>
        <WagmiProvider config={wagmiConfig}>
          <LoadingProvider>
            <QueryClientProvider client={queryClient}>
              <UserProvider>
                <ProfileProvider>
                  {fingerprintProviderContent}
                </ProfileProvider>
              </UserProvider>
            </QueryClientProvider>
          </LoadingProvider>
        </WagmiProvider>
      </I18nProvider>
      <Toaster richColors position='top-right' />
    </>
  )
}

export default Providers

'use client'

import Image from 'next/image'
import Link from 'next/link'
import React, { memo, MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'

import { useInitialSettingsContext } from '@/context/initial-settings-context'
import { useLoading } from '@/context/loading-context'
import { AUTH_TABS, ModalType, useModal } from '@/context/modal-context'
import { useUser } from '@/context/user-context'

import { cn } from '@/lib/utils'

import NotificationDropdown from '@/components/layout/header/notification-dropdown/notification-dropdown'
import { Input } from '@/components/ui/input'

import loginUserIcon from '@/assets/icons/login-icon.png'
import registerUserIcon from '@/assets/icons/register-outline.png'
import SearchIcon from '@/assets/icons/search-icon.svg'

import BalanceIndicator from './balance-indicator/balance-indicator'
import UserMenu from './user-menu/user-menu'
import { Button } from '../../ui/button'
const Header = () => {
  const { isAuthenticated } = useUser()
  const { isLoading } = useLoading()
  const { settings } = useInitialSettingsContext()
  const { setIsOpen, setType, setActiveTab } = useModal()
  // const { setIsOpen: setIsOpenChat, isOpen: isOpenChat } = useChat()
  // const { setIsOpen: setIsOpenBonus, isOpen: isOpenBonus } = useRewards()
  // const { isOpen: isOpenNotification, setIsOpen: setIsOpenNotification } =
  //   useNotification()
  const { t } = useTranslation()

  const handleOpenAuthModal = (e: MouseEvent<HTMLButtonElement>) => {
    const tab = e.currentTarget.dataset.tab as AUTH_TABS
    setType(ModalType.Auth)
    setActiveTab(tab)
    setIsOpen(true)
  }

  // const handleOpenPanel = (panel: string) => {
  //   if (panel === 'bonus') {
  //     setIsOpenBonus((prev: boolean) => !prev)
  //     if (isOpenNotification) {
  //       setIsOpenNotification(false)
  //     }
  //     if (isOpenChat) {
  //       setIsOpenChat(false)
  //     }
  //   }
  //   if (panel === 'notification') {
  //     setIsOpenNotification((prev: boolean) => !prev)
  //     if (isOpenBonus) {
  //       setIsOpenBonus(false)
  //     }
  //     if (isOpenChat) {
  //       setIsOpenChat(false)
  //     }
  //   }
  //   if (panel === 'chat') {
  //     setIsOpenChat((prev: boolean) => !prev)
  //     if (isOpenBonus) {
  //       setIsOpenBonus(false)
  //     }
  //     if (isOpenNotification) {
  //       setIsOpenNotification(false)
  //     }
  //   }
  // }

  const handleWalletClick = () => {
    setType(ModalType.DepositWithdraw)
    setIsOpen(true)
  }

  const openBalanceModal = () => {
    setType(ModalType.Balance)
    setIsOpen(true)
  }

  return (
    <header className='w-fill-available fixed top-0 z-40 bg-dark-grey'>
      <div className='w-full max-w-[1440px]'>
        <div className='flex h-full items-center justify-between gap-1 px-main-spacing sm:gap-2'>
          <div className='flex items-center justify-center gap-3 p-0 py-5 lg:gap-4'>
            <Link href='/' className={cn('relative cursor-pointer')}>
              <Image
                src={settings.socialMediaSetting.logo}
                alt='logo'
                width={125}
                height={48}
                style={settings.socialMediaSetting.logoStyle}
                className={cn(
                  'relative block !h-9 w-24 object-contain md:!h-12 md:w-[125px]',
                  {
                    block: !isAuthenticated,
                  }
                )}
              />
              {/* <Image
                src={settings.socialMediaSetting.logoSymbol}
                alt='logo'
                width={0}
                height={0}
                sizes='100vw'
                style={settings.socialMediaSetting.logoSymbolStyle}
                className={cn(
                  'relative min-h-12 w-auto min-w-[62px] sm:hidden sm:pr-9',
                  {
                    hidden: !isAuthenticated,
                  }
                )}
              /> */}
            </Link>
          </div>
          {/* <div className='hidden lg:block'>
            <Breadcrumb />
          </div> */}
          {isAuthenticated && (
            <>
              <div className='flex gap-2'>
                <BalanceIndicator
                  openDepositWithdrawModal={handleWalletClick}
                  openBalanceModal={openBalanceModal}
                />
              </div>
            </>
          )}
          <div className='flex items-center justify-end gap-1 sm:gap-4'>
            <div className='flex items-center justify-end gap-1 sm:gap-4'>
              <div className='hidden gap-4 md:flex lg:hidden xl:flex'>
                {isAuthenticated && <NotificationDropdown />}
                <Input
                  type='search'
                  placeholder='Search'
                  startAddon={<SearchIcon />}
                  wrapperClassName='border border-mirage bg-cinder lg:w-[239px]'
                />
              </div>
              <div className='hidden h-10 w-[1px] bg-mirage sm:block' />
              {!isAuthenticated && !isLoading && (
                <div className='flex gap-2'>
                  <Button
                    data-tab={AUTH_TABS.signin}
                    variant='secondary1'
                    onClick={handleOpenAuthModal}
                  >
                    <Image
                      src={loginUserIcon}
                      alt='register'
                      width={12}
                      height={12}
                      className='object-contain'
                    />
                    {t('header.sign_in')}
                  </Button>
                  <Button
                    data-tab={AUTH_TABS.signup}
                    variant='secondary2'
                    onClick={handleOpenAuthModal}
                  >
                    <Image
                      src={registerUserIcon}
                      alt='register'
                      width={16}
                      height={12}
                      className='object-contain'
                    />
                    {t('header.sign_up')}
                  </Button>
                </div>
              )}
              {/* <Button
                variant='secondary2'
                onClick={() => {
                  setType(ModalType.AccessRestricted)
                  setIsOpen(true)
                }}
              >
                Access Restricted
              </Button> */}

              {isAuthenticated && (
                <>
                  <UserMenu />
                </>
              )}
            </div>

            {/* <Button
              variant='icon'
              size='icon'
              className='hidden md:flex'
              onClick={() => handleOpenPanel('chat')}
            >
              <Chat />
            </Button> */}
          </div>
        </div>
      </div>
    </header>
  )
}

export default memo(Header)

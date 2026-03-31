'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React, { MouseEvent } from 'react'

// import useChat from '@/context/features/chat-context'
import { useMenu } from '@/context/menu-context'
import { AUTH_TABS, ModalType, useModal } from '@/context/modal-context'
import { useUser } from '@/context/user-context'

import { cn } from '@/lib/utils'

import BonusRedIcon from '@/assets/menus/bonuses red.svg'
import BonusWhiteIcon from '@/assets/menus/bonuses white.svg'
import CasinoRedIcon from '@/assets/menus/casino red.svg'
import CasinoWhiteIcon from '@/assets/menus/casino white.svg'
import DepositRedIcon from '@/assets/menus/deposit red.svg'
import DepositWhiteIcon from '@/assets/menus/deposit white.svg'
import HomeRedIcon from '@/assets/menus/home-red.svg'
import HomeWhiteIcon from '@/assets/menus/home-white.svg'
import MenuRedIcon from '@/assets/menus/menu-red.svg'
import MenuWhiteIcon from '@/assets/menus/menu-white.svg'

const MobileMenuBar = () => {
  // const { isOpen: isChatOpen, setIsOpen: setIsOpenChat } = useChat()
  const { isOpen, setIsOpen } = useMenu()

  const pathname = usePathname()
  const { isOpen: isModalOpen, type: modalType } = useModal()
  // const { isOpen: isRewardsOpen, setIsOpen: setIsOpenRewards } = useRewards()
  // const { isOpen: isNotificationOpen, setIsOpen: setIsOpenNotification } =
  //   useNotification()
  const { setIsOpen: setIsOpenModal, setType, setActiveTab } = useModal()
  const { isAuthenticated } = useUser()
  const router = useRouter()

  const handleMenuClick = () => {
    setIsOpen((prev) => !prev)
    // if (isChatOpen) {
    //   setIsOpenChat(false)
    // }
  }

  const handleOpenAuthModal = (e: MouseEvent<HTMLButtonElement>) => {
    const tab = e.currentTarget.dataset.tab as AUTH_TABS
    setType(ModalType.Auth)
    setActiveTab(tab)
    setIsOpenModal(true)
    setIsOpen(false)
  }

  const handleOpenDepositModal = () => {
    setType(ModalType.DepositWithdraw)
    setIsOpenModal(true)
    setIsOpen(false)
  }

  return (
    <div
      className={`${cn(
        'fixed bottom-0 z-50 h-[66px] w-full rounded-t-[18px] lg:hidden',
        'shadow-0-m4-10-0',
        { 'z-[49]': isModalOpen && modalType === ModalType.Wallet }
      )} shadow-black/25`}
    >
      <div className='flex h-full w-full justify-around bg-[#111111D9] font-medium backdrop-blur-[20px]'>
        <span
          className={cn(
            'flex flex-1 cursor-pointer flex-col items-center justify-center gap-0.5',
            { 'text-arty-red': isOpen }
          )}
          onClick={handleMenuClick}
        >
          {isOpen ? <MenuRedIcon /> : <MenuWhiteIcon />}
          <span className='text-[10px]'>Menu</span>
        </span>

        <Link
          href='/'
          className={cn(
            'flex flex-1 cursor-pointer flex-col items-center justify-center gap-0.5',
            {
              'text-arty-red': pathname === '/' && !isOpen,
            }
          )}
          onClick={() => setIsOpen(false)}
        >
          {pathname === '/' && !isOpen ? <HomeRedIcon /> : <HomeWhiteIcon />}
          <span className='text-[10px]'>Home</span>
        </Link>
        <span
          className={cn(
            'flex flex-1 cursor-pointer flex-col items-center justify-center gap-0.5',
            {
              'text-arty-red': pathname === '/profile/settings' && !isOpen,
            }
          )}
          onClick={
            isAuthenticated ? handleOpenDepositModal : handleOpenAuthModal
          }
          data-tab={AUTH_TABS.signin}
        >
          {ModalType.DepositWithdraw === modalType && isModalOpen ? (
            <DepositRedIcon />
          ) : (
            <DepositWhiteIcon />
          )}
          <span className='text-[10px]'>Deposit</span>
        </span>
        <Link
          href='/bonus'
          className={cn(
            'flex flex-1 cursor-pointer flex-col items-center justify-center gap-0.5',
            {
              'text-arty-red': pathname === '/bonus' && !isOpen,
            }
          )}
          onClick={() => setIsOpen(false)}
        >
          {pathname === '/bonus' && !isOpen ? (
            <BonusRedIcon />
          ) : (
            <BonusWhiteIcon />
          )}
          <span className='text-[10px]'>Bonuses</span>
        </Link>

        <Link
          href='/slots'
          className={cn(
            'flex flex-1 cursor-pointer flex-col items-center justify-center gap-0.5',
            {
              'text-arty-red': pathname === '/slots' && !isOpen,
            }
          )}
          onClick={() => setIsOpen(false)}
        >
          {pathname === '/slots' && !isOpen ? (
            <CasinoRedIcon />
          ) : (
            <CasinoWhiteIcon />
          )}
          <span className='text-[10px]'>Casino</span>
        </Link>

        {/* <span
          className={cn(
            'flex flex-1 cursor-pointer flex-col items-center justify-center gap-0.5',
            {
              'text-arty-red': pathname === '/profile/settings' && !isOpen,
            }
          )}
          onClick={
            isAuthenticated
              ? () => router.push('/settings/general')
              : handleOpenAuthModal
          }
          data-tab={AUTH_TABS.signin}
        >
          <UserIcon />
          <span className='text-[10px]'>
            {isAuthenticated ? 'Profile' : 'Login'}
          </span>
        </span> */}

        {/* <span
          onClick={handleOpenChat}
          className={cn(
            'flex cursor-pointer flex-col items-center justify-center gap-0.5',
            { 'text-success-300': isChatOpen }
          )}
        >
          <ChatIcon />
          <span className='text-[10px]'>Chat</span>
        </span> */}
      </div>
    </div>
  )
}

export default MobileMenuBar

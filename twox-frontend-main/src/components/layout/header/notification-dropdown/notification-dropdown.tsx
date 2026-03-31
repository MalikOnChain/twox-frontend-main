import React, { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import useNotification from '@/context/features/notification-context'

import { cn } from '@/lib/utils'

import NotificationContent from '@/components/layout/header/notification-dropdown/notification-content'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import Close from '@/assets/close.svg'
import NotificationIcon from '@/assets/icons/notification-icon.svg'

const NotificationDropdown = () => {
  const { isOpen, setIsOpen, unreadCount, markAllAsRead, setNotifications } =
    useNotification()
  const wasOpenRef = useRef(false)
  const { t } = useTranslation()

  // Mark notifications as read when dropdown closes, but only if it was previously open
  useEffect(() => {
    // If dropdown was open and is now closed
    if (wasOpenRef.current && !isOpen && unreadCount > 0) {
      markAllAsRead()
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, isRead: true }))
      )
    }

    // Keep track of previous state
    wasOpenRef.current = isOpen
  }, [isOpen, unreadCount, markAllAsRead, setNotifications])

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <span
          className={cn(
            'relative flex cursor-pointer items-center text-secondary-text hover:text-foreground data-[state=open]:text-mulberry'
          )}
        >
          <div className='flex h-10 w-10 items-center justify-center rounded-lg border border-mirage bg-cinder'>
            <NotificationIcon />
          </div>
          {unreadCount > 0 && (
            <span className='absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-medium text-white'>
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </span>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className='relative flex !h-[300px] w-[475px] flex-col rounded-lg border-none bg-[#111015] py-0 shadow-0-0-4-0 shadow-black/25 sm:h-auto sm:w-[390px] sm:!min-w-[390px] sm:!max-w-[390px]'
        side='top'
        align='end'
        sideOffset={10}
      >
        <div
          className='absolute right-5 top-5 z-50 flex h-[20px] w-[20px] cursor-pointer items-center justify-center rounded-full border border-white/30 transition-all hover:border-white/50 hover:bg-white/5'
          onClick={() => setIsOpen(false)}
        >
          <Close className='h-3.5 w-3.5 text-white' />
        </div>
        <h1 className='z-40 pb-2 pl-5 pt-5 font-satoshi text-[20px] font-bold text-white'>
          {t('header.notifications')}
        </h1>
        <NotificationContent />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default NotificationDropdown

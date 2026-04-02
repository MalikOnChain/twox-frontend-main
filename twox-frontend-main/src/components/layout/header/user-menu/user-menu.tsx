import React, { useState } from 'react'

import useNotification from '@/context/features/notification-context'
import { useUser } from '@/context/user-context'

import { useUserMenu } from '@/lib/menu'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import UserIcon from '@/assets/icons/user.svg'

import NavItem from './nav-item'

const UserMenu = () => {
  const { user } = useUser()
  const { setIsOpen: setNotificationOpen } = useNotification()
  const [open, setOpen] = useState(false)

  const menu = useUserMenu()

  if (!user) return null

  const handleMenuItemClick = (item: { action?: string }) => {
    if (item.action === 'open-notifications') {
      setOpen(false)
      setNotificationOpen(true)
    }
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <span className='relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-mirage bg-[#141317] !pl-[5px]'>
          <UserIcon className='h-6 w-6' />
        </span>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className='flex w-[240px] flex-col gap-2 rounded-lg border-none bg-[#111015] p-2.5 shadow-0-0-4-0 shadow-black/25'
        side='top'
        align='end'
        sideOffset={10}
      >
        {menu.map((item) => {
          if (item.action) {
            return (
              <DropdownMenuItem
                key={item.name}
                className='flex cursor-pointer items-center gap-2 rounded-lg p-2.5 text-sm font-medium text-muted-foreground hover:bg-mirage hover:text-foreground'
                onClick={() => handleMenuItemClick(item)}
              >
                {item.icon && <item.icon className='size-4' />}
                {item.name}
              </DropdownMenuItem>
            )
          }

          return (
            <DropdownMenuItem
              asChild
              key={item.name}
              className='p-0'
              onSelect={() => setOpen(false)}
            >
              <NavItem {...item} onClose={() => setOpen(false)} />
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserMenu

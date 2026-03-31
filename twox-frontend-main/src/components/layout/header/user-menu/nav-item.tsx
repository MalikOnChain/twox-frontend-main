import Link from 'next/link'
import React, { forwardRef, LegacyRef } from 'react'

import { useMenu } from '@/context/menu-context'
import { ModalType, useModal } from '@/context/modal-context'
import { useSocket } from '@/context/socket-context'
import { useUser } from '@/context/user-context'

import { SOCKET_NAMESPACES } from '@/lib/socket'
import { cn } from '@/lib/utils'

import { NavItem as TNavItem } from '@/types/menu'

interface NavItemProps extends TNavItem {
  onClose?: () => void
}

const NavItem = forwardRef(
  ({ icon, to, name, onClose }: NavItemProps, ref: LegacyRef<any>) => {
    const Icon = icon as any
    const { logout } = useUser()
    const { socket } = useSocket(SOCKET_NAMESPACES.USER)
    const { setIsOpen } = useMenu()
    const { setType, setIsOpen: setModalOpen } = useModal()

    const handleLogout = () => {
      logout()
      if (socket) {
        socket.emit('auth:logout', null)
      }
      onClose?.()
      setIsOpen(false)
    }

    const handleLogoutClick = () => {
      handleLogout()
    }

    const handleWalletClick = () => {
      setType(ModalType.Balance)
      setModalOpen(true)
      onClose?.()
      setIsOpen(false)
    }

    // Handle wallet option specially
    if (name.toLowerCase().includes('wallet') && !name.toLowerCase().includes('connect')) {
      return (
        <div
          ref={ref}
          className={cn(
            'flex cursor-pointer items-center gap-2 rounded-lg p-2.5 text-sm font-medium text-muted-foreground',
            'hover:bg-mirage hover:text-foreground'
          )}
          onClick={handleWalletClick}
        >
          {icon && <Icon className='size-4' />}
          {name}
        </div>
      )
    }

    if (!to) {
      return (
        <div
          ref={ref}
          data-name={name}
          className={cn(
            'flex cursor-pointer items-center gap-1.5 rounded-lg p-2.5 text-sm font-medium text-muted-foreground',
            'hover:bg-mirage hover:text-foreground'
          )}
          onClick={handleLogoutClick}
        >
          {icon && <Icon className='size-5' />}
          {name}
        </div>
      )
    }

    return (
      <Link
        href={to}
        ref={ref}
        className={cn(
          'flex cursor-pointer items-center gap-2 rounded-lg p-2.5 text-sm font-medium text-muted-foreground',
          'hover:bg-mirage hover:text-foreground'
        )}
        onClick={() => {
          onClose?.()
          setIsOpen(false)
        }}
      >
        {icon && <Icon className='size-4' />}
        {name}
      </Link>
    )
  }
)

export default NavItem
NavItem.displayName = 'NavItem'

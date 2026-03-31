import React, { useState } from 'react'

import { useUser } from '@/context/user-context'
import { useWalletConnection } from '@/context/wallet-connection-context'
import { useSolanaWallet } from '@/context/solana-wallet-context'
import useNotification from '@/context/features/notification-context'

import { useUserMenu } from '@/lib/menu'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import UserIcon from '@/assets/icons/user.svg'
import MetaMaskIcon from '@/assets/wallets/metamask.svg'
import PhantomIcon from '@/assets/wallets/phantom.svg'

import NavItem from './nav-item'

const UserMenu = () => {
  const { user } = useUser()
  const { 
    isConnected: isEvmConnected, 
    connect: connectEvm, 
    disconnect: disconnectEvm 
  } = useWalletConnection()
  const { 
    isConnected: isSolanaConnected, 
    connect: connectSolana,
    disconnect: disconnectSolana
  } = useSolanaWallet()
  const { setIsOpen: setNotificationOpen } = useNotification()
  const [open, setOpen] = useState(false)
  
  const isWalletConnected = isEvmConnected || isSolanaConnected
  const menu = useUserMenu(isWalletConnected)

  if (!user) return null

  const handleWalletToggle = async (walletType: 'metamask' | 'phantom') => {
    if (walletType === 'metamask') {
      if (isEvmConnected) {
        // Disconnect if already connected
        try {
          await disconnectEvm()
        } catch (error) {
          console.error('Failed to disconnect MetaMask:', error)
        }
      } else {
        // Connect if not connected
        try {
          await connectEvm()
        } catch (error) {
          console.error('Failed to connect MetaMask:', error)
        }
      }
    } else if (walletType === 'phantom') {
      if (isSolanaConnected) {
        // Disconnect if already connected
        try {
          await disconnectSolana()
        } catch (error) {
          console.error('Failed to disconnect Phantom:', error)
        }
      } else {
        // Connect if not connected
        try {
          await connectSolana()
        } catch (error) {
          console.error('Failed to connect Phantom:', error)
        }
      }
    }
  }

  const handleMenuItemClick = (item: any) => {
    if (item.action === 'open-notifications') {
      setOpen(false) // Close user menu
      setNotificationOpen(true) // Open notifications dropdown
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
          // Special handling for "Connect Wallet" - show submenu for MetaMask/Phantom
          if (item.action === 'connect-wallet') {
            return (
              <DropdownMenuSub key={item.name}>
                <DropdownMenuSubTrigger className='flex cursor-pointer items-center gap-2 rounded-lg p-2.5 text-sm font-medium text-muted-foreground hover:bg-mirage hover:text-foreground'>
                  {item.icon && <item.icon className='size-4' />}
                  {item.name}
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className='rounded-lg border-none bg-[#111015] p-2 shadow-0-0-4-0 shadow-black/25 min-w-[200px]'>
                  <DropdownMenuItem
                    className='flex cursor-pointer items-center justify-between gap-2 rounded-lg p-2.5 text-sm font-medium text-muted-foreground hover:bg-mirage hover:text-foreground'
                    onClick={() => handleWalletToggle('metamask')}
                  >
                    <span className='flex items-center gap-2'>
                      <MetaMaskIcon className='size-4' />
                      MetaMask
                    </span>
                    <span className={`text-xs ${isEvmConnected ? 'text-green-500' : 'text-gray-500'}`}>
                      {isEvmConnected ? '● Connected' : '○ Connect'}
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className='flex cursor-pointer items-center justify-between gap-2 rounded-lg p-2.5 text-sm font-medium text-muted-foreground hover:bg-mirage hover:text-foreground'
                    onClick={() => handleWalletToggle('phantom')}
                  >
                    <span className='flex items-center gap-2'>
                      <PhantomIcon className='size-4' />
                      Phantom
                    </span>
                    <span className={`text-xs ${isSolanaConnected ? 'text-green-500' : 'text-gray-500'}`}>
                      {isSolanaConnected ? '● Connected' : '○ Connect'}
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            )
          }

          // Handle items with custom actions (like notifications)
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


'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { MouseEvent, useState } from 'react'

import { useMenu } from '@/context/menu-context'
import { useRedeemModal } from '@/context/redeem-modal-context'
import { useReferEarnModal } from '@/context/refer-earn-modal-context'

import { cn } from '@/lib/utils'

import { NavItem } from '@/types/menu'

interface NavMenuItemProps extends NavItem {
  className?: string
}

const NavMenuItem = ({
  icon,
  className = '',
  name,
  to,
  items,
  disabled,
  coloredIcon,
  action,
}: NavMenuItemProps) => {
  const Icon = icon
  const ColoredIcon = coloredIcon
  const { isExpanded, isOpen, setIsOpen } = useMenu()
  const { openModal: openReferEarnModal } = useReferEarnModal()
  const { openModal: openRedeemModal } = useRedeemModal()
  const pathnames = usePathname()
  const isActive = to === pathnames

  const [isHovered, setIsHovered] = useState(false)

  const handleToggle = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
  }

  const handleClick = (e?: MouseEvent) => {
    // Handle action-based menu items
    if (action) {
      e?.preventDefault()
      
      if (action === 'open-refer-earn') {
        openReferEarnModal()
      } else if (action === 'open-redeem') {
        openRedeemModal()
      }
      
      // Close mobile menu after action
      if (isOpen) {
        setIsOpen(false)
      }
      return
    }

    // Handle regular navigation
    if (!isOpen) return
    setIsOpen(false)
  }

  const content = (
    <div className='group relative' title={isExpanded ? '' : name}>
      <div
        className={cn(
          'flex h-8 items-center gap-2 rounded-sm bg-secondary text-muted-foreground md:h-10 md:rounded-lg',
          'group-hover:bg-primary-300 group-hover:text-white',
          'transition-all duration-300',
          'px-2 md:px-4',
          { 'bg-primary text-white': isActive },
          { 'justify-center px-1 md:px-1': !isExpanded && !isOpen },
          className
        )}
      >
        {Icon && <Icon className='h-5 w-5' />}
        {isExpanded && (
          <span className='flex-1 whitespace-nowrap font-medium'>{name}</span>
        )}
      </div>
    </div>
  )

  if (items && items.length > 0) {
    return (
      <div onClick={handleToggle} className='inline-block w-full'>
        {content}
      </div>
    )
  }

  // If action is provided, render as button instead of link
  if (action) {
    return (
      <li>
        <button
          onClick={handleClick}
          className={`flex w-full items-center gap-2 rounded-lg border border-transparent p-2 font-satoshi text-sm font-normal hover:shadow-card-shadow-red hover:!border-gradient-vertical ${className}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {isHovered
            ? ColoredIcon && <ColoredIcon className='h-5 w-5' />
            : Icon && <Icon className='h-5 w-5' />}

          {name}
        </button>
      </li>
    )
  }

  return (
    <li>
      <Link
        href={disabled ? '#' : to || '#'}
        onClick={handleClick}
        className={`flex w-full items-center gap-2 rounded-lg border border-transparent p-2 font-satoshi text-sm font-normal hover:shadow-card-shadow-red hover:!border-gradient-vertical ${isActive ? 'border !border-mulberry bg-dark-grey-gradient shadow-card-shadow-red' : ''} ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {isHovered || isActive
          ? ColoredIcon && <ColoredIcon className='h-5 w-5' />
          : Icon && <Icon className='h-5 w-5' />}

        {name}
      </Link>
    </li>
  )
}

export default NavMenuItem

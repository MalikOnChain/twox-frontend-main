'use client'
import { ChevronDown } from 'lucide-react'
import React, { useMemo } from 'react'

import { useMenu } from '@/context/menu-context'

import { cn } from '@/lib/utils'

import { NavigationMenu } from '@/types/menu'

interface NavMenuTriggerProps extends Pick<NavigationMenu, 'icon' | 'section'> {
  className?: string
  isOpen: boolean
  isActive: boolean
  iconClassName?: string
  onClick?: () => void
}

const NavMenuTrigger = ({
  icon,
  section,
  className = '',
  isOpen,
  isActive,
  iconClassName,
  onClick,
}: NavMenuTriggerProps) => {
  const { isExpanded } = useMenu()
  const _iconClassName = useMemo(() => {
    if (section === 'Games') return 'drop-shadow-0-12-0-primary'
    return 'drop-shadow-0-12-0-success'
  }, [section])

  const Icon = icon
  return (
    <div
      className={cn(
        'flex items-center gap-2 text-muted-foreground',
        'group-hover:bg-primary-300 group-hover:text-foreground',
        'cursor-pointer transition-colors duration-300',
        { 'justify-center px-1 md:px-1': !isExpanded },
        { 'text-foreground': isOpen },
        { 'text-foreground': isActive },
        className
      )}
      onClick={onClick}
    >
      {Icon && (
        <Icon
          className={cn(
            'h-5 w-5 min-w-5 drop-shadow-0-12-0-primary',
            _iconClassName,
            iconClassName
          )}
        />
      )}

      {isExpanded && (
        <>
          <span className='flex-1 whitespace-nowrap font-bold leading-[1]'>
            {section}
          </span>
          <span className='flex size-5 items-center justify-center rounded bg-[#FFFFFF0D] text-white'>
            <ChevronDown
              size={16}
              className={cn({
                'rotate-[180deg]': isOpen,
              })}
            />
          </span>
        </>
      )}
    </div>
  )
}

export default NavMenuTrigger

import * as Collapsible from '@radix-ui/react-collapsible'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { memo, useCallback, useMemo, useState } from 'react'

import { useMenu } from '@/context/menu-context'

import { cn } from '@/lib/utils'

import NavMenuTrigger from '@/components/layout/nav-menu/nav-menu-trigger'

import { NavigationMenu } from '@/types/menu'

const CollapsibleMenu = ({ menu }: { menu: NavigationMenu }) => {
  const { section, iconClassName, className = '', icon: Icon, items } = menu
  const pathnames = usePathname()
  const isActive = useMemo(() => {
    return items.some((item) => item.to === pathnames)
  }, [items, pathnames])
  const {
    isOpen: isSidebarOpen,
    isExpanded,
    setIsOpen: setSidebarIsOpen,
  } = useMenu()
  const [isOpen, setIsOpen] = useState(true)

  const isMenuActive = useCallback(
    (to?: string) => {
      if (!to) return false
      return to === pathnames
    },
    [pathnames]
  )

  const handleTriggerToggle = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  const handleClick = useCallback(() => {
    if (!isSidebarOpen) return
    setSidebarIsOpen(false)
  }, [isSidebarOpen, setSidebarIsOpen])

  return (
    <div
      className={`relative bg-background-third ${isExpanded ? 'rounded-2xl p-4' : 'rounded-xl p-3'}`}
    >
      {/* Trigger Button */}
      <NavMenuTrigger
        icon={Icon}
        iconClassName={iconClassName}
        section={section}
        isOpen={isOpen}
        isActive={isActive}
        onClick={handleTriggerToggle}
        className={cn('relative z-[1]', className)}
      />

      <div className='relative'>
        <Collapsible.Root open={isOpen}>
          <Collapsible.Content>
            <div
              className={cn(
                'flex flex-col justify-center gap-1 pt-3',
                isExpanded ? 'pt-3' : 'pt-0'
              )}
            >
              {items.map((item, index) => (
                <Link
                  key={index}
                  href={item.disabled ? '#' : item.to || ''}
                  onClick={handleClick}
                  title={item.name}
                  className={cn(
                    'flex h-10 w-full items-center gap-3 text-center text-sm text-muted-foreground transition-all duration-300 max-md:text-[14px]',
                    'hover:text-white',
                    'whitespace-nowrap',
                    { 'justify-center': !isExpanded },
                    {
                      'text-success-300': isMenuActive(item.to),
                    }
                  )}
                >
                  {item.icon && <item.icon className={cn('h-6 w-6 min-w-6')} />}

                  {isExpanded && item.name}
                </Link>
              ))}
            </div>
          </Collapsible.Content>
        </Collapsible.Root>
      </div>
    </div>
  )
}

export default memo(CollapsibleMenu)

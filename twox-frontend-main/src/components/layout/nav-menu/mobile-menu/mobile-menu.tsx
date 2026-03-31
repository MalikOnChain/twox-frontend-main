import { Collapsible, CollapsibleContent } from '@radix-ui/react-collapsible'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { memo, useCallback, useMemo, useState } from 'react'

import { useMenu } from '@/context/menu-context'

import { cn } from '@/lib/utils'

import NavMenuTrigger from '@/components/layout/nav-menu/nav-menu-trigger'

import { NavigationMenu } from '@/types/menu'

const MobileMenu = ({ menu }: { menu: NavigationMenu }) => {
  const { section, icon: Icon, items } = menu
  const pathnames = usePathname()
  const isActive = useMemo(() => {
    return items.some((item) => item.to === pathnames)
  }, [items, pathnames])
  const {
    isOpen: isSidebarOpen,
    setIsOpen: setSidebarIsOpen,
    isExpanded,
  } = useMenu()
  const [isOpen, setIsOpen] = useState<boolean>(isActive)

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
    <div className='relative'>
      {/* Trigger Button */}
      <NavMenuTrigger
        icon={Icon}
        section={section}
        isOpen={isOpen}
        isActive={isActive}
        onClick={handleTriggerToggle}
        className={cn('relative z-[1]')}
      />

      <div className='relative'>
        <div
          className={cn(
            'absolute inset-0 -top-2 h-2 bg-secondary opacity-0 transition-opacity delay-200 duration-300',
            {
              'opacity-100 delay-0': isOpen,
            }
          )}
        />

        <Collapsible open={isOpen}>
          <CollapsibleContent>
            <div
              className={cn(
                'flex flex-wrap justify-center rounded-b-lg bg-secondary',
                { 'pl-7': isExpanded }
              )}
            >
              {items.map((item, index) => (
                <Link
                  key={index}
                  href={item.disabled ? '#' : item.to || ''}
                  onClick={handleClick}
                  className={cn(
                    'flex h-8 w-full items-center gap-2 p-1 px-2 text-center text-muted-foreground max-md:text-[14px] md:px-4',
                    'hover:text-white',
                    {
                      'text-primary-400': isMenuActive(item.to),
                    },
                    { 'px-1 md:px-1': !isExpanded }
                  )}
                >
                  {item.icon && <item.icon className={cn('h-4 w-4')} />}

                  {item.name}
                </Link>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  )
}

export default memo(MobileMenu)

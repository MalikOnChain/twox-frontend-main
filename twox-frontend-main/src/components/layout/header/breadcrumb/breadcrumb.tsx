'use client'

import { ChevronRight, Home } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { cn } from '@/lib/utils'
const Breadcrumb = () => {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)
  const firstSegment = segments[0] || ''
  const { t } = useTranslation()

  // Don't show breadcrumb on home page
  if (pathname === '/') {
    return null
  }

  const breadcrumbs = firstSegment
    ? [
        {
          href: `/${firstSegment}`,
          label: t(
            `${firstSegment.charAt(0).toUpperCase() + firstSegment.slice(1).replace(/-/g, ' ')}`
          ),
        },
      ]
    : []

  return (
    <nav className='flex items-center space-x-1 text-sm text-muted-foreground'>
      <Link
        href='/'
        className='flex items-center transition-colors hover:text-foreground'
      >
        <Home className='h-5 w-5' />
      </Link>
      {breadcrumbs.map((breadcrumb, index) => (
        <React.Fragment key={breadcrumb.href}>
          <ChevronRight className='h-4 w-4' />
          <Link
            href={breadcrumb.href}
            className={cn(
              'transition-colors hover:text-foreground',
              index === breadcrumbs.length - 1 &&
                'font-medium uppercase text-foreground'
            )}
          >
            {breadcrumb.label}
          </Link>
        </React.Fragment>
      ))}
    </nav>
  )
}

export default Breadcrumb

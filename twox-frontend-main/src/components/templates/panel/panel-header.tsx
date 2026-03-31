import { ChevronLeft } from 'lucide-react'
import React, { ReactNode } from 'react'

import { cn } from '@/lib/utils'
import { useMediaQuery } from '@/hooks/features/use-media-query'

import { Button } from '@/components/ui/button'

import Close from '@/assets/close.svg'

const PanelHeader = ({
  title,
  icon,
  onClose,
  hideClose = false,
  children,
}: {
  title: string
  hideClose?: boolean
  icon?: ReactNode
  onClose: () => void
  children?: ReactNode
}) => {
  const isDesktop = useMediaQuery('xl+1')

  return (
    <div
      className={cn('flex items-center justify-between px-2.5 py-3', {
        'h-header-sm bg-background-secondary px-4': !isDesktop,
      })}
    >
      <div
        className={cn('flex flex-1 items-center gap-1.5', {
          'gap-4': !isDesktop,
        })}
      >
        {!isDesktop && (
          <Button onClick={onClose} variant='icon' size='icon'>
            <ChevronLeft />
          </Button>
        )}
        {icon && isDesktop && icon}
        <span
          className={cn('text-sm font-bold', { 'text-[18px]': !isDesktop })}
        >
          {title}
        </span>
      </div>
      {children}
      {!hideClose && (
        <div className='flex items-center gap-2'>
          <Close
            onClick={onClose}
            className='hover:cursor-pointer hover:text-slate-50'
          />
        </div>
      )}
    </div>
  )
}

export default PanelHeader

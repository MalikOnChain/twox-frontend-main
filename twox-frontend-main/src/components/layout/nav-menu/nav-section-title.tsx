import React from 'react'

import { cn } from '@/lib/utils'

const NavSectionTitle = ({
  isExpanded,
  title,
}: {
  isExpanded: boolean
  title: string
}) => {
  return (
    <div
      className={cn(
        'flex items-center gap-1 py-0.5 text-sm font-medium uppercase text-muted-foreground',
        { 'text-xs': !isExpanded },
        { 'px-2': isExpanded }
      )}
    >
      <span>{title}</span>
    </div>
  )
}

export default NavSectionTitle

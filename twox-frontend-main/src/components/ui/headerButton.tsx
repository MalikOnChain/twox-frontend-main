'use client'

import { ArrowUpDown } from 'lucide-react'

export const HeaderButton = ({
  children,
  onClick,
}: {
  children: React.ReactNode
  onClick: () => void
}) => {
  return (
    <span className='flex items-center gap-1' onClick={onClick}>
      {children}
      <ArrowUpDown size={14} className='ml-2' />
    </span>
  )
}

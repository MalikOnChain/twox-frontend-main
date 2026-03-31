import React from 'react'

import { cn } from '@/lib/utils'

const Backdrop = ({
  isOpen,
  className = '',
  setIsOpen,
}: {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  className?: string
}) => {
  return (
    <div
      className={cn(
        'visible fixed z-40 h-screen w-screen bg-black/60 opacity-100 backdrop-blur-sm',
        className,
        {
          'invisible opacity-0': !isOpen,
        }
      )}
      onClick={() => setIsOpen(false)}
    />
  )
}

export default Backdrop

import React, { ReactNode } from 'react'

import { cn } from '@/lib/utils'

const Container = ({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) => {
  return (
    <div
      className={cn(
        'mx-auto mt-2 flex min-h-[calc(100vh-390px)] w-full flex-col justify-between px-4 lg:mt-7',
        className
      )}
    >
      {children}
    </div>
  )
}

export default Container

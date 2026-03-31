import React, { useEffect, useState } from 'react'

import useRewards from '@/context/features/rewards-context'

import { cn } from '@/lib/utils'

import GiftContent from '@/components/layout/header/gift-dropdown/git-content'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import Gift from '@/assets/gift.svg'

const GiftDropdown = () => {
  const { getUserEligibleBonuses } = useRewards()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (isOpen) {
      getUserEligibleBonuses()
    }
  }, [isOpen, getUserEligibleBonuses])

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <span
          className={cn(
            'relative flex cursor-pointer items-center rounded-lg text-yellow-400 hover:text-yellow-400 data-[state=open]:text-success-300'
          )}
        >
          <Gift className='h-6 w-6' />
        </span>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className='relative flex w-[320px] flex-col rounded-lg border-none bg-background-third px-4 py-0 shadow-0-0-4-0 shadow-black/25 sm:w-[390px]'
        side='top'
        align='end'
        sideOffset={10}
      >
        <GiftContent />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default GiftDropdown

import React, { memo } from 'react'

import { cn } from '@/lib/utils'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface ListTabsProps {
  className?: string
  selectedTab: 'all' | 'winning'
  setSelectedTab: (tab: 'all' | 'winning') => void
}

const ListTabs = ({
  className,
  selectedTab,
  setSelectedTab,
}: ListTabsProps) => {
  return (
    <Tabs
      value={selectedTab}
      onValueChange={(value) => setSelectedTab(value as 'all' | 'winning')}
      className={cn('w-full', className)}
    >
      <TabsList className='grid h-[60px] w-full grid-cols-2 rounded-tl-[20px] rounded-tr-[20px] bg-secondary p-0'>
        <TabsTrigger
          value='all'
          className={cn(
            'h-full rounded-none data-[state=active]:bg-transparent',
            'text-lg font-semibold text-shadow',
            'transition-colors duration-200',
            'hover:text-primary-400',
            'data-[state=active]:text-primary',
            'data-[state=inactive]:text-gray-200'
          )}
        >
          Bets
        </TabsTrigger>
        <TabsTrigger
          value='winning'
          className={cn(
            'h-full rounded-none data-[state=active]:bg-transparent',
            'text-lg font-semibold text-shadow',
            'transition-colors duration-200',
            'hover:text-primary-400',
            'data-[state=active]:text-primary',
            'data-[state=inactive]:text-gray-200'
          )}
        >
          Leaderboard
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}

export default memo(ListTabs)

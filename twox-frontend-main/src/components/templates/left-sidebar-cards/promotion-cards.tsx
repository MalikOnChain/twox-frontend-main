import dynamic from 'next/dynamic'
import React, { memo } from 'react'

import { useMenu } from '@/context/menu-context'

import LotteryCard from '@/components/templates/left-sidebar-cards/lottery-card'
import { Skeleton } from '@/components/ui/skeleton'

const WagerRaceCard = dynamic(
  () =>
    import(
      '@/components/templates/left-sidebar-cards/wager-race-card/wager-race-card'
    ),
  {
    ssr: false,
    loading: () => <Skeleton className='h-[60px] w-full' />,
  }
)
const PromotionCards = () => {
  const { isExpanded } = useMenu()
  if (!isExpanded) return null

  return (
    <div className='space-y-2 pt-3'>
      <WagerRaceCard />
      <LotteryCard />
    </div>
  )
}

export default memo(PromotionCards)

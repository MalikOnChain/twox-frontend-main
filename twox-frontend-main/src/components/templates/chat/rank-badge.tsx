import Image from 'next/image'
import React from 'react'

import { useInitialSettingsContext } from '@/context/initial-settings-context'

import { cn } from '@/lib/utils'

const ChatRankIcon = ({
  rank,
  className,
}: {
  rank: string
  className: string
}) => {
  const { getRankIcon } = useInitialSettingsContext()
  const RankIcon = getRankIcon(rank)

  return (
    <Image
      src={RankIcon}
      alt={rank}
      width={0}
      height={0}
      className={cn('h-5 w-5', className)}
      sizes='100vw'
    />
  )
}

export default ChatRankIcon

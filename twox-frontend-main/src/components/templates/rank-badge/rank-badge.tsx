import Image from 'next/image'
import React from 'react'

import { useInitialSettingsContext } from '@/context/initial-settings-context'

const RankBadge = ({ rank }: { rank: string }) => {
  const { getRankIcon } = useInitialSettingsContext()
  const RankIcon = getRankIcon(rank)

  return (
    <Image
      src={RankIcon}
      alt={rank}
      width={0}
      height={0}
      sizes='100vw'
      className='h-5 w-5'
    />
  )
}

export default RankBadge

import Image from 'next/image'
import React, { useMemo } from 'react'

import { useInitialSettingsContext } from '@/context/initial-settings-context'

import Timestamp from '@/components/templates/chat/timestamp'

const ChatUser = ({
  username,
  isAdmin,
  timestamp,
  currentRank,
}: {
  currentRank: string
  username: string
  isAdmin: boolean
  timestamp: string | Date
}) => {
  const { getRankIcon } = useInitialSettingsContext()
  const rankIcon = useMemo(
    () => getRankIcon(currentRank),
    [currentRank, getRankIcon]
  )
  return (
    <div className='flex w-full items-center gap-1'>
      <div className='flex flex-1 items-center gap-1'>
        {rankIcon && (
          <Image
            src={rankIcon}
            alt={currentRank}
            className='h-[24px] w-auto'
            width={0}
            height={0}
            sizes='100vw'
          />
        )}
        <span className='text-xs text-foreground'>{username}</span>
        {isAdmin && (
          <span className='rounded-3xl bg-error-500 px-1 text-[10px] font-semibold uppercase'>
            admin
          </span>
        )}
      </div>
      <span className='flex justify-end text-[0.85rem] text-gray-400'>
        <Timestamp timestamp={timestamp} />
      </span>
    </div>
  )
}

export default ChatUser

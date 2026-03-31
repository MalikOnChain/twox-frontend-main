import React, { useMemo } from 'react'

import { cn } from '@/lib/utils'

import UserAvatar from '@/components/ui/user-avatar'

import { VIP_TIERS } from '@/types/vip'

const ChatAvatar = ({
  avatar,
  username,
  currentRank,
  currentLevel,
}: {
  avatar: string
  username: string
  currentRank: string
  currentLevel: string
}) => {
  const tierClassName = useMemo(() => {
    switch (currentRank?.toLowerCase()) {
      case VIP_TIERS.NOVICE:
        return 'bg-gradient-novice'
      case VIP_TIERS.CHALLENGER:
        return 'bg-gradient-challenger'
      case VIP_TIERS.PRO:
        return 'bg-gradient-pro'
      case VIP_TIERS.ELITE:
        return 'bg-gradient-elite'
      case VIP_TIERS.LEGEND:
        return 'bg-gradient-legend'
      case VIP_TIERS.THE_DON:
        return 'bg-gradient-the-don'
      default:
        return ''
    }
  }, [currentRank])

  return (
    <UserAvatar
      src={avatar}
      alt={username}
      level={currentLevel}
      className={{
        avatarClassName: 'h-9 w-8 min-w-8',
        levelClassName: cn('size-5 text-xs font-bold', tierClassName),
      }}
    />
  )
}

export default ChatAvatar

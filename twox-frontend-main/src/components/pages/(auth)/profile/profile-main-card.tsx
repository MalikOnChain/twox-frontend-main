'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'

import { useProfile } from '@/context/data/profile-context'
import { useInitialSettingsContext } from '@/context/initial-settings-context'
import { useUser } from '@/context/user-context'

import { cn } from '@/lib/utils'

import RankProgressbar from '@/components/templates/progressbar/rank-progressbar'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

import ShoppingIcon from '@/assets/shopping.svg'

const ProfileMainCard = ({ className = '' }: { className?: string }) => {
  const { user } = useUser()
  const { userRankStatus } = useProfile()
  const { getRankIcon } = useInitialSettingsContext()
  const router = useRouter()
  const calculateProgress = () => {
    if (!userRankStatus || userRankStatus.totalRequired === 0) return 0
    return (userRankStatus.currentXP / userRankStatus.totalRequired) * 100
  }
  const progress = calculateProgress()

  const handleNextShopClick = () => {
    router.push('/')
  }

  if (!userRankStatus) return null
  const RankIcon = getRankIcon(userRankStatus.currentTier)

  return (
    <Card className={cn(className)}>
      <div className='flex items-center gap-3'>
        <div className='flex-1 flex-col gap-3.5'>
          <div className='text-[22px] font-bold'>{user?.username}</div>
          <p className='text-xs text-muted-foreground'>
            Member since{' '}
            <span className='font-semibold text-foreground'>
              March 3 2024
            </span>{' '}
          </p>
        </div>
        <Image
          src={RankIcon}
          sizes='100vw'
          alt='Rank'
          width={0}
          height={0}
          className='h-auto w-[58px]'
        />
      </div>
      <Separator />
      <RankProgressbar
        height='h-3.5'
        showProgress
        progress={progress}
        hideNextRank
      />
      <Separator />
      <div className='flex items-center'>
        <div className='flex flex-1 flex-col'>
          <div>Shop next rank</div>
        </div>

        <Badge
          variant='success'
          className='cursor-pointer'
          onClick={handleNextShopClick}
        >
          <ShoppingIcon className='size-6' />
        </Badge>
      </div>
    </Card>
  )
}

export default ProfileMainCard

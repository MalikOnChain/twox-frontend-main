'use client'
import Image, { StaticImageData } from 'next/image'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { useProfile } from '@/context/data/profile-context'
import { useInitialSettingsContext } from '@/context/initial-settings-context'

import { cn } from '@/lib/utils'

import EligibleBonusItem from '@/components/pages/(other)/RankingPage/eligible-bonus-item'
import RankProgressbar from '@/components/templates/progressbar/rank-progressbar'
import { Card } from '@/components/ui/card'

import BonusImage1 from '@/assets/images/bonus-1.png'
import BonusImage2 from '@/assets/images/bonus-2.png'
import BonusImage3 from '@/assets/images/bonus-3.png'
import Ellipse from '@/assets/images/ellipse.png'

type EligibleBonus = {
  title: string
  description: string
  image: StaticImageData
}

const eligibleBonuses: EligibleBonus[] = [
  {
    title: 'DAILY BONUS',
    description: 'Get 20 point free',
    image: BonusImage1,
  },
  {
    title: 'DAILY BONUS',
    description: 'Get 20 point free',
    image: BonusImage2,
  },
  {
    title: 'DAILY BONUS',
    description: 'Get 20 point free',
    image: BonusImage3,
  },
]
const RankingMainCard = ({ className = '' }: { className?: string }) => {
  const { userRankStatus } = useProfile()
  const { getRankIcon } = useInitialSettingsContext()
  const { t } = useTranslation()
  const calculateProgress = () => {
    if (!userRankStatus || userRankStatus.totalRequired === 0) return 0
    return (userRankStatus.currentXP / userRankStatus.totalRequired) * 100
  }
  const progress = calculateProgress()

  if (!userRankStatus) return null
  const RankIcon = getRankIcon(userRankStatus.currentTier)

  console.log(userRankStatus, 'userRankStatus')

  return (
    <Card className={cn(className, 'relative overflow-hidden')}>
      <Image
        src={Ellipse}
        alt='Ellipse'
        width={0}
        height={0}
        className='absolute -left-20 -top-20 z-10'
        sizes='100vw'
      />
      <div className='relative z-20 flex items-center'>
        <Image
          src={RankIcon}
          sizes='100vw'
          alt='Rank'
          width={0}
          height={0}
          className='h-auto w-14 lg:w-[114px]'
        />
        <div className='flex w-full flex-col gap-2'>
          <div className='flex w-full items-center justify-between'>
            <div className='flex flex-col gap-1'>
              <span className='text-xs font-medium text-secondary-800 lg:text-[15px]'>
                {t('ranking.current_level')}
              </span>
              <span className='font-kepler text-lg uppercase lg:text-[32px]'>
                {userRankStatus.currentTier}
              </span>
            </div>
            <div className='flex flex-col gap-1'>
              <span className='text-xs font-medium text-secondary-800 lg:text-[15px]'>
                {t('ranking.next_level')}
              </span>
              <span className='font-kepler text-lg uppercase text-secondary-800 lg:text-[32px]'>
                {t('ranking.silver')}
              </span>
            </div>
          </div>
          <div className='relative z-20 flex items-center gap-3'>
            {/* <UserAvatarUploader showUploadButton={false} /> */}
            <RankProgressbar
              height='h-2 lg:h-3.5'
              showProgress
              progress={progress}
              hideNextRank
              hideRemainingXP={false}
            />
          </div>
        </div>
      </div>
      {/* <Separator className='relative z-20' /> */}

      <div className='relative z-30 mt-4 flex gap-2 overflow-auto'>
        {eligibleBonuses.map((bonus, index) => (
          <EligibleBonusItem key={index} {...bonus} />
        ))}
      </div>
    </Card>
  )
}

export default RankingMainCard

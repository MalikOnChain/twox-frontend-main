'use client'

import Image from 'next/image'
import { useTranslation } from 'react-i18next'

import { useProfile } from '@/context/data/profile-context'
import { useInitialSettingsContext } from '@/context/initial-settings-context'

import LevelsTable from '@/components/tables/vip-Levels-table/levels-table'

import vipCrownIcon from '@/assets/icons/crown.png'

const VIPLevelsTable = () => {
  const { ranks } = useInitialSettingsContext()
  const { userRankStatus } = useProfile()
  const { t } = useTranslation()
  const currentTierIndex = ranks?.findIndex(
    (r) => r.name.toLowerCase() === userRankStatus?.currentTier.toLowerCase()
  )
  const currentLevelIndex = ranks?.[currentTierIndex]?.levels.findIndex(
    (l) => l.name === userRankStatus?.currentLevel
  )

  const modifiedRanks = ranks?.map((rank, tierIndex) => {
    return {
      ...rank,
      levels: rank.levels.map((level, levelIndex) => ({
        ...level,
        isCompleted: userRankStatus
          ? // If current tier is higher than this tier, all levels are completed
            tierIndex < currentTierIndex ||
            // If same tier, check if current level is higher or equal
            (tierIndex === currentTierIndex && levelIndex <= currentLevelIndex)
          : false,
      })),
    }
  })

  return (
    <div className='flex flex-col gap-3'>
      <div className='flex items-center gap-1'>
        <Image src={vipCrownIcon} alt='vip-crown' width={40} height={40} />
        <span className='font-satoshi text-xl font-bold text-foreground'>
          {t('ranking.vip_levels')}
        </span>
      </div>
      {modifiedRanks && (
        <div className='flex flex-col gap-3'>
          {modifiedRanks.map((rank) => (
            <LevelsTable key={rank._id} rank={rank} />
          ))}
        </div>
      )}
    </div>
  )
}

export default VIPLevelsTable

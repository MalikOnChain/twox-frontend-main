import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useInitialSettingsContext } from '@/context/initial-settings-context'
import { useProfile } from '@/context/data/profile-context'

import { formatNumber } from '@/lib/number'
import { cn } from '@/lib/utils'

import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

import CrashIcon from '@/assets/crash-xp.svg'
import LiveCasinoIcon from '@/assets/icons/casino-icon.svg'
import DepositIcon from '@/assets/icons/deposit.svg'
import LossIcon from '@/assets/icons/lost-icon.svg'
import SlotsIcon from '@/assets/icons/lost-icon.svg'

const XP_ICONS = {
  DEPOSIT: <DepositIcon className='size-10' />,
  LOSS: <LossIcon className='size-10' />,
  'LIVE CASINO': <LiveCasinoIcon className='size-10' />,
  CRASH: <CrashIcon className='size-10' />,
  SLOTS: <SlotsIcon className='size-10' />,
}

const InfoCard = ({
  className,
  label,
  value,
  icon,
}: {
  className?: string
  label: string
  value: number | string
  icon: React.ReactNode
}) => {
  return (
    <div
      className={cn(
        'flex gap-2 rounded-2xl border border-mirage bg-dark-gradient p-4',
        className
      )}
    >
      <div className='flex items-center gap-2'>{icon}</div>
      <div className='flex flex-col items-start gap-1.5'>
        <span className='line-clamp-1 font-satoshi text-sm text-oslo-grey'>
          {label}
        </span>
        <span className='font-satoshi text-base font-bold text-white'>
          {typeof value === 'number' ? `${formatNumber(value)} XP` : value}
        </span>
      </div>
    </div>
  )
}

const RankingInfoCard = ({ className = '' }: { className?: string }) => {
  const { settings } = useInitialSettingsContext()
  const { userRankStatus } = useProfile()
  const { t } = useTranslation()
  const [xpSettings, setXpSettings] = useState<
    {
      label: string
      value: number | string
      icon: React.ReactNode
    }[]
  >([])

  useEffect(() => {
    const getCategoryList = () => {
      const categoryList = [
        {
          label: 'DEPOSIT',
          value: settings.xpSetting.depositXpAmount,
          icon: XP_ICONS.DEPOSIT,
        },
        // {
        //   label: 'LOSS $1',
        //   value: settings.xpSetting.lossXpAmount || 'n/a',
        //   icon: XP_ICONS.LOSS,
        // },
      ]
      categoryList.push(
        ...settings.xpSetting.wagerXpSetting.map((wager) => ({
          label: `${wager.gameCategory.toUpperCase()} $1`,
          value: wager.wagerXpAmount,
          icon: XP_ICONS[
            wager.gameCategory.toUpperCase() as keyof typeof XP_ICONS
          ],
        }))
      )
      return categoryList
    }
    if (settings) {
      setXpSettings(getCategoryList())
    }
  }, [settings])

  // Calculate progress data
  const currentTier = userRankStatus?.currentTier || 'Novice'
  const currentLevel = userRankStatus?.currentLevel || 'Novice I'
  const currentXP = userRankStatus?.currentXP || 0
  
  // Get ranks for tier-to-tier calculation
  const { ranks } = useInitialSettingsContext()
  
  // Calculate tier-to-tier progression (not level-to-level)
  const { actualNextTier, tierProgress, tierRemainingXP } = React.useMemo(() => {
    if (!ranks || ranks.length === 0) {
      return {
        actualNextTier: 'Challenger',
        tierProgress: 0,
        tierRemainingXP: 1500,
      }
    }

    // Find current tier
    const currentTierIndex = ranks.findIndex(r => r.name === currentTier)
    if (currentTierIndex === -1) {
      return {
        actualNextTier: 'Challenger',
        tierProgress: 0,
        tierRemainingXP: 1500,
      }
    }

    // Get next tier
    const nextTierIndex = currentTierIndex + 1
    if (nextTierIndex >= ranks.length) {
      // Max tier reached
      return {
        actualNextTier: null,
        tierProgress: 100,
        tierRemainingXP: 0,
      }
    }

    const currentTierData = ranks[currentTierIndex]
    const nextTierData = ranks[nextTierIndex]

    // Get the minimum XP for current tier (first level)
    const currentTierMinXP = currentTierData.levels
      .sort((a, b) => a.minXP - b.minXP)[0]?.minXP || 0

    // Get the minimum XP for next tier (first level)
    const nextTierMinXP = nextTierData.levels
      .sort((a, b) => a.minXP - b.minXP)[0]?.minXP || 0

    // Calculate progress from current tier start to next tier start
    const tierXPRange = nextTierMinXP - currentTierMinXP
    const progressInTier = Math.max(currentXP - currentTierMinXP, 0)
    const tierProgressPercentage = Math.min((progressInTier / tierXPRange) * 100, 100)
    const remainingXP = Math.max(nextTierMinXP - currentXP, 0)

    return {
      actualNextTier: nextTierData.name,
      tierProgress: tierProgressPercentage,
      tierRemainingXP: remainingXP,
    }
  }, [ranks, currentTier, currentXP])
  
  const progress = tierProgress
  const remainingXP = tierRemainingXP

  return (
    <Card className={cn(className)}>
      <div className='flex items-center justify-between gap-2 mb-4'>
        <span className='font-satoshi text-base font-bold text-white'>
          {t('ranking.xp_earnings')}
        </span>
        <Badge
          variant={
            settings.xpSetting.status.toLowerCase() === 'active'
              ? 'success'
              : 'destructive'
          }
          className='font-satoshi text-[10px] uppercase'
        >
          {settings.xpSetting.status}
        </Badge>
      </div>

      {/* XP Progress Section */}
      {userRankStatus && (
        <div className='mb-6 rounded-2xl border border-mirage bg-dark-gradient p-4'>
          <div className='mb-3'>
            <h3 className='font-satoshi text-2xl font-bold text-white'>
              {currentTier}
            </h3>
            <p className='font-satoshi text-sm text-oslo-grey'>
              XP Earnings
            </p>
          </div>

          {/* Progress Bar */}
          <div className='mb-3'>
            <div className='relative h-2 w-full overflow-hidden rounded-full bg-gray-700'>
              <div
                className='absolute left-0 top-0 h-full bg-arty-red transition-all duration-500'
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>

          {/* Progress Labels */}
          <div className='flex items-center justify-between text-sm'>
            <div className='text-left'>
              <p className='font-satoshi font-bold text-white'>
                {currentTier}
              </p>
              <p className='font-satoshi text-xs text-oslo-grey'>
                {progress.toFixed(1)}%
              </p>
            </div>
            <div className='text-right'>
              <p className='font-satoshi font-bold text-white'>
                {actualNextTier || 'Max Level'}
              </p>
              <p className='font-satoshi text-xs text-oslo-grey'>
                {actualNextTier ? (progress >= 100 ? '100%' : `${(100 - progress).toFixed(1)}%`) : 'Complete'}
              </p>
            </div>
          </div>

          {/* XP Stats */}
          <div className='mt-3 pt-3 border-t border-mirage'>
            <div className='flex items-center justify-between'>
              <div className='text-left'>
                <p className='font-satoshi text-xs text-oslo-grey'>
                  Current XP
                </p>
                <p className='font-satoshi text-sm font-bold text-white'>
                  {formatNumber(currentXP)} XP
                </p>
              </div>
              <div className='text-right'>
                <p className='font-satoshi text-xs text-oslo-grey'>
                  XP to {actualNextTier || 'Next Level'}
                </p>
                <p className='font-satoshi text-sm font-bold text-white'>
                  {formatNumber(remainingXP)} XP
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* XP Earning Methods */}
      <div className='grid grid-cols-2 gap-2 xm:grid-cols-3 md:grid-cols-2 2xl:grid-cols-3'>
        {xpSettings.map((wager) => (
          <InfoCard
            key={wager.label}
            label={wager.label}
            value={wager.value}
            icon={wager.icon}
          />
        ))}
      </div>
    </Card>
  )
}

export default RankingInfoCard

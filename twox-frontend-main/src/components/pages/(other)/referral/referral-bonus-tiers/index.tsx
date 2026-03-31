'use client'

import { useEffect, useMemo, useState } from 'react'

import { useInitialSettingsContext } from '@/context/initial-settings-context'

import { cn } from '@/lib/utils'

import Gift from '@/assets/gift.svg'

import BonusTierCard from './bonus-tier-card'

import { BonusType, ReferralBonus } from '@/types/bonus'

const ReferralBonusTiers = ({ totalReferrals }: { totalReferrals: number }) => {
  const [bonusTiers, setBonusTiers] = useState<ReferralBonus[]>([])
  const { initialBonuses } = useInitialSettingsContext()
  const referralBonuses = useMemo(
    () =>
      initialBonuses.filter((bonus) => {
        if (bonus.type === BonusType.REFERRAL) {
          return bonus as ReferralBonus
        }
      }) as ReferralBonus[],
    [initialBonuses]
  )

  useEffect(() => {
    setBonusTiers(
      referralBonuses.sort(
        (a, b) => a.requiredReferralCount - b.requiredReferralCount
      )
    )
  }, [referralBonuses])

  return (
    <div className='w-full'>
      <div className='mb-[17px] flex items-center sm:mb-[22px]'>
        <Gift className='mr-3 h-[26px] w-[26px] text-success drop-shadow-0-12-0-success' />
        <span className='text-2xl font-bold text-foreground sm:text-[22px]'>
          Bonus Tiers
        </span>
      </div>

      <div
        className={cn(
          'flex gap-3 md:grid md:grid-cols-3 xl:grid-cols-4',
          'custom-scrollbar -webkit-overflow-scrolling-touch w-[calc(100vw-3rem)] overflow-x-auto md:w-full'
        )}
      >
        {bonusTiers.map((bonusTier) => (
          <BonusTierCard
            key={bonusTier.name}
            bonus={bonusTier}
            disabled={totalReferrals < bonusTier.requiredReferralCount}
          />
        ))}
      </div>
    </div>
  )
}

export default ReferralBonusTiers

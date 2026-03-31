import React from 'react'
import { useTranslation } from 'react-i18next'

import { useProfile } from '@/context/data/profile-context'
import { useUser } from '@/context/user-context'

import { formatNumber } from '@/lib/number'
import { cn } from '@/lib/utils'

import CoinIcon from '@/components/templates/icons/coin-icon'
import { Card } from '@/components/ui/card'
const InfoCard = ({
  className,
  label,
  value,
}: {
  className?: string
  label: string
  value: number
}) => {
  return (
    <div
      className={cn(
        'flex flex-col gap-2 rounded-lg bg-background-third p-4',
        className
      )}
    >
      <span className='text-xs text-muted-foreground'>{label}</span>
      <div className='flex items-center gap-1.5'>
        <CoinIcon />
        <span className='text-lg'>{formatNumber(value)}</span>
      </div>
    </div>
  )
}

const ProfileInfoCard = ({ className = '' }: { className?: string }) => {
  const { userStatistics } = useProfile()
  const { balance } = useUser()
  const { t } = useTranslation()

  return (
    <Card className={cn(className)}>
      <div className='mb-2 text-base font-bold'>
        {t('profile.profile_information')}
      </div>
      <div className='grid grid-cols-2 gap-2 md:grid-cols-4 3xl:grid-cols-2'>
        <InfoCard
          label={t('profile.real_balance')}
          className='col-span-2'
          value={balance?.realBalance || 0}
        />
        <InfoCard
          label={t('profile.bonus')}
          value={balance?.totalBonusBalance || 0}
        />
        <InfoCard
          label={t('profile.locked_winnings')}
          value={balance?.totalLockedWinnings || 0}
        />
        <InfoCard
          label={t('profile.deposit')}
          value={userStatistics?.statistics.totalDepositAmount || 0}
        />
        <InfoCard
          label={t('profile.withdrawn')}
          value={userStatistics?.statistics.totalWithdrawAmount || 0}
        />
        <InfoCard
          label={t('profile.wagered')}
          value={userStatistics?.statistics.totalWageredAmount || 0}
        />
        <InfoCard label={t('profile.profit')} value={0} />
      </div>
    </Card>
  )
}

export default ProfileInfoCard

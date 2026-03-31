import { useCallback } from 'react'

import useRewards from '@/context/features/rewards-context'

import { getRemainingDays } from '@/lib/utils'
import { cn } from '@/lib/utils'

import IconComponent from '@/components/templates/icon-component/icon-component'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

import Check from '@/assets/check.svg'
import Gift from '@/assets/gift.svg'
import Lock from '@/assets/lock.svg'

import { Bonus, ClaimStatus, ReferralBonus } from '@/types/bonus'

interface ClockIconProps {
  className?: string
}

const ClockIcon: React.FC<ClockIconProps> = ({ className }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    className={className}
  >
    <circle cx='12' cy='12' r='10' />
    <polyline points='12 6 12 12 16 14' />
  </svg>
)

const GiftContent = () => {
  const {
    eligibleActiveBonuses,
    isClaiming,
    handleClaimBonus,
    isLoadingBonuses,
  } = useRewards()

  const disableClaim = useCallback((bonus: Bonus | ReferralBonus) => {
    return [ClaimStatus.CLAIMED, ClaimStatus.CANNOT_CLAIM].includes(
      bonus.claimStatus
    )
  }, [])

  const getBonusText = useCallback((bonus: Bonus | ReferralBonus) => {
    const whenClaim = getRemainingDays(bonus.whenCanClaim)
    if (whenClaim) {
      return `Claim in ${whenClaim} days`
    }
    if (bonus.claimStatus === ClaimStatus.CLAIMED) {
      return 'Claimed'
    } else if (bonus.claimStatus === ClaimStatus.CANNOT_CLAIM) {
      return "Can't Claim"
    }
    return 'Claim'
  }, [])

  const getStatusIcon = useCallback((bonus: Bonus | ReferralBonus) => {
    if (bonus.claimStatus === ClaimStatus.CLAIMED) {
      return <Check className='text-green-500' />
    } else if (bonus.claimStatus === ClaimStatus.CANNOT_CLAIM) {
      return <Lock className='text-secondary-800' />
    } else if (bonus.whenCanClaim) {
      return <ClockIcon className='text-yellow-500' />
    }
    return <Gift className='h-6 w-6 text-primary' />
  }, [])

  if (eligibleActiveBonuses.length < 1 || isLoadingBonuses) {
    return (
      <div className='space-y-2 py-2'>
        {[...Array(6)].map((_, index) => (
          <Skeleton key={index} className='h-[60px] w-full' />
        ))}
      </div>
    )
  }

  return (
    <div className='custom-scrollbar -webkit-overflow-scrolling-touch relative grid h-[450px] overflow-y-auto'>
      {eligibleActiveBonuses.map(
        (bonus: Bonus | ReferralBonus, index: number) => (
          <div
            key={index}
            className='flex h-[fit-content] items-center justify-between border-secondary-600 py-4 [&:not(:last-child)]:border-b-2'
          >
            <div className='flex items-center justify-center gap-2'>
              <IconComponent
                icon={getStatusIcon(bonus)}
                variant='gold'
                className='mr-[6px]'
              />
              <div className='flex-1 text-sm text-primary-foreground'>
                {bonus.name}
              </div>
            </div>
            <Button
              variant='default'
              size='sm'
              loading={isClaiming === bonus._id}
              className={cn('w-[100px] sm:min-w-[120px]', {
                'opacity-40': disableClaim(bonus),
                'bg-green-500': bonus.claimStatus === ClaimStatus.CAN_CLAIM,
                'bg-green-500 hover:bg-green-600':
                  bonus.claimStatus === ClaimStatus.CLAIMED,
                'bg-secondary-700 hover:bg-secondary-700':
                  bonus.claimStatus === ClaimStatus.CANNOT_CLAIM,
                'bg-yellow-500 hover:bg-yellow-600': bonus.whenCanClaim,
              })}
              disabled={disableClaim(bonus)}
              onClick={() => handleClaimBonus(bonus)}
            >
              {getBonusText(bonus)}
            </Button>
          </div>
        )
      )}
    </div>
  )
}

export default GiftContent

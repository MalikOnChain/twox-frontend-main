'use client'

import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { claimTierReward, getUserTierRewards, TierReward } from '@/api/vip-rewards'

import { useUser } from '@/context/user-context'

import IconComponent from '@/components/templates/icon-component/icon-component'
import { Button } from '@/components/ui/button'

import GiftIcon from '@/assets/icons/gift.svg'
import RewardsIcon from '@/assets/icons/rewards.svg'

const Rewards = () => {
  const { t } = useTranslation()
  const { isAuthenticated } = useUser()
  const [rewards, setRewards] = useState<TierReward[]>([])
  const [loading, setLoading] = useState(true)
  const [claiming, setClaiming] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false)
      return
    }

    loadRewards()
  }, [isAuthenticated])

  const loadRewards = async () => {
    try {
      setLoading(true)
      const response = await getUserTierRewards()
      console.log('Tier rewards response:', response)
      setRewards(response.rewards || [])
    } catch (error) {
      console.error('Failed to load tier rewards:', error)
      toast.error('Failed to load tier rewards')
    } finally {
      setLoading(false)
    }
  }

  const handleClaim = async (rewardId: string) => {
    try {
      setClaiming(rewardId)
      const result = await claimTierReward(rewardId)
      
      if (result.success) {
        toast.success(result.message || 'Reward claimed successfully!')
        // Reload rewards after claiming
        await loadRewards()
      } else {
        toast.error(result.message || 'Failed to claim reward')
      }
    } catch (error: any) {
      console.error('Failed to claim reward:', error)
      const errorMessage = error.response?.data?.error || error.message || 'Failed to claim reward'
      toast.error(errorMessage)
    } finally {
      setClaiming(null)
    }
  }

  const formatRewardDescription = (reward: TierReward): string => {
    const parts: string[] = []
    
    if (reward.tierReward.cash) {
      if (reward.tierReward.cash.percentage) {
        parts.push(`${reward.tierReward.cash.percentage}% cash bonus`)
      } else if (reward.tierReward.cash.amount) {
        parts.push(`${reward.tierReward.cash.amount} USDT bonus`)
      }
      
      if (reward.tierReward.cash.maxAmount) {
        parts.push(`up to ${reward.tierReward.cash.maxAmount} USDT`)
      }
    }
    
    if (reward.tierReward.freeSpins?.amount) {
      parts.push(`${reward.tierReward.freeSpins.amount} free spins`)
    }
    
    if (reward.tierReward.bonus) {
      if (reward.tierReward.bonus.percentage) {
        parts.push(`${reward.tierReward.bonus.percentage}% bonus`)
      }
    }

    if (reward.tierWageringMultiplier) {
      parts.push(`${reward.tierWageringMultiplier}x wagering`)
    }
    
    return parts.length > 0 ? parts.join(', ') : 'Exclusive VIP reward'
  }

  if (loading) {
    return (
      <div className='mt-6 flex flex-col gap-5'>
        <div className='flex items-center gap-2'>
          <RewardsIcon className='h-6 w-6' />
          <span className='font-satoshi text-xl font-bold text-white'>
            {t('ranking.rewards')}
          </span>
        </div>
        <div className='grid w-full gap-3 xm:grid-cols-2 md:grid-cols-4'>
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className='flex flex-col gap-2 rounded-lg border border-mirage bg-dark-gradient p-3.5 animate-pulse'
            >
              <div className='h-10 w-10 bg-gray-700 rounded'></div>
              <div className='h-6 bg-gray-700 rounded w-3/4'></div>
              <div className='h-12 bg-gray-700 rounded'></div>
              <div className='h-10 bg-gray-700 rounded'></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className='mt-6 flex flex-col gap-5'>
        <div className='flex items-center gap-2'>
          <RewardsIcon className='h-6 w-6' />
          <span className='font-satoshi text-xl font-bold text-white'>
            {t('ranking.rewards')}
          </span>
        </div>
        <div className='rounded-lg border border-mirage bg-dark-gradient p-6 text-center'>
          <span className='font-satoshi text-sm text-[#FFFFFFCC]'>
            Please login to view your VIP tier rewards
          </span>
        </div>
      </div>
    )
  }

  if (rewards.length === 0) {
    return (
      <div className='mt-6 flex flex-col gap-5'>
        <div className='flex items-center gap-2'>
          <RewardsIcon className='h-6 w-6' />
          <span className='font-satoshi text-xl font-bold text-white'>
            {t('ranking.rewards')}
          </span>
        </div>
        <div className='rounded-lg border border-mirage bg-dark-gradient p-6 text-center'>
          <span className='font-satoshi text-sm text-[#FFFFFFCC]'>
            No tier rewards available at your current VIP level. Keep playing to unlock rewards!
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className='mt-6 flex flex-col gap-5'>
      <div className='flex items-center gap-2'>
        <RewardsIcon className='h-6 w-6' />
        <span className='font-satoshi text-xl font-bold text-white'>
          {t('ranking.rewards')}
        </span>
      </div>
      <div className='grid w-full gap-3 xm:grid-cols-2 md:grid-cols-4'>
        {rewards.map((reward) => (
          <div
            key={reward._id}
            className='flex flex-col gap-2 rounded-lg border border-mirage bg-dark-gradient p-3.5'
          >
            <IconComponent icon={<GiftIcon />} variant='red' />
            <span className='line-clamp-1 font-satoshi text-xl font-bold uppercase text-white'>
              {reward.tierName} {reward.tierLevel}
            </span>
            <span className='line-clamp-3 font-satoshi text-sm text-[#FFFFFFCC] first-letter:uppercase'>
              {formatRewardDescription(reward)}
            </span>
            <Button 
              variant='secondary2'
              onClick={() => handleClaim(reward._id)}
              disabled={claiming === reward._id}
            >
              {claiming === reward._id ? 'Claiming...' : t('ranking.claim')}
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Rewards

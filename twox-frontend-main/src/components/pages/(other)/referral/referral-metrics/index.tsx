'use client'

import Image from 'next/image'
import React from 'react'

import { cn } from '@/lib/utils'

import Earn from '@/assets/earn.svg'
import Bitcoin from '@/assets/images/coin-o.webp'
// Replace it with appropriate icon.
import UserFav from '@/assets/user-fav.svg'
import UserPlus from '@/assets/user-plus.svg'
import Wallet from '@/assets/wallet-1.svg'

import { ReferralMetrics as TReferralMetrics } from '@/types/bonus'

interface MetricCardProps {
  icon: React.ReactNode
  title: string
  value: string | number
  label?: React.ReactNode
  unit?: string
  className?: string
}

const MetricCard = ({
  icon,
  title,
  value,
  label,
  unit,
  className,
}: MetricCardProps) => {
  return (
    <div
      className={cn(
        'flex flex-1 flex-col items-center border-secondary-600 py-[18px] sm:py-0 sm:[&:not(:last-child)]:border-r-2',
        className
      )}
    >
      <div className='flex-center mb-2 flex justify-center'>{icon}</div>
      <div className='mb-1 text-xs font-medium text-secondary-text'>
        {title}
      </div>
      <div className='flex items-center justify-center gap-[6px] text-[22px] font-bold text-white sm:text-lg'>
        {label && <div className='h-5 w-5'>{label}</div>}
        <div>{value}</div>
        {unit && <div>{unit}</div>}
      </div>
    </div>
  )
}

interface ReferralMetricsProps {
  className?: string
  metrics: TReferralMetrics | null
}

const ReferralMetrics = ({ metrics, className }: ReferralMetricsProps) => {
  return (
    <div
      className={cn(
        'mb-8 grid grid-cols-2 rounded-xl bg-background-secondary px-3 sm:mb-6 sm:grid-cols-4 sm:rounded-lg sm:px-[30px] sm:pb-[14px] sm:pt-[17px]',
        className
      )}
    >
      <MetricCard
        icon={
          <UserFav className='h-[28px] w-[28px] text-secondary-text sm:h-5 sm:w-5' />
        }
        title='Affiliate user Register'
        value={metrics?.totalReferrals || 0}
        unit='users'
        className='border-b-2 sm:border-b-0'
      />

      <MetricCard
        icon={
          <Earn className='h-[28px] w-[28px] text-secondary-text sm:h-5 sm:w-5' />
        }
        title='Total Earnings'
        value='0'
        label={
          <Image
            src={Bitcoin}
            alt='bitcoin'
            width={0}
            height={0}
            sizes='100vw'
            className='h-5 w-5'
          />
        }
        className='border-b-2 sm:border-b-0'
      />

      <MetricCard
        icon={
          <Wallet className='h-[28px] w-[28px] text-secondary-text sm:h-5 sm:w-5' />
        }
        title='Total Deposited'
        value='0'
        label={
          <Image
            src={Bitcoin}
            alt='bitcoin'
            width={0}
            height={0}
            sizes='100vw'
            className='h-5 w-5'
          />
        }
      />

      <MetricCard
        icon={
          <UserPlus className='h-[28px] w-[28px] text-secondary-text sm:h-5 sm:w-5' />
        }
        title='Active Users'
        value='0'
        unit='users'
      />
    </div>
  )
}

export default ReferralMetrics

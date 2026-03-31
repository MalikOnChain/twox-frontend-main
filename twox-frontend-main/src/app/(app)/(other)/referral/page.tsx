'use client'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { getUserReferralMetrics } from '@/api/bonus'

import { useUser } from '@/context/user-context'

import ReferralBanner from '@/components/pages/(other)/referral/referral-banner'
import ReferralBonusTiers from '@/components/pages/(other)/referral/referral-bonus-tiers'
import ReferralMetrics from '@/components/pages/(other)/referral/referral-metrics'

import { ReferralMetrics as TReferralMetrics } from '@/types/bonus'

const ReferralPage = () => {
  const [metrics, setMetrics] = useState<TReferralMetrics | null>(null)
  const { isAuthenticated } = useUser()
  const fetchReferralMetrics = async () => {
    try {
      const res = await getUserReferralMetrics()
      setMetrics(res)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Failed to fetch referral metrics')
      }
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchReferralMetrics()
    } else {
      setMetrics(null)
    }
  }, [isAuthenticated])

  return (
    <div className='mt-2 flex flex-col'>
      <ReferralBanner />
      <ReferralMetrics metrics={metrics} />
      <ReferralBonusTiers totalReferrals={metrics?.totalReferrals || 0} />
      {/* <Faq data={faqs} titleClass='mt-8 sm:mt-[44px] mb-[17px] sm:mb-[22px]' /> */}
    </div>
  )
}

export default ReferralPage

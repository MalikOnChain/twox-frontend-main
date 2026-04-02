'use client'

import Image from 'next/image'
import React from 'react'

import { useUser } from '@/context/user-context'

import RankingInfoCard from '@/components/pages/(other)/RankingPage/ranking-info-card'
import Rewards from '@/components/pages/(other)/RankingPage/rewards'
import VIPLevelsTable from '@/components/tables/vip-Levels-table'

import VIPBanner from '@/assets/banner/vip-banner.png'

const RankingPage = () => {
  const { user } = useUser()
  return (
    <div className='mx-auto mt-2 w-full max-w-[1400px] space-y-4'>
      <div className='grid gap-4 md:grid-cols-2 md:items-stretch'>
        <div className='flex'>
          <Image
            src={VIPBanner}
            alt='VIP Banner'
            width={517}
            height={288}
            sizes='50vw'
            className='h-auto w-full object-cover rounded-lg'
          />
        </div>
        <div className='flex'>
          <RankingInfoCard className='w-full p-4 md:p-6' />
        </div>
      </div>
      <Rewards />
      <VIPLevelsTable />
      {/* <TierBonusTable /> */}
    </div>
  )
}

export default RankingPage

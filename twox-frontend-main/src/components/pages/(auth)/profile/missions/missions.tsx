'use client'
import { Trophy } from 'lucide-react'
import React from 'react'

import { useProfile } from '@/context/data/profile-context'

import { formatNumber } from '@/lib/number'

import ProgressBar from '@/components/templates/progressbar/progressbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const Missions = () => {
  const { userRankStatus } = useProfile()

  if (!userRankStatus) return null

  return (
    <div className='mx-auto'>
      <Card className='mb-4'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Trophy className='h-6 w-6 text-yellow-500' />
            Current Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-2'>
            <div className='flex justify-between text-sm'>
              <span>Level {userRankStatus.currentLevel}</span>
              <span>
                {formatNumber(userRankStatus.totalXP)} /{' '}
                {formatNumber(userRankStatus.totalRequired)}
              </span>
            </div>
            <ProgressBar
              height='h-3'
              label='Progress'
              progress={userRankStatus.progress}
            />
          </div>
        </CardContent>
      </Card>

      {/* <div className='grid grid-cols-2 gap-4'>
        {userRankStatus.milestones.map((milestone, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-lg'>
                <Target className='h-5 w-5 text-blue-500' />
                Level {milestone.level} Milestone
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm text-gray-600'>Wager Required</p>
                    <p className='font-semibold'>
                      {formatNumber(milestone.wagerRequired)}
                    </p>
                  </div>
                  <div className='text-right'>
                    <p className='text-sm text-gray-600'>Remaining</p>
                    <p className='font-semibold'>
                      {formatNumber(milestone.remainingWager)}
                    </p>
                  </div>
                </div>
                <ProgressBar
                  height='h-3'
                  label='Progress'
                  progress={milestone.progress}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div> */}
    </div>
  )
}

export default Missions

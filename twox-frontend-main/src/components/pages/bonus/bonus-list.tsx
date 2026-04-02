'use client'
import React, { useEffect,useState } from 'react'

import { Bonus as BonusType,getAllBonuses } from '@/api/bonus'

import BonusItem from '@/components/pages/bonus/bonus-item'
import WelcomeBonus from '@/components/pages/bonus/welcome-bonus'
import Banner from '@/components/pages/home/banner/banner'

import BonusGreyIcon from '@/assets/banner/icon/bonus-grey.svg'

import { ClaimStatus } from '@/types/bonus'

const BonusList = () => {
  const [open, setOpen] = useState(false)
  const [bonuses, setBonuses] = useState<any[]>([])
  const [selectedBonus, setSelectedBonus] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBonuses = async () => {
      try {
        setLoading(true)
        const response = await getAllBonuses()
        if (response.success && response.data) {
          // Transform to match component expected format
          const transformed = response.data.map((bonus: BonusType) => ({
            _id: bonus._id,
            name: bonus.name,
            description: bonus.description,
            timeLeft: bonus.validTo ? new Date(bonus.validTo).toLocaleString() : 'No expiry',
            claimStatus: ClaimStatus.CAN_CLAIM,
            type: bonus.type,
            reward: bonus.defaultReward,
            wageringRequirement: bonus.wageringRequirement,
            validTo: bonus.validTo,
            termsAndConditions: bonus.termsAndConditions,
            imageUrl: bonus.imageUrl,
          }))
          setBonuses(transformed)
        }
      } catch (error) {
        console.error('Failed to fetch bonuses:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBonuses()
  }, [])

  const handleSelectBonus = (bonus: any) => {
    setSelectedBonus(bonus)
  }

  const handleBonusClaimed = () => {
    // Refresh bonuses after claiming
    const fetchBonuses = async () => {
      try {
        const response = await getAllBonuses()
        if (response.success && response.data) {
          const transformed = response.data.map((bonus: BonusType) => ({
            _id: bonus._id,
            name: bonus.name,
            description: bonus.description,
            timeLeft: bonus.validTo ? new Date(bonus.validTo).toLocaleString() : 'No expiry',
            claimStatus: ClaimStatus.CAN_CLAIM,
            type: bonus.type,
            reward: bonus.defaultReward,
            wageringRequirement: bonus.wageringRequirement,
            validTo: bonus.validTo,
            termsAndConditions: bonus.termsAndConditions,
            imageUrl: bonus.imageUrl,
          }))
          setBonuses(transformed)
        }
      } catch (error) {
        console.error('Failed to fetch bonuses:', error)
      }
    }
    fetchBonuses()
  }

  return (
    <div>
      <div className='mb-8 mt-4'>
        <Banner />
        <div className='my-6 h-[154px] w-full rounded-lg border border-mirage bg-cinder'>
          <div className='mx-auto flex h-full max-w-[220px] flex-col items-center justify-center text-center'>
            <BonusGreyIcon />
            <p className='mt-2 font-satoshi text-lg font-normal'>
              To activate a bonus, select it from the list below.
            </p>
          </div>
        </div>
        {loading ? (
          <div className='grid gap-4 xm:grid-cols-2 md:grid-cols-3 3xl:grid-cols-4'>
            {[...Array(6)].map((_, i) => (
              <div
                key={`skeleton-${i}`}
                className='h-[200px] animate-pulse rounded-lg bg-custom-dual-gradient'
              />
            ))}
          </div>
        ) : bonuses.length === 0 ? (
          <div className='flex h-[200px] items-center justify-center rounded-lg border border-mirage bg-cinder'>
            <p className='text-gray-400'>No bonuses available at the moment</p>
          </div>
        ) : (
          <div className='grid gap-4 xm:grid-cols-2 md:grid-cols-3 3xl:grid-cols-4'>
            {bonuses.map((bonus) => (
              <BonusItem 
                key={bonus._id} 
                item={bonus} 
                onOpenChange={setOpen}
                onSelectBonus={handleSelectBonus}
                onBonusClaimed={handleBonusClaimed}
              />
            ))}
          </div>
        )}
      </div>
      <WelcomeBonus 
        open={open} 
        onOpenChange={setOpen}
        bonusData={selectedBonus}
        onBonusClaimed={handleBonusClaimed}
      />
    </div>
  )
}

export default BonusList

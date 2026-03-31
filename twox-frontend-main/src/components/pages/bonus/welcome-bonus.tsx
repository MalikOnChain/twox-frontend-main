import { useState } from 'react'
import { toast } from 'sonner'

import { claimBonus } from '@/api/bonus'

import { useFingerprint } from '@/context/fingerprint-context'
import { Button } from '@/components/ui/button'
import { CustomModal } from '@/components/ui/modal'

import { RoundedCrossIcon } from '@/svg'

interface BonusData {
  _id: string
  name: string
  description?: string
  type?: string
  reward?: any
  wageringRequirement?: any
  validTo?: string
  termsAndConditions?: string
}

const WelcomeBonus = ({
  open,
  onOpenChange,
  bonusData,
  onBonusClaimed,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  bonusData?: BonusData
  onBonusClaimed?: () => void
}) => {
  const [isClaiming, setIsClaiming] = useState(false)
  const { visitorId, fingerprintData } = useFingerprint()

  const handleClaim = async () => {
    if (!bonusData?._id) return

    try {
      setIsClaiming(true)
      const response = await claimBonus(bonusData._id, undefined, {
        visitorId: visitorId || '',
        fingerprintData,
      })
      if (response.success) {
        toast.success('Bonus claimed successfully!')
        onOpenChange(false)
        // Notify parent to refresh the bonus list
        if (onBonusClaimed) {
          onBonusClaimed()
        }
      } else {
        toast.error(response.message || 'Failed to claim bonus')
      }
    } catch (error) {
      toast.error('Failed to claim bonus')
    } finally {
      setIsClaiming(false)
    }
  }

  if (!bonusData) return null

  // Format bonus details for display
  const getBonusAmount = () => {
    if (bonusData.reward?.cash?.percentage) {
      return `${bonusData.reward.cash.percentage}% up to $${bonusData.reward.cash.maxAmount || 'unlimited'}`
    }
    if (bonusData.reward?.cash?.amount) {
      return `$${bonusData.reward.cash.amount}`
    }
    if (bonusData.reward?.freespins?.count) {
      return `${bonusData.reward.freespins.count} Free Spins`
    }
    return 'N/A'
  }

  const bonusDetails = [
    {
      key: 'Type',
      value: bonusData.type?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Bonus',
    },
    {
      key: 'Currency',
      value: 'USDT',
    },
    {
      key: 'Bonus Amount',
      value: getBonusAmount(),
    },
    {
      key: 'Min Deposit',
      value: bonusData.reward?.cash?.minAmount 
        ? `$${bonusData.reward.cash.minAmount}` 
        : 'No minimum',
    },
    {
      key: 'Max Bonus',
      value: bonusData.reward?.cash?.maxAmount 
        ? `$${bonusData.reward.cash.maxAmount}` 
        : 'Unlimited',
    },
    {
      key: 'Wager Multiplier',
      value: bonusData.wageringRequirement?.multiplier 
        ? `X ${bonusData.wageringRequirement.multiplier}` 
        : 'No wagering',
    },
    {
      key: 'Expires on',
      value: bonusData.validTo 
        ? new Date(bonusData.validTo).toLocaleDateString() 
        : 'No expiry',
    },
  ]

  return (
    <CustomModal
      isOpen={open}
      onRequestClose={() => onOpenChange(false)}
      contentLabel='Bonus Details Modal'
    >
      <div className='w-full overflow-hidden font-satoshi'>
        <div className='flex'>
          <div className='mx-auto flex w-full min-w-[320px] max-w-md flex-1 flex-col justify-between gap-4 rounded-xl border border-mirage bg-dark-gradient p-6 md:min-w-[400px]'>
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <h2 className='font-satoshi text-lg font-bold text-white'>
                  {bonusData.name}
                </h2>
                <RoundedCrossIcon
                  onClick={() => {
                    onOpenChange(false)
                  }}
                />
              </div>
              
              {bonusData.description && (
                <p className='text-sm text-gray-400'>{bonusData.description}</p>
              )}

              <div className='space-y-2'>
                {bonusDetails.map((item) => (
                  <div key={item.key} className='flex justify-between gap-4'>
                    <p className='text-xs text-[#FFFFFF80]'>{item.key}:</p>
                    <p className='text-xs font-bold text-white'>{item.value}</p>
                  </div>
                ))}
              </div>

              {bonusData.reward?.freespins && (
                <p className='text-xs font-bold text-yellow-400'>
                  +{bonusData.reward.freespins.count} Free Spins @ ${bonusData.reward.freespins.valuePerSpin} each
                </p>
              )}

              {bonusData.termsAndConditions && (
                <div className='rounded-lg bg-black/20 p-3'>
                  <p className='text-xs text-gray-400'>{bonusData.termsAndConditions}</p>
                </div>
              )}

              <div className='grid grid-cols-2 gap-4'>
                <Button 
                  variant='secondary2' 
                  className='w-full'
                  onClick={handleClaim}
                  loading={isClaiming}
                >
                  Claim Bonus
                </Button>
                <Button 
                  variant='none' 
                  className='w-full'
                  onClick={() => onOpenChange(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CustomModal>
  )
}

export default WelcomeBonus

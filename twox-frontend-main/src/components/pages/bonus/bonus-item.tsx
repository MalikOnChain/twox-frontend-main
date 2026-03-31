import { Info } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { claimBonus } from '@/api/bonus'
import { AUTH_TABS, ModalType, useModal } from '@/context/modal-context'
import { useUser } from '@/context/user-context'
import { useFingerprint } from '@/context/fingerprint-context'

import { Button } from '@/components/ui/button'

import bonusImg from '@/assets/bonus-img.png'

import { ClaimStatus } from '@/types/bonus'

const BonusItem = ({
  item,
  className,
  onOpenChange,
  onSelectBonus,
  onBonusClaimed,
}: {
  item: {
    _id: string
    name: string
    timeLeft: string
    claimStatus: ClaimStatus
    imageUrl?: string
  }
  className?: string
  onOpenChange: (open: boolean) => void
  onSelectBonus?: (bonus: any) => void
  onBonusClaimed?: () => void
}) => {
  const { isAuthenticated } = useUser()
  const { setIsOpen, setType, setActiveTab } = useModal()
  const [isLoading, setIsLoading] = useState(false)
  const { visitorId, fingerprintData } = useFingerprint()

  const { t } = useTranslation()
  
  const handleClaim = async () => {
    if (!isAuthenticated) {
      setType(ModalType.Auth)
      setActiveTab(AUTH_TABS.signup)
      setIsOpen(true)
      return
    }

    try {
      setIsLoading(true)
      console.log('🎁 Claiming bonus ID:', item._id)
      const response = await claimBonus(item._id, undefined, {
        visitorId: visitorId || '',
        fingerprintData,
      })
      console.log('🎁 Claim response:', response)
      
      if (response.success) {
        console.log('✅ Bonus claimed! Refreshing list...')
        toast.success('Bonus claimed successfully!')
        // Notify parent to refresh the bonus list
        if (onBonusClaimed) {
          console.log('🔄 Calling onBonusClaimed callback')
          onBonusClaimed()
        } else {
          console.warn('⚠️ onBonusClaimed callback not provided!')
        }
      } else {
        console.error('❌ Claim failed:', response.message)
        toast.error(response.message || 'Failed to claim bonus')
      }
    } catch (error) {
      console.error('💥 Error claiming bonus:', error)
      toast.error('Failed to claim bonus')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='rounded-2xl border border-mirage bg-dark-gradient p-4 font-satoshi'>
      <Image
        src={item.imageUrl || bonusImg}
        alt={item.name}
        width={353}
        height={206}
        className='rounded-2xl object-cover'
        unoptimized={!!item.imageUrl}
      />
      <div>
        <h4 className='mb-1 mt-4 text-lg font-bold text-white md:text-xl'>
          {item.name}
        </h4>
        <p className='text-sm font-normal text-[#FFFFFF80]'>
          Available Until {item.timeLeft}
        </p>
        <div className='mt-2 flex items-center gap-1'>
          <Info className='h-3 w-3' />
          <p
            className='cursor-pointer font-satoshi text-sm font-bold text-white'
            onClick={() => {
              if (onSelectBonus) onSelectBonus(item)
              onOpenChange(true)
            }}
          >
            More Info
          </p>
        </div>
        <div className='my-4 h-[1px] w-full bg-mirage' />
        {item.claimStatus !== ClaimStatus.CANNOT_CLAIM && (
          <Button
            loading={isLoading}
            variant='secondary2'
            className='w-full'
            disabled={item.claimStatus === ClaimStatus.CLAIMED}
            onClick={handleClaim}
          >
            {isAuthenticated
              ? item.claimStatus === ClaimStatus.CAN_CLAIM
                ? t('bonus.claim')
                : item.claimStatus === ClaimStatus.CLAIMED
                  ? t('bonus.claimed')
                  : t('bonus.cannot_claim')
              : t('bonus.sign_up')}
          </Button>
        )}
      </div>
    </div>
  )
}

export default BonusItem

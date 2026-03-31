import { X } from 'lucide-react'
import React, { useEffect, useState } from 'react'

// Import API utilities
import { getSpinResult, getWheelBonuses } from '@/api/wheel'

import { useUser } from '@/context/user-context'

import { Wheel } from '@/components/modals/wheel-modal/Wheel'
import { CustomModal } from '@/components/ui/modal'

interface WheelModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const WheelModal: React.FC<WheelModalProps> = ({ open, onOpenChange }) => {
  // State
  const { user } = useUser()
  const [spins, setSpins] = useState(user?.spinCount || 0)
  const [participants, setParticipants] = useState<string[]>([
    '2X',
    '5X',
    '10X',
    '50X',
    '100X',
    '500X',
    '1000X',
    '2000X',
  ])
  const [isLoading, setIsLoading] = useState(false)

  // Fetch initial data when modal opens
  useEffect(() => {
    if (open) {
      // You could fetch the user's current spins and available prizes here
      // For now, we'll use the default values
    }
  }, [open])

  const getWheelBonusesFromApi = async (): Promise<string[]> => {
    const response = await getWheelBonuses()
    return (
      response.wheelBonusAmounts?.map((amount) => 'R$ ' + amount.toString()) ||
      []
    )
  }

  const getSpinResultFromApi = async (): Promise<string | null> => {
    if (spins <= 0) return null

    setIsLoading(true)
    try {
      const response = await getSpinResult()

      if (response.success) {
        setSpins((prev) => prev - 1)
        return response.result
      } else {
        console.error('Failed to get spin result:', response.error)
        return null
      }
    } catch (error) {
      console.error('Error getting spin result:', error)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const fetchBonuses = async () => {
      const bonuses = await getWheelBonusesFromApi()
      setParticipants(bonuses)
    }
    fetchBonuses()
  }, [])

  return (
    <CustomModal
      isOpen={open}
      onRequestClose={() => onOpenChange(false)}
      contentLabel='Wheel of Fortune'
    >
      <div className='relative border bg-[url(/background/bg-compose.jpeg)] bg-cover bg-center bg-no-repeat p-3.5 shadow-sm shadow-cyan-50 md:w-[930px]'>
        <button
          className='absolute right-5 top-1 rounded-[10px] p-2 md:right-2.5 md:top-2.5'
          onClick={() => onOpenChange(false)}
          disabled={isLoading}
        >
          <X className='size-8 text-white' />
        </button>

        <Wheel
          spins={spins}
          setSpins={setSpins}
          participants={participants}
          getSpinResult={getSpinResultFromApi}
          isLoading={isLoading}
        />

        <div className='absolute bottom-5 left-0 right-0 flex w-full items-center justify-center gap-4'>
          <div className='flex items-center rounded-lg bg-black bg-opacity-60 px-4 py-2 text-white'>
            <span className='mr-2'>Spins:</span>
            <span className='font-bold'>{spins}</span>
          </div>
        </div>
      </div>
    </CustomModal>
  )
}

export default WheelModal

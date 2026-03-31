import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { toast } from 'sonner'

import { claimBonus, getAllBonuses, getUserBonuses } from '@/api/bonus'

import { useInitialSettingsContext } from '@/context/initial-settings-context'
import { useUser } from '@/context/user-context'

import { Bonus, ReferralBonus } from '@/types/bonus'

interface RewardsContextType {
  eligibleActiveBonuses: (Bonus | ReferralBonus)[]
  allBonuses: (Bonus | ReferralBonus)[]
  isOpen: boolean
  isLoadingBonuses: boolean
  isClaiming: string | null
  setIsOpen: Dispatch<SetStateAction<boolean>>
  handleClaimBonus: (bonus: Bonus | ReferralBonus) => Promise<void>
  getUserEligibleBonuses: () => Promise<void>
}

const RewardsContext = createContext<RewardsContextType | undefined>(undefined)

interface RewardsProviderProps {
  children: React.ReactNode
}

export const RewardsProvider: React.FC<RewardsProviderProps> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const { isAuthenticated } = useUser()
  const [eligibleActiveBonuses, setEligibleActiveBonuses] = useState<Bonus[]>(
    []
  )
  const [allBonuses, setAllBonuses] = useState<Bonus[]>([])

  const [isLoadingBonuses, setIsLoadingBonuses] = useState(true)
  const { initialBonuses } = useInitialSettingsContext()
  const [isClaiming, setIsClaiming] = useState<string | null>(null)

  const getUserEligibleBonuses = useCallback(async () => {
    try {
      setIsLoadingBonuses(true)
      const { bonuses } = await getUserBonuses()
      setEligibleActiveBonuses(
        initialBonuses
          .filter(
            (bonus) =>
              bonus.isVisible && bonuses.some((b) => b._id === bonus._id)
          )
          .map((b) => {
            const bonus = bonuses.find((_b) => _b._id === b._id) as any
            return {
              ...b,
              ...bonus,
            }
          })
      )
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Error getting user eligible bonuses')
      }

      console.error('Error getting user eligible bonuses', error)
    } finally {
      setIsLoadingBonuses(false)
    }
  }, [initialBonuses])

  const getAllUserBonuses = useCallback(async () => {
    try {
      const { data } = await getAllBonuses()
      setAllBonuses(data as any)
    } catch (error) {
      console.error('Error getting all bonuses', error)
    }
  }, [])

  const handleClaimBonus = useCallback(
    async (bonus: Bonus | ReferralBonus) => {
      try {
        setIsClaiming(bonus._id)
        const code = typeof bonus === 'object' && 'code' in bonus ? bonus.code || undefined : undefined
        await claimBonus(bonus._id, code)
        await getUserEligibleBonuses()
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message)
        } else {
          toast.error('Error claiming bonus')
        }
      } finally {
        setIsClaiming(null)
      }
    },
    [getUserEligibleBonuses]
  )

  useEffect(() => {
    if (isAuthenticated) {
      getUserEligibleBonuses()
    } else {
      getAllUserBonuses()
    }
  }, [isAuthenticated, getUserEligibleBonuses, getAllUserBonuses])

  const value = useMemo(
    () => ({
      eligibleActiveBonuses,
      allBonuses,
      isOpen,
      isClaiming,
      handleClaimBonus,
      isLoadingBonuses,
      setIsOpen,
      getUserEligibleBonuses,
    }),
    [
      isOpen,
      isClaiming,
      isLoadingBonuses,
      eligibleActiveBonuses,
      allBonuses,
      setIsOpen,
      handleClaimBonus,
      getUserEligibleBonuses,
    ]
  )

  return (
    <RewardsContext.Provider value={value}>{children}</RewardsContext.Provider>
  )
}

export const useRewards = () => {
  const context = useContext(RewardsContext)
  if (context === undefined) {
    throw new Error('useRewards must be used within a RewardsProvider')
  }
  return context
}

export default useRewards

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

import { getPromotions } from '@/api/promotion'

import { IPromotion } from '@/types/promotion'

interface PromotionsContextType {
  promotions: IPromotion[]
  isOpen: boolean
  isLoadingPromotions: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  getPromotionsList: () => Promise<void>
}

const PromotionsContext = createContext<PromotionsContextType | undefined>(
  undefined
)

interface PromotionsProviderProps {
  children: React.ReactNode
}

export const PromotionsProvider: React.FC<PromotionsProviderProps> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [promotions, setPromotions] = useState<IPromotion[]>([])
  const [isLoadingPromotions, setIsLoadingPromotions] = useState(true)

  const getPromotionsList = useCallback(async () => {
    try {
      setIsLoadingPromotions(true)
      const { data } = await getPromotions()
      // Map API Promotion to IPromotion
      const mappedPromotions: IPromotion[] = data.map((promo) => ({
        _id: promo._id,
        name: promo.name,
        description: promo.summary,
        image: promo.image || '',
      }))
      setPromotions(mappedPromotions)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Error getting promotions')
      }
      console.error('Error getting promotions', error)
    } finally {
      setIsLoadingPromotions(false)
    }
  }, [])

  useEffect(() => {
    getPromotionsList()
  }, [getPromotionsList])

  const value = useMemo(
    () => ({
      promotions,
      isOpen,
      isLoadingPromotions,
      setIsOpen,
      getPromotionsList,
    }),
    [isOpen, isLoadingPromotions, promotions, setIsOpen, getPromotionsList]
  )

  return (
    <PromotionsContext.Provider value={value}>
      {children}
    </PromotionsContext.Provider>
  )
}

export const usePromotions = () => {
  const context = useContext(PromotionsContext)
  if (context === undefined) {
    throw new Error('usePromotions must be used within a PromotionsProvider')
  }
  return context
}

export default usePromotions

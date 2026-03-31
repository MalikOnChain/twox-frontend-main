'use client'

import React, {
  createContext,
  Dispatch,
  SetStateAction,
  Suspense,
  useContext,
  useMemo,
  useState,
} from 'react'

import { AUTH_TABS } from '@/lib/auth'
import { WALLET_MODAL_TABS } from '@/lib/crypto'

import BalanceModal from '@/components/layout/header/balance-modal/balance-modal'
import DepositWithdrawModal from '@/components/layout/header/deposit-withdraw-modal/deposit-withdraw-modal'
import AccessRestrictedModal from '@/components/modals/access-restricted-modal/access-restricted-modal'

import { IPromotion } from '@/types/promotion'

// Enum for modal types
export { AUTH_TABS } from '@/lib/auth'
export { WALLET_MODAL_TABS } from '@/lib/crypto'

export enum ModalType {
  Auth = 'Auth',
  Wallet = 'Wallet',
  Wheel = 'Wheel',
  Pix = 'Pix',
  Promotion = 'Promotion',
  DepositWithdraw = 'DepositWithdraw',
  Balance = 'Balance',
  AccessRestricted = 'AccessRestricted',
}

const AuthModal = React.lazy(() => import('@/components/modals/auth-modal'))
const WalletModal = React.lazy(
  () => import('@/components/modals/wallet-modal/index')
)
const WheelModal = React.lazy(() => import('@/components/modals/wheel-modal'))
const PixModal = React.lazy(() => import('@/components/modals/pix-modal'))
const PromotionModal = React.lazy(
  () => import('@/components/modals/promotion-modal/promotion-modal')
)

interface ModalContextType {
  isOpen: boolean
  activeTab: WALLET_MODAL_TABS | AUTH_TABS | undefined
  type: ModalType | undefined
  promotion?: IPromotion
  setIsOpen: Dispatch<SetStateAction<boolean>>
  setActiveTab: Dispatch<
    SetStateAction<WALLET_MODAL_TABS | AUTH_TABS | undefined>
  >
  setType: Dispatch<SetStateAction<ModalType | undefined>>
  setPromotion: Dispatch<SetStateAction<IPromotion | undefined>>
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

// ModalProvider component that handles the logic for displaying modals
export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState<ModalContextType['isOpen']>(false)
  const [activeTab, setActiveTab] =
    useState<ModalContextType['activeTab']>(undefined)
  const [type, setType] = useState<ModalContextType['type']>(undefined)
  const [promotion, setPromotion] = useState<IPromotion | undefined>(undefined)

  const value = useMemo(
    () => ({
      isOpen,
      activeTab,
      type,
      promotion,
      setIsOpen,
      setActiveTab,
      setType,
      setPromotion,
    }),
    [
      isOpen,
      activeTab,
      type,
      promotion,
      setIsOpen,
      setActiveTab,
      setType,
      setPromotion,
    ]
  )

  return (
    <ModalContext.Provider value={value}>
      <Suspense fallback={<></>}>
        {type === ModalType.Auth && (
          <AuthModal
            setActiveTab={setActiveTab}
            activeTab={activeTab}
            open={isOpen}
            onOpenChange={setIsOpen}
          />
        )}
        {type === ModalType.Wallet && (
          <WalletModal open={isOpen} onOpenChange={setIsOpen} />
        )}
        {type === ModalType.Wheel && (
          <WheelModal open={isOpen} onOpenChange={setIsOpen} />
        )}
        {type === ModalType.Pix && (
          <PixModal open={isOpen} onOpenChange={setIsOpen} />
        )}
        {type === ModalType.Promotion && (
          <PromotionModal
            open={isOpen}
            onOpenChange={setIsOpen}
            promotion={promotion}
          />
        )}
        {type === ModalType.DepositWithdraw && (
          <DepositWithdrawModal
            open={isOpen}
            onOpenChange={setIsOpen}
            // activeTab={activeTab}
            // setActiveTab={setActiveTab}
          />
        )}
        {type === ModalType.Balance && (
          <BalanceModal open={isOpen} onOpenChange={setIsOpen} />
        )}
        {type === ModalType.AccessRestricted && (
          <AccessRestrictedModal open={isOpen} onOpenChange={setIsOpen} />
        )}
      </Suspense>
      {children}
    </ModalContext.Provider>
  )
}

// Custom hook for using the modal context with a specific modal type
export function useModal() {
  const context = useContext(ModalContext)
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider')
  }

  return context
}

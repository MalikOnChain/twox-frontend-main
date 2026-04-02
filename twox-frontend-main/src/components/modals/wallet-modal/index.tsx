'use client'

import { X } from 'lucide-react'
import { memo, useMemo } from 'react'

import {
  useWalletModal,
  WalletModalProvider,
} from '@/context/wallet-modal-context'

import { AUTH_TABS } from '@/lib/auth'
import { WALLET_MODAL_TABS } from '@/lib/crypto'
import { cn } from '@/lib/utils'

import { DepositTargetType } from '@/components/modals/wallet-modal/deposit'
import DepositAddress from '@/components/modals/wallet-modal/deposit/deposit-address'
import WalletModalContent from '@/components/modals/wallet-modal/wallet-modal-content'
import { Button } from '@/components/ui/button'
import { CustomModal } from '@/components/ui/modal'

interface WalletModal {
  open: boolean
  onOpenChange: (open: boolean) => void
  activeTab?: WALLET_MODAL_TABS | AUTH_TABS | undefined
}

function WalletModal({ open, onOpenChange }: WalletModal) {
  return (
    <WalletModalProvider>
      <WalletModalContextContent open={open} onOpenChange={onOpenChange} />
    </WalletModalProvider>
  )
}

function WalletModalContextContent({ open, onOpenChange }: WalletModal) {
  const {
    activeTab,
    activeTarget,
    setActiveTarget,
    activeCrypto,
    setActiveCrypto,
  } = useWalletModal()

  const getTitle = () => {
    switch (activeTarget) {
      case DepositTargetType.Crypto:
        return 'Deposit with Crypto'
      case DepositTargetType.Skinsback:
        return 'Deposit with Skinsback'
      case DepositTargetType.GiftCards:
        return 'Deposit with Gift Cards'
      case DepositTargetType.Fystack:
        return 'Crypto deposit'
      default:
        if (activeTarget == null) {
          return 'Wallet'
        }
        return activeTarget
    }
  }

  const handleClose = () => {
    setActiveTarget(null)
    setActiveCrypto(null)
    onOpenChange(false)
  }

  const showDepositAddress = useMemo(() => {
    return activeCrypto && activeTab == WALLET_MODAL_TABS.deposit
  }, [activeCrypto, activeTab])

  return (
    <CustomModal
      isOpen={open}
      onRequestClose={handleClose}
      contentLabel='Wallet Modal'
    >
      <div
        aria-describedby='wallet modal'
        className={cn(
          'relative flex gap-0 overflow-hidden rounded-none md:rounded-[22px]'
        )}
      >
        {showDepositAddress && <DepositAddress />}
        <div
          className={cn(
            'h-[100dvh] w-screen bg-background p-[16px] sm:h-auto sm:w-[400px] md:block md:p-[30px] md:pb-[18px] xl:w-[484px]',
            showDepositAddress ? 'hidden' : ''
          )}
        >
          <div className='flex items-center justify-between pb-6 text-[22px] font-bold'>
            <span
              className={cn(
                'flex items-center gap-2',
                activeTab === WALLET_MODAL_TABS.deposit ? 'md:hidden' : ''
              )}
            >
              {getTitle()}
            </span>
            <Button
              className='absolute right-3 top-[14px] h-6 w-6 bg-transparent !p-0 hover:bg-transparent'
              onClick={handleClose}
              variant='link'
            >
              <X className='!h-6 !w-6 text-secondary-text' size={24} />
            </Button>
          </div>
          <WalletModalContent />
        </div>
      </div>
    </CustomModal>
  )
}

export default memo(WalletModal)

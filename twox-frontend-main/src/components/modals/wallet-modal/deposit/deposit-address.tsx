import { ChevronRight, X } from 'lucide-react'
import { useCallback, useMemo } from 'react'

import { useWalletModal } from '@/context/wallet-modal-context'

import { WALLET_MODAL_TABS } from '@/lib/crypto'
import { cn } from '@/lib/utils'

import GiftCardContent from '@/components/modals/wallet-modal/gift-card'
import { Button } from '@/components/ui/button'

import CryptoDepositContent from './crypto-deposit-content'
import { DepositTargetType } from './index'
import SkinsbackContent from './skinsback-content'
import WalletContent from './wallet-content'

const DepositAddress = () => {
  const { activeTab, activeTarget, setActiveTarget, setActiveCrypto } =
    useWalletModal()

  const handleBack = useCallback(() => {
    setActiveTarget(null)
    setActiveCrypto(null)
  }, [setActiveCrypto, setActiveTarget])

  const AddressHeader = useMemo(() => {
    if (activeTarget === DepositTargetType.Crypto) {
      return (
        <div className='mb-4 md:hidden'>
          <div className='mb-4 flex items-center text-xs font-normal'>
            <span className='text-muted-foreground'>Deposit</span>
            <ChevronRight className='mx-1 text-muted-foreground' size={14} />
            <span className='text-foreground'>Deposit Address</span>
          </div>
          <span
            className={cn(
              'flex items-center gap-2 text-xl font-bold md:text-[28px]',
              activeTab === WALLET_MODAL_TABS.deposit ? 'md:hidden' : ''
            )}
          >
            Deposit Address
          </span>
          <Button
            className='absolute right-3 top-[14px] h-6 w-6 bg-transparent !p-0 hover:bg-transparent'
            onClick={handleBack}
            variant='link'
          >
            <X className='!h-6 !w-6 text-secondary-text' size={24} />
          </Button>
        </div>
      )
    }

    return <></>
  }, [activeTarget, activeTab, handleBack])

  return (
    <div
      className={cn(
        'flex h-[100dvh] w-screen flex-col bg-background-secondary p-[16px] transition-all duration-300 sm:h-auto sm:w-[360px] md:p-[30px]'
      )}
    >
      <h1 className='mb-[22px] hidden text-[22px] font-bold text-secondary-foreground md:block'>
        Wallet
      </h1>

      {AddressHeader}

      {activeTarget === DepositTargetType.Crypto && <CryptoDepositContent />}
      {activeTarget === DepositTargetType.Skinsback && <SkinsbackContent />}
      {(activeTarget === DepositTargetType.MetaMask ||
        activeTarget === DepositTargetType.Coinbase) && (
        <WalletContent depositType={activeTarget} />
      )}
      {activeTarget === DepositTargetType.GiftCards && <GiftCardContent />}

      <div className='flex flex-1 items-end'>
        <Button
          className='w-full !text-base font-medium text-foreground'
          onClick={handleBack}
        >
          Go Back
        </Button>
      </div>
    </div>
  )
}

export default DepositAddress

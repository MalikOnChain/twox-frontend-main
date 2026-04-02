import { useWalletModal } from '@/context/wallet-modal-context'

import { WALLET_MODAL_TABS } from '@/lib/crypto'
import { cn } from '@/lib/utils'

import { CryptoDepositFystackFlow } from '@/components/layout/header/deposit-withdraw-modal/crypto-deposit-fystack-flow'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import DepositContent, { DepositTargetType } from './deposit'
import WithdrawContent from './withdraw/withdraw-content'

export default function WalletModalContent() {
  const { activeTarget, activeTab, setActiveTab, setActiveTarget } =
    useWalletModal()

  const handleTabChange = (value: string) => {
    setActiveTab(value as WALLET_MODAL_TABS)
    setActiveTarget(
      value === WALLET_MODAL_TABS.deposit ? DepositTargetType.Crypto : null
    ) // Replace with Crypto
  }

  return (
    <>
      <div className='w-full sm:max-w-[575px]'>
        <Tabs
          defaultValue={activeTab}
          className='w-full'
          onValueChange={handleTabChange}
        >
          {(activeTab == WALLET_MODAL_TABS.deposit || !activeTarget) && (
            <TabsList
              className='bg-secondary-0 mb-[18px] flex w-full items-center justify-start bg-background-teritary sm:mb-[22px]'
              variant='secondary'
            >
              {Object.values(WALLET_MODAL_TABS).map((tab) => (
                <TabsTrigger
                  key={tab}
                  className={cn('relative z-[1] flex-1')}
                  value={tab}
                  variant='secondary'
                >
                  <div className='relative z-[1] px-2 py-[14px] text-sm'>
                    {tab}
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>
          )}

          <TabsContent
            value={WALLET_MODAL_TABS.deposit}
            className='m-0 rounded-md'
          >
            {activeTarget === DepositTargetType.Fystack ? (
              <CryptoDepositFystackFlow onExit={() => setActiveTarget(null)} />
            ) : (
              <DepositContent />
            )}
          </TabsContent>

          {/* <TabsContent
            value={WALLET_MODAL_TABS.coupons}
            className='m-0 rounded-md'
          >
            <CouponsContent />
          </TabsContent> */}

          <TabsContent
            value={WALLET_MODAL_TABS.withdraw}
            className='m-0 rounded-md'
          >
            <WithdrawContent />
          </TabsContent>

          {/* <TabsContent
            value={WALLET_MODAL_TABS.giftCard}
            className='m-0 rounded-md'
          >
            <GiftCardContent />
          </TabsContent> */}
        </Tabs>
      </div>
    </>
  )
}

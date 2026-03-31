import { AnimatePresence } from 'framer-motion'
import { XIcon } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useEvent } from '@/context/event-context'

import { Button } from '@/components/ui/button'
import { CustomModal } from '@/components/ui/modal'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

import PaymentBanner from '@/assets/banner/payment-banner.png'

import Deposit from './deposit'
import Withdraw from './withdraw'
const PixModal = ({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) => {
  const [tab, setTab] = useState('deposit')
  const { setIsPaid, isPaid } = useEvent()
  const { t } = useTranslation()
  const [step, setStep] = useState(1)

  useEffect(() => {
    if (isPaid) {
      onOpenChange(false)
      setIsPaid(false)
    }
  }, [isPaid, onOpenChange, setIsPaid])

  useEffect(() => {
    if (open) {
      setStep(1)
      setTab('deposit')
    }
  }, [open])

  return (
    <CustomModal
      isOpen={open}
      onRequestClose={() => onOpenChange(false)}
      contentLabel='Pix Modal'
      isCentered={false}
    >
      <Button
        variant='outline'
        size='icon'
        onClick={() => onOpenChange(false)}
        className='absolute right-3 top-3 z-40'
      >
        <XIcon className='!h-4 !w-4' />
      </Button>
      <div className='flex flex-col gap-4 rounded-lg bg-background-secondary sm:w-96 md:min-h-[755px] md:w-[440px]'>
        {step === 1 && (
          <>
            <Image
              src={PaymentBanner}
              alt='logo'
              width={100}
              height={100}
              sizes='100vw'
              className='right-0 top-0 w-full'
            />

            <Tabs
              value={tab}
              onValueChange={setTab}
              className='mx-auto w-full max-w-[400px] px-4 md:px-0'
            >
              <TabsList>
                <TabsTrigger value='deposit'>
                  {t('pix_modal.deposit')}
                </TabsTrigger>
                <TabsTrigger value='withdraw'>
                  {t('pix_modal.withdraw')}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </>
        )}

        <div className='relative flex-1 pb-8'>
          <AnimatePresence mode='wait' initial={false}>
            {tab === 'deposit' && (
              <Deposit
                step={step}
                setStep={setStep}
                onClose={() => onOpenChange(false)}
              />
            )}
            {tab === 'withdraw' && (
              <Withdraw onFinish={() => onOpenChange(false)} />
            )}
          </AnimatePresence>
        </div>
      </div>
    </CustomModal>
  )
}

export default PixModal

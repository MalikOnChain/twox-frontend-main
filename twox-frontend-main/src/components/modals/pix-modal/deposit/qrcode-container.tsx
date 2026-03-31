import { ArrowLeftIcon, CopyIcon } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'

const QrCodeContainer = ({
  onBack,
  onNext,
  paymentData,
}: {
  onBack: () => void
  onNext: () => void
  paymentData: any
}) => {
  const [copied, setCopied] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [initialTotalTime, setInitialTotalTime] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const { t } = useTranslation()
  useEffect(() => {
    if (paymentData?.due) {
      const brazilOffset = 3 * 60 * 60 * 1000
      const dueInBrazil = new Date(paymentData.due).getTime()
      const dueUTC = dueInBrazil - brazilOffset
      const nowUTC = new Date().getTime() // This is UTC

      const diff = Math.max(0, Math.floor((dueUTC - nowUTC) / 1000))
      setTimeLeft(diff)
      setInitialTotalTime(diff)
      const updateTimer = () => {
        const now = Date.now()
        const diff = Math.max(0, Math.floor((dueUTC - now) / 1000))
        setTimeLeft(diff)
      }
      updateTimer()
      timerRef.current = setInterval(updateTimer, 1000)
      return () => {
        if (timerRef.current) clearInterval(timerRef.current)
      }
    }
  }, [paymentData?.due])

  const handleCopy = () => {
    navigator.clipboard.writeText(paymentData.qrcode)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0')
  const seconds = String(timeLeft % 60).padStart(2, '0')

  return (
    <div className='flex h-full flex-col p-6'>
      <div className='flex items-center gap-2 border-b border-gray-700 pb-2'>
        <button
          className='flex items-center gap-2 !p-0 text-white'
          onClick={onBack}
        >
          <ArrowLeftIcon className='h-4 w-4' />
          <div className='flex flex-col items-start'>
            <span>{t('pix_modal.back')}</span>
            <span className='text-xs text-muted-foreground'>
              {t('pix_modal.choose_another_value')}
            </span>
          </div>
        </button>
      </div>
      <div className='flex flex-1 flex-col items-center justify-between gap-4 py-4'>
        <div className='flex flex-col items-center gap-4'>
          <span className='text-lg'>{t('pix_modal.scan_the_image')}</span>
          <div className='rounded-lg border border-gray-700 bg-white p-2'>
            <QRCodeSVG value={paymentData.qrcode} size={120} />
          </div>
        </div>
        <ol className='list-inside list-decimal text-sm text-muted-foreground'>
          <li>{t('pix_modal.scan_the_qr_code_above_in_the_pix_app')}</li>
          <li>{t('pix_modal.complete_the_deposit_with_your_bank')}</li>
          <li>
            {t(
              'pix_modal.the_balance_of_r_paymentdata_amount_fixed_2_and_any_applicable_deposit_bonus_will_be_credited'
            )}
          </li>
        </ol>
        <div className='flex w-full max-w-md flex-col items-center gap-4 rounded-xl border-[2px] border-dotted border-gray-700 bg-background-fourth p-4'>
          <span className='mb-2 text-lg font-bold'>
            R$ {paymentData.amount?.toFixed(2)}
          </span>
          <textarea
            className='w-full resize-none rounded-lg bg-black p-3 text-xs text-white'
            value={paymentData.qrcode}
            readOnly
            rows={5}
            onFocus={(e) => e.target.select()}
          />
          <Button
            className='min-h-12 w-full rounded-lg border-none bg-gradient-to-b from-green-500 to-green-600 py-3 text-sm shadow-2xl shadow-green-700/40 transition-all duration-100 hover:from-green-500 hover:to-green-700 active:translate-y-1 active:from-green-600 active:to-green-800 active:shadow-md'
            style={{ boxShadow: '0 0px 12px 0 #22c55e99, 0 1.5px 0 0 #15803d' }}
            onClick={handleCopy}
          >
            <CopyIcon className='h-4 w-4' />
            {copied ? t('pix_modal.copied') : t('pix_modal.copy_code')}
          </Button>
          <span className='text-center text-xs text-muted-foreground'>
            {t(
              'pix_modal.if_you_have_difficulty_with_the_copy_button_tap_or_click_in_the_text_field_to_select_the_entire_code_and_copy_it_manually'
            )}
          </span>
        </div>
        {timeLeft > 0 ? (
          <div className='flex flex-col items-center'>
            <span className='text-orange-400'>
              {t('pix_modal.the_time_for_you_to_pay_ends_in')}
            </span>
            <span className='mt-1 text-2xl font-bold'>
              {minutes}:{seconds}
            </span>
            <div className='mt-2 h-2 w-48 rounded bg-gray-700'>
              <div
                className='h-2 rounded bg-green-500 transition-all duration-1000'
                style={{
                  width: `${initialTotalTime ? (timeLeft / initialTotalTime) * 100 : 0}%`,
                }}
              />
            </div>
          </div>
        ) : (
          <div className='flex w-full flex-col items-center gap-4'>
            <span className='text-xs text-red-500'>
              {t('pix_modal.expired_pix_code')}
            </span>
            <Button
              className='min-h-12 w-full rounded-lg border-none bg-gradient-to-b from-green-500 to-green-600 py-3 text-sm shadow-2xl shadow-green-700/40 transition-all duration-100 hover:from-green-500 hover:to-green-700 active:translate-y-1 active:from-green-600 active:to-green-800 active:shadow-md'
              style={{
                boxShadow: '0 0px 12px 0 #22c55e99, 0 1.5px 0 0 #15803d',
              }}
              onClick={handleCopy}
            >
              {t('pix_modal.i_have_already_paid_the_pix')}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default QrCodeContainer

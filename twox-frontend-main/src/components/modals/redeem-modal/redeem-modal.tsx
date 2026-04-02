'use client'

import { X } from 'lucide-react'
import Image from 'next/image'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { redeemPromoCode } from '@/api/bonus'

import { useFingerprint } from '@/context/fingerprint-context'

import redeemImg from '@/assets/images/redeem_img.png'

interface RedeemModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function RedeemModal({ isOpen, onClose }: RedeemModalProps) {
  const { t } = useTranslation()
  const [promoCode, setPromoCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { visitorId, fingerprintData } = useFingerprint()

  const handleRedeem = async () => {
    if (!promoCode.trim()) {
      toast.error('Please enter a promotional code')
      return
    }

    try {
      setIsLoading(true)
      await redeemPromoCode(promoCode, {
        visitorId: visitorId || '',
        fingerprintData,
      })
      toast.success('Promo code redeemed successfully!')
      setPromoCode('')
      onClose()
    } catch (error: any) {
      toast.error(error.message || 'Failed to redeem promo code')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleRedeem()
    }
  }

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4'>
      <div 
        className='relative w-[830px] h-[300px] rounded-2xl bg-[#0C0C0C] border border-gray-800/50 shadow-2xl transition-all duration-300'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className='absolute right-4 top-4 flex h-[20px] w-[20px] items-center justify-center rounded-full border border-white/30 text-white hover:bg-white/10 transition-colors z-10'
        >
          <X className='h-4 w-4' />
        </button>

        {/* Content Container */}
        <div className='flex h-full'>
          {/* Left Section - Text and Input (60-65% width) */}
          <div className='flex flex-col justify-center px-6 w-[60%]'>
            <h2 className='mb-6 font-satoshi text-xl font-bold text-white'>
              {t('redeem.title')}
            </h2>
            
            <h3 className='mb-3 font-satoshi text-4xl font-extrabold text-white' style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
              {t('redeem.heading')}
            </h3>
            
            <p className='mb-8 font-satoshi text-sm text-gray-400 leading-relaxed'>
              {t('redeem.description')}
            </p>

            {/* Input and Button Group */}
            <div className='space-y-3'>
              <label className='block font-satoshi text-sm text-gray-400'>
                {t('redeem.enter_code_label')}
              </label>
              <div className='flex gap-3'>
                <input
                  type='text'
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t('redeem.enter_code_placeholder')}
                  className='flex-1 h-12 rounded-lg bg-[#1A1A1A] border border-gray-700 px-4 font-satoshi text-sm text-white outline-none placeholder:text-gray-500 focus:border-gray-600 focus:ring-0 transition-colors'
                  disabled={isLoading}
                />
                <button
                  onClick={handleRedeem}
                  disabled={isLoading || !promoCode.trim()}
                  className='px-8 h-12 rounded-lg bg-gradient-to-r from-arty-red to-[#C00337] font-satoshi text-sm font-bold text-white hover:from-[#C00337] hover:to-arty-red transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg'
                >
                  {isLoading ? t('redeem.redeeming') : t('redeem.redeem_button')}
                </button>
              </div>
            </div>
          </div>

          {/* Right Section - Image (35-40% width) */}
          <div className='relative flex items-center justify-center w-[40%] pr-4'>
            <Image
              src={redeemImg}
              alt='Slot Machine'
              width={300}
              height={300}
              className='h-full w-auto object-contain'
              priority
            />
          </div>
        </div>
      </div>
    </div>
  )
}


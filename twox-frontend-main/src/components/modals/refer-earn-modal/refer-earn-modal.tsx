'use client'

import { Copy,X } from 'lucide-react'
import Image from 'next/image'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { getUserReferralMetrics } from '@/api/bonus'

import { useProfile } from '@/context/data/profile-context'
import { useInitialSettingsContext } from '@/context/initial-settings-context'
import { useUser } from '@/context/user-context'

import frameImg from '@/assets/images/frame_img.png'

interface ReferEarnModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ReferEarnModal({ isOpen, onClose }: ReferEarnModalProps) {
  const { t } = useTranslation()
  const { user } = useUser()
  const { userRankStatus } = useProfile()
  const { ranks } = useInitialSettingsContext()
  const [activeTab, setActiveTab] = useState<'refer' | 'earnings'>('refer')
  const [chartPeriod, setChartPeriod] = useState<'30d' | '14d' | '7d'>('7d')
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [earnings, setEarnings] = useState({
    totalReferrals: 0,
    totalDeposits: 0,
    totalWagered: 0,
    totalEarnings: 0,
  })
  const [loadingEarnings, setLoadingEarnings] = useState(false)

  const referralCode = user?.referralCode || 'driomalik'
  const referralUrl = `https://twox.com/?ref=${referralCode}`

  // Get VIP tier data for commission tier display
  const currentTier = userRankStatus?.currentTier || 'Novice'
  const currentXP = userRankStatus?.currentXP || 0
  
  // Calculate tier-to-tier progression
  const { nextTier, tierProgress } = React.useMemo(() => {
    if (!ranks || ranks.length === 0) {
      return { nextTier: 'Challenger', tierProgress: 0 }
    }

    const currentTierIndex = ranks.findIndex(r => r.name === currentTier)
    if (currentTierIndex === -1) {
      return { nextTier: 'Challenger', tierProgress: 0 }
    }

    const nextTierIndex = currentTierIndex + 1
    if (nextTierIndex >= ranks.length) {
      return { nextTier: null, tierProgress: 100 }
    }

    const currentTierData = ranks[currentTierIndex]
    const nextTierData = ranks[nextTierIndex]

    // Get minimum XP for current tier (first level)
    const currentTierMinXP = currentTierData.levels
      .sort((a, b) => a.minXP - b.minXP)[0]?.minXP || 0

    // Get minimum XP for next tier (first level)
    const nextTierMinXP = nextTierData.levels
      .sort((a, b) => a.minXP - b.minXP)[0]?.minXP || 0

    // Calculate progress from current tier start to next tier start
    const tierXPRange = nextTierMinXP - currentTierMinXP
    const progressInTier = Math.max(currentXP - currentTierMinXP, 0)
    const tierProgressPercentage = Math.min((progressInTier / tierXPRange) * 100, 100)

    return {
      nextTier: nextTierData.name,
      tierProgress: tierProgressPercentage,
    }
  }, [ranks, currentTier, currentXP])

  // Commission rates based on tier (example values)
  const currentCommissionRate = 5.0 // 5% for current tier
  const nextCommissionRate = 5.5 // 5.5% for next tier

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(referralUrl)
    toast.success('Referral link copied to clipboard!')
  }

  const loadEarnings = async () => {
    try {
      setLoadingEarnings(true)
      const data = await getUserReferralMetrics()
      setEarnings(data)
    } catch (error) {
      console.error('Failed to load earnings:', error)
    } finally {
      setLoadingEarnings(false)
    }
  }

  const handleTabChange = (tab: 'refer' | 'earnings') => {
    setActiveTab(tab)
    if (tab === 'earnings' && earnings.totalReferrals === 0) {
      loadEarnings()
    }
  }

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4'>
      <div className='relative w-[830px] rounded-xl bg-[#0C0C0C] shadow-2xl transition-all duration-300'>
        {/* Close Button */}
        <button
          onClick={onClose}
          className='absolute right-6 top-6 flex h-[20px] w-[20px] items-center justify-center rounded-full border border-gray-600 text-gray-400 hover:bg-white/10 hover:text-white transition-colors'
        >
          <X className='h-5 w-5' />
        </button>

        {/* Header */}
        <div className='flex flex-col border-b border-gray-400 px-[20px] py-6 pb-0'>
          <h2 className='mb-6 font-satoshi text-2xl font-bold text-white'>
            {t('refer_earn.title')}
          </h2>

          {/* Tabs */}
          <div className='flex w-full'>
            <button
              onClick={() => handleTabChange('refer')}
              className={`relative flex-1 pb-4 font-satoshi text-base font-medium transition-colors ${
                activeTab === 'refer'
                  ? 'text-white'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              {t('refer_earn.refer_friends')}
              {activeTab === 'refer' && (
                <div className='absolute bottom-0 left-0 right-0 h-[2px] bg-arty-red' />
              )}
            </button>
            <button
              onClick={() => handleTabChange('earnings')}
              className={`relative flex-1 pb-4 font-satoshi text-base font-medium transition-colors ${
                activeTab === 'earnings'
                  ? 'text-white'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              {t('refer_earn.my_earnings')}
              {activeTab === 'earnings' && (
                <div className='absolute bottom-0 left-0 right-0 h-[2px] bg-arty-red' />
              )}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className='py-6 px-[20px]'>
          {activeTab === 'refer' ? (
            <div className='space-y-8'>
              {/* Main Content Container */}
              <div className='rounded-xl bg-[#242424] overflow-hidden'>
                <div className='grid md:grid-cols-2'>
                  {/* Left Column - Text Content */}
                  <div className='flex flex-col justify-center py-8 px-8'>
                    <h3 className='mb-4 font-satoshi text-3xl font-bold text-white'>
                      {t('refer_earn.refer_your_friends')}
                    </h3>
                    <p className='font-satoshi text-base leading-relaxed text-white'>
                      {t('refer_earn.share_promo_code')}{' '}
                      <span className='font-bold text-white'>"{referralCode}"</span>{' '}
                      {t('refer_earn.with_friends')}
                    </p>
                    <a
                      href='/affiliate'
                      className='mt-2 font-satoshi text-base text-white hover:text-gray-300'
                    >
                      {t('refer_earn.join_affiliates')}
                    </a>
                  </div>

                  {/* Right Column - Spin the Wheel Image */}
                  <div className='relative flex items-center justify-end'>
                    <Image
                      src={frameImg}
                      alt='Spin the Wheel'
                      width={335}
                      height={252}
                      className='h-full w-auto object-cover'
                    />
                  </div>
                </div>
              </div>

              {/* Share Referral Link Section */}
              <div className='space-y-3'>
                <h4 className='font-satoshi text-base font-medium text-white'>
                  {t('refer_earn.share_referral_link')}
                </h4>
                <div className='flex gap-3'>
                  <div className='flex-1'>
                    <input
                      type='text'
                      value={referralUrl}
                      readOnly
                      className='h-12 w-full rounded-lg bg-[#242424] px-4 font-satoshi text-sm text-white outline-none'
                    />
                  </div>
                  <button
                    onClick={handleCopyUrl}
                    className='flex items-center gap-2 rounded-lg bg-gradient-to-r from-arty-red to-[#C00337] px-6 py-3 font-satoshi text-sm font-medium text-white hover:from-[#C00337] hover:to-arty-red transition-all'
                  >
                    <Copy className='h-4 w-4' />
                    {t('refer_earn.copy_url')}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className='space-y-2'>
              {/* Top Section - Available Credit, Lifetime Earnings, Commission Tier */}
              <div className='grid gap-4 md:grid-cols-2 border border-[#242424] rounded-xl p-2'>
                {/* Available Credit & Lifetime Earnings */}
                <div className='rounded-xl bg-[#242424] p-4'>
                  <p className='mb-1 font-satoshi text-xs text-white'>
                    {t('refer_earn.available_credit')}
                  </p>
                  <p className='mb-2 font-satoshi text-2xl font-bold text-white'>
                    ${earnings.totalEarnings.toFixed(2)}
                  </p>
                  <button className='w-full rounded-lg bg-arty-red py-2 font-satoshi text-sm font-medium text-white hover:bg-[#C00337] transition-colors disabled:opacity-50 disabled:cursor-not-allowed' disabled={earnings.totalEarnings === 0}>
                    {t('refer_earn.claim')}
                  </button>
                  
                  {/* Lifetime Earnings */}
                  <div className='mt-3 pt-3 border-t border-gray-700'>
                    <p className='mb-1 font-satoshi text-xs text-white'>
                      {t('refer_earn.lifetime_earnings')}
                    </p>
                    <p className='font-satoshi text-xl font-bold text-white'>
                      ${earnings.totalEarnings.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Commission Tier */}
                <div className='rounded-xl bg-[#242424] p-4'>
                  <p className='mb-2 font-satoshi text-xs text-white'>
                    {t('refer_earn.commission_tier')}
                  </p>
                  <p className='mb-3 font-satoshi text-2xl font-bold text-white'>
                    {currentTier}
                  </p>
                  
                  <div className='mb-2'>
                    <div className='relative h-2 w-full overflow-hidden rounded-full bg-gray-700'>
                      <div
                        className='absolute left-0 top-0 h-full bg-arty-red transition-all duration-500'
                        style={{ width: `${Math.min(tierProgress, 100)}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className='flex items-center justify-between text-sm'>
                    <div>
                      <p className='font-satoshi font-bold text-white'>{currentTier}</p>
                      <p className='font-satoshi text-xs text-gray-400'>{tierProgress.toFixed(1)}%</p>
                    </div>
                    <div className='text-right'>
                      <p className='font-satoshi font-bold text-white'>{nextTier || 'Max Level'}</p>
                      <p className='font-satoshi text-xs text-gray-400'>{nextTier ? `${(100 - tierProgress).toFixed(1)}%` : 'Complete'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Referral Statistics */}
              <div className='grid gap-4 grid-cols-3 border border-[#242424] rounded-xl p-2'>
                <div className='rounded-xl bg-[#242424] p-4 text-left'>
                  <p className='mb-2 font-satoshi text-xs text-white'>
                    {t('refer_earn.referrals')}
                  </p>
                  <p className='font-satoshi text-2xl font-bold text-white'>
                    {loadingEarnings ? '...' : earnings.totalReferrals}
                  </p>
                </div>
                <div className='rounded-xl bg-[#242424] p-4 text-left'>
                  <p className='mb-2 font-satoshi text-xs text-white'>
                    {t('refer_earn.depositors')}
                  </p>
                  <p className='font-satoshi text-2xl font-bold text-white'>
                    {loadingEarnings ? '...' : earnings.totalReferrals}
                  </p>
                </div>
                <div className='rounded-xl bg-[#242424] p-4 text-left'>
                  <p className='mb-2 font-satoshi text-xs text-white'>
                    {t('refer_earn.deposits')}
                  </p>
                  <p className='font-satoshi text-2xl font-bold text-white'>
                    {loadingEarnings ? '...' : `$${earnings.totalDeposits.toFixed(2)}`}
                  </p>
                </div>
              </div>

              {/* Referrals Earnings Chart */}
              <div className='border border-[#242424] rounded-xl p-2'>
                <div className='rounded-xl bg-[#242424] p-4'>
                  <div className='mb-3 flex items-center justify-between'>
                    <h4 className='font-satoshi text-base font-bold text-white'>
                      {t('refer_earn.referrals_earnings')}
                    </h4>
                  <div className='flex gap-2'>
                    {(['30d', '14d', '7d'] as const).map((period) => (
                      <button
                        key={period}
                        onClick={() => setChartPeriod(period)}
                        className={`rounded px-3 py-1 font-satoshi text-xs transition-colors ${
                          period === chartPeriod
                            ? 'bg-arty-red text-white'
                            : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                        }`}
                      >
                        {period}
                      </button>
                    ))}
                  </div>
                  </div>
                  
                  {/* Chart Area with Y-axis */}
                  <div className='flex gap-2'>
                    {/* Chart */}
                    <div className='relative flex-1 h-48 border-l border-b border-gray-700'>
                      {/* Horizontal grid lines */}
                      <div className='absolute inset-0 flex flex-col justify-between'>
                        {[0, 1, 2, 3, 4, 5].map((i) => (
                          <div key={i} className='border-t border-dashed border-gray-700' />
                        ))}
                      </div>
                      
                      {/* Empty state */}
                      <div className='absolute inset-0 flex flex-col items-center justify-center gap-2'>
                        <p className='font-satoshi text-xs text-gray-500'>
                          {t('refer_earn.no_earnings_data')}
                        </p>
                        <p className='font-satoshi text-[10px] text-gray-600'>
                          {t('refer_earn.period')}: {chartPeriod}
                        </p>
                      </div>
                    </div>
                    
                    {/* Y-axis labels */}
                    <div className='flex h-48 flex-col justify-between text-right'>
                      {['$1.00', '$0.80', '$0.60', '$0.40', '$0.20', '$0.00'].map((value, i) => (
                        <span key={i} className='font-satoshi text-[10px] text-gray-400'>
                          {value}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Referrals History */}
              <div className='border border-[#242424] rounded-xl p-2'>
                <div className='rounded-xl bg-[#242424] p-4'>
                  <div className='relative flex items-center justify-between'>
                    {/* Blue underline */}
                    <div className='absolute bottom-0 left-0 right-0' />
                        <h4 className='font-satoshi text-base font-bold text-white'>
                        {t('refer_earn.referrals_history')}
                        </h4>
                        <button 
                          onClick={() => setShowHistoryModal(true)}
                          className='rounded bg-white px-4 py-1 font-satoshi text-xs font-medium text-black hover:bg-gray-200 transition-colors'
                        >
                        {t('refer_earn.view_all')}
                        </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Referrals History Modal */}
      {showHistoryModal && (
        <div 
          className='fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4'
          onClick={() => setShowHistoryModal(false)}
        >
          <div 
            className='relative w-full max-w-2xl rounded-xl bg-[#0C0C0C] shadow-2xl'
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowHistoryModal(false)}
              className='absolute right-6 top-6 flex h-[20px] w-[20px] items-center justify-center rounded-full border border-gray-600 text-gray-400 hover:bg-white/10 hover:text-white transition-colors'
            >
              <X className='h-5 w-5' />
            </button>

            {/* Header */}
            <div className='border-b border-gray-700 px-6 py-6'>
              <h2 className='mb-4 font-satoshi text-2xl font-bold text-white'>
                {t('refer_earn.title')}
              </h2>
              
              {/* Back Button */}
              <button
                onClick={() => setShowHistoryModal(false)}
                className='rounded-lg bg-white px-6 py-2 font-satoshi text-sm font-medium text-black hover:bg-gray-200 transition-colors'
              >
                {t('refer_earn.back_to_earnings')}
              </button>
            </div>

            {/* Content */}
            <div className='py-6'>
              {/* Table Header */}
              <div className='mb-4 grid grid-cols-2 gap-4 bg-[#242424] px-6 py-3'>
                <div className='font-satoshi text-sm font-medium text-white'>
                  {t('refer_earn.username')}
                </div>
                <div className='font-satoshi text-sm font-medium text-white'>
                  {t('refer_earn.commission_generated')}
                </div>
              </div>

              {/* Table Content */}
              <div className='min-h-[300px] flex items-center justify-center'>
                <p className='font-satoshi text-sm text-gray-400'>
                  {t('refer_earn.no_results')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


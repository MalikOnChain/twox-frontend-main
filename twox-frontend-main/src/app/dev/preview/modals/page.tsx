'use client'

import React from 'react'

import { AUTH_TABS } from '@/lib/auth'
import { WALLET_MODAL_TABS } from '@/lib/crypto'

import config from '../../../../../tailwind.config'

const ComponentSection = ({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) => (
  <div className='space-y-4'>
    <h2 className='text-2xl font-semibold'>{title}</h2>
    <div className='rounded-lg border border-slate-200 p-4'>{children}</div>
  </div>
)

const ColorPreviewPage = () => {
  const colors = config.theme?.extend?.colors
  const gradients = config.theme?.extend?.backgroundImage

  if (!colors && !gradients) {
    return <div className='p-8'>No color configuration found</div>
  }

  return (
    <div className='mx-auto max-w-7xl space-y-8 p-8'>
      <ComponentSection title='Auth Modal'>
        {AUTH_TABS.signin} <br />
        {AUTH_TABS.signup} <br />
        {AUTH_TABS.forgotPassword} <br />
      </ComponentSection>
      <ComponentSection title='Wallet Modal'>
        {WALLET_MODAL_TABS.deposit} <br />
        {WALLET_MODAL_TABS.withdraw}
      </ComponentSection>
    </div>
  )
}

export default ColorPreviewPage

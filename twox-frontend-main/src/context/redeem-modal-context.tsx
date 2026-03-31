'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

import RedeemModal from '@/components/modals/redeem-modal/redeem-modal'

interface RedeemModalContextType {
  isOpen: boolean
  openModal: () => void
  closeModal: () => void
}

const RedeemModalContext = createContext<RedeemModalContextType | undefined>(undefined)

export const RedeemModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false)

  const openModal = () => setIsOpen(true)
  const closeModal = () => setIsOpen(false)

  return (
    <RedeemModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
      <RedeemModal isOpen={isOpen} onClose={closeModal} />
    </RedeemModalContext.Provider>
  )
}

export const useRedeemModal = () => {
  const context = useContext(RedeemModalContext)
  if (!context) {
    throw new Error('useRedeemModal must be used within a RedeemModalProvider')
  }
  return context
}


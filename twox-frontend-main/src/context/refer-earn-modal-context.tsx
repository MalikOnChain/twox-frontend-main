'use client'

import React, { createContext, useContext, useState } from 'react'

interface ReferEarnModalContextType {
  isOpen: boolean
  openModal: () => void
  closeModal: () => void
}

const ReferEarnModalContext = createContext<ReferEarnModalContextType | undefined>(undefined)

export function ReferEarnModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const openModal = () => setIsOpen(true)
  const closeModal = () => setIsOpen(false)

  return (
    <ReferEarnModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
    </ReferEarnModalContext.Provider>
  )
}

export function useReferEarnModal() {
  const context = useContext(ReferEarnModalContext)
  if (context === undefined) {
    throw new Error('useReferEarnModal must be used within ReferEarnModalProvider')
  }
  return context
}


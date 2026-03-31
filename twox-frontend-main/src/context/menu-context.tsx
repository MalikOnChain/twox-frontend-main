'use client'

import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useMemo,
  useState,
} from 'react'

interface MenuContextType {
  isOpen: boolean
  isExpanded: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  // setIsExpanded: Dispatch<SetStateAction<boolean>>
}

const MenuContext = createContext<MenuContextType | undefined>(undefined)

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded] = useState(true)

  const value = useMemo(
    () => ({
      isOpen,
      isExpanded,
      // setIsExpanded: () => {},
      setIsOpen,
    }),
    [isOpen, setIsOpen, isExpanded]
  )

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>
}

// Custom hook for using the user context
export function useMenu() {
  const context = useContext(MenuContext)
  if (context === undefined) {
    throw new Error('useMenu must be used within a MenuProvider')
  }
  return context
}

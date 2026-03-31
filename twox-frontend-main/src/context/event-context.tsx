'use client'

import { sendGTMEvent } from '@next/third-parties/google'
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { toast } from 'sonner'

import { useSocket } from '@/context/socket-context'
import { useUser } from '@/context/user-context'
interface EventContextType {
  isPaid: boolean
  setIsPaid: (isPaid: boolean) => void
}

interface SocketNewEvent {
  message: string
  type: 'deposit' | 'withdrawal' | 'game-play' | 'message'
  metadata: any
  success: boolean
}

const EventContext = createContext<EventContextType | undefined>(undefined)

export function EventProvider({ children }: { children: React.ReactNode }) {
  const { socket } = useSocket('/')
  const { user } = useUser()
  const [isPaid, setIsPaid] = useState<boolean>(false)

  useEffect(() => {
    if (socket) {
      socket.on('new-event', (data: SocketNewEvent) => {
        if (data.message) {
          if (data.success) {
            toast.success(data.message)
          } else {
            toast.error(data.message)
          }
        }

        switch (data.type) {
          case 'deposit': {
            if (data.success) {
              setIsPaid(true)

              const utmSource = localStorage.getItem('utm_source')
              const utmCampaign = localStorage.getItem('utm_campaign')

              if (data.metadata?.isFirstDeposit) {
                sendGTMEvent({
                  userId: user?._id,
                  amount: data.metadata.amount,
                  event: 'first_deposit',
                  utm_source: utmSource || '',
                  utm_campaign: utmCampaign || '',
                  debug_mode: process.env.NODE_ENV === 'development',
                })
              }

              if (data.metadata?.isSecondDeposit) {
                sendGTMEvent({
                  userId: user?._id,
                  amount: data.metadata.amount,
                  event: 'recurring_deposit',
                  utm_source: utmSource || '',
                  utm_campaign: utmCampaign || '',
                  debug_mode: process.env.NODE_ENV === 'development',
                })
              }
            }

            break
          }
          case 'withdrawal':
            break
          case 'game-play':
            break
          case 'message':
            break
          default:
            break
        }
      })
    }
  }, [socket, user])

  useEffect(() => {
    if (isPaid) {
      setTimeout(() => {
        setIsPaid(false)
      }, 5000)
    }
  }, [isPaid])

  const value = useMemo(
    () => ({
      isPaid,
      setIsPaid,
    }),
    [isPaid]
  )

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>
}

// Custom hook for using the user context
export function useEvent() {
  const context = useContext(EventContext)
  if (context === undefined) {
    throw new Error('useEvent must be used within a EventProvider')
  }
  return context
}

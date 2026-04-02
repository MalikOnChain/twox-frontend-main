'use client'

import React, { useEffect, useRef } from 'react'
import { toast } from 'sonner'

import { useModal } from '@/context/modal-context'
import { useUser } from '@/context/user-context'

import { API_URL } from '@/lib/api'

interface TelegramLoginWidgetProps {
  botUsername: string
  state?: string
  onSuccess?: () => void
  onError?: (error: string) => void
}

declare global {
  interface Window {
    onTelegramAuth?: (user: any) => void
  }
}

export default function TelegramLoginWidget({
  botUsername,
  state = '',
  onSuccess,
  onError,
}: TelegramLoginWidgetProps) {
  const widgetRef = useRef<HTMLDivElement>(null)
  const { checkAuth } = useUser()
  const { setIsOpen } = useModal()

  useEffect(() => {
    // Load Telegram Widget script
    const script = document.createElement('script')
    script.src = 'https://telegram.org/js/telegram-widget.js?22'
    script.setAttribute('data-telegram-login', botUsername)
    script.setAttribute('data-size', 'large')
    script.setAttribute('data-onauth', 'onTelegramAuth(user)')
    script.setAttribute('data-request-access', 'write')
    script.async = true

    if (widgetRef.current) {
      widgetRef.current.innerHTML = ''
      widgetRef.current.appendChild(script)
    }

    // Set up callback function
    window.onTelegramAuth = async (user: any) => {
      try {
        if (!user || !user.id) {
          throw new Error('Invalid Telegram user data')
        }

        // Send user data to backend using fetch API
        const response = await fetch(`${API_URL}/auth/telegram/callback`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            ...user,
            state: state,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Telegram authentication failed' }))
          throw new Error(errorData.error || 'Telegram authentication failed')
        }

        // Backend returns JSON with identifier
        const data = await response.json()
        if (data.identifier) {
          await checkAuth(data.identifier)
          setIsOpen(false)
          toast.success('Telegram login successful!')
          onSuccess?.()
          // Redirect if provided
          if (data.redirect) {
            window.location.href = data.redirect
          }
        } else {
          throw new Error('No identifier received from server')
        }
      } catch (error) {
        console.error('Telegram auth error:', error)
        const errorMessage = error instanceof Error ? error.message : 'Telegram authentication failed'
        toast.error(errorMessage)
        onError?.(errorMessage)
      }
    }

    return () => {
      // Cleanup
      if (window.onTelegramAuth) {
        delete window.onTelegramAuth
      }
    }
  }, [botUsername, state, checkAuth, setIsOpen, onSuccess, onError])

  return (
    <div className='flex flex-col items-center justify-center p-6'>
      <h3 className='mb-4 text-lg font-semibold text-white'>Sign in with Telegram</h3>
      <div ref={widgetRef} className='telegram-widget-container' />
      <p className='mt-4 text-sm text-gray-400'>
        Click the button above to authenticate with Telegram
      </p>
    </div>
  )
}


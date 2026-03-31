'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { toast } from 'sonner'

import { CustomModal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import ThanksForRegisteringModal from '@/components/landing/thanks-for-registering-modal'

import GoogleIcon from '@/assets/social/google.svg'
import TelegramIcon from '@/assets/social/telegram-colored.svg'
import DiscordIcon from '@/assets/social/discord-colored.svg'
import { AUTH_PROVIDER_KEYS } from '@/types/auth'
import { getErrorMessage } from '@/lib/error-handler'

interface JoinBetaModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function JoinBetaModal({ open, onOpenChange }: JoinBetaModalProps) {
  const [email, setEmail] = useState('')
  const [telegramUsername, setTelegramUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [socialLoading, setSocialLoading] = useState<string | null>(null)
  const [thanksModalOpen, setThanksModalOpen] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return

    // Basic validation
    if (!email || !telegramUsername) {
      toast.error('Please fill in all fields')
      return
    }

    setLoading(true)
    try {
      // TODO: Submit email and telegram username to backend API if needed
      // For now, we'll just redirect to Telegram channel
      
      // Open Telegram channel in new tab
      window.open('https://t.me/twoxggcasino', '_blank', 'noopener,noreferrer')
      
      // Close join-beta modal
      onOpenChange(false)
      
      // Reset form
      setEmail('')
      setTelegramUsername('')
      
      // Show thanks modal after a short delay
      setTimeout(() => {
        setThanksModalOpen(true)
      }, 300)
    } catch (error) {
      const errorMessage = getErrorMessage(error)
      toast.error(errorMessage || 'Failed to submit. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSocialLogin = async (provider: AUTH_PROVIDER_KEYS) => {
    if (socialLoading) return
    setSocialLoading(provider)
    try {
      // TODO: Implement social login logic
      // Redirect to OAuth provider
    } catch (error) {
      // Error handling will be implemented
    } finally {
      setSocialLoading(null)
    }
  }

  return (
    <>
      <CustomModal
        isOpen={open}
        onRequestClose={() => onOpenChange(false)}
        contentLabel='Join Beta Modal'
        isCentered={true}
      >
      <div
        className='relative overflow-hidden rounded-xl bg-[#1a1a1d] p-8'
        style={{
          width: '448px',
          maxHeight: '90vh',
          maxWidth: '90vw',
        }}
      >
        {/* Close Button */}
        <Button
          variant='icon'
          size='icon'
          onClick={() => onOpenChange(false)}
          className='absolute right-4 top-4 z-10 h-8 w-8 p-2 rounded-full text-white hover:bg-white/10'
        >
          <X className='h-4 w-4' />
        </Button>

        {/* Title */}
        <h2
          className='mb-6 text-2xl font-bold text-white'
          style={{
            fontFamily: 'var(--font-stolzl), sans-serif',
            fontWeight: 700,
            fontSize: '24px',
          }}
        >
          Join Beta
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className='space-y-4'>
          {/* Email Input */}
          <div>
            <Input
              label='Email'
              type='email'
              placeholder='Enter your email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Telegram Username Input */}
          <div>
            <Input
              label='Your Telegram Username'
              placeholder='@username'
              value={telegramUsername}
              onChange={(e) => setTelegramUsername(e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <Button
            type='submit'
            size='lg'
            className='w-full min-h-11'
            variant='secondary2'
            disabled={loading}
            loading={loading}
          >
            Submit
          </Button>
        </form>

        {/* Social Login Section */}
        <div className='mt-6 space-y-4'>
          <p
            className='text-center text-sm text-white/70'
            style={{
              fontFamily: 'var(--font-satoshi), sans-serif',
            }}
          >
            or connect with
          </p>
          <div className='flex items-center justify-center gap-4'>
            <Button
              variant='outline'
              size='icon'
              onClick={() => handleSocialLogin(AUTH_PROVIDER_KEYS.GOOGLE)}
              disabled={!!socialLoading}
              loading={socialLoading === AUTH_PROVIDER_KEYS.GOOGLE}
              className='h-12 w-12 rounded-full border-none bg-background-fourth hover:bg-background-fourth/80 transition-opacity disabled:opacity-50'
            >
              <GoogleIcon className='h-6 w-6' />
            </Button>
            <Button
              variant='outline'
              size='icon'
              onClick={() => handleSocialLogin(AUTH_PROVIDER_KEYS.TELEGRAM)}
              disabled={!!socialLoading}
              loading={socialLoading === AUTH_PROVIDER_KEYS.TELEGRAM}
              className='h-12 w-12 rounded-full border-none bg-background-fourth hover:bg-background-fourth/80 transition-opacity disabled:opacity-50'
            >
              <TelegramIcon className='h-6 w-6 fill-white' />
            </Button>
            <Button
              variant='outline'
              size='icon'
              onClick={() => handleSocialLogin(AUTH_PROVIDER_KEYS.DISCORD)}
              disabled={!!socialLoading}
              loading={socialLoading === AUTH_PROVIDER_KEYS.DISCORD}
              className='h-12 w-12 rounded-full border-none bg-background-fourth hover:bg-background-fourth/80 transition-opacity disabled:opacity-50'
            >
              <DiscordIcon className='h-6 w-6' />
            </Button>
          </div>
        </div>
      </div>
    </CustomModal>

    {/* Thanks for Registering Modal - Outside of JoinBetaModal */}
    <ThanksForRegisteringModal open={thanksModalOpen} onOpenChange={setThanksModalOpen} />
  </>
  )
}


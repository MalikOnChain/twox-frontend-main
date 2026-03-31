'use client'

import { useState } from 'react'
import { X, ArrowRight, Check } from 'lucide-react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { toast } from 'sonner'
import Cookies from 'js-cookie'

import { CustomModal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { waitingListSignIn, waitingListSignUp, waitingListExchangeToken, waitingListOAuthLogin } from '@/api/auth'
import { AUTH_PROVIDER_KEYS } from '@/types/auth'
import storageHandler from '@/lib/storage-utils'
import { useRouter } from 'next/navigation'
import { getErrorMessage } from '@/lib/error-handler'

import { LoginFormValues, loginSchema } from '@/schema/auth'
import { RegisterFormValues, registerSchema } from '@/schema/auth'

import GoogleIcon from '@/assets/social/google.svg'
import TelegramIcon from '@/assets/social/telegram-colored.svg'
import DiscordIcon from '@/assets/social/discord-colored.svg'

import RegistrationClosedModal from './registration-closed-modal'

interface LandingAuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type TabType = 'login' | 'signup'

export default function LandingAuthModal({ open, onOpenChange }: LandingAuthModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('login')
  const [loginLoading, setLoginLoading] = useState(false)
  const [signupLoading, setSignupLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [ageConfirmed, setAgeConfirmed] = useState(false)
  const [socialLoading, setSocialLoading] = useState<string | null>(null)
  const [registrationClosedModalOpen, setRegistrationClosedModalOpen] = useState(false)

  const router = useRouter()
  const { setValue: setToken } = storageHandler({ key: 'token' })

  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const {
    register: registerSignup,
    handleSubmit: handleSignupSubmit,
    formState: { errors: signupErrors },
  } = useForm<RegisterFormValues>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
      phone: '',
    },
  })

  const onLoginSubmit = async (data: LoginFormValues) => {
    if (loginLoading) return
    setLoginLoading(true)
    try {
      const response = await waitingListSignIn(data)

      if (response.identifier) {
        // Exchange identifier for token
        const { token } = await waitingListExchangeToken(response.identifier)
        setToken(token)
        
        // Set authentication cookie for middleware
        Cookies.set('isAuthenticated', 'true', { expires: 7 }) // Cookie expires in 7 days
        
        // Close modal
        onOpenChange(false)
        toast.success('Login successful')
        
        // Redirect to home page using window.location to ensure cookie is set
        setTimeout(() => {
          window.location.href = '/'
        }, 500)
      } else {
        if (!response.success) {
          toast.error(response.error || 'Login failed')
        }
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error)
      toast.error(errorMessage)
    } finally {
      setLoginLoading(false)
    }
  }

  const onSignupSubmit = async (data: RegisterFormValues) => {
    if (!ageConfirmed) {
      toast.error('Please confirm that you are at least 18 years old')
      return
    }

    if (signupLoading) return
    setSignupLoading(true)
    try {
      const utmSource = localStorage.getItem('utm_source')
      const utmCampaign = localStorage.getItem('utm_campaign')

      const signUpData = {
        ...data,
        ...(utmSource && { utm_source: utmSource }),
        ...(utmCampaign && { utm_campaign: utmCampaign }),
      }

      const response = await waitingListSignUp(signUpData)

      // Check if registration was successful
      if (response.success === true || (response.success !== false && !response.error && response.identifier)) {
        // Close the auth modal
        onOpenChange(false)
        
        // Show registration closed modal
        setRegistrationClosedModalOpen(true)
        
        toast.success(response?.message || 'Registration successful! You have been added to the waiting list.')
      } else {
        // Registration failed - show error message
        toast.error(response.error || 'Registration failed. Please try again.')
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error)
      toast.error(errorMessage)
    } finally {
      setSignupLoading(false)
    }
  }

  const handleSocialLogin = async (provider: AUTH_PROVIDER_KEYS) => {
    if (socialLoading) return
    setSocialLoading(provider)
    try {
      if (provider === AUTH_PROVIDER_KEYS.TELEGRAM) {
        // Telegram uses a widget, handle separately if needed
        toast.info('Telegram login will be implemented')
        setSocialLoading(null)
      } else {
        // OAuth login redirects to external provider, so we just close the modal
        onOpenChange(false)
        await waitingListOAuthLogin(provider)
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error)
      toast.error(errorMessage)
      setSocialLoading(null)
    }
  }

  return (
    <>
      <CustomModal
        isOpen={open}
        onRequestClose={() => onOpenChange(false)}
        contentLabel='Landing Auth Modal'
        isCentered={true}
      >
      <div
        className='relative overflow-hidden rounded-xl bg-[#1a1a1d] p-8'
        style={{
          width: '480px',
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

        {/* Tabs */}
        <div className='mb-6 flex items-center gap-4 border-b border-gray-700'>
          <button
            onClick={() => setActiveTab('login')}
            className={`pb-3 text-base font-medium transition-colors ${
              activeTab === 'login'
                ? 'border-b-2 border-red-500 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
            style={{
              fontFamily: 'var(--font-stolzl), sans-serif',
            }}
          >
            Log In
          </button>
          <button
            onClick={() => setActiveTab('signup')}
            className={`pb-3 text-base font-medium transition-colors ${
              activeTab === 'signup'
                ? 'border-b-2 border-red-500 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
            style={{
              fontFamily: 'var(--font-stolzl), sans-serif',
            }}
          >
            Sign Up
          </button>
        </div>

        {/* Login Form */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit(onLoginSubmit)} className='w-full space-y-2'>
            <div className='space-y-4'>
              <Input
                label='Email'
                placeholder='Enter your email'
                error={loginErrors.email?.message}
                {...registerLogin('email')}
              />

              <Input
                label='Password'
                type='password'
                placeholder='Enter your password'
                error={loginErrors.password?.message}
                {...registerLogin('password')}
              />
            </div>

            <div className='!mb-3 !mt-2.5 flex items-center justify-between'>
              <div className='flex items-center gap-1.5 font-satoshi text-xs text-white'>
                <div className='relative' onClick={() => setRememberMe(!rememberMe)}>
                  <div
                    className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${
                      rememberMe
                        ? 'border-mulberry bg-mulberry'
                        : 'border-dawn-pink bg-transparent'
                    }`}
                  >
                    {rememberMe && <Check className='h-3 w-3 text-white' />}
                  </div>
                </div>
                Remember me
              </div>
              <Button
                variant='link'
                type='button'
                className='h-fit !p-0 font-satoshi !text-xs text-white'
              >
                Forget Password?
              </Button>
            </div>

            <Button
              type='submit'
              size='lg'
              className='min-h-11 w-full flex items-center justify-center gap-2'
              disabled={loginLoading}
              loading={loginLoading}
              variant='secondary2'
            >
              <span>Log In</span>
              <ArrowRight className='h-4 w-4' />
            </Button>
          </form>
        )}

        {/* Sign Up Form */}
        {activeTab === 'signup' && (
          <form onSubmit={handleSignupSubmit(onSignupSubmit)} className='w-full'>
            <div className='w-full space-y-4'>
              <Input
                label='Email'
                placeholder='Enter your email'
                error={signupErrors.email?.message}
                {...registerSignup('email')}
              />

              <Input
                label='Username'
                placeholder='Enter your username'
                error={signupErrors.username?.message}
                {...registerSignup('username')}
              />

              <Input
                label='Password'
                type='password'
                placeholder='Enter your password'
                error={signupErrors.password?.message}
                {...registerSignup('password')}
              />

              <Input
                label='Confirm Password'
                type='password'
                placeholder='Confirm your password'
                error={signupErrors.confirmPassword?.message}
                {...registerSignup('confirmPassword')}
              />
            </div>

            <div className='!mb-0 !mt-2.5 flex items-center justify-between'>
              <div className='flex items-center gap-2 font-satoshi text-xs text-white'>
                <div className='relative' onClick={() => setAgeConfirmed(!ageConfirmed)}>
                  <div
                    className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${
                      ageConfirmed
                        ? 'border-mulberry bg-mulberry'
                        : 'border-dawn-pink bg-transparent'
                    }`}
                  >
                    {ageConfirmed && <Check className='h-3 w-3 text-white' />}
                  </div>
                </div>
                I confirm that I am 18 years old and I have read the{' '}
                <Link href='/terms' className='underline hover:text-gray-300'>
                  Terms of service
                </Link>
              </div>
            </div>

            <Button
              type='submit'
              size='lg'
              className='mt-4 min-h-11 w-full flex items-center justify-center gap-2'
              variant='secondary2'
              disabled={signupLoading || !ageConfirmed}
              loading={signupLoading}
            >
              <span>Next</span>
              <ArrowRight className='h-4 w-4' />
            </Button>
          </form>
        )}

        {/* Social Login */}
        <div className='mt-6 space-y-4'>
          <p
            className='text-center text-sm text-gray-400'
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

        {/* Legal Text (Login only) */}
        {activeTab === 'login' && (
          <p
            className='mt-6 text-center text-xs text-gray-400'
            style={{
              fontFamily: 'var(--font-satoshi), sans-serif',
            }}
          >
            By accessing you confirm that you are at least 18 years old and agree to the{' '}
            <Link href='/terms' className='underline hover:text-gray-300'>
              Terms of service
            </Link>
          </p>
        )}
      </div>
      </CustomModal>

      {/* Registration Closed Modal */}
      <RegistrationClosedModal
        open={registrationClosedModalOpen}
        onOpenChange={setRegistrationClosedModalOpen}
      />
    </>
  )
}


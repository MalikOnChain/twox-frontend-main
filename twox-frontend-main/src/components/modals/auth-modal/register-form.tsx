'use client'

import { yupResolver } from '@hookform/resolvers/yup'
import { sendGTMEvent } from '@next/third-parties/google'
import { Check } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import PhoneInput from 'react-phone-number-input'
import { toast } from 'sonner'

import 'react-phone-number-input/style.css'

import { resendVerificationEmail, signUp } from '@/api/auth'

import { useFingerprint } from '@/context/fingerprint-context'
import { useUser } from '@/context/user-context'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { RegisterFormValues, registerSchema } from '@/schema/auth'

const RegisterForm = ({
  onSignIn,
  onSuccess,
}: {
  onSignIn: () => void
  onSuccess: () => void
}) => {
  const [loading, setLoading] = React.useState(false)
  const [needsVerification, setNeedsVerification] = useState(false)
  const [verificationEmail, setVerificationEmail] = useState('')
  const [countdown, setCountdown] = useState(0)
  const [checked, setChecked] = useState(false)
  const { t } = useTranslation()
  const { checkAuth } = useUser()
  const { visitorId, fingerprintData } = useFingerprint()
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
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

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1)
      }, 1000)
    }
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [countdown])

  const handleResendVerification = async () => {
    if (loading || countdown > 0) return
    setLoading(true)
    try {
      const response = await resendVerificationEmail(verificationEmail)
      toast.success(
        response?.message || 'Verification email resent successfully'
      )
      setCountdown(30)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('An unexpected error occurred')
      }
    }
    setLoading(false)
  }

  const onSubmit = async (data: RegisterFormValues) => {
    if (loading) return
    setLoading(true)
    try {
      const utmSource = localStorage.getItem('utm_source')
      const utmCampaign = localStorage.getItem('utm_campaign')

      const signUpData = {
        ...data,
        ...(utmSource && { utm_source: utmSource }),
        ...(utmCampaign && { utm_campaign: utmCampaign }),
      }

      const response = await signUp(signUpData, {
        visitorId: visitorId || '',
        fingerprintData,
      })

      sendGTMEvent({
        event: 'signup_success',
        utm_source: utmSource || '',
        utm_campaign: utmCampaign || '',
        debug_mode: process.env.NODE_ENV === 'development',
      })

      if (response?.identifier) {
        await checkAuth(response.identifier)
        onSuccess()
        return
      }

      setNeedsVerification(true)
      setVerificationEmail(data.email)
      toast.success(response?.message || 'Account created. Please verify your email.')
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('An unexpected error occurred')
      }
    }
    setLoading(false)
  }

  if (needsVerification) {
    return (
      <div className='w-full max-w-[352px] space-y-4'>
        <p className='py-12 text-center text-sm text-secondary-800'>
          {t('register.verification_email_sent')}
        </p>
        <Button
          type='button'
          size='lg'
          className='min-h-11 w-full'
          variant='secondary2'
          onClick={handleResendVerification}
          loading={loading}
          disabled={countdown > 0}
        >
          {countdown > 0
            ? `${t('register.resend_verification')} (${countdown}s)`
            : t('register.resend_verification')}
        </Button>
        <Button
          type='button'
          size='lg'
          className='min-h-11 w-full'
          variant='outline'
          onClick={() => setNeedsVerification(false)}
        >
          {t('register.back_to_signup')}
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='w-full'>
      <div className='w-full space-y-4'>
        <Input
          label={t('register.email')}
          placeholder={t('register.email_placeholder')}
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label={t('register.username')}
          placeholder={t('register.username_placeholder')}
          error={errors.username?.message}
          {...register('username')}
        />

        <Input
          label={t('register.password')}
          type='password'
          placeholder={t('register.password_placeholder')}
          error={errors.password?.message}
          {...register('password')}
        />

        <Input
          label={t('register.confirm_password')}
          type='password'
          placeholder={t('register.confirm_password_placeholder')}
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <div>
          <PhoneInput
            international
            defaultCountry='BR'
            value={watch('phone') || ''}
            countrySelectProps={{
              className: 'bg-background-third text-white',
            }}
            onChange={(value) => {
              setValue('phone', value || '', {
                shouldValidate: true,
                shouldDirty: true,
              })
            }}
            className='phone-input-custom rounded-lg border border-input bg-background-third pl-2'
          />
          {errors.phone && (
            <span className='text-xs text-destructive'>
              {errors.phone.message}
            </span>
          )}
        </div>
      </div>
      <div className='!mb-0 !mt-2.5 flex items-center justify-between'>
        <div className='flex items-center gap-2 font-satoshi text-xs text-white'>
          <div className='relative' onClick={() => setChecked(!checked)}>
            <div
              className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${
                checked
                  ? 'border-mulberry bg-mulberry'
                  : 'border-dawn-pink bg-transparent'
              }`}
            >
              {checked && <Check className='h-3 w-3 text-white' />}
            </div>
          </div>
          I agree to the Terms of Service.
        </div>
      </div>
      <Button
        type='submit'
        size='lg'
        className='mt-4 min-h-11 w-full'
        variant='secondary2'
        disabled={isSubmitting}
        loading={loading}
      >
        {isSubmitting ? t('register.signing_up') : t('register.sign_up')}
      </Button>

      <p className='mt-4 text-center font-satoshi text-sm font-normal text-white'>
        Already have an account?{' '}
        <span
          className='te inline-block cursor-pointer font-medium text-arty-red hover:underline'
          onClick={() => {
            onSignIn()
          }}
        >
          Sign In
        </span>
      </p>
    </form>
  )
}

export default RegisterForm

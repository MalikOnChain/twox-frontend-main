'use client'

import { yupResolver } from '@hookform/resolvers/yup'
import { Check } from 'lucide-react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { signIn } from '@/api/auth'

import { useUser } from '@/context/user-context'
import { useFingerprint } from '@/context/fingerprint-context'

import { AUTH_TABS } from '@/lib/auth'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { LoginFormValues, loginSchema } from '@/schema/auth'

const LoginForm = ({
  onSignUp,
  onSuccess,
  onForgotPwd,
}: {
  onSignUp: () => void
  onForgotPwd: () => void
  onSuccess: () => void
  activeTab?: AUTH_TABS
  setActiveTab?: (activeTab: AUTH_TABS) => void
}) => {
  const [loading, setLoading] = React.useState(false)
  const [checked, setChecked] = React.useState(false)
  const { t } = useTranslation()
  const { checkAuth } = useUser()
  const { visitorId, fingerprintData } = useFingerprint()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (data: LoginFormValues) => {
    if (loading) return
    setLoading(true)
    try {
      const response = await signIn(data, {
        visitorId: visitorId || '',
        fingerprintData,
      })

      if (response.identifier) {
        checkAuth(response.identifier)
        onSuccess()
      } else {
        if (!response.success) {
          toast.error(response.error)
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('An unexpected error occurred')
      }
    }
    setLoading(false)
  }

  return (
    <div className='w-full space-y-6'>
      {/* Email/Password Form */}
      <form onSubmit={handleSubmit(onSubmit)} className='w-full space-y-2'>
        <div className='space-y-4'>
          <Input
            label={t('login.email')}
            placeholder='Enter your email'
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label={t('login.password')}
            type='password'
            placeholder='Enter your password'
            error={errors.password?.message}
            {...register('password')}
          />
        </div>

        <div className='!mb-3 !mt-2.5 flex items-center justify-between'>
          <div className='flex items-center gap-1.5 font-satoshi text-xs text-white'>
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
            Remember me
          </div>
          <Button
            variant='link'
            type='button'
            onClick={onForgotPwd}
            className='h-fit !p-0 font-satoshi !text-xs text-white'
          >
            {t('login.forgot_password')}?
          </Button>
        </div>

        <Button
          type='submit'
          size='lg'
          className='min-h-11 w-full'
          disabled={isSubmitting}
          loading={loading}
          variant='secondary2'
        >
          {isSubmitting ? t('login.signing_in') : t('login.sign_in')}
        </Button>

        <p className='mt-4 text-center font-satoshi text-sm font-normal text-white'>
          Don’t have an account?{' '}
          <span
            className='te inline-block cursor-pointer font-medium text-arty-red hover:underline'
            onClick={() => {
              onSignUp()
            }}
          >
            Register
          </span>
        </p>

        {/* <p className='text-center text-xs text-primary'>
          {`Don't you have an account? `}
          <span
            onClick={onSignUp}
            className='cursor-pointer underline hover:text-white'
          >
            Sign up
          </span>
        </p> */}
      </form>
    </div>
  )
}

export default LoginForm

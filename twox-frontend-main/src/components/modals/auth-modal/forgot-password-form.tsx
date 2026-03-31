'use client'

import { yupResolver } from '@hookform/resolvers/yup'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { requestForgotPassword, resetPassword, verifyOTP } from '@/api/auth'

import {
  forgotPasswordEmailFormValues,
  forgotPasswordEmailSchema,
  resetPasswordFormSchema,
  resetPasswordFormValues,
} from '@/schema/auth'

import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../../ui/input-otp'

export enum STEP {
  EMAIL = 'email',
  OTP = 'otp',
  PASSWORD = 'password',
}

const EmailForm = ({ onSuccess }: { onSuccess: (email: string) => void }) => {
  const [loading, setLoading] = React.useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<forgotPasswordEmailFormValues>({
    resolver: yupResolver(forgotPasswordEmailSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async ({ email }: forgotPasswordEmailFormValues) => {
    if (loading) return
    setLoading(true)
    try {
      const response = await requestForgotPassword(email)
      if (response.success) {
        onSuccess(email)
        toast.success(
          `We've sent you an email containing the security code to reset your password!`
        )
      } else {
        toast.error(response.error)
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
    <form onSubmit={handleSubmit(onSubmit)} className='w-full'>
      <Input
        label='Email'
        placeholder='Enter your email'
        error={errors.email?.message}
        {...register('email')}
      />

      <Button
        type='submit'
        size='lg'
        loading={loading}
        className='mt-4 min-h-11 w-full'
        disabled={isSubmitting}
        variant='secondary2'
      >
        Reset Password
      </Button>
    </form>
  )
}

const OTPForm = ({
  email,
  onSuccess,
}: {
  email: string
  onSuccess: (code: string) => void
}) => {
  const [loading, setLoading] = useState(false)
  const [value, setValue] = useState('')

  const onSubmit = async () => {
    if (loading) return
    setLoading(true)
    try {
      await verifyOTP({ email, code: value })
      onSuccess(value)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('An unexpected error occurred')
      }
    }
    setLoading(false)
  }

  const handleComplete = (value: any) => {
    setValue(value)
    setTimeout(() => {
      onSubmit()
    }, 300)
  }

  return (
    <div className='w-full'>
      <InputOTP
        value={value}
        onChange={(value) => setValue(value)}
        onComplete={handleComplete}
        maxLength={6}
        className='w-full'
      >
        <InputOTPGroup className='w-full justify-between'>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>

      <Button
        type='submit'
        size='lg'
        loading={loading}
        disabled={value.length < 6}
        className='mt-4 min-h-11 w-full'
        variant='secondary2'
        onClick={onSubmit}
      >
        Verify
      </Button>
    </div>
  )
}

const PasswordForm = ({
  email,
  code,
  onSuccess,
}: {
  email: string
  code: string
  onSuccess: (email: string) => void
}) => {
  const [loading, setLoading] = React.useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<resetPasswordFormValues>({
    resolver: yupResolver(resetPasswordFormSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (data: resetPasswordFormValues) => {
    if (loading) return
    setLoading(true)
    try {
      await resetPassword({ email, password: data.password, code })
      toast.success(`You have successfully reset your password, try login in!`)
      setTimeout(() => {
        onSuccess(email)
      }, 500)
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
    <form onSubmit={handleSubmit(onSubmit)} className='w-full'>
      <div className='space-y-4'>
        <Input
          label='Password'
          type='password'
          placeholder='Create a password'
          error={errors.password?.message}
          {...register('password')}
        />

        <Input
          label='Confirm Password'
          type='password'
          placeholder='Confirm your password'
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />
      </div>

      <Button
        type='submit'
        size='lg'
        loading={loading}
        className='mt-4 min-h-11 w-full'
        disabled={isSubmitting}
        variant='secondary2'
      >
        Reset Password
      </Button>
    </form>
  )
}

const ForgotPasswordForm = ({ onBack }: { onBack: () => void }) => {
  const [step, setStep] = useState<string>(STEP.EMAIL)
  const [email, setEmail] = useState<string | null>(null)
  const [code, setCode] = useState<string | null>(null)

  const handleRequestSuccess = (e: string) => {
    setStep(STEP.OTP)
    setEmail(e)
  }

  const handleVeritySuccess = (code: string) => {
    setCode(code)
    setStep(STEP.PASSWORD)
  }

  // const handleBack = () => {
  //   setCode(null)
  //   setEmail(null)
  //   onBack()
  // }

  return (
    <div className='space-y-4 pt-4'>
      {/* <Button variant='link' className='h-auto p-0' onClick={handleBack}>
        <ArrowLeft /> Back
      </Button> */}

      {step === STEP.EMAIL && <EmailForm onSuccess={handleRequestSuccess} />}
      {step === STEP.OTP && email && (
        <OTPForm email={email} onSuccess={handleVeritySuccess} />
      )}
      {step === STEP.PASSWORD && email && code && (
        <PasswordForm email={email} code={code} onSuccess={onBack} />
      )}
    </div>
  )
}

export default ForgotPasswordForm

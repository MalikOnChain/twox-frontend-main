'use client'

import { yupResolver } from '@hookform/resolvers/yup'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as yup from 'yup'

import { requestSelfExclusion, confirmSelfExclusion } from '@/api/responsible-gambling'

import SecurityLayout from '@/components/templates/security-layout/security-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const emailSchema = yup.object({
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
})

const confirmationSchema = yup.object({
  code: yup
    .string()
    .required('Confirmation code is required')
    .min(4, 'Code must be at least 4 characters')
    .max(10, 'Code must not exceed 10 characters'),
})

type EmailFormData = yup.InferType<typeof emailSchema>
type ConfirmationFormData = yup.InferType<typeof confirmationSchema>

export default function ResponsibleGamblingPage() {
  const [step, setStep] = useState<'request' | 'confirm'>('request')
  const [submitting, setSubmitting] = useState(false)
  const [requestedEmail, setRequestedEmail] = useState('')

  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: emailErrors },
  } = useForm<EmailFormData>({
    resolver: yupResolver(emailSchema),
    defaultValues: {
      email: '',
    },
  })

  const {
    register: registerConfirmation,
    handleSubmit: handleSubmitConfirmation,
    formState: { errors: confirmationErrors },
  } = useForm<ConfirmationFormData>({
    resolver: yupResolver(confirmationSchema),
    defaultValues: {
      code: '',
    },
  })

  const onRequestExclusion = async (data: EmailFormData) => {
    try {
      setSubmitting(true)
      
      const result = await requestSelfExclusion(data.email)

      if (result.success) {
        setRequestedEmail(data.email)
        setStep('confirm')
        toast.success(result.message || 'Confirmation code sent to your email', {
          description: 'Please check your email and enter the confirmation code below.',
          duration: 5000,
        })
      } else {
        toast.error(result.message || 'Failed to send confirmation code')
      }
    } catch (error: any) {
      console.error('Error requesting self-exclusion:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Failed to send confirmation code'
      toast.error(errorMessage)
    } finally {
      setSubmitting(false)
    }
  }

  const onConfirmExclusion = async (data: ConfirmationFormData) => {
    try {
      setSubmitting(true)
      
      const result = await confirmSelfExclusion(requestedEmail, data.code)

      if (result.success) {
        toast.success('Self-exclusion activated successfully', {
          description: 'Your account has been excluded. You will be logged out shortly.',
          duration: 5000,
        })
        
        // Redirect to logout after 3 seconds
        setTimeout(() => {
          window.location.href = '/logout'
        }, 3000)
      } else {
        toast.error(result.message || 'Invalid confirmation code')
      }
    } catch (error: any) {
      console.error('Error confirming self-exclusion:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Failed to confirm self-exclusion'
      toast.error(errorMessage)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <SecurityLayout>
      <h2 className='mb-3 text-base font-bold text-white md:text-xl'>
        Self Exclusion
      </h2>
      
      <div className='rounded-lg bg-cinder px-2.5 py-3 font-satoshi text-sm font-normal text-[#ABAAAD] mb-5'>
        Need a break from TWOX? To start the automated self-exclusion process,
        please enter your email address below to receive confirmation instructions via email.
      </div>

      {step === 'request' ? (
        <form onSubmit={handleSubmitEmail(onRequestExclusion)}>
          <div className='space-y-4'>
            <div>
              <h3 className='mb-3 text-base font-bold text-white'>
                Email Address
              </h3>
              <Input
                {...registerEmail('email')}
                type='email'
                placeholder='Enter your email address'
                wrapperClassName='h-12'
                error={emailErrors.email?.message}
              />
            </div>

            <Button
              type='submit'
              variant='secondary1'
              disabled={submitting}
              className='w-full sm:w-auto'
            >
              {submitting ? 'Sending...' : 'Request Self-Exclusion'}
            </Button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleSubmitConfirmation(onConfirmExclusion)}>
          <div className='space-y-4'>
            <div className='rounded-lg bg-cinder px-2.5 py-3 font-satoshi text-sm font-normal text-[#ABAAAD]'>
              We've sent a confirmation code to <strong className='text-white'>{requestedEmail}</strong>.
              Please enter the code below to confirm your self-exclusion request.
            </div>

            <div>
              <h3 className='mb-3 text-base font-bold text-white'>
                Confirmation Code
              </h3>
              <Input
                {...registerConfirmation('code')}
                type='text'
                placeholder='Enter confirmation code'
                wrapperClassName='h-12'
                error={confirmationErrors.code?.message}
              />
            </div>

            <div className='flex gap-4'>
              <Button
                type='submit'
                variant='secondary1'
                disabled={submitting}
              >
                {submitting ? 'Confirming...' : 'Confirm Self-Exclusion'}
              </Button>
              <Button
                type='button'
                variant='outline'
                onClick={() => setStep('request')}
                disabled={submitting}
              >
                Back
              </Button>
            </div>
          </div>
        </form>
      )}

      <div className='mt-8 rounded-lg bg-cinder px-2.5 py-3 font-satoshi text-sm font-normal text-[#ABAAAD]'>
        <h4 className='font-bold text-white mb-2'>What happens when you self-exclude?</h4>
        <ul className='list-disc list-inside space-y-1'>
          <li>Your account will be immediately locked</li>
          <li>You will be logged out from all devices</li>
          <li>You won't be able to login or place bets</li>
          <li>Any pending withdrawals will be processed</li>
          <li>You can contact support to reactivate your account after the exclusion period</li>
        </ul>
      </div>
    </SecurityLayout>
  )
}

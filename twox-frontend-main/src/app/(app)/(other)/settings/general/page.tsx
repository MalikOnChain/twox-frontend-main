'use client'
import { yupResolver } from '@hookform/resolvers/yup'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as yup from 'yup'

import { sendEmailChangeCode, changeEmail, updatePhoneNumber } from '@/api/user-settings'

import { useUser } from '@/context/user-context'

import SecurityLayout from '@/components/templates/security-layout/security-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

// Validation schema for email form
const emailSchema = yup.object({
  email: yup.string().email('Please enter a valid email address').required('Email is required'),
  verificationCode: yup.string().when('$showCodeInput', {
    is: true,
    then: (schema) => schema.required('Verification code is required').min(4, 'Code must be at least 4 characters'),
    otherwise: (schema) => schema.notRequired(),
  }),
})

// Validation schema for phone form
const phoneSchema = yup.object({
  phoneNumber: yup
    .string()
    .required('Phone number is required')
    .matches(/^\+?[1-9]\d{0,15}$/, 'Please enter a valid phone number'),
})

type EmailFormData = yup.InferType<typeof emailSchema>
type PhoneFormData = yup.InferType<typeof phoneSchema>

export default function GeneralPage() {
  const { user, getLoggedInUser } = useUser()
  const [emailCodeSent, setEmailCodeSent] = useState(false)
  const [isChangingEmail, setIsChangingEmail] = useState(false)
  const [isChangingPhone, setIsChangingPhone] = useState(false)

  // Email form
  const emailForm = useForm<EmailFormData>({
    resolver: yupResolver(emailSchema),
    context: { showCodeInput: emailCodeSent },
    defaultValues: {
      email: user?.email || '',
      verificationCode: '',
    },
  })

  // Phone form
  const phoneForm = useForm<PhoneFormData>({
    resolver: yupResolver(phoneSchema),
    defaultValues: {
      phoneNumber: user?.phoneNumber || '',
    },
  })

  const handleSendEmailCode = async () => {
    const email = emailForm.getValues('email')
    
    if (!email || emailForm.formState.errors.email) {
      toast.error('Please enter a valid email address')
      return
    }

    if (email === user?.email) {
      toast.error('New email must be different from current email')
      return
    }

    try {
      setIsChangingEmail(true)
      const response = await sendEmailChangeCode(email)
      toast.success(response.message || 'Verification code sent to your new email')
      setEmailCodeSent(true)
    } catch (error: any) {
      toast.error(error.message || 'Failed to send verification code')
    } finally {
      setIsChangingEmail(false)
    }
  }

  const handleConfirmEmailChange = async (data: EmailFormData) => {
    if (!emailCodeSent || !data.verificationCode) {
      toast.error('Please enter the verification code')
      return
    }

    try {
      setIsChangingEmail(true)
      const response = await changeEmail(data.email, data.verificationCode)
      toast.success(response.message || 'Email updated successfully!')
      
      // Refresh user data
      await getLoggedInUser()
      
      // Reset form
      emailForm.reset({ email: data.email, verificationCode: '' })
      setEmailCodeSent(false)
    } catch (error: any) {
      toast.error(error.message || 'Failed to change email')
    } finally {
      setIsChangingEmail(false)
    }
  }

  const handlePhoneUpdate = async (data: PhoneFormData) => {
    try {
      setIsChangingPhone(true)
      
      // Use dedicated phone number update endpoint
      const response = await updatePhoneNumber(data.phoneNumber)
      
      toast.success(response.message || 'Phone number updated successfully!')
      
      // Refresh user data
      await getLoggedInUser()
    } catch (error: any) {
      toast.error(error.message || 'Failed to update phone number')
    } finally {
      setIsChangingPhone(false)
    }
  }

  return (
    <SecurityLayout>
      <div className='space-y-8'>
        {/* Email Change Section */}
        <div>
          <h2 className='text-base font-bold text-white md:text-xl'>Email</h2>
          <p className='mb-3 text-sm text-gray-400'>
            Current email: <span className='text-white'>{user?.email || 'Not set'}</span>
          </p>
          
          <form onSubmit={emailForm.handleSubmit(handleConfirmEmailChange)}>
          <Input
              {...emailForm.register('email')}
            type='email'
              placeholder='Enter new email address'
            containerClassName='mt-3'
            wrapperClassName='h-12'
              error={emailForm.formState.errors.email?.message}
              disabled={emailCodeSent}
            />

            {emailCodeSent && (
              <div className='mt-3'>
                <Input
                  {...emailForm.register('verificationCode')}
                  type='text'
                  placeholder='Enter verification code'
                  wrapperClassName='h-12'
                  error={emailForm.formState.errors.verificationCode?.message}
                />
                <p className='mt-2 text-xs text-gray-400'>
                  A verification code has been sent to your new email address
                </p>
              </div>
            )}

            <div className='mt-5 flex gap-3'>
              {!emailCodeSent ? (
            <Button
              type='button'
              variant='secondary1'
                  onClick={handleSendEmailCode}
                  disabled={isChangingEmail}
                >
                  {isChangingEmail ? 'Sending...' : 'Send Verification Code'}
                </Button>
              ) : (
                <>
                  <Button
                    type='submit'
                    variant='secondary1'
                    disabled={isChangingEmail}
                  >
                    {isChangingEmail ? 'Confirming...' : 'Confirm Email Change'}
                  </Button>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => {
                      setEmailCodeSent(false)
                      emailForm.setValue('verificationCode', '')
                    }}
                  >
                    Cancel
            </Button>
                </>
              )}
          </div>
          </form>
        </div>

        {/* Phone Number Section */}
        <div>
          <h2 className='mb-2 text-base font-bold text-white md:text-xl'>
            Phone Number
          </h2>
          <p className='mb-3 text-sm font-normal text-[#ABAAAD]'>
            We only service areas that are listed in the available country code list.
          </p>
          <p className='mb-3 text-sm text-gray-400'>
            Current phone: <span className='text-white'>{user?.phoneNumber || 'Not set'}</span>
          </p>
          
          <form onSubmit={phoneForm.handleSubmit(handlePhoneUpdate)}>
          <Input
              {...phoneForm.register('phoneNumber')}
            type='tel'
              placeholder='Enter new phone number (e.g., +1234567890)'
            wrapperClassName='h-12'
              error={phoneForm.formState.errors.phoneNumber?.message}
            />

            <div className='mt-5 flex gap-3'>
              <Button
                type='submit'
                variant='secondary1'
                disabled={isChangingPhone}
              >
                {isChangingPhone ? 'Updating...' : 'Update Phone Number'}
          </Button>
              <Button
                type='button'
                variant='outline'
                onClick={() => phoneForm.reset({ phoneNumber: user?.phoneNumber || '' })}
              >
            Reset
          </Button>
        </div>
      </form>
        </div>
      </div>
    </SecurityLayout>
  )
}

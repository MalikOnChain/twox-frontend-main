'use client'
import { yupResolver } from '@hookform/resolvers/yup'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as yup from 'yup'

import { updatePassword } from '@/api/user-settings'

import SecurityLayout from '@/components/templates/security-layout/security-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import CopyIcon from '@/assets/profile/copy.svg'

// Password validation schema
const passwordSchema = yup.object({
  currentPassword: yup
    .string()
    .required('Current password is required')
    .min(8, 'Password must be at least 8 characters'),
  newPassword: yup
    .string()
    .required('New password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(30, 'Password must be less than 30 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
      'Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  confirmPassword: yup
    .string()
    .required('Please confirm your new password')
    .oneOf([yup.ref('newPassword')], 'Passwords must match'),
})

type PasswordFormData = yup.InferType<typeof passwordSchema>

export default function SecurityPage() {
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)

  const passwordForm = useForm<PasswordFormData>({
    resolver: yupResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const handlePasswordUpdate = async (data: PasswordFormData) => {
    try {
      setIsUpdatingPassword(true)
      const response = await updatePassword(data.currentPassword, data.newPassword)
      toast.success(response.message || 'Password updated successfully!')
      
      // Reset form on success
      passwordForm.reset()
    } catch (error: any) {
      toast.error(error.message || 'Failed to update password')
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  return (
    <div className='flex flex-col gap-6'>
      <SecurityLayout>
        <form onSubmit={passwordForm.handleSubmit(handlePasswordUpdate)}>
          <div className='flex w-full flex-col gap-3'>
            <h2 className='text-base font-bold text-white md:text-xl'>
              Password
            </h2>
            <Input
              {...passwordForm.register('currentPassword')}
              type='password'
              placeholder='Current Password'
              wrapperClassName='h-12'
              error={passwordForm.formState.errors.currentPassword?.message}
              autoComplete='current-password'
            />
            <Input
              {...passwordForm.register('newPassword')}
              type='password'
              placeholder='New Password (min 8 chars, uppercase, lowercase, number)'
              wrapperClassName='h-12'
              error={passwordForm.formState.errors.newPassword?.message}
              autoComplete='new-password'
            />
            <Input
              {...passwordForm.register('confirmPassword')}
              type='password'
              placeholder='Repeat New Password'
              wrapperClassName='h-12'
              error={passwordForm.formState.errors.confirmPassword?.message}
              autoComplete='new-password'
            />
          </div>
          <Button 
            type='submit' 
            variant='secondary1' 
            className='mt-5'
            disabled={isUpdatingPassword}
          >
            {isUpdatingPassword ? 'Updating...' : 'Save Password'}
          </Button>
        </form>
      </SecurityLayout>
      {/* <SecurityLayout>
        <h2 className='mb-3 text-base font-bold text-white md:text-xl'>
          Two Factor
        </h2>
        <p className='mb-5 text-sm font-normal text-[#ABAAAD]'>
          To keep your account extra secure leave a two factor authentication
          enabled.
        </p>
        <label className='mb-3 inline-block text-sm font-bold text-white'>
          Authenticator App Code
        </label>
        <div className='mb-3 flex h-12 items-center gap-2.5 rounded-lg bg-cinder px-3 py-2'>
          <span className='inline-block h-4 w-4 scale-100 cursor-copy active:scale-90'>
            <CopyIcon />
          </span>
          <p className='text-[#ABAAAD]'>BUQ5Z2QQF2XNKDNDFDWHU4W4CY</p>
        </div>
        <label className='mb-3 inline-block text-sm font-bold text-white'>
          Two Factor Code
        </label>
        <Input type='text' wrapperClassName='h-12' />
        <Button variant='secondary1' className='mt-5'>
          Activate
        </Button>
      </SecurityLayout> */}
    </div>
  )
}

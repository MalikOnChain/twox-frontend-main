'use client'

import { yupResolver } from '@hookform/resolvers/yup'
import React from 'react'
import { useForm } from 'react-hook-form'

import { useUser } from '@/context/user-context'

import useProfileSetting from '@/hooks/data/use-profile-setting'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CustomModal } from '@/components/ui/modal'

import { ChangePasswordFormValues, changePasswordSchema } from '@/schema/auth'

interface ChangePasswordModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const ChangePasswordModal = ({
  open,
  onOpenChange,
}: ChangePasswordModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormValues>({
    resolver: yupResolver(changePasswordSchema),
    defaultValues: { newPassword: '', confirmPassword: '' },
  })

  const { handleUpdatePassword } = useProfileSetting()

  const onSubmit = async (data: ChangePasswordFormValues) => {
    if (user?.hasPassword && !data.oldPassword) {
      setError('oldPassword', { message: 'Password is required' })
      return
    }
    await handleUpdatePassword(data.oldPassword || '', data.newPassword, () => {
      reset()
      onOpenChange(false)
    })
  }

  const { user } = useUser()

  return (
    <CustomModal
      isOpen={open}
      onRequestClose={() => onOpenChange(false)}
      contentLabel='Change Password Modal'
    >
      <div className='relative w-full min-w-[32rem] overflow-hidden rounded-lg bg-background p-8'>
        <form onSubmit={handleSubmit(onSubmit)} className='w-full'>
          <h3 className='mb-2 text-base'>Change Password</h3>
          {user?.hasPassword && (
            <div className='col-span-1'>
              <label className='mb-2 block text-[13px] font-medium text-secondary-800'>
                Password
              </label>
              <Input
                label='Old password'
                type='password'
                placeholder='Old password'
                error={errors.oldPassword?.message}
                {...register('oldPassword')}
              />
            </div>
          )}

          <div className='my-6 space-y-3'>
            <div className='col-span-1'>
              <label className='mb-2 block text-[13px] font-medium text-secondary-800'>
                New password
              </label>
              <Input
                type='password'
                placeholder='New password'
                error={errors.newPassword?.message}
                {...register('newPassword')}
              />
            </div>
            <div className='col-span-1'>
              <label className='mb-2 block text-[13px] font-medium text-secondary-800'>
                Confirm Password
              </label>
              <Input
                type='password'
                placeholder='Confirm your password'
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />
            </div>
          </div>
          <Button
            type='submit'
            size='sm'
            className='ml-auto flex w-40'
            disabled={isSubmitting}
          >
            Change Password
          </Button>
        </form>
      </div>
    </CustomModal>
  )
}
export default ChangePasswordModal

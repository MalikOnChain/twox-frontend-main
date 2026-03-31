'use client'

import { yupResolver } from '@hookform/resolvers/yup'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { useUser } from '@/context/user-context'

import useProfileSetting from '@/hooks/data/use-profile-setting'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { changeEmailSchema, ChangeEmailValues } from '@/schema/auth'

import ChangeEmailModal from './change-email-modal'

const ChangeEmail = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangeEmailValues>({
    resolver: yupResolver(changeEmailSchema),
    defaultValues: { newEmail: '' },
  })

  const [openModal, setOpenModal] = useState(false)
  const { user } = useUser()
  const { handleRequestChangeEmail, loading } = useProfileSetting()
  const [isSendCode, setIsSendCode] = useState(false)

  const onSubmit = async (data: ChangeEmailValues) => {
    await handleRequestChangeEmail(data.newEmail)
    setIsSendCode(true)
    setOpenModal(true)
  }

  const onOpenChange = (open: boolean) => {
    setOpenModal(open)
  }

  useEffect(() => {
    return () => {
      setIsSendCode(false)
    }
  }, [])

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className='w-full'>
        <h3 className='mb-2 text-base'>Manage Email</h3>
        <div className='mb-6 w-full'>
          <Input defaultValue={user?.email} disabled={true} />
        </div>
        <div className='mb-6 w-full'>
          <Input
            label='New email'
            placeholder='Enter your new email'
            error={errors.newEmail?.message}
            {...register('newEmail')}
          />
        </div>

        <div className='button-container flex justify-end gap-2'>
          <Button
            type='submit'
            size='sm'
            className='flex w-40'
            disabled={loading}
            loading={loading}
          >
            {isSendCode ? 'Resend Code' : 'Change Email'}
          </Button>

          {isSendCode && (
            <Button
              type='button'
              size='sm'
              className='flex w-40'
              disabled={loading}
              loading={loading}
              onClick={(e) => {
                e.preventDefault()
                onOpenChange(true)
              }}
            >
              Verify Email
            </Button>
          )}
        </div>
      </form>
      <ChangeEmailModal
        open={openModal}
        oldEmail={user?.email || ''}
        onOpenChange={onOpenChange}
      />
    </>
  )
}

export default ChangeEmail

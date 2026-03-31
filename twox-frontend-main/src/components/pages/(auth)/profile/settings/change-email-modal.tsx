'use client'

import { yupResolver } from '@hookform/resolvers/yup'
import { ArrowLeft, X } from 'lucide-react'
import React, { memo, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { useUser } from '@/context/user-context'

import useProfileSetting from '@/hooks/data/use-profile-setting'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import { CustomModal } from '@/components/ui/modal'

import { changeEmailSchema, ChangeEmailValues } from '@/schema/auth'

enum ModalStep {
  SendEmail = 'send-email',
  VerifyEmail = 'verify-email',
}

interface ChangeModalType {
  open: boolean
  oldEmail: string
  onOpenChange: (open: boolean) => void
}

function ChangeEmailModal({ open, oldEmail, onOpenChange }: ChangeModalType) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ChangeEmailValues>({
    resolver: yupResolver(changeEmailSchema),
    defaultValues: { newEmail: '' },
  })

  const { user } = useUser()
  const { handleRequestChangeEmail, loading: loadingChangeEmail } =
    useProfileSetting()
  const [isSendCode, setIsSendCode] = useState(false)

  const [modalStep, setModalStep] = useState<ModalStep>(ModalStep.SendEmail)

  const onSubmitEmail = async (data: ChangeEmailValues) => {
    await handleRequestChangeEmail(data.newEmail)
    setIsSendCode(true)
  }

  useEffect(() => {
    return () => {
      setIsSendCode(false)
    }
  }, [])

  const {
    handleChangeEmail,
    oldEmailCode,
    newEmailCode,
    setOldEmailCode,
    setNewEmailCode,
    loading: loadingVerifyEmail,
  } = useProfileSetting()

  const [newEmail, setNewEmail] = useState(getValues('newEmail'))

  const handleOldVerifySuccess = (code: string) => {
    setOldEmailCode(code)
  }

  const handleNewVerifySuccess = (code: string) => {
    setNewEmailCode(code)
    setTimeout(() => {
      handleChangeEmail(newEmail, () => {
        onOpenChange(false)
      })
    }, 300)
  }

  return (
    <CustomModal
      isOpen={open}
      onRequestClose={() => onOpenChange(false)}
      contentLabel='Authentication Modal'
    >
      <div className='relative w-full min-w-[32rem] overflow-hidden rounded-lg bg-background p-8'>
        <div className='absolute right-5 top-4 z-10'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => onOpenChange(false)}
            className='p-0'
          >
            <X className='h-4 w-4' />
          </Button>
        </div>
        {modalStep === ModalStep.SendEmail && (
          <form onSubmit={handleSubmit(onSubmitEmail)} className='w-full'>
            <h3 className='mb-2 text-base'>Manage Email</h3>
            <div className='mb-6 w-full'>
              <Input
                value={user?.email}
                label='Current Email'
                // variant='secondary2'
                disabled={true}
              />
            </div>
            <div className='mb-6 w-full'>
              <Input
                label='New Email'
                placeholder='Enter your new email'
                error={errors.newEmail?.message}
                // variant='secondary'
                {...register('newEmail')}
              />
            </div>

            <div className='button-container flex justify-end gap-2'>
              <Button
                type='submit'
                size='sm'
                className='flex w-40'
                disabled={loadingChangeEmail}
                loading={loadingChangeEmail}
              >
                {isSendCode ? 'Resend Code' : 'Change Email'}
              </Button>

              {isSendCode && (
                <Button
                  type='button'
                  size='sm'
                  className='flex w-40'
                  disabled={loadingChangeEmail}
                  loading={loadingChangeEmail}
                  onClick={(e) => {
                    e.preventDefault()
                    setModalStep(ModalStep.VerifyEmail)
                    setNewEmail(getValues('newEmail'))
                  }}
                >
                  Verify Email
                </Button>
              )}
            </div>
          </form>
        )}
        {modalStep === ModalStep.VerifyEmail && (
          <div>
            <div className='absolute left-5 top-4'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setModalStep(ModalStep.SendEmail)}
                className='px-0'
              >
                <ArrowLeft className='h-4 w-4' />
                Back
              </Button>
            </div>
            <div className='mb-6 mt-6 w-full'>
              <Input value={oldEmail} disabled={true} />
            </div>
            <div className='mb-6 w-full'>
              <div className='w-full'>
                <InputOTP
                  value={oldEmailCode}
                  onChange={(value) => setOldEmailCode(value)}
                  onComplete={handleOldVerifySuccess}
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
              </div>
            </div>
            <div className='mb-6 w-full'>
              <Input value={newEmail} disabled={true} />
            </div>
            <div className='mb-6 w-full'>
              <div className='w-full'>
                <InputOTP
                  value={newEmailCode}
                  onChange={(value) => setNewEmailCode(value)}
                  onComplete={handleNewVerifySuccess}
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
              </div>
            </div>
            <Button
              size='lg'
              className='ml-auto flex w-32'
              disabled={loadingVerifyEmail}
              loading={loadingVerifyEmail}
              onClick={() => handleChangeEmail(newEmail)}
            >
              Change Email
            </Button>
          </div>
        )}
      </div>
    </CustomModal>
  )
}

export default memo(ChangeEmailModal)

'use client'
import { yupResolver } from '@hookform/resolvers/yup'
import { Edit2 as Edit, LogOut } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { oAuthLogin } from '@/api/auth'

import { useSocket } from '@/context/socket-context'
import { useUser } from '@/context/user-context'

import { SOCKET_NAMESPACES } from '@/lib/socket'
import { cn, formatDate } from '@/lib/utils'
import useProfileSetting from '@/hooks/data/use-profile-setting'

import AccountCard from '@/components/pages/(auth)/profile/settings/account-card'
import ChangeEmailModal from '@/components/pages/(auth)/profile/settings/change-email-modal'
import ChangePasswordModal from '@/components/pages/(auth)/profile/settings/change-password-modal'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

import { profileInfoFormSchema, ProfileInfoFormValues } from '@/schema/auth'

import TwoFactor from '@/assets/2fa.svg'
import settingsCardBg from '@/assets/header-bg.png'
import GoogleIcon from '@/assets/social/google-red.svg'

import { AUTH_PROVIDER_KEYS } from '@/types/auth'
import { LinkedState } from '@/types/user'
const SettingsPage = () => {
  const { user, logout } = useUser()
  const { socket } = useSocket(SOCKET_NAMESPACES.USER)
  const { t } = useTranslation()
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProfileInfoFormValues>({
    resolver: yupResolver(profileInfoFormSchema),
    defaultValues: {
      username: '',
      fullName: '',
    },
  })

  const handleLogout = () => {
    logout()
    if (socket) {
      socket.emit('auth:logout', null)
    }
  }

  useEffect(() => {
    if (user) {
      setValue('username', user.username)
      setValue('fullName', user.fullName || '')
    }
  }, [user, setValue])

  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)

  const { handleUpdateProfile } = useProfileSetting()

  const onSubmit = async (data: ProfileInfoFormValues) => {
    await handleUpdateProfile(data)
    reset()
  }

  return (
    <>
      <div className='flex flex-col gap-5 3xl:flex-row'>
        <Card
          className={cn(
            'relative flex flex-1 flex-col justify-between bg-background-fourth 3xl:flex-[0.6]'
          )}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='grid grid-cols-1 gap-x-3 gap-y-4 sm:grid-cols-2'>
              <div className='col-span-1'>
                <label className='mb-2 block text-[13px] font-medium text-secondary-800'>
                  {t('profile.username')}
                </label>
                <Input
                  placeholder='Enter your username'
                  error={errors.username?.message}
                  {...register('username')}
                />
              </div>
              <div className='col-span-1'>
                <label className='mb-2 block text-[13px] font-medium text-secondary-800'>
                  {t('profile.full_name')}
                </label>
                <Input
                  placeholder='Enter your full name'
                  error={errors.fullName?.message}
                  {...register('fullName')}
                />
              </div>
              <div className='col-span-1'>
                <label className='mb-2 block text-[13px] font-medium text-secondary-800'>
                  {t('profile.email')}
                </label>
                <Input
                  type='email'
                  placeholder='Enter your email'
                  readOnly
                  value={user?.email || ''}
                  onClick={() => setIsEmailModalOpen(true)}
                  disabled={!!user?.googleId}
                  endAddon={
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => setIsEmailModalOpen(true)}
                      className='border-none bg-transparent'
                      disabled={!!user?.googleId}
                    >
                      <Edit className='!h-4 !w-4' />
                    </Button>
                  }
                />
              </div>
              <div className='col-span-1'>
                <label className='mb-2 block text-[13px] font-medium text-secondary-800'>
                  {t('profile.password')}
                </label>
                <Input
                  placeholder='Enter your password'
                  readOnly
                  onClick={() => setIsPasswordModalOpen(true)}
                  endAddon={
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => setIsPasswordModalOpen(true)}
                      className='border-none bg-transparent'
                    >
                      <Edit className='!h-4 !w-4' />
                    </Button>
                  }
                />
              </div>
              <div className='mt-3 flex justify-end sm:col-span-2'>
                <Button className='w-20' type='submit' disabled={isSubmitting}>
                  {isSubmitting ? t('profile.saving') : t('profile.save')}
                </Button>
              </div>
            </div>
          </form>

          <Separator className='my-3' />

          <div>
            <h6 className='mb-2 text-xs capitalize tracking-normal text-muted-foreground'>
              {t('profile.linked_accounts')}
            </h6>
            <div className='grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-3'>
              <AccountCard
                state={user?.googleId ? LinkedState.LINK : LinkedState.UNLINK}
                icon={<GoogleIcon className='h-9 w-9' />}
                title={t('profile.google')}
                description={
                  user?.googleId
                    ? t('profile.linked_at') + formatDate(user.createdAt)
                    : t('profile.not_linked')
                }
                onClick={() => {
                  if (user && !user.googleId) {
                    oAuthLogin(AUTH_PROVIDER_KEYS.GOOGLE)
                  }
                }}
              />
            </div>
          </div>
        </Card>

        <div className='flex flex-1 flex-col justify-start gap-2 sm:flex-row sm:gap-5 3xl:flex-[0.4] 3xl:flex-col'>
          <div
            className='flex flex-[0.5] rounded-2xl bg-cover bg-no-repeat p-6'
            style={{ backgroundImage: `url(${settingsCardBg.src})` }}
          >
            <div className='flex flex-1 items-center justify-center'>
              <TwoFactor className='flex-[0.4]' />
              <div className='flex flex-1 flex-col'>
                <h2 className='mb-1 font-kepler text-[22px] font-normal uppercase'>
                  {t('profile.enable_2fa')}
                </h2>
                <p className='font-stolzl text-[14px] text-muted-foreground'>
                  {t('profile.secure_your_account')}
                </p>

                <Button
                  variant='secondary2'
                  className='mt-[14px] h-[39px] w-[74px]'
                >
                  {t('profile.enable')}
                </Button>
              </div>
            </div>
          </div>

          <div
            className='flex flex-[0.5] rounded-2xl bg-cover bg-no-repeat p-6'
            style={{ backgroundImage: `url(${settingsCardBg.src})` }}
          >
            <div className='flex items-center justify-center'>
              <div className='flex flex-[0.4] items-center justify-center'>
                <LogOut className='-ml-[20px] h-12 w-12' />
              </div>
              <div className='flex flex-1 flex-col'>
                <h2 className='mb-1 font-kepler text-[22px] font-normal uppercase'>
                  {t('profile.sign_out_everywhere')}
                </h2>
                <p className='font-stolzl text-[14px] text-muted-foreground'>
                  {t('profile.sign_out_from_all_devices')}
                </p>

                <Button
                  variant='secondary2'
                  className='mt-[14px] h-[39px] w-[74px]'
                  onClick={handleLogout}
                >
                  {t('profile.sign_out')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ChangeEmailModal
        open={isEmailModalOpen}
        oldEmail={user?.email || ''}
        onOpenChange={setIsEmailModalOpen}
      />

      <ChangePasswordModal
        open={isPasswordModalOpen}
        onOpenChange={setIsPasswordModalOpen}
      />
    </>
  )
}

export default SettingsPage

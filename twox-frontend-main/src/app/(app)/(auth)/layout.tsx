'use client'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import React, { ReactNode, useEffect } from 'react'

import { useInitialSettingsContext } from '@/context/initial-settings-context'
import { useLoading } from '@/context/loading-context'
import { useUser } from '@/context/user-context'

import { cn } from '@/lib/utils'

import ProfileInfoCard from '@/components/pages/(auth)/profile/profile-info-card'
import ProfileTabs from '@/components/pages/(auth)/profile/profile-tabs'
import UserAvatarUploader from '@/components/pages/(auth)/profile/user-avatar-uploader'
import UserInfoCard from '@/components/pages/(auth)/profile/user-info-card'
import MainLoading from '@/components/templates/loading/main-loading'

import ProfileBg from '@/assets/banner/profile-bg.png'

const Layout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname()
  const router = useRouter()
  const { isLoading } = useLoading()
  const { user } = useUser()
  const { settings } = useInitialSettingsContext()

  useEffect(() => {
    if (!user && !isLoading) {
      router.push('/')
    }
  }, [user, router, isLoading])

  if (isLoading || !user) {
    return (
      <MainLoading
        className='left-0 top-0'
        logoImg={settings.socialMediaSetting.logo}
      />
    )
  }

  return (
    <div className='mx-auto w-full max-w-8xl pt-6'>
      <Image
        src={ProfileBg}
        alt='profile-bg'
        className='h-full min-h-24 w-full rounded-xl object-cover'
      />
      <div className='mx-auto flex max-w-3xl flex-col items-center px-0 md:items-start md:gap-11 3xl:max-w-full 3xl:flex-row 3xl:pl-14 3xl:pr-5'>
        <UserAvatarUploader />

        <div className='-mt-20 flex w-full flex-col gap-5 3xl:mt-0'>
          <div className='flex flex-col gap-5 3xl:-mt-4 3xl:flex-row'>
            <UserInfoCard className='flex-1 bg-background-fourth lg:flex-[0.6]' />
            <ProfileInfoCard className='bg-background-fourth lg:flex-[0.4]' />
          </div>
          <ProfileTabs />
          <div
            className={cn(
              pathname !== '/profile/settings'
                ? 'rounded-2xl bg-background-fourth px-5'
                : ''
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Layout

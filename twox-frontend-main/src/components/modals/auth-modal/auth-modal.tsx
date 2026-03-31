'use client'

import { ArrowLeft } from 'lucide-react'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'

import { AUTH_TABS } from '@/lib/auth'

import { CustomModal } from '@/components/ui/modal'

import { RoundedCrossIcon } from '@/svg'

import ForgotPasswordForm from './forgot-password-form'
import LoginForm from './login-form'
import RegisterForm from './register-form'

interface AuthModalPropsType {
  open: boolean
  activeTab?: string
  onOpenChange: (open: boolean) => void
  setActiveTab: (activeTab: AUTH_TABS) => void
}

function AuthModal({
  open,
  activeTab,
  onOpenChange,
  setActiveTab,
}: AuthModalPropsType) {
  const { t } = useTranslation()
  const handleOpenChange = (openFlag: boolean) => {
    onOpenChange(openFlag)
    setTimeout(() => {
      if (activeTab === AUTH_TABS.forgotPassword) {
        setActiveTab(AUTH_TABS.signin)
      }
    }, 300)
  }

  return (
    <CustomModal
      isOpen={open}
      onRequestClose={() => handleOpenChange(false)}
      contentLabel='Authentication Modal'
    >
      <div className='w-full overflow-hidden'>
        <div className='flex'>
          {/* <div className='hidden translate-x-3 md:flex'>
            <Image
              src={AuthImage}
              alt='auth'
              width={0}
              height={0}
              sizes='100vw'
              className='max-h-[558px] max-w-[425px] object-cover'
            />
          </div> */}

          <div className='mx-auto flex w-full min-w-[320px] flex-1 flex-col justify-between gap-4 rounded-xl border border-mirage bg-dark-gradient p-6 md:min-w-[400px]'>
            <div className='space-y-4'>
              {activeTab === AUTH_TABS.forgotPassword && (
                <button
                  className='flex items-center gap-2'
                  onClick={() => setActiveTab(AUTH_TABS.signin)}
                >
                  <div className='rounded-[10px] bg-dark-grey-gradient p-2 text-secondary-800'>
                    <ArrowLeft className='size-4' />
                  </div>
                  {/* <span>{t('auth.back')}</span> */}
                </button>
              )}
              <div className='flex items-center justify-between'>
                <h2 className='font-satoshi text-lg font-bold'>
                  {activeTab === AUTH_TABS.signup
                    ? t('auth.sign_up')
                    : activeTab === AUTH_TABS.forgotPassword
                      ? t('auth.forgot_password')
                      : t('auth.sign_in')}
                </h2>
                <RoundedCrossIcon onClick={() => handleOpenChange(false)} />
              </div>

              {/* {activeTab !== AUTH_TABS.forgotPassword && (
                <Tabs
                  value={activeTab}
                  onValueChange={(val) => setActiveTab(val as AUTH_TABS)}
                  className='w-full'
                >
                  <TabsList
                    variant='secondary'
                    className='relative w-full border-b-2 border-background-third bg-transparent p-0'
                  >
                    <div
                      className='absolute bottom-0 left-0 z-10 h-[2px] w-1/2 bg-success-300 transition-transform duration-300 ease-in-out'
                      style={{
                        transform:
                          activeTab === AUTH_TABS.signup
                            ? 'translateX(0%)'
                            : 'translateX(100%)',
                      }}
                    />
                    <TabsTrigger
                      value={AUTH_TABS.signup}
                      variant='secondary'
                      className={`flex-1 px-0 pb-2 font-rubik text-[15px] tracking-wide ${activeTab === AUTH_TABS.signup ? 'text-foreground' : 'text-secondary-800'}`}
                    >
                      {t('auth.sign_up')}
                    </TabsTrigger>
                    <TabsTrigger
                      value={AUTH_TABS.signin}
                      variant='secondary'
                      className={`flex-1 px-0 pb-2 font-rubik text-[15px] tracking-wide ${activeTab === AUTH_TABS.signin ? 'text-foreground' : 'text-secondary-800'}`}
                    >
                      {t('auth.sign_in')}
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              )} */}
              <div className='rounded-lg bg-mirage p-4'>
                {activeTab === AUTH_TABS.signin && (
                  <LoginForm
                    onSuccess={() => onOpenChange(false)}
                    onSignUp={() => setActiveTab(AUTH_TABS.signup)}
                    onForgotPwd={() => setActiveTab(AUTH_TABS.forgotPassword)}
                  />
                )}
                {activeTab === AUTH_TABS.signup && (
                  <RegisterForm
                    onSuccess={() => onOpenChange(false)}
                    onSignIn={() => setActiveTab(AUTH_TABS.signin)}
                  />
                )}
                {activeTab === AUTH_TABS.forgotPassword && (
                  <ForgotPasswordForm
                    onBack={() => setActiveTab(AUTH_TABS.signin)}
                  />
                )}
              </div>
            </div>
            {/* {activeTab !== AUTH_TABS.forgotPassword && (
              <AuthProviders handleOpenChange={handleOpenChange} />
            )} */}

            {/* <p className='flex-1 content-end text-center text-xs text-secondary-800'>
              {`This site is protected by reCAPTCHA and the Google `}
              <Link
                target='_blank'
                href='https://policies.google.com/privacy'
                className='underline hover:text-white'
              >
                Privacy Policy
              </Link>{' '}
              and{' '}
              <Link
                target='_blank'
                href='https://policies.google.com/privacy'
                className='underline hover:text-white'
              >
                Terms of Service
              </Link>{' '}
              apply.
            </p> */}
          </div>
        </div>
      </div>
    </CustomModal>
  )
}

export default memo(AuthModal)

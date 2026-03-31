'use client'
import SumsubWebSdk from '@sumsub/websdk-react'
import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'

import { getKYCStatus, getSumsubWebSDKAccessToken } from '@/api/profile'

import { cn } from '@/lib/utils'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

import LogoWithText from '@/assets/brand/logo.webp'

import { ADMIN_REVIEW_STATUS, KYC_STATUS, KYCStatus } from '@/types/user'

const MESSAGE_STATUSES = {
  MODULE_LOADING_STARTED: 'idCheck.moduleLoadingStarted',
  MODULE_LOADING_COMPLETED: 'idCheck.moduleLoadingCompleted',
  MODULE_LOADING_FAILED: 'idCheck.moduleLoadingFailed',
  MODULE_LOADING_CANCELLED: 'idCheck.moduleLoadingCancelled',
  MODULE_READY: 'idCheck.onReady',
  MODULE_UNREADY: 'idCheck.onUnready',
  MODULE_ERROR: 'idCheck.onError',
  MODULE_CANCELLED: 'idCheck.onCancelled',
  MODULE_CLOSED: 'idCheck.onClosed',
  MODULE_RESUMED: 'idCheck.onResumed',
  MODULE_PAUSED: 'idCheck.onPaused',
  MODULE_INITIALIZED: 'idCheck.onInitialized',
  APPLICANT_SUBMITTED: 'idCheck.onApplicantSubmitted',
  STATUS_CHANGED: 'idCheck.onApplicantStatusChanged',
  STEP_COMPLETED: 'idCheck.onStepCompleted',
  LIVENESS_COMPLETED: 'idCheck.onLivenessCompleted',
}

const REVIEW_STATUSES = {
  PENDING: 'pending',
  COMPLETED: 'completed',
}

const KYCForm = () => {
  const [kycToken, setKycToken] = useState<string | null>(null)
  const [_loading, setLoading] = useState<boolean>(false)
  const [sdkLoading, setSdkLoading] = useState<boolean | null>(null)
  const [verificationStatus, setVerificationStatus] =
    useState<KYCStatus | null>(null)
  const [isOpenedLevel, setIsOpenedLevel] = useState<number[]>([])

  const disableLevel2 = useMemo(() => {
    return verificationStatus?.status !== KYC_STATUS.COMPLETED
  }, [verificationStatus])

  const fetchStatus = async () => {
    try {
      const response = await getKYCStatus()
      setVerificationStatus(response)
    } catch (error) {
      console.error('KYC status error:', error)
    }
  }

  const handleSignup = async () => {
    setLoading(true)
    try {
      const response = await getSumsubWebSDKAccessToken()
      setKycToken(response.token)
      setIsOpenedLevel((prev) => [...prev, 1])
    } catch (error) {
      console.error('Signup error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMessage = (message: string, options: any) => {
    switch (message) {
      case MESSAGE_STATUSES.STATUS_CHANGED: {
        if (options.reviewStatus === REVIEW_STATUSES.COMPLETED) {
          fetchStatus()
        }
        break
      }
      case MESSAGE_STATUSES.MODULE_READY: {
        setSdkLoading(true)
        break
      }
      case MESSAGE_STATUSES.MODULE_INITIALIZED: {
        setSdkLoading(false)
        break
      }
      default:
        return
    }
  }

  const handleError = (e: any) => {
    console.error(e)
  }

  const getKYCStatusBadge = () => {
    if (verificationStatus?.status === KYC_STATUS.PENDING) {
      return <Badge>Pending</Badge>
    }

    if (verificationStatus?.status === KYC_STATUS.REVIEWING) {
      return <Badge>Reviewing</Badge>
    }

    if (verificationStatus?.status === KYC_STATUS.COMPLETED) {
      return <Badge variant='success'>Completed</Badge>
    }

    if (verificationStatus?.status === KYC_STATUS.REJECTED) {
      return <Badge variant='destructive'>Rejected</Badge>
    }

    if (verificationStatus?.status === KYC_STATUS.ON_HOLD) {
      return <Badge variant='destructive'>On Hold</Badge>
    }
    return null
  }

  const getAdminReviewStatusBadge = () => {
    if (disableLevel2) return null

    if (
      verificationStatus?.adminReview.status === ADMIN_REVIEW_STATUS.PENDING
    ) {
      return <Badge variant='gold'>Pending</Badge>
    }

    if (
      verificationStatus?.adminReview.status === ADMIN_REVIEW_STATUS.APPROVED
    ) {
      return <Badge variant='success'>Approved</Badge>
    }

    if (
      verificationStatus?.adminReview.status === ADMIN_REVIEW_STATUS.REJECTED
    ) {
      return <Badge variant='destructive'>Rejected</Badge>
    }

    return null
  }

  const getKYCStatusButton = () => {
    if (verificationStatus?.status === KYC_STATUS.COMPLETED) {
      return null
    }

    if (verificationStatus?.status === KYC_STATUS.PENDING) {
      return null
    }

    if (verificationStatus?.status === KYC_STATUS.REVIEWING) {
      return null
    }

    if (verificationStatus?.status === KYC_STATUS.ON_HOLD) {
      return null
    }

    if (verificationStatus?.status === KYC_STATUS.REJECTED) {
      return (
        <Button
          size='sm'
          variant='link'
          className='h-auto p-0'
          onClick={handleSignup}
        >
          Resubmit
        </Button>
      )
    }

    return (
      <Button
        size='sm'
        variant='link'
        className='h-auto p-0'
        onClick={handleSignup}
      >
        Start Verification
      </Button>
    )
  }

  const handleToggleLevel2 = () => {
    if (disableLevel2) return

    if (
      verificationStatus?.adminReview.status === ADMIN_REVIEW_STATUS.PENDING
    ) {
      return
    }

    setIsOpenedLevel((prev) => {
      if (prev.includes(2)) {
        return prev.filter((item) => item !== 2)
      }
      return [...prev, 2]
    })
  }

  useEffect(() => {
    fetchStatus()
  }, [])

  return (
    <>
      <Card className='space-y-0 p-0 sm:p-0'>
        <CardHeader className='flex-row items-center justify-between space-y-0 p-4 text-sm'>
          <p>Level 1</p>
          <div className='flex gap-2'>
            {getKYCStatusBadge()}
            {getKYCStatusButton()}
          </div>
        </CardHeader>

        <div
          className={`overflow-hidden transition-all duration-300 ${
            isOpenedLevel.includes(1) ? 'max-h-[1000px]' : 'max-h-0'
          }`}
        >
          <CardContent className='pt-0'>
            {kycToken && (
              <>
                <div className='header flex h-[60px] min-h-[60px] w-full items-center justify-start rounded-t-xl bg-secondary px-10'>
                  <Image
                    src={LogoWithText}
                    alt='logo'
                    width={0}
                    height={0}
                    sizes='100vw'
                    className='h-10 w-auto'
                  />
                </div>
                <div
                  className={cn(
                    'flex flex-col overflow-y-auto',
                    'pb-2',
                    'h-[800px] min-h-[800px]',
                    'bg-external-sumsubBackground',
                    'rounded-b-xl'
                  )}
                  style={{
                    paddingTop:
                      sdkLoading === null
                        ? '200px'
                        : sdkLoading === true
                          ? '200px'
                          : '50px',
                  }}
                >
                  <SumsubWebSdk
                    accessToken={kycToken}
                    expirationHandler={() => getSumsubWebSDKAccessToken()}
                    config={{
                      theme: 'dark',
                    }}
                    options={{}}
                    onMessage={handleMessage}
                    onError={handleError}
                    style={{ transition: 'all 0.3s ease-in-out' }}
                  />
                </div>
              </>
            )}
          </CardContent>
        </div>
      </Card>

      <Card className='space-y-0 p-0 sm:p-0'>
        <CardHeader
          className={cn(
            'cursor-pointer flex-row items-center justify-between space-y-0 p-4 text-sm',
            {
              'cursor-not-allowed opacity-40': disableLevel2,
            },
            {
              'cursor-default':
                verificationStatus?.adminReview.status ===
                ADMIN_REVIEW_STATUS.PENDING,
            }
          )}
          onClick={handleToggleLevel2}
        >
          <p>Level 2</p>
          <div className='flex gap-2'>{getAdminReviewStatusBadge()}</div>
        </CardHeader>
        <div
          className={`overflow-hidden transition-all duration-300 ${
            isOpenedLevel.includes(2) ? 'max-h-[1000px]' : 'max-h-0'
          }`}
        >
          <CardContent className='pt-0'>
            <p className='text-sm italic'>
              {verificationStatus?.adminReview.notes}
            </p>
          </CardContent>
        </div>
      </Card>
    </>
  )
}

export default KYCForm

'use client'
import { LinkIcon } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { useUser } from '@/context/user-context'

import { getReferralLink } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import BitcoinO from '@/assets/images/coin-o.webp'

const AffiliateClaimCard = () => {
  const [referralLink, setReferralLink] = useState('')
  const { user } = useUser()

  const handleCopyReferralLink = () => {
    navigator.clipboard.writeText(referralLink)
    toast.success('Referral link was copied successfully')
  }

  useEffect(() => {
    setReferralLink(getReferralLink(user?.referralCode))
  }, [user])

  return (
    <div className='flex h-full w-full flex-col rounded-2xl bg-background-secondary p-[12px] pt-[18px] md:w-[300px] md:p-[18px]'>
      <h1 className='mb-[18px] text-[16px] font-bold leading-[1.2] tracking-normal text-foreground md:mb-[22px]'>
        Create a Code
      </h1>

      <div className='mb-2 flex flex-col gap-2'>
        <Input
          placeholder='Enter your code'
          containerClassName='w-full'
          wrapperClassName='h-[42px] md:h-[46px]'
          endAddon={
            <Button
              className='max-md:h-[30px] max-md:translate-x-[4px]'
              size='sm'
            >
              Save
            </Button>
          }
        />
        <Input
          endAddon={
            <span
              className='cursor-pointer hover:text-primary md:translate-x-[-2px]'
              onClick={handleCopyReferralLink}
            >
              <LinkIcon className='!h-4 !w-4' />
            </span>
          }
          containerClassName='w-full'
          wrapperClassName='h-[42px] md:h-[46px]'
          className='text-xs'
          value={referralLink}
          onChange={(e) => setReferralLink(e.target.value)}
        />
      </div>

      <div className='bg-gradient-affiliate-claim flex flex-col items-center rounded-lg p-[10px] max-md:pb-3'>
        <h2 className='mb-[10px] mt-2 text-xs font-medium leading-[1.2] text-foreground'>
          Available Earnings
        </h2>
        <span className='mb-[18px] inline-flex items-center text-[20px] font-bold leading-[1.2] text-foreground'>
          <Image
            src={BitcoinO}
            alt='Bitcoin'
            width={0}
            height={0}
            sizes='100vw'
            className='mr-2 h-6 w-6'
          />
          0.910.00
        </span>
        <Button className='h-[44px] w-full md:h-[46px]'>Claim Earnings</Button>
      </div>
    </div>
  )
}

export default AffiliateClaimCard

'use client'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { useUser } from '@/context/user-context'

import { cn, getReferralLink } from '@/lib/utils'

import { Input } from '@/components/ui/input'

import BitCoin from '@/assets/bst.webp'
import Bugle from '@/assets/bugle.webp'
import LinkIcon from '@/assets/link-1.svg'
import SpreadVector from '@/assets/vector/spread-vector.webp'

interface ReferralBannerProps {
  className?: string
}

const ReferralBanner = ({ className }: ReferralBannerProps) => {
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
    <div
      className={cn(
        'relative z-10 mb-2 overflow-hidden rounded-xl bg-background-secondary p-3 pt-[22px] sm:rounded-2xl md:mb-4 md:p-[30px]',
        className
      )}
    >
      <div className='max-w-[318px]'>
        <h1 className='mb-3 text-[22px] font-bold leading-[28px] text-primary-foreground md:mb-[18px]'>
          Invite friends to Earn 10% from each referral
        </h1>
        <p className='mb-[18px] text-xs text-secondary-text md:mb-[22px]'>
          Share your blog with your friends and earn money!
          <br />
          Everyone you invite will receive a bonus when they join.
        </p>
        <Input
          endAddon={
            <span
              className='translate-x-[6px] cursor-pointer hover:text-primary md:translate-x-[2px]'
              onClick={handleCopyReferralLink}
            >
              <LinkIcon className='!h-[30px] !w-[30px]' />
            </span>
          }
          wrapperClassName='h-[42px] md:h-[46px]'
          className='text-xs'
          value={referralLink}
          onChange={(e) => setReferralLink(e.target.value)}
        />
      </div>

      <div
        className={cn(
          'absolute bottom-0 right-0 flex items-center justify-center',
          '-z-10 w-[583px] translate-x-[60%] translate-y-[33%] sm:translate-x-[40%] sm:translate-y-[35%] md:w-[920px] md:translate-x-[28%] md:translate-y-[40%]'
        )}
      >
        <Image
          src={SpreadVector}
          alt='spread-vector'
          className='h-auto w-full opacity-[.32]'
          width={0}
          height={0}
          sizes='100vw'
        />
        <div className='absolute flex -translate-x-[72%] -translate-y-[35%] items-center justify-center sm:-translate-y-[4%] sm:translate-x-[4%]'>
          <span
            className={cn(
              'absolute rounded-full bg-primary/60 blur-[50px]',
              'h-[67px] w-[84px] sm:h-[160px] sm:w-[200px]'
            )}
          />
          <Image
            src={Bugle}
            alt='bugle'
            className='w-[100px] rotate-[-151deg] opacity-90 md:w-[210px]'
            width={0}
            height={0}
            sizes='100vw'
          />
        </div>
        <Image
          src={BitCoin}
          alt='bit-coin'
          className='absolute mt-2 hidden h-[90px] w-[95px] -translate-x-[250%] translate-y-[92%] md:mt-4 xl:block'
          width={0}
          height={0}
          sizes='100vw'
        />
        <Image
          src={BitCoin}
          alt='bit-coin'
          className='absolute left-[160px] top-[169px] h-[38px] w-[36px] -rotate-90 opacity-[.82] blur-[2px] md:left-[284px] md:top-[360px] md:h-[74px] md:w-[70px]'
          width={0}
          height={0}
          sizes='100vw'
        />
        <Image
          src={BitCoin}
          alt='bit-coin'
          className='absolute left-[72px] top-[181px] h-[38px] w-[39px] opacity-[.62] blur-[2px] md:left-[156px] md:top-[312px] md:h-[43px] md:w-[46px]'
          width={0}
          height={0}
          sizes='100vw'
        />
      </div>
    </div>
  )
}

export default ReferralBanner

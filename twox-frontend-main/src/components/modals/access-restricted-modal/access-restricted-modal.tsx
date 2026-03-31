import Image from 'next/image'
import React from 'react'

import { useInitialSettingsContext } from '@/context/initial-settings-context'

import { CustomModal } from '@/components/ui/modal'

import accessRestrictedBg from '@/assets/access-restricted-bg.png'
import FacebookIcon from '@/assets/social/facebook-colored.svg'
import InstagramIcon from '@/assets/social/instagram-colored.svg'
import LinkedinIcon from '@/assets/social/linkedin-colored.svg'
import XIcon from '@/assets/social/x-colored.svg'
import { RoundedCrossIcon } from '@/svg'

const AccessRestrictedModal = ({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) => {
  const { settings } = useInitialSettingsContext()

  return (
    <CustomModal
      isOpen={open}
      onRequestClose={() => onOpenChange(false)}
      contentLabel='Access Restricted Modal'
    >
      <div className='w-full overflow-hidden font-satoshi'>
        <div className='flex'>
          <div
            className='mx-auto flex min-h-[658px] w-full min-w-[320px] max-w-md flex-1 flex-col justify-between gap-4 rounded-xl border border-mirage p-6 md:min-w-[450px]'
            style={{
              backgroundImage: `url(${accessRestrictedBg.src})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center bottom',
              backgroundRepeat: 'no-repeat',
            }}
          >
            <div className='flex items-center justify-between'>
              <Image
                src={settings.socialMediaSetting.logo}
                alt='logo'
                width={125}
                height={48}
                style={settings.socialMediaSetting.logoStyle}
                className='relative block !h-9 w-24 object-contain md:!h-10 md:w-[105px]'
              />
              <RoundedCrossIcon
                onClick={() => {
                  onOpenChange(false)
                }}
              />
            </div>
            <div className='flex h-full flex-col justify-between'>
              <div className='!mt-9 font-satoshi'>
                <h1 className='text-4xl font-bold tracking-[-0.36px] md:text-[40px] md:leading-[54px]'>
                  Feel free to check us out again when you travel!
                </h1>
                <p className='mt-9 text-sm text-[#FFFFFFCC]'>
                  We currently do not support connections from united kingdom.
                  Contact us via live chat in bottom right corner or
                  <br />
                  <a
                    href='mailto:support@twox.com'
                    className='font-bold text-white underline'
                  >
                    support@twox.com
                  </a>
                </p>
              </div>
              <div>
                <h6 className='font-satoshi text-xl font-bold'>
                  Let&apos;s be in touch
                </h6>
                <div className='!mt-4 flex gap-1'>
                  <div className='flex h-8 w-8 items-center justify-center rounded-full bg-white'>
                    <FacebookIcon />
                  </div>
                  <div className='flex h-8 w-8 items-center justify-center rounded-full bg-white'>
                    <InstagramIcon />
                  </div>
                  <div className='flex h-8 w-8 items-center justify-center rounded-full bg-white'>
                    <LinkedinIcon />
                  </div>
                  <div className='flex h-8 w-8 items-center justify-center rounded-full bg-white'>
                    <XIcon />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CustomModal>
  )
}

export default AccessRestrictedModal

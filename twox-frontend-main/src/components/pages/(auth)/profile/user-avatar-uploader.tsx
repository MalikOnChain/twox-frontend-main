'use client'

import Image from 'next/image'
import React, { useState } from 'react'

import { useUser } from '@/context/user-context'

import { cn } from '@/lib/utils'

import PencilIcon from '@/assets/pencil.svg'

const UserAvatarUploader = ({
  showUploadButton = true,
}: {
  showUploadButton?: boolean
}) => {
  const { user } = useUser()
  const [imageSrc, setImageSrc] = useState(user?.avatar) // Default profile picture

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          setImageSrc(e.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className='relative flex h-full max-h-[90px] w-full max-w-[90px] -translate-y-1/2 items-center justify-center rounded-full border-[8px] border-background md:max-h-[151px] md:max-w-[151px]'>
      {imageSrc && (
        <Image
          src={imageSrc}
          width={0}
          height={0}
          sizes='100vw'
          alt='Profile Picture'
          className='h-full w-full rounded-full object-cover'
        />
      )}

      {/* Hidden File Input */}
      <input
        type='file'
        accept='image/*'
        className='hidden'
        id='imageUpload'
        onChange={handleImageUpload}
      />

      {showUploadButton && (
        <label
          htmlFor='imageUpload'
          className={cn(
            'absolute -bottom-0 left-0 flex size-7 cursor-pointer items-center justify-center rounded-full bg-button-gradient hover:bg-primary-600',
            'border-2 border-background'
          )}
        >
          <PencilIcon className='size-4.5' />
        </label>
      )}
    </div>
  )
}

export default UserAvatarUploader

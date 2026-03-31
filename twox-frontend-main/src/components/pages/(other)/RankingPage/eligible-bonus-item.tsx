import Image, { StaticImageData } from 'next/image'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'

const EligibleBonusItem = ({
  title,
  description,
  image,
}: {
  title: string
  description: string
  image: StaticImageData
}) => {
  const { t } = useTranslation()
  return (
    <div className='flex min-w-[211px] flex-col gap-2 rounded-2xl bg-background-fourth p-2 md:gap-6 md:p-3.5'>
      <div className='flex items-center gap-3'>
        <Image
          src={image}
          alt={title}
          width={0}
          height={0}
          sizes='100vw'
          className='h-14 w-14'
        />
        <div className='flex flex-col md:gap-0.5'>
          <span className='text-xs font-medium text-secondary-800'>
            {t('bonus.bonus')}
          </span>
          <h3 className='whitespace-nowrap font-kepler text-[16px] lg:text-lg'>
            {title}
          </h3>
          <p className='text-xs text-secondary-800'>{description}</p>
        </div>
      </div>
      <Button>{t('bonus.claimed')}</Button>
    </div>
  )
}

export default EligibleBonusItem

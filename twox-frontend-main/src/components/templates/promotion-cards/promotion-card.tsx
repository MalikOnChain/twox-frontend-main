import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'

import GiftImage from '@/assets/images/gift.webp'
import TelegramImage from '@/assets/images/telegram.webp'

const PromotionCard = ({ type }: { type: 'telegram' | 'promotion' }) => {
  const background =
    type === 'telegram' ? 'bg-telegram-gradient' : 'bg-promotion-gradient'
  const image = type === 'telegram' ? TelegramImage : GiftImage
  const subtitle =
    type === 'telegram' ? 'Always stay in touch' : 'Especially for you'
  const title = type === 'telegram' ? 'Telegram' : 'Promotion'
  const imgClassName = type === 'telegram' ? '' : 'rotate-[-6.34deg]'

  return (
    <div
      className={cn(
        'relative flex w-full flex-col items-start gap-4 rounded-[12px] p-4 md:items-center lg:flex-row',
        background
      )}
    >
      <Image
        src={image}
        alt='promotion-card'
        width={0}
        height={0}
        sizes='100vw'
        className={cn('h-auto w-[57px] object-contain', imgClassName)}
      />
      <div className='flex flex-1 flex-col justify-end space-y-2'>
        <p className='text-[12px] text-white/60'>{subtitle} </p>
        <h6 className='font-satoshi text-[18px] font-extrabold uppercase text-foreground'>
          {title}
        </h6>
      </div>

      <Button
        variant='outline'
        className='h-9 w-9 p-0 max-md:absolute max-md:right-4 md:p-0'
      >
        <ArrowRight className='w-[22px]' />
      </Button>
    </div>
  )
}

export default PromotionCard

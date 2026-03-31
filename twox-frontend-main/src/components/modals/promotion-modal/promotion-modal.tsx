import Image from 'next/image'
import React from 'react'

import { CustomModal } from '@/components/ui/modal'

import { IPromotion } from '@/types/promotion'

interface PromotionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  promotion?: IPromotion
}

const PromotionModal = ({
  open,
  onOpenChange,
  promotion,
}: PromotionModalProps) => {
  if (!promotion) return null

  return (
    <CustomModal
      isOpen={open}
      onRequestClose={() => onOpenChange(false)}
      contentLabel={promotion.name}
      isCentered={false}
    >
      <div className='flex flex-col rounded-lg bg-background-fourth'>
        <Image
          src={promotion.image}
          alt={promotion.name}
          width={100}
          height={100}
          sizes='100vw'
          className='max-h-[344px] w-full rounded-lg object-cover'
        />
        <div className='p-4 md:p-6'>
          <div className='space-y-2'>
            <h2 className='text-xl font-semibold'>{promotion.name}</h2>
            <div dangerouslySetInnerHTML={{ __html: promotion.description }} />
          </div>
          {/* <div className='flex justify-end'>
            <button
              onClick={() => onOpenChange(false)}
              className='rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90'
            >
              Close
            </button>
          </div> */}
        </div>
      </div>
    </CustomModal>
  )
}

export default PromotionModal

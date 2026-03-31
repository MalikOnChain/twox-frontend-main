import Image from 'next/image'
import React from 'react'

import { useModal } from '@/context/modal-context'
import { ModalType } from '@/context/modal-context'

import { IPromotion } from '@/types/promotion'

const PromotionItem = ({ promotion }: { promotion: IPromotion }) => {
  const { setIsOpen, setType, setPromotion } = useModal()

  const handleClick = () => {
    setPromotion(promotion)
    setType(ModalType.Promotion)
    setIsOpen(true)
  }

  return (
    <>
      <div
        className='rounded-2xl border border-mirage bg-dark-gradient p-4 font-satoshi'
        onClick={handleClick}
      >
        <Image
          src={promotion.image}
          alt=''
          width={353}
          height={206}
          className='w-full rounded-t-2xl object-cover'
        />
        <div className='font-satoshi'>
          <h4 className='mb-1 mt-4 text-lg font-bold text-white md:text-xl'>
            {promotion.name}
          </h4>
          <p className='text-sm font-normal text-[#FFFFFF80]'>
            {promotion.description}
          </p>
        </div>
      </div>
    </>
  )
}

export default PromotionItem

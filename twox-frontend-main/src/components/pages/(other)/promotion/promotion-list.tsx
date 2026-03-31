'use client'
import React, { useEffect, useState } from 'react'

import { getPromotions, Promotion } from '@/api/promotion'

import PromotionItem from '@/components/pages/(other)/promotion/promotion-item'
import Banner from '@/components/pages/home/banner/banner'
import promotionImg1 from '@/assets/promotion/promotion1.png'
import promotionImg2 from '@/assets/promotion/promotion2.png'
import promotionImg3 from '@/assets/promotion/promotion3.png'

const PromotionList = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        setLoading(true)
        const response = await getPromotions()
        if (response.success && response.data) {
          // Filter only public promotions
          const publicPromotions = response.data.filter((p) => p.isPublic)
          setPromotions(publicPromotions)
        }
      } catch (error) {
        console.error('Failed to fetch promotions:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPromotions()
  }, [])

  return (
    <div>
      <div>
        <Banner />
      </div>
      {loading ? (
        <div className='grid grid-cols-1 gap-4 xm:grid-cols-2 min-[880px]:grid-cols-3 lg:grid-cols-2 min-[1150px]:grid-cols-3 3xl:grid-cols-4'>
          {[...Array(6)].map((_, i) => (
            <div
              key={`skeleton-${i}`}
              className='h-[300px] animate-pulse rounded-lg bg-custom-dual-gradient'
            />
          ))}
        </div>
      ) : promotions.length === 0 ? (
        <div className='flex h-[300px] items-center justify-center rounded-lg border border-mirage bg-cinder'>
          <p className='text-gray-400'>No promotions available at the moment</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 gap-4 xm:grid-cols-2 min-[880px]:grid-cols-3 lg:grid-cols-2 min-[1150px]:grid-cols-3 3xl:grid-cols-4'>
          {promotions.map((promotion) => (
            <PromotionItem 
              key={promotion._id} 
              promotion={{
                _id: promotion._id,
                name: promotion.name,
                description: promotion.summary,
                image: promotion.image || '',
              }} 
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default PromotionList

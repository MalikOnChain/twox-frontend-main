'use client'

import { yupResolver } from '@hookform/resolvers/yup'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as yup from 'yup'

import { redeemPromoCode } from '@/api/bonus'

import SecurityLayout from '@/components/templates/security-layout/security-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const schema = yup.object({
  promoCode: yup
    .string()
    .trim()
    .required('Promo code is required')
    .min(3, 'Promo code must be at least 3 characters')
    .max(20, 'Promo code cannot exceed 20 characters')
    .matches(
      /^[A-Z0-9_-]+$/,
      'Promo code must contain only uppercase letters, numbers, underscores, and hyphens'
    ),
})

type FormData = yup.InferType<typeof schema>

export default function PromoCodePage() {
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      promoCode: '',
    },
  })

  const onSubmit = async (data: FormData) => {
    try {
      setSubmitting(true)
      
      const result = await redeemPromoCode(data.promoCode)

      if (result.success) {
        toast.success(result.message || 'Promo code redeemed successfully!', {
          description: result.bonus
            ? `You received: ${result.bonus.name}${result.bonus.amount ? ` - ${result.bonus.amount} USDT` : ''}`
            : undefined,
          duration: 5000,
        })
        reset()
      } else {
        toast.error(result.message || 'Failed to redeem promo code')
      }
    } catch (error: any) {
      console.error('Error redeeming promo code:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Failed to redeem promo code. Please try again.'
      toast.error(errorMessage)
    } finally {
      setSubmitting(false)
    }
  }

  // Watch promo code value for real-time validation feedback
  const promoCodeValue = watch('promoCode')

  return (
    <SecurityLayout>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2 className='mb-3 text-base font-bold text-white md:text-xl'>
          Promo code
        </h2>
        <Input
          {...register('promoCode')}
          type='text'
          placeholder='Enter Promo code'
          wrapperClassName='h-12'
          error={errors.promoCode?.message}
          style={{ textTransform: 'uppercase' }}
        />

        <div className='mt-5 flex gap-4'>
          <Button
            type='submit'
            variant='secondary1'
            disabled={submitting || !promoCodeValue}
          >
            {submitting ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
      </form>
    </SecurityLayout>
  )
}

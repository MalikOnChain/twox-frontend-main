'use client'

import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect,useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as yup from 'yup'

import { getKYCInfo, submitKYCInfo } from '@/api/user-settings'

import { DAYS, MONTHS, YEARS } from '@/lib/profile'

import SecurityLayout from '@/components/templates/security-layout/security-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Validation schema - all fields required with format validation
const schema = yup.object({
  firstName: yup
    .string()
    .trim()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters'),
  lastName: yup
    .string()
    .trim()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters'),
  day: yup.string().required('Day is required'),
  month: yup.string().required('Month is required'),
  year: yup.string().required('Year is required'),
  address: yup
    .string()
    .trim()
    .required('Address is required')
    .min(10, 'Address must be at least 10 characters'),
  city: yup
    .string()
    .trim()
    .required('City is required')
    .min(2, 'City must be at least 2 characters'),
  postalAddress: yup
    .string()
    .trim()
    .required('Postal address is required')
    .matches(/^[0-9A-Za-z\s-]*$/, 'Please enter a valid postal code')
    .min(3, 'Postal code must be at least 3 characters'),
})

type FormData = yup.InferType<typeof schema>

export default function VerifyPage() {
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: '',
      lastName: '',
      day: '',
      month: '',
      year: '',
      address: '',
      city: '',
      postalAddress: '',
    },
  })

  // Load existing KYC data on mount
  useEffect(() => {
    const loadKYCData = async () => {
      try {
        const kycData = await getKYCInfo()
        
        if (kycData) {
          setValue('firstName', kycData.firstName || '')
          setValue('lastName', kycData.lastName || '')
          setValue('address', kycData.address || '')
          setValue('city', kycData.city || '')
          setValue('postalAddress', kycData.postalCode || '')
          
          // Parse date of birth
          if (kycData.dateOfBirth) {
            const dob = new Date(kycData.dateOfBirth)
            setValue('day', dob.getDate().toString())
            setValue('month', dob.getMonth().toString())
            setValue('year', dob.getFullYear().toString())
          }
        }
      } catch (error) {
        console.error('Failed to load KYC data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadKYCData()
  }, [setValue])

  const onSubmit = async (data: FormData) => {
    try {
      setSubmitting(true)
      
      // Construct date of birth from day, month, year
      const dateOfBirth = new Date(
        parseInt(data.year),
        parseInt(data.month),
        parseInt(data.day)
      ).toISOString()

      await submitKYCInfo({
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth,
        address: data.address,
        city: data.city,
        postalCode: data.postalAddress,
      })

      toast.success('Verification information submitted successfully!')
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit verification information')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <SecurityLayout>
        <div className='flex h-64 items-center justify-center'>
          <div className='h-8 w-8 animate-spin rounded-full border-4 border-gray-600 border-t-white' />
        </div>
      </SecurityLayout>
    )
  }

  return (
    <SecurityLayout>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='space-y-6 font-satoshi'>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <div>
              <h2 className='mb-3 text-base font-bold text-white md:text-xl'>
                First Name
              </h2>
              <Input
                {...register('firstName')}
                type='text'
                placeholder='First Name'
                wrapperClassName='h-12'
                error={errors.firstName?.message}
              />
            </div>
            <div>
              <h2 className='mb-3 text-base font-bold text-white md:text-xl'>
                Last Name
              </h2>
              <Input
                {...register('lastName')}
                type='text'
                placeholder='Last Name'
                wrapperClassName='h-12'
                error={errors.lastName?.message}
              />
            </div>
          </div>

          <div>
            <h2 className='mb-3 text-base font-bold text-white md:text-xl'>
              Date of birth
            </h2>
            <div className='flex gap-4'>
              {/* Day Select */}
              <Controller
                name='day'
                control={control}
                render={({ field }) => (
                  <div className='flex-1'>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        className={`flex-1 rounded-lg border-none bg-[#17161B] from-[#242327] to-[#151419] px-[15px] py-2 font-satoshi text-sm text-[#ABAAAD] focus:outline-none focus:ring-0 focus:ring-offset-0 [&>svg]:opacity-70 ${errors.day ? 'border border-destructive' : ''}`}
                      >
                        <SelectValue
                          placeholder='DD'
                          className='!font-bold text-[#ABAAAD]'
                        />
                      </SelectTrigger>
                      <SelectContent
                        className='min-h-[122px] rounded-lg border-none bg-[#141317] p-[5px] shadow-lg'
                        sideOffset={8}
                      >
                        <div className='flex flex-col gap-2'>
                          {DAYS.map((item) => (
                            <SelectItem
                              hideIndicator
                              key={item}
                              value={item.toString()}
                              className='min-h-[24px] cursor-pointer rounded py-2 text-white hover:bg-[#1f1f23] focus:bg-[#1f1f23] data-[highlighted]:bg-[#1f1f23]'
                            >
                              <div className='flex w-full flex-1 flex-row justify-between'>
                                <div className='flex-1 font-satoshi text-sm'>
                                  {item}
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </div>
                      </SelectContent>
                    </Select>
                    {errors.day && (
                      <span className='mt-1.5 text-xs text-destructive'>
                        {errors.day.message}
                      </span>
                    )}
                  </div>
                )}
              />

              {/* Month Select */}
              <Controller
                name='month'
                control={control}
                render={({ field }) => (
                  <div className='flex-1'>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        className={`flex-1 rounded-lg border-none bg-[#17161B] from-[#242327] to-[#151419] px-[15px] py-2 font-satoshi text-sm text-[#ABAAAD] focus:outline-none focus:ring-0 focus:ring-offset-0 [&>svg]:opacity-70 ${errors.month ? 'border border-destructive' : ''}`}
                      >
                        <SelectValue
                          placeholder='MM'
                          className='!font-bold text-[#ABAAAD]'
                        />
                      </SelectTrigger>
                      <SelectContent
                        className='min-h-[122px] rounded-lg border-none bg-[#141317] p-[5px] shadow-lg'
                        sideOffset={8}
                      >
                        <div className='flex flex-col gap-2'>
                          {MONTHS.map((item, index) => (
                            <SelectItem
                              hideIndicator
                              key={item}
                              value={index.toString()}
                              className='min-h-[24px] cursor-pointer rounded py-2 text-white hover:bg-[#1f1f23] focus:bg-[#1f1f23] data-[highlighted]:bg-[#1f1f23]'
                            >
                              <div className='flex w-full flex-1 flex-row justify-between'>
                                <div className='flex-1 font-satoshi text-sm'>
                                  {item}
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </div>
                      </SelectContent>
                    </Select>
                    {errors.month && (
                      <span className='mt-1.5 text-xs text-destructive'>
                        {errors.month.message}
                      </span>
                    )}
                  </div>
                )}
              />

              {/* Year Select */}
              <Controller
                name='year'
                control={control}
                render={({ field }) => (
                  <div className='flex-1'>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        className={`flex-1 rounded-lg border-none bg-[#17161B] from-[#242327] to-[#151419] px-[15px] py-2 font-satoshi text-sm text-[#ABAAAD] focus:outline-none focus:ring-0 focus:ring-offset-0 [&>svg]:opacity-70 ${errors.year ? 'border border-destructive' : ''}`}
                      >
                        <SelectValue
                          placeholder='YYYY'
                          className='!font-bold text-[#ABAAAD]'
                        />
                      </SelectTrigger>
                      <SelectContent
                        className='min-h-[122px] rounded-lg border-none bg-[#141317] p-[5px] shadow-lg'
                        sideOffset={8}
                      >
                        <div className='flex flex-col gap-2'>
                          {YEARS.map((item) => (
                            <SelectItem
                              hideIndicator
                              key={item}
                              value={item.toString()}
                              className='min-h-[24px] cursor-pointer rounded py-2 text-white hover:bg-[#1f1f23] focus:bg-[#1f1f23] data-[highlighted]:bg-[#1f1f23]'
                            >
                              <div className='flex w-full flex-1 flex-row justify-between'>
                                <div className='flex-1 font-satoshi text-sm'>
                                  {item}
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </div>
                      </SelectContent>
                    </Select>
                    {errors.year && (
                      <span className='mt-1.5 text-xs text-destructive'>
                        {errors.year.message}
                      </span>
                    )}
                  </div>
                )}
              />
            </div>
          </div>

          <div>
            <h2 className='mb-3 text-base font-bold text-white md:text-xl'>
              Address
            </h2>
            <Input
              {...register('address')}
              type='text'
              placeholder='Your Address'
              wrapperClassName='h-12'
              error={errors.address?.message}
            />
          </div>

          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <div>
              <h2 className='mb-3 text-base font-bold text-white md:text-xl'>
                City
              </h2>
              <Input
                {...register('city')}
                type='text'
                placeholder='City'
                wrapperClassName='h-12'
                error={errors.city?.message}
              />
            </div>
            <div>
              <h2 className='mb-3 text-base font-bold text-white md:text-xl'>
                Postal Address
              </h2>
              <Input
                {...register('postalAddress')}
                type='text'
                placeholder='Postal Address'
                wrapperClassName='h-12'
                error={errors.postalAddress?.message}
              />
            </div>
          </div>
        </div>

        <div className='mt-5 flex gap-4'>
          <Button
            type='submit'
            variant='secondary1'
            className='min-w-32'
            disabled={submitting || loading}
          >
            {submitting ? 'Submitting...' : 'Verify'}
          </Button>
          <Button 
            type='button' 
            variant='outline' 
            onClick={() => reset()}
            disabled={submitting}
          >
            Reset
          </Button>
        </div>
      </form>
    </SecurityLayout>
  )
}

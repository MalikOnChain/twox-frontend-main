import { yupResolver } from '@hookform/resolvers/yup'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import PhoneInput from 'react-phone-number-input'
import { toast } from 'sonner'
import * as yup from 'yup'

import 'react-phone-number-input/style.css'

import { updateProfile } from '@/api/profile'

import { useUser } from '@/context/user-context'

import { cn, isValidCPF } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
const countries = [
  { value: 'USA', label: 'USA' },
  { value: 'BRA', label: 'Brazil' },
  { value: 'CAN', label: 'Canada' },
  { value: 'UK', label: 'UK' },
  { value: 'AUS', label: 'Australia' },
  // Add more countries as needed
]

const profileFormSchema = yup.object({
  username: yup.string().required('Username is required'),
  fullName: yup.string().required('Full name is required'),
  address: yup.string().required('Address is required'),
  zipCode: yup.string().required('Postal code is required'),
  country: yup.string().required('Country is required'),
  city: yup.string().required('City is required'),
  phoneNumber: yup
    .string()
    .required('Phone is required')
    .matches(/^\+[1-9]\d{6,14}$/, 'Invalid phone number'),
  CPFNumber: yup
    .string()
    .required('CPFNumber is required')
    .test('is-cpf', 'Invalid CPFNumber', (value) => {
      if (!value) return false
      return isValidCPF(value)
    }),
})

type ProfileFormValues = yup.InferType<typeof profileFormSchema>

const defaultValues: ProfileFormValues = {
  username: '',
  fullName: '',
  address: '',
  zipCode: '',
  country: 'BRA',
  city: '',
  phoneNumber: '',
  CPFNumber: '',
}

const UserInfoCard = ({ className = '' }: { className?: string }) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: yupResolver(profileFormSchema),
    defaultValues,
    mode: 'onChange',
  })
  const { getLoggedInUser, user } = useUser()
  const [isSaving, setIsSaving] = useState(false)
  const { t } = useTranslation()

  const onSubmit = async (data: ProfileFormValues) => {
    // Remove all non-digit characters from CPFNumber
    const sanitizedData = {
      ...data,
      CPFNumber: data.CPFNumber.replace(/\D/g, ''),
    }
    console.log(sanitizedData, 'sanitized data')
    if (isSaving) return
    setIsSaving(true)
    try {
      await updateProfile(sanitizedData)
      toast.success('Profile is updated successfully!')
      getLoggedInUser()
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('An unexpected error occurred')
      }
    } finally {
      setIsSaving(false)
    }
  }

  const formatCPF = (value: string) => {
    const digits = value.replace(/\D/g, '')
    return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, '$1.$2.$3-$4')
  }

  useEffect(() => {
    if (user) {
      setValue('username', user.username)
      setValue('fullName', user.fullName || '')
      setValue('address', user.address || '')
      setValue('zipCode', user.zipCode || '')
      setValue('country', user.country || '')
      setValue('city', user.city || '')
      setValue('phoneNumber', user.phoneNumber || '')
      setValue('CPFNumber', user.CPFNumber || '')
    }
  }, [user, setValue])

  return (
    <Card className={cn(className)}>
      <h2 className='mb-2 font-kepler text-[22px] font-normal text-white'>
        {t('profile.profile')}
      </h2>
      <form
        className='flex flex-col gap-x-2 gap-y-4 md:grid md:grid-cols-2'
        onSubmit={handleSubmit(onSubmit)}
        autoComplete='off'
      >
        {/* Username */}
        <div className='col-span-1'>
          <label className='mb-2 block text-[13px] font-medium text-secondary-800'>
            {t('profile.username')}
          </label>
          <Input
            {...register('username')}
            placeholder={t('profile.enter_username')}
            className='bg-background-third text-white'
            error={errors.username?.message}
          />
        </div>
        {/* Full Name */}
        <div className='col-span-1'>
          <label className='mb-2 block text-[13px] font-medium text-secondary-800'>
            {t('profile.full_name')}
          </label>
          <Input
            {...register('fullName')}
            placeholder={t('profile.enter_full_name')}
            className='bg-background-third text-white'
            error={errors.fullName?.message}
          />
        </div>
        {/* Address */}
        <div className='col-span-1'>
          <label className='mb-2 block text-[13px] font-medium text-secondary-800'>
            {t('profile.address')}
          </label>
          <Input
            {...register('address')}
            placeholder={t('profile.enter_address')}
            className='bg-background-third text-white'
            error={errors.address?.message}
          />
        </div>
        {/* Postal Code */}
        <div className='col-span-1'>
          <label className='mb-2 block text-[13px] font-medium text-secondary-800'>
            {t('profile.postal_code')}
          </label>
          <Input
            {...register('zipCode')}
            placeholder={t('profile.enter_postal_code')}
            className='bg-background-third text-white'
            error={errors.zipCode?.message}
          />
        </div>
        {/* Country */}
        <div className='col-span-1'>
          <label className='mb-2 block text-[13px] font-medium text-secondary-800'>
            {t('profile.country')}
          </label>
          <Select
            value={watch('country')}
            onValueChange={(val) =>
              setValue('country', val, {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
          >
            <SelectTrigger className='bg-background-third text-white'>
              <SelectValue placeholder={t('profile.select_country')} />
            </SelectTrigger>
            <SelectContent className='bg-background-third text-white'>
              {countries.map((country) => (
                <SelectItem key={country.value} value={country.value}>
                  {country.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.country && (
            <span className='text-xs text-destructive'>
              {errors.country.message}
            </span>
          )}
        </div>
        {/* City */}
        <div className='col-span-1'>
          <label className='mb-2 block text-[13px] font-medium text-secondary-800'>
            {t('profile.city')}
          </label>
          <Input
            {...register('city')}
            placeholder={t('profile.enter_city')}
            className='bg-background-third text-white'
            error={errors.city?.message}
          />
        </div>
        {/* Phone */}
        <div className='col-span-1'>
          <label className='mb-2 block text-[13px] font-medium text-secondary-800'>
            {t('profile.phone')}
          </label>
          <PhoneInput
            international
            defaultCountry='BR'
            countries={['BR']}
            countrySelectProps={{
              className: cn(
                'bg-background-third text-white pointer-events-none'
              ),
            }}
            value={watch('phoneNumber')}
            onChange={(value) =>
              setValue('phoneNumber', value || '', {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
            className='phone-input-custom rounded-lg border border-input bg-background-third pl-2'
          />
          {errors.phoneNumber && (
            <span className='text-xs text-destructive'>
              {errors.phoneNumber.message}
            </span>
          )}
        </div>
        {/* CPF */}
        <div className='col-span-1'>
          <label className='mb-2 block text-[13px] font-medium text-secondary-800'>
            {t('profile.cpf')}
          </label>
          <Input
            {...register('CPFNumber')}
            placeholder='000.000.000-00'
            className='bg-background-third text-white'
            error={errors.CPFNumber?.message}
            onChange={(e) => {
              const formatted = formatCPF(e.target.value)
              e.target.value = formatted
              register('CPFNumber').onChange(e)
            }}
            maxLength={14}
          />
        </div>
        {/* Save changes button */}
        <div className='col-span-2 mt-3 flex justify-start'>
          <Button
            loading={isSaving}
            variant={isSubmitting ? 'secondary1' : 'default'}
            type='submit'
            className='min-h-11 rounded-[10px]'
            disabled={isSubmitting}
          >
            {t('profile.save_changes')}
          </Button>
        </div>
      </form>
    </Card>
  )
}

export default UserInfoCard

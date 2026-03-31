import { useState } from 'react'
import { toast } from 'sonner'

import {
  changeEmail,
  requestChangeEmail,
  updatePassword,
  updateProfile,
} from '@/api/profile'

import { useUser } from '@/context/user-context'

import { IUpdateProfile } from '@/types/user'

const useProfileSetting = () => {
  const [oldEmailCode, setOldEmailCode] = useState<string>('')
  const [newEmailCode, setNewEmailCode] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const { user, getLoggedInUser } = useUser()

  const handleChangeEmail = async (
    newEmail: string,
    onSuccess?: () => void
  ) => {
    if (loading) return
    setLoading(true)
    try {
      if (!user?.email) {
        toast.error('Old email is required!')
        return
      }
      const code = `${oldEmailCode}${newEmailCode}`
      await changeEmail(newEmail, code)
      getLoggedInUser()
      toast.success('Email was changed successfully!')
      setOldEmailCode('')
      setNewEmailCode('')
      if (typeof onSuccess === 'function') {
        onSuccess()
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('An unexpected error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleRequestChangeEmail = async (newEmail: string) => {
    if (loading) return
    setLoading(true)
    try {
      await requestChangeEmail(newEmail)
      toast.success('Email was requested successfully!')
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('An unexpected error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleUpdatePassword = async (
    oldPassword: string,
    newPassword: string,
    onSuccess?: () => void
  ) => {
    if (loading) return
    setLoading(true)
    try {
      await updatePassword(oldPassword, newPassword)
      getLoggedInUser()
      toast.success('Password was updated successfully!')
      if (typeof onSuccess === 'function') {
        onSuccess()
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('An unexpected error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProfile = async (data: IUpdateProfile) => {
    if (loading) return
    setLoading(true)
    try {
      await updateProfile(data)
      getLoggedInUser()
      toast.success('Profile was updated successfully!')
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('An unexpected error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  return {
    handleChangeEmail,
    handleRequestChangeEmail,
    handleUpdatePassword,
    handleUpdateProfile,
    oldEmailCode,
    newEmailCode,
    setOldEmailCode,
    setNewEmailCode,
    loading,
  }
}

export default useProfileSetting

'use client'
import { useEffect,useState } from 'react'
import { toast } from 'sonner'

import { getUserPreferences, updateUserPreferences } from '@/api/user-settings'

import { TIMEZONES } from '@/lib/profile'

import SecurityLayout from '@/components/templates/security-layout/security-layout'
import { Button } from '@/components/ui/button'
import Radio from '@/components/ui/radio'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function PreferencePage() {
  const [language, setLanguage] = useState('english')
  const [timeZone, setTimeZone] = useState('utc+00:00')
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Load user preferences on mount
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const prefs = await getUserPreferences()
        setLanguage(prefs.language || 'english')
        setTimeZone(prefs.timezone || 'utc+00:00')
        setEmailNotifications(prefs.notifications?.email ?? true)
        setPushNotifications(prefs.notifications?.push ?? false)
      } catch (error) {
        console.error('Failed to load preferences:', error)
        toast.error('Failed to load preferences')
      } finally {
        setLoading(false)
      }
    }

    loadPreferences()
  }, [])

  const handleSaveChanges = async () => {
    try {
      setSaving(true)
      
      await updateUserPreferences({
        language,
        timezone: timeZone,
        notifications: {
          email: emailNotifications,
          push: pushNotifications,
        },
      })
      
      toast.success('Preferences saved successfully!')
    } catch (error: any) {
      toast.error(error.message || 'Failed to save preferences')
    } finally {
      setSaving(false)
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
      <div className='grid grid-cols-1 gap-5 sm:grid-cols-2'>
        <div>
          <h2 className='mb-3 text-base font-bold text-white md:text-xl'>
            Language
          </h2>
          <Select
            value={language}
            onValueChange={(value) => {
              setLanguage(value)
            }}
          >
            <SelectTrigger className='rounded-lg border-none bg-[#17161B] from-[#242327] to-[#151419] px-[15px] py-2 font-satoshi text-sm text-[#ABAAAD] focus:outline-none focus:ring-0 focus:ring-offset-0 [&>svg]:opacity-70'>
              <SelectValue
                placeholder='English'
                className='!font-bold text-[#ABAAAD]'
              />
            </SelectTrigger>
            <SelectContent
              className='min-h-[122px] rounded-lg border-none bg-[#141317] p-[5px] shadow-lg'
              sideOffset={8}
            >
              <div className='flex flex-col gap-2'>
                {['English', 'Português'].map((item) => (
                  <SelectItem
                    hideIndicator
                    key={item}
                    value={item.toLowerCase()}
                    className='min-h-[24px] cursor-pointer rounded py-2 text-white hover:bg-[#1f1f23] focus:bg-[#1f1f23] data-[highlighted]:bg-[#1f1f23]'
                  >
                    <div className='flex w-full flex-1 flex-row justify-between'>
                      <div className='flex-1 font-satoshi text-sm'>{item}</div>
                    </div>
                  </SelectItem>
                ))}
              </div>
            </SelectContent>
          </Select>
        </div>
        <div>
          <h2 className='mb-3 text-base font-bold text-white md:text-xl'>
            Time Zone
          </h2>
          <Select
            value={timeZone}
            onValueChange={(value) => {
              setTimeZone(value)
            }}
          >
            <SelectTrigger className='rounded-lg border-none bg-[#17161B] from-[#242327] to-[#151419] px-[15px] py-2 font-satoshi text-sm text-[#ABAAAD] focus:outline-none focus:ring-0 focus:ring-offset-0 [&>svg]:opacity-70'>
              <SelectValue
                placeholder='English'
                className='!font-bold text-[#ABAAAD]'
              />
            </SelectTrigger>
            <SelectContent
              className='rounded-lg border-none bg-[#141317] p-[5px] shadow-lg'
              sideOffset={8}
            >
              <div className='flex flex-col gap-2'>
                {TIMEZONES.map((item) => (
                  <SelectItem
                    hideIndicator
                    key={item.value}
                    value={item.value.toLowerCase()}
                    className='min-h-[24px] cursor-pointer rounded py-2 text-white hover:bg-[#1f1f23] focus:bg-[#1f1f23] data-[highlighted]:bg-[#1f1f23]'
                  >
                    <div className='flex w-full flex-1 flex-row justify-between'>
                      <div className='flex-1 font-satoshi text-sm'>
                        {item.label}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </div>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className='mt-5'>
        <h2 className='mb-3 text-base font-bold text-white md:text-xl'>
          Subscriptions
        </h2>
        <div className='mt-6 flex flex-col gap-6'>
          <Radio
            name='email'
            label='Email'
            isOn={emailNotifications}
            onChange={setEmailNotifications}
          />
          <Radio
            name='notifications'
            label='Notifications'
            isOn={pushNotifications}
            onChange={setPushNotifications}
          />
        </div>
        <Button 
          variant='secondary1' 
          className='mt-5'
          onClick={handleSaveChanges}
          disabled={saving || loading}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </SecurityLayout>
  )
}

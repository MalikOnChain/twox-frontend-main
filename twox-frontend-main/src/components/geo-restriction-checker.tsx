'use client'

import { useEffect, useRef } from 'react'

import { ModalType, useModal } from '@/context/modal-context'

interface GeoLocationResponse {
  country: string
  countryCode: string
  ip: string
}

const GeoRestrictionChecker = () => {
  const { setType, setIsOpen } = useModal()
  const hasChecked = useRef(false)

  const checkUserLocation = async () => {
    try {
      console.log('🔍 Checking user location...')

      // Try multiple IP geolocation APIs to avoid CORS issues
      const apis = [
        'https://api.ipify.org?format=json',
        'https://api.myip.com',
        'https://ipapi.co/json/',
        'https://ipinfo.io/json',
      ]

      let data: GeoLocationResponse | null = null
      let error: string | null = null

      for (const api of apis) {
        try {
          console.log(`🌐 Trying API: ${api}`)

          const response = await fetch(api, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          })

          if (response.ok) {
            const responseData = await response.json()
            console.log(`✅ API ${api} response:`, responseData)

            // Normalize the response data
            if (
              responseData.country_code ||
              responseData.countryCode ||
              responseData.country
            ) {
              data = {
                country:
                  responseData.country ||
                  responseData.country_name ||
                  'Unknown',
                countryCode:
                  responseData.country_code ||
                  responseData.countryCode ||
                  'Unknown',
                ip: responseData.ip || 'Unknown',
              }
              break
            }
          }
        } catch (apiError) {
          console.warn(`❌ API ${api} failed:`, apiError)
          error = apiError as string
          continue
        }
      }

      if (!data) {
        console.warn('❌ All APIs failed, using fallback check')
        // For development/testing, you can manually set this to test UK detection
        if (process.env.NODE_ENV === 'development') {
          // Simulate UK detection for testing
          data = {
            country: 'United Kingdom',
            countryCode: 'GB',
            ip: '127.0.0.1',
          }
          console.log('🧪 Development mode: Simulating UK location for testing')
        } else {
          console.warn('❌ Could not determine user location')
          return
        }
      }

      console.log('📍 User location data:', data)

      // Check if user is from UK (GB country code)
      if (data.countryCode === 'GB') {
        console.log('🚫 UK user detected - showing AccessRestrictedModal')
        setType(ModalType.AccessRestricted)
        setIsOpen(true)
      } else {
        console.log('✅ User is not from UK - allowing access')
      }
    } catch (error) {
      console.warn('Error checking user location:', error)
    }
  }

  useEffect(() => {
    console.log('🔄 GeoRestrictionChecker mounted')

    // Only check once per session
    if (hasChecked.current) {
      console.log('⏭️ Already checked, skipping...')
      return
    }

    hasChecked.current = true
    console.log('⏰ Setting up location check timer...')

    // Check location after a short delay to ensure the app is loaded
    const timer = setTimeout(() => {
      console.log('🚀 Timer fired, calling checkUserLocation...')
      checkUserLocation()
    }, 1500)

    return () => {
      console.log('🧹 Cleaning up timer...')
      clearTimeout(timer)
    }
  }, []) // Remove dependencies to ensure it runs only once

  return null
}

export default GeoRestrictionChecker

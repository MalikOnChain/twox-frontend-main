'use client'

import { useEffect, useRef } from 'react'

import { getBrowserApiBaseUrl } from '@/lib/api-base-url'

export default function UTMTracker() {
  const hasTracked = useRef(false)

  const trackUTM = async () => {
    const urlParams = new URLSearchParams(window.location.search)
    const utmSource =
      urlParams.get('utm_source') || localStorage.getItem('utm_source')
    const utmCampaign =
      urlParams.get('utm_campaign') || localStorage.getItem('utm_campaign')

    if (utmSource && utmCampaign) {
      localStorage.setItem('utm_source', utmSource)
      localStorage.setItem('utm_campaign', utmCampaign)
    }

    if (!utmSource || !utmCampaign) {
      return
    }

    const baseUrl = getBrowserApiBaseUrl()
    if (!baseUrl) return

    const endpoint = '/utm-visitor'
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        utm_source: utmSource,
        utm_campaign: utmCampaign,
      }),
      cache: 'no-store',
    })
    return response
  }

  useEffect(() => {
    if (hasTracked.current) return
    hasTracked.current = true

    trackUTM()
  }, [])

  return null
}

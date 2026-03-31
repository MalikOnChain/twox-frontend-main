import { useCallback } from 'react'

type StorageType = 'localStorage' | 'sessionStorage' | 'cookie'

interface StorageProps {
  key: string
  type?: StorageType
  expires?: number // Cookie expiration in days
}

const useStorage = ({
  key,
  type = 'localStorage',
  expires = 7, // Default 7 days for cookies
}: StorageProps) => {
  const getCookie = useCallback(() => {
    try {
      const cookie = document.cookie
        .split('; ')
        .find((row) => row.startsWith(`${key}=`))
      return cookie
        ? JSON.parse(decodeURIComponent(cookie.split('=')[1]))
        : null
    } catch (error) {
      console.error('Error reading cookie:', error)
      return null
    }
  }, [key])

  const setCookie = useCallback(
    (value: unknown) => {
      try {
        const date = new Date()
        date.setDate(date.getDate() + expires)
        const cookieValue = encodeURIComponent(JSON.stringify(value))
        document.cookie = `${key}=${cookieValue}; expires=${date.toUTCString()}; path=/`
      } catch (error) {
        console.error('Error setting cookie:', error)
      }
    },
    [key, expires]
  )

  const removeCookie = useCallback(() => {
    try {
      document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`
    } catch (error) {
      console.error('Error removing cookie:', error)
    }
  }, [key])

  const getValue = useCallback(() => {
    try {
      if (type === 'cookie') {
        return getCookie()
      }
      const item = window[type].getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error('Error getting value:', error)
      return null
    }
  }, [key, type, getCookie])

  const setValue = useCallback(
    (value: unknown) => {
      try {
        if (type === 'cookie') {
          setCookie(value)
          return
        }
        window[type].setItem(key, JSON.stringify(value))
      } catch (error) {
        console.error('Error setting value:', error)
      }
    },
    [key, type, setCookie]
  )

  const removeValue = useCallback(() => {
    try {
      if (type === 'cookie') {
        removeCookie()
        return
      }
      window[type].removeItem(key)
    } catch (error) {
      console.error('Error removing value:', error)
    }
  }, [key, type, removeCookie])

  const clean = useCallback(() => {
    try {
      if (type === 'cookie') {
        document.cookie.split(';').forEach((cookie) => {
          const [name] = cookie.split('=')
          document.cookie = `${name.trim()}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`
        })
        return
      }
      window[type].clear()
    } catch (error) {
      console.error('Error clearing storage:', error)
    }
  }, [type])

  return {
    getValue,
    setValue,
    removeValue,
    clean,
  }
}

export default useStorage

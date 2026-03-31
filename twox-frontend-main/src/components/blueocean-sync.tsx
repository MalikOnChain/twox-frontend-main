'use client'

import { useEffect, useState } from 'react'

import { syncBlueOceanGames } from '@/api/game'

const BlueOceanSync = () => {
  const [isSynced, setIsSynced] = useState(false)

  useEffect(() => {
    const syncGames = async () => {
      try {
        // Check if we've already synced in this session
        const hasSynced = sessionStorage.getItem('blueocean-synced')
        if (hasSynced) {
          setIsSynced(true)
          return
        }

        console.log('🔄 Syncing BlueOcean games...')
        const result = await syncBlueOceanGames()
        
        if (result.success) {
          console.log(`✅ BlueOcean sync successful: ${result.syncedCount} games synced`)
          sessionStorage.setItem('blueocean-synced', 'true')
          setIsSynced(true)
        } else {
          console.error('❌ BlueOcean sync failed:', result.message)
        }
      } catch (error) {
        console.error('❌ BlueOcean sync error:', error)
      }
    }

    // Only sync if we haven't synced yet
    if (!isSynced) {
      syncGames()
    }
  }, [isSynced])

  // This component doesn't render anything
  return null
}

export default BlueOceanSync

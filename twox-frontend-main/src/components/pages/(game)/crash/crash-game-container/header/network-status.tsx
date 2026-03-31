import React from 'react'

import NetworkStatusIcon from '@/assets/games/network-status.svg'

const NetworkStatus = () => {
  return (
    <div className='network-status hidden items-center sm:flex'>
      <span className='hidden text-xl font-semibold 2xl:flex'>
        Network Status
      </span>
      <NetworkStatusIcon />
    </div>
  )
}

export default NetworkStatus

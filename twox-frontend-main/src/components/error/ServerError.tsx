import React from 'react'

const ServerError = ({ error }: { error: string }) => {
  return (
    <div className='mx-auto flex h-[100dvh] w-screen max-w-lg items-center justify-center'>
      <h3 className='text-center text-2xl font-bold'>{error}</h3>
    </div>
  )
}

export default ServerError

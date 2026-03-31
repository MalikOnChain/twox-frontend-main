import React from 'react'

const SecurityLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='max-w-4xl rounded-2xl border border-mirage p-6'>
      {children}
    </div>
  )
}

export default SecurityLayout

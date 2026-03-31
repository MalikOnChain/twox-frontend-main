import Link from 'next/link'
import React from 'react'

const PreviewPage = () => {
  return (
    <div className='flex h-screen w-screen gap-4'>
      <Link href='preview/colors' className='hover:text-primary'>
        Colors
      </Link>
      <Link href='preview/components' className='hover:text-primary'>
        Components
      </Link>
      <Link href='preview/modals' className='hover:text-primary'>
        Modals
      </Link>
    </div>
  )
}

export default PreviewPage

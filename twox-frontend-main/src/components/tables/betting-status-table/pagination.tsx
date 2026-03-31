import { ChevronLeft, ChevronRight } from 'lucide-react'
import React, { memo } from 'react'

const Pagination = () => {
  return (
    <div className='flex items-center justify-center gap-1 py-4'>
      <button className='p-2 text-gray-400 hover:text-white'>
        <ChevronLeft className='h-4 w-4' />
      </button>
      <button className='h-8 w-8 rounded bg-[#5D5FEF] text-white'>1</button>
      <button className='h-8 w-8 rounded text-gray-400 hover:text-white'>
        2
      </button>
      <span className='text-gray-400'>...</span>
      <button className='h-8 w-8 rounded text-gray-400 hover:text-white'>
        9
      </button>
      <button className='h-8 w-8 rounded text-gray-400 hover:text-white'>
        10
      </button>
      <button className='p-2 text-gray-400 hover:text-white'>
        <ChevronRight className='h-4 w-4' />
      </button>
    </div>
  )
}

export default memo(Pagination)

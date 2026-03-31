'use client'

import React from 'react'

import config from '../../../../../tailwind.config'

interface ColorValue {
  DEFAULT?: string
  foreground?: string
  [key: string]: string | undefined
}

const ColorSwatch: React.FC<{
  name: string
  value: string
}> = ({ name, value }) => (
  <div className='space-y-2'>
    <div
      className='h-16 rounded-md border border-slate-200'
      style={{ background: value }}
    />
    <div className='space-y-1'>
      <div className='text-sm font-medium capitalize'>{name}</div>
      <div className='break-all text-xs text-slate-500'>{value}</div>
    </div>
  </div>
)

const ColorSection: React.FC<{
  name: string
  value: string | ColorValue
}> = ({ name, value }) => {
  if (typeof value === 'object' && value !== null) {
    return (
      <div className='space-y-2'>
        <h3 className='text-lg font-semibold capitalize'>{name}</h3>
        <div className='grid grid-cols-1 gap-4 pl-4 md:grid-cols-2 lg:grid-cols-3'>
          {Object.entries(value).map(([key, nestedValue]) => (
            <ColorSwatch
              key={key}
              name={key === 'DEFAULT' ? name : `${name}-${key}`}
              value={nestedValue as string}
            />
          ))}
        </div>
      </div>
    )
  }

  return <ColorSwatch name={name} value={value} />
}

const ColorPreviewPage = () => {
  const colors = config.theme?.extend?.colors
  const gradients = config.theme?.extend?.backgroundImage

  if (!colors && !gradients) {
    return <div className='p-8'>No color configuration found</div>
  }

  return (
    <div className='mx-auto max-w-7xl space-y-8 p-8'>
      <h1 className='mb-8 text-2xl font-bold'>Tailwind Colors</h1>

      {/* Colors */}
      {colors && (
        <div className='space-y-8'>
          {Object.entries(colors).map(([name, value]) => (
            <ColorSection
              key={name}
              name={name}
              value={value as string | ColorValue}
            />
          ))}
        </div>
      )}

      {/* Gradients */}
      {gradients && (
        <div className='space-y-4'>
          <h2 className='text-base font-bold text-white md:text-xl'>
            Background Gradients
          </h2>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {Object.entries(gradients).map(([name, value]) => (
              <ColorSwatch key={name} name={name} value={value as string} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ColorPreviewPage

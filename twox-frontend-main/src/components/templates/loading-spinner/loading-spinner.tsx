import React from 'react'

import { cn } from '@/lib/utils'

type SpinnerSize = 'sm' | 'default' | 'lg'

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: SpinnerSize
}

const sizeClasses: Record<SpinnerSize, string> = {
  sm: 'w-6 h-6',
  default: 'w-24 h-24',
  lg: 'w-32 h-32',
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  className,
  size = 'default',
  ...props
}) => {
  return (
    <div
      className={cn(
        'relative animate-[spin_1s_linear_infinite]',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      <svg
        className='h-full w-full'
        viewBox='0 0 100 100'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <circle
          cx='50'
          cy='50'
          r='45'
          strokeWidth='10'
          className='stroke-[url(#spinner-gradient)]'
        />
        <defs>
          <linearGradient
            id='spinner-gradient'
            x1='0%'
            y1='0%'
            x2='100%'
            y2='0%'
            gradientUnits='userSpaceOnUse'
            gradientTransform='rotate(90, 0.5, 0.5)'
          >
            <stop
              offset='0%'
              style={{
                stopColor: 'hsl(var(--primary-500))',
                stopOpacity: '1',
              }}
            />
            <stop
              offset='50%'
              style={{
                stopColor: 'hsl(var(--primary-500))',
                stopOpacity: '0.5',
              }}
            />
            <stop
              offset='100%'
              style={{
                stopColor: 'hsl(var(--primary-500))',
                stopOpacity: '0',
              }}
            />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}

export default LoadingSpinner

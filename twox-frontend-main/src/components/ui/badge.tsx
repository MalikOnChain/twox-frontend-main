import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-1.5 py-1 leading-[1] text-[10px] font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80',
        success:
          'bg-success/[0.12] border-none text-success drop-shadow-0-12-0-success',
        gold: 'bg-gold/[0.12] border-none text-gold-500 drop-shadow-0-12-0-gold',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'bg-error/[0.12] border-transparent text-error drop-shadow-0-12-0-error',
        outline: 'text-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, children, ...props }: BadgeProps) {
  if (variant === 'success') {
    return (
      <div className='flex overflow-hidden rounded-md'>
        <div className={cn(badgeVariants({ variant }), className)} {...props}>
          {children}
        </div>
      </div>
    )
  }

  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {children}
    </div>
  )
}

export { Badge, badgeVariants }

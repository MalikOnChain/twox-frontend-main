import * as TogglePrimitive from '@radix-ui/react-toggle'
import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/lib/utils'

const toggleVariants = cva(
  'group/toggle rounded-full relative transition-colors disabled:pointer-events-none aspect-[9/4]',
  {
    variants: {
      variant: {
        default: 'bg-secondary-600',
      },
      size: {
        default: 'h-10',
        sm: 'h-6',
        lg: 'h-11',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

const toggleIconVariants = cva('absolute', {
  variants: {
    variant: {
      default:
        'flex transition-all duration-300 items-center justify-center rounded-full bg-primary text-white border-2 border-white/[.18] -top-[2px] group-data-[state=off]/toggle:left-0 group-data-[state=on]/toggle:translate-x-[calc(100%-2px)]',
    },
    size: {
      default: 'h-[42px] w-[42px]',
      sm: 'h-[28px] w-[28px]',
      lg: 'h-[46px] w-[46px]',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
})

interface ToggleProps
  extends React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root>,
    VariantProps<typeof toggleVariants> {
  icon?: React.ReactNode
}

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  ToggleProps
>(({ className, variant, size, icon, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size }), className)}
    {...props}
  >
    {icon && (
      <div className={toggleIconVariants({ variant, size })}>{icon}</div>
    )}
  </TogglePrimitive.Root>
))

Toggle.displayName = TogglePrimitive.Root.displayName

export { Toggle, toggleVariants }

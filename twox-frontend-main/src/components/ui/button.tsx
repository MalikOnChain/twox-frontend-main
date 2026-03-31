'use client'
import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import * as React from 'react'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex border items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-background-sixth text-primary-text hover:bg-background-sixth-hover active:bg-background-sixth-active font-satoshi',
        'dark-primary':
          'bg-dark-primary border-charcoal-grey text-primary-text hover:bg-dark-primary-600 active:bg-primary',
        secondary1:
          'bg-white text-cinder border border-dawn-pink font-satoshi font-medium text-sm',
        secondary2:
          'bg-button-gradient text-white font-satoshi border border-arty-red disabled:bg-button-gradient-disabled disabled:cursor-not-allowed disabled:opacity-90 hover:bg-button-gradient-hover transition-colors duration-500 ease-out',
        // 'transition-all ease-linear bg-button-gradient text-white font-satoshi border border-arty-red disabled:bg-button-gradient-disabled disabled:cursor-not-allowed disabled:opacity-90 hover:bg-button-gradient-hover',
        outline:
          'bg-white bg-opacity-[0.08]  text-foreground hover:bg-opacity-[16px] backdrop-blur-[4px] border-white/10 active:bg-foreground active:text-background',
        icon: 'bg-secondary-600 text-secondary-text border-secondary-550 hover:text-foreground hover:bg-secondary hover:border-secondary-450 active:bg-primary active:text-secondary-foreground active:border-white/15',
        link: 'text-primary underline-offset-4 hover:underline border-none',
        'gradient-border':
          'gradient-border-button text-primary-text font-satoshi py-2 !px-[13px] gap-2 rounded-lg font-medium text-sm hover:text-arty-red',
        none: 'bg-transparent border-none',
      },
      size: {
        default: 'h-10 py-2 px-4 md:px-5 md:py-2.5 max-md:text-xs',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 text-base px-8',
        icon: 'h-10 w-10 p-0 [&_svg]:size-[18px] md:[&_svg]:size-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {loading ? (
          <div className='z-[2] inline-flex h-full items-center justify-center gap-2'>
            <span className='invisible opacity-0'>{children}</span>
            <Loader2 className='absolute animate-spin' aria-hidden='true' />
          </div>
        ) : (
          children
        )}
      </Comp>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }

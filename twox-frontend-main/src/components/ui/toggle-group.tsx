import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group'
import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/lib/utils'

/** Start of ToggleGroup */
const toggleGroupVariants = cva('inline-flex items-center', {
  variants: {
    variant: {
      default: 'font-medium rounded-lg bg-secondary-700',
      secondary: 'custom-scrollbar -webkit-overflow-scrolling-touch',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

type ToggleGroupProps = React.ComponentPropsWithoutRef<
  typeof ToggleGroupPrimitive.Root
> &
  VariantProps<typeof toggleGroupVariants>

const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  ToggleGroupProps
>(({ className, variant, ...props }, ref) => (
  <ToggleGroupPrimitive.Root
    ref={ref}
    className={cn(toggleGroupVariants({ variant }), className)}
    {...props}
  />
))

ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName
/** End of ToggleGroup */

/** Start of ToggleGroupItem */
const toggleGroupItemVariants = cva(
  'group/toggle-group-item relative h-10 rounded-none text-muted-foreground hover:text-foreground data-[state=on]:text-foreground transition-all duration-300 border-none font-normal data-[state=on]:font-medium text-sm outline-none [&[tabindex="0"]]:text-foreground',
  {
    variants: {
      variant: {
        default: 'px-4',
        secondary:
          'rounded-full data-[state=on]:bg-success-100 data-[state=on]:px-4',
        custom: 'px-4',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

interface ToggleGroupItemProps
  extends React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item>,
    VariantProps<typeof toggleGroupItemVariants> {}

const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  ToggleGroupItemProps
>(({ className, children, variant = 'default', ...props }, ref) => (
  <ToggleGroupPrimitive.Item
    ref={ref}
    className={cn(toggleGroupItemVariants({ variant }), className)}
    {...props}
  >
    {variant === 'default' && (
      <div className='absolute inset-[-1px] z-[0] rounded-lg bg-secondary-400 opacity-0 group-data-[state=on]/toggle-group-item:opacity-100'></div>
    )}
    {variant === 'custom' && (
      <div className='absolute inset-[-1px] z-[0] !rounded-lg border border-arty-red bg-button-gradient opacity-0 group-data-[state=on]/toggle-group-item:opacity-100'></div>
    )}
    <div className='relative z-[1] font-satoshi text-sm font-medium'>
      {children}
    </div>
  </ToggleGroupPrimitive.Item>
))
ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName
/** End of ToggleGroupItem */

export { ToggleGroup, ToggleGroupItem }

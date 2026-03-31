'use client'

import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { type VariantProps, cva } from 'class-variance-authority'
import { ChevronDown } from 'lucide-react'
import * as React from 'react'

import { cn } from '@/lib/utils'

const Accordion = AccordionPrimitive.Root

const accordionItemVariants = cva('', {
  variants: {
    variant: {
      default: 'border-b',
      primary:
        'bg-background-secondary data-[state=open]:bg-secondary-600 rounded-xl py-[22px] px-[18px]',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

interface AccordionItemProps
  extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>,
    VariantProps<typeof accordionItemVariants> {}

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  AccordionItemProps
>(({ className, variant, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn(accordionItemVariants({ variant }), className)}
    {...props}
  />
))
AccordionItem.displayName = 'AccordionItem'

// Start Accordion Trigger
const accordionTriggerVariants = cva(
  'group/trigger relative flex flex-1 items-center justify-between text-left text-sm font-medium transition-all [&[data-state=open]>.expand-icon]:rotate-180',
  {
    variants: {
      variant: {
        default: 'hover:underline',
        primary:
          'text-foreground text-[16px] font-bold leading-[20px] tracking-normal data-[state=open]:mb-3',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

interface AccordionTriggerProps
  extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>,
    VariantProps<typeof accordionTriggerVariants> {
  expandIcon?: React.ReactNode
}

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  AccordionTriggerProps
>(({ className, variant, children, expandIcon, ...props }, ref) => (
  <AccordionPrimitive.Header className='flex'>
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(accordionTriggerVariants({ variant }), className)}
      {...props}
    >
      {children}
      {expandIcon || (
        <ChevronDown className='expand-icon h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200' />
      )}
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName
// End Accordion Trigger

const accordionContentVariants = cva(
  'overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down',
  {
    variants: {
      variant: {
        default: 'pb-4 pt-0',
        primary: 'text-secondary-text text-xs',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

interface AccordionContentProps
  extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>,
    VariantProps<typeof accordionContentVariants> {}

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  AccordionContentProps
>(({ className, variant, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn(accordionContentVariants({ variant }), className)}
    {...props}
  >
    {children}
  </AccordionPrimitive.Content>
))
AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger }

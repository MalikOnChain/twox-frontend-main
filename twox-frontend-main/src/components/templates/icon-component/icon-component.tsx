import { type VariantProps, cva } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const iconVariants = cva(
  'flex justify-center items-center rounded-[6px] w-10 h-10',
  {
    variants: {
      variant: {
        default: '',
        gold: 'bg-gold/[.12] [&_span]:text-gold [&_span]:drop-shadow-0-12-0-gold',
        red: 'bg-[#F8043F1A] [&_span]:text-red [&_span]:drop-shadow-0-12-0-red',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

interface IconComponentProps extends VariantProps<typeof iconVariants> {
  icon: React.ReactNode
  className?: string
}

const IconComponent = ({ icon, className, variant }: IconComponentProps) => {
  return (
    <div className={cn(iconVariants({ variant }), className)}>
      <span className='flex h-6 w-6 items-center justify-center'>{icon}</span>
    </div>
  )
}

export default IconComponent

import { ArrowRight } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface CTAButtonProps {
  children: React.ReactNode
  onClick?: () => void
  href?: string
  variant?: 'default' | 'dark-primary' | 'secondary1' | 'secondary2' | 'outline' | 'icon' | 'link' | 'gradient-border' | 'none'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

export default function CTAButton({
  children,
  onClick,
  href,
  variant = 'secondary2',
  size = 'lg',
}: CTAButtonProps) {
  const buttonContent = (
    <Button variant={variant} size={size} className='flex items-center gap-2' onClick={onClick}>
      <span>{children}</span>
      <ArrowRight className='h-5 w-5' />
    </Button>
  )

  if (href) {
    return <a href={href}>{buttonContent}</a>
  }

  return buttonContent
}


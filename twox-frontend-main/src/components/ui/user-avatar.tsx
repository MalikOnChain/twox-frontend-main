'use client'

import { cn } from '@/lib/utils'

import HexagonAvatar from '@/components/templates/hexagon-avatar/hexagon-avatar'

interface IUserAvatarProps {
  className?: {
    avatarClassName?: string
    levelClassName?: string
  }
  src: string
  alt?: string
  level?: string
  children?: React.ReactNode
}

const UserAvatar = ({
  className,
  src,
  alt,
  level,
  children,
}: IUserAvatarProps) => {
  return (
    <div className='relative z-10 mb-2 h-fit'>
      <HexagonAvatar
        src={src}
        alt={alt || 'avatar'}
        className={cn('hex-alt object-cover', className?.avatarClassName)}
      />

      {/* user level badge */}
      {level && (
        <div className='absolute bottom-1 left-1/2 z-20 -translate-x-1/2 translate-y-1/2'>
          <div className='hex-mask absolute inset-[-1px] bg-white/10' />

          <div
            className={cn(
              'hex-alt flex items-center justify-center',
              className?.levelClassName
            )}
          >
            {level}
          </div>
        </div>
      )}

      {children && children}
    </div>
  )
}

export default UserAvatar

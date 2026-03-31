'use client'
import { useMemo } from 'react'

import { cn } from '@/lib/utils'

import { LinkedState } from '@/types/user'

interface AccountCardProps {
  onClick?: (state: LinkedState) => void
  state: LinkedState
  icon: React.ReactNode
  title: string
  description?: string
  linkedAt?: string
}

function AccountCard({
  onClick,
  state,
  icon,
  title,
  description,
  linkedAt,
}: AccountCardProps) {
  const handleClick = () => {
    if (typeof onClick === 'function') {
      onClick(state)
    }
  }

  const desc = useMemo(() => {
    if (description) {
      return description
    }
    if (state === LinkedState.LINK) {
      return 'Linked at ' + linkedAt
    }
    return 'Not linked'
  }, [state, description, linkedAt])

  return (
    <button
      className='group/account-card relative box-border flex items-center space-x-2 rounded-lg bg-secondary-600 p-[10px] hover:cursor-pointer hover:disabled:cursor-not-allowed'
      data-state={state}
      onClick={handleClick}
      disabled={state === LinkedState.LINK}
    >
      <div className=''>{icon}</div>
      <div className='flex flex-1 flex-col items-start space-y-1'>
        <div className='text-xs text-foreground drop-shadow-0-12-0-success group-data-[state="active"]/crypto-token:text-success'>
          {title}
        </div>
        <div className='text-xs text-muted-foreground'>{desc}</div>
      </div>
      <div
        className={cn(
          'absolute right-[10px] top-[10px] flex h-5 items-center justify-center self-start overflow-hidden rounded-[6px] px-[6px] py-1',
          state === 'link' ? 'bg-success/[.12]' : 'bg-error/[.12]'
        )}
      >
        <span
          className={cn(
            'text-[10px] font-bold capitalize',
            state === 'link'
              ? 'text-success drop-shadow-0-12-0-success'
              : 'drop-shadow-0-12-0-error text-error'
          )}
        >
          {state}
        </span>
      </div>
    </button>
  )
}

export default AccountCard

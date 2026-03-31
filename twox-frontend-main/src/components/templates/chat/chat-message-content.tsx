import React, { memo, ReactNode } from 'react'

import { cn } from '@/lib/utils'

import ChatUser from '@/components/templates/chat/chat-user'

import { Message } from '@/types/chat'

const ChatMessageContent = ({
  message,
  children,
}: {
  message: Message
  children: ReactNode
}) => {
  return (
    <div className='flex flex-1 flex-col gap-[5px]'>
      <ChatUser
        currentRank={message.currentRank}
        isAdmin={message.isAdmin || false}
        timestamp={message.createdAt}
        username={message.username}
      />
      <div
        className={cn(
          `w-fit flex-1 break-all rounded-lg rounded-tl-none text-sm text-gray-200`,
          { 'border border-error-500': message.isAdmin }
        )}
      >
        {children}
      </div>
    </div>
  )
}

export default memo(ChatMessageContent)

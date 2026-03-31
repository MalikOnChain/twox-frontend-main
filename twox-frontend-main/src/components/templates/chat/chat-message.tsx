import { memo } from 'react'

import ChatAvatar from '@/components/templates/chat/chat-avatar'
import ChatMessageContent from '@/components/templates/chat/chat-message-content'

import { Message } from '@/types/chat'

interface ChatMessageProps {
  message: Message
  isMine?: boolean
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  return (
    <div
      key={message._id || message.id}
      className='mb-2 flex w-full gap-1 rounded-lg bg-secondary p-2'
    >
      <ChatAvatar
        avatar={message.avatar}
        username={message.username}
        currentRank={message.currentRank}
        currentLevel={message.currentLevel}
      />
      <ChatMessageContent message={message}>
        {message.message}
      </ChatMessageContent>
    </div>
  )
}

export default memo(ChatMessage)

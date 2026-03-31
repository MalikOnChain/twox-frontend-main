import { memo } from 'react'

import { useUser } from '@/context/user-context'

import ChatGifMessage from '@/components/templates/chat/chat-gif-message'
import ChatMessage from '@/components/templates/chat/chat-message'

import { Message } from '@/types/chat'

const ChatMessageContainer = ({ messages }: { messages: Message[] }) => {
  const { user } = useUser()

  return (
    <>
      {messages.map((message) => {
        if (message.isGif) {
          return (
            <ChatGifMessage
              key={message._id || message.id}
              message={message}
              isMine={message.senderId !== user?._id}
            />
          )
        }

        return <ChatMessage key={message._id || message.id} message={message} />
      })}
    </>
  )
}

export default memo(ChatMessageContainer)

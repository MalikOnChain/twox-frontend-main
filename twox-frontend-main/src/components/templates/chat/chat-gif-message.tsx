import Image from 'next/image'
import { memo, useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

import { getGifById, GiphyGif } from '@/api/giphy'

import { ApiError } from '@/lib/error-handler'

import ChatAvatar from '@/components/templates/chat/chat-avatar'
import ChatMessageContent from '@/components/templates/chat/chat-message-content'
import { Skeleton } from '@/components/ui/skeleton'

import { Message } from '@/types/chat'

const ChatGifMessage = ({ message }: { message: Message; isMine: boolean }) => {
  const [gif, setGif] = useState<GiphyGif | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchGif = useCallback(async () => {
    if (!message.gifId) {
      return
    }

    try {
      const response = await getGifById(message.gifId)
      setGif(response.data)
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message)
      } else {
        toast.error('Failed to fetch gif')
      }
    } finally {
      setIsLoading(false)
    }
  }, [message.gifId])

  useEffect(() => {
    if (!message.gifId) {
      return
    }
    fetchGif()
  }, [message, fetchGif])

  return (
    <div
      key={message._id || message.id}
      className='mb-2 flex w-fit gap-1 rounded-lg bg-secondary p-2'
    >
      <ChatAvatar
        avatar={message.avatar}
        username={message.username}
        currentRank={message.currentRank}
        currentLevel={message.currentLevel}
      />
      <ChatMessageContent message={message}>
        <div className='h-[150px]'>
          {isLoading && !gif && (
            <Skeleton className='bg-secondary-300 size-[150px]' />
          )}

          {gif && (
            <Image
              src={gif?.images?.fixed_height.url}
              alt={message.message}
              className='h-[150px] w-auto object-contain'
              width={0}
              height={0}
              unoptimized
              sizes='100vw'
            />
          )}
        </div>
      </ChatMessageContent>
    </div>
  )
}

export default memo(ChatGifMessage)

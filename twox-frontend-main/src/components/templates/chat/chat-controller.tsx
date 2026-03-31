import { Dispatch, memo, SetStateAction } from 'react'

import { cn } from '@/lib/utils'
import { useMediaQuery } from '@/hooks/features/use-media-query'

import ChatInput from '@/components/templates/chat/chat-input'
import { Button } from '@/components/ui/button'

// import EmojiIcon from '@/assets/emoji.svg'
import EmojiSmileIcon from '@/assets/emoji-smile.svg'
import SendIcon from '@/assets/send.svg'

interface ChatControllerProps {
  message: string
  onMessageChange: Dispatch<SetStateAction<string>>
  onSendMessage: () => boolean
  onGifVisible: () => void
}

const ChatController = ({
  message,
  onMessageChange,
  onSendMessage,
  onGifVisible,
}: ChatControllerProps) => {
  const isDesktop = useMediaQuery('xl')
  return (
    <div
      className={cn('flex items-center gap-2 p-2.5', {
        'bg-background-secondary': isDesktop,
        'bg-transparent': !isDesktop,
      })}
    >
      <div className='flex w-full items-center gap-2 rounded-[8px] border-2 border-secondary-600 p-2'>
        {/* <EmojiIcon className='hover:cursor-pointer hover:fill-slate-50' /> */}
        <ChatInput
          message={message}
          setMessage={(message) => onMessageChange(message)}
          sendMessage={onSendMessage}
        />

        <EmojiSmileIcon
          onClick={onGifVisible}
          className='size-3.5 cursor-pointer'
        />

        <Button
          className='h-[30px] w-[30px] p-0 md:p-0'
          onClick={onSendMessage}
        >
          <SendIcon />
        </Button>
      </div>
    </div>
  )
}

export default memo(ChatController)

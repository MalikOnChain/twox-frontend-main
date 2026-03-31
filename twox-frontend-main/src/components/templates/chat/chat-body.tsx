'use client'

import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import InfiniteScroll from 'react-infinite-scroll-component'

import { GiphyGif } from '@/api/giphy'

import useChat from '@/context/features/chat-context'

import { cn } from '@/lib/utils'
import { useMediaQuery } from '@/hooks/features/use-media-query'

import ChatMessageContainer from '@/components/templates/chat/chat-message-container'
import GifSdk from '@/components/templates/gif-sdk'
import Trivia from '@/components/templates/trivia'

import { Message } from '@/types/chat'

export type ChatBodyRef = {
  scrollToBottom: () => void
}

interface ChatBodyProps {
  onSendGif: (gifId: string) => void
  isGifVisible: boolean
  setIsGifVisible: (isGifVisible: boolean) => void
  isTriviaVisible: boolean
  setIsTriviaVisible: (isGifVisible: boolean) => void
  roomId: string
  messages: Message[]
  hasMore: boolean
}

const ChatBody = forwardRef<ChatBodyRef, ChatBodyProps>(
  (
    {
      onSendGif,
      isGifVisible,
      setIsGifVisible,
      isTriviaVisible,
      setIsTriviaVisible,
      roomId,
      messages,
      hasMore,
    },
    ref
  ) => {
    const { isOpen: isVisible, loadMoreMessages } = useChat()
    const [isMounted, setIsMounted] = useState<boolean>(false)
    const isDesktop = useMediaQuery('xl')
    const [messageCount, setMessageCount] = useState(0)
    const [isLoading, setIsLoading] = useState(false)

    const handleGifSelect = (gif: GiphyGif) => {
      setIsGifVisible(false)
      onSendGif(gif._id || '')
    }

    useImperativeHandle(ref, () => ({
      scrollToBottom: () => {
        if (containerRef.current) {
          containerRef.current.scrollTo({
            top: containerRef.current.scrollHeight,
          })
        }
      },
    }))

    const containerRef = useRef<HTMLDivElement>(null)

    // Improved scroll behavior
    useEffect(() => {
      if (containerRef.current) {
        // Add a small delay to ensure DOM updates are complete
        setTimeout(() => {
          if (containerRef.current) {
            // For iOS Safari
            const scrollHeight = containerRef.current.scrollHeight
            const height = containerRef.current.clientHeight
            const maxScrollTop = scrollHeight - height

            containerRef.current.scrollTo({
              top: maxScrollTop,
            })
          }
        }, 100)
      }
    }, [isVisible])

    // Handle mounting state for client-side DOM references
    useEffect(() => {
      setIsMounted(true)
      return () => setIsMounted(false)
    }, [])

    const handleLoadMore = useCallback(() => {
      if (messages.length > 0) {
        setIsLoading(true)
        loadMoreMessages(roomId, new Date(messages[0].createdAt))
      }
    }, [roomId, messages, loadMoreMessages])

    useEffect(() => {
      if (messages.length > messageCount) {
        setIsLoading(false)
        setMessageCount(messages.length)
      }
    }, [messages, messageCount])

    return (
      <div
        ref={containerRef}
        id='chat-scroll-container'
        className={cn(
          'custom-scrollbar -webkit-overflow-scrolling-touch relative flex flex-1 flex-col-reverse space-y-3 overflow-y-auto p-2.5',
          {
            'p-4': !isDesktop,
          }
        )}
      >
        <InfiniteScroll
          dataLength={messages.length}
          next={handleLoadMore}
          hasMore={hasMore && !isLoading}
          inverse={true}
          loader={<></>}
          scrollableTarget='chat-scroll-container'
          className='flex flex-col'
        >
          {isLoading && (
            <h4 className='text-center text-sm'>Loading More...</h4>
          )}
          <ChatMessageContainer messages={messages} />

          {/* Use createPortal to render GifSdk outside the scrollable container */}
          {isGifVisible &&
            isMounted &&
            createPortal(
              <>
                <GifSdk
                  className='fixed bottom-[9rem] right-1 z-50 w-[280px] rounded-md border border-white/10 bg-background-secondary md:bottom-[6rem] md:w-[300px]'
                  onSelect={handleGifSelect}
                  setIsGifVisible={setIsGifVisible}
                />
                <div
                  className='fixed inset-0 z-[49] h-screen w-screen'
                  onClick={() => setIsGifVisible(false)}
                />
              </>,
              document.body
            )}
          {isTriviaVisible &&
            createPortal(
              <>
                <Trivia
                  className='fixed bottom-[9rem] right-1 z-50 w-[280px] rounded-md border border-white/10 bg-background-secondary md:bottom-[6rem] md:w-[300px]'
                  setIsTriviaVisible={setIsTriviaVisible}
                />
                <div
                  className='fixed inset-0 z-40 h-screen w-screen'
                  onClick={() => setIsTriviaVisible(false)}
                />
              </>,
              document.body
            )}
        </InfiniteScroll>
      </div>
    )
  }
)

ChatBody.displayName = 'ChatBody'

export default memo(ChatBody)

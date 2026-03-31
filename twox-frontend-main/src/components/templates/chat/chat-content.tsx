import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'

import useChat from '@/context/features/chat-context'
import { AUTH_TABS, ModalType, useModal } from '@/context/modal-context'
import { useUser } from '@/context/user-context'

import { useMediaQuery } from '@/hooks/features/use-media-query'

import ChatBody, { ChatBodyRef } from './chat-body'
import ChatController from './chat-controller'
import ChatHeader from './chat-header'

const ChatContent = memo(() => {
  const roomId = useMemo(() => 'general', [])
  const { isAuthenticated } = useUser()
  const { isOpen, sendMessage, rooms } = useChat()
  const [message, setMessage] = useState('')
  const [isGifVisible, setIsGifVisible] = useState(false)
  const [isTriviaVisible, setIsTriviaVisible] = useState(false)
  const { setIsOpen, setType, setActiveTab } = useModal()
  const { roomStatus } = useChat()
  const chatBodyRef = useRef<ChatBodyRef>(null)
  const memberCount = useMemo(
    () => roomStatus[roomId]?.memberCount || 0,
    [roomStatus, roomId]
  )
  const isDesktop = useMediaQuery('xl+1')

  const handleOpenAuthModal = useCallback(() => {
    setIsOpen(true)
    setType(ModalType.Auth)
    setActiveTab(AUTH_TABS.signin)
  }, [setIsOpen, setType, setActiveTab])

  const handleSendMessage = useCallback(() => {
    if (!isAuthenticated) {
      handleOpenAuthModal()
      setMessage('')
      return false
    }

    if (!message.trim()) return false
    if (message.trim().length > 1000) {
      toast.error('Message is too long')
      return false
    }
    if (message.trim().length < 1) {
      toast.error('Message is too short')
      return false
    }

    sendMessage({ message, roomId: roomId })
    setMessage('')
    chatBodyRef.current?.scrollToBottom()
    return true
  }, [isAuthenticated, message, roomId, handleOpenAuthModal, sendMessage])

  const handleSendGif = useCallback(
    (gifId: string) => {
      if (!isAuthenticated) {
        handleOpenAuthModal()
        return
      }

      chatBodyRef.current?.scrollToBottom()
      sendMessage({ message: '', roomId: roomId, isGif: true, gifId: gifId })
    },
    [isAuthenticated, handleOpenAuthModal, roomId, sendMessage]
  )

  useEffect(() => {
    if (!isDesktop && isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.removeProperty('overflow')
    }
  }, [isDesktop, isOpen])

  return (
    <>
      <ChatHeader
        memberCount={memberCount}
        onTriviaVisible={() => setIsTriviaVisible(!isTriviaVisible)}
      />
      <ChatBody
        onSendGif={handleSendGif}
        isGifVisible={isGifVisible}
        setIsGifVisible={setIsGifVisible}
        isTriviaVisible={isTriviaVisible}
        setIsTriviaVisible={setIsTriviaVisible}
        ref={chatBodyRef}
        roomId={roomId}
        hasMore={rooms[roomId]?.hasMore}
        messages={rooms[roomId]?.messages || []}
      />
      <ChatController
        message={message}
        onMessageChange={setMessage}
        onSendMessage={handleSendMessage}
        onGifVisible={() => setIsGifVisible(!isGifVisible)}
      />
    </>
  )
})

export default ChatContent

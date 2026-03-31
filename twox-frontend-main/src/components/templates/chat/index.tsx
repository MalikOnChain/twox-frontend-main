'use client'
import { memo } from 'react'

import useChat from '@/context/features/chat-context'

import { useMediaQuery } from '@/hooks/features/use-media-query'

import Backdrop from '@/components/templates/backdrop/backdrop'
import ChatContent from '@/components/templates/chat/chat-content'
import PanelContainer from '@/components/templates/panel/panel-container'

const Chat = () => {
  const { isOpen, setIsOpen } = useChat()
  const isDesktop = useMediaQuery('xl+1')

  return (
    <>
      {!isDesktop && (
        <Backdrop
          className='top-0 z-[49]'
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
      )}
      <PanelContainer isVisible={isOpen}>
        <ChatContent />
      </PanelContainer>
    </>
  )
}
export default memo(Chat)

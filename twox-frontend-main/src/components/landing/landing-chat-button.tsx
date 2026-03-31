'use client'

import { useState } from 'react'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import { TawkChatModal } from '@/components/modals/tawk-chat-modal'

import chatIcon from '@/assets/icons/chat.png'

export default function LandingChatButton() {
  const [chatModalOpen, setChatModalOpen] = useState(false)

  const handleChatClick = () => {
    setChatModalOpen(true)
  }

  return (
    <>
      {/* Support Chat Icon - Fixed Bottom Right */}
      <div className='fixed bottom-4 right-4 z-50 md:bottom-8 md:right-8'>
        <Button
          variant='outline'
          size='icon'
          className='flex h-10 w-10 items-center justify-center rounded-full border border-[#404044] bg-dark-grey-gradient hover:bg-dark-gradient shadow-lg md:h-12 md:w-12'
          onClick={handleChatClick}
          aria-label='Open live chat'
        >
          <Image
            src={chatIcon}
            alt='Chat Icon'
            width={16}
            height={21}
            className='h-4 w-4 object-contain md:h-4 md:w-4'
          />
        </Button>
      </div>

      {/* Chat Modal */}
      <TawkChatModal open={chatModalOpen} onOpenChange={setChatModalOpen} />
    </>
  )
}


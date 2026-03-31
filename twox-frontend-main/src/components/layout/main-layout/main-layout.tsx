'use client'

import React, { ReactNode } from 'react'

import { useReferEarnModal } from '@/context/refer-earn-modal-context'

import ReferEarnModal from '@/components/modals/refer-earn-modal/refer-earn-modal'
import Chat from '@/components/templates/chat'

import AppSidebar from '../app-sidebar/app-sidebar'
import Container from '../container/container'
import Footer from '../footer/footer'
import Header from '../header/header'
import MobileMenuBar from '../mobile-menu-bar/mobile-menu-bar'

const MainLayout = ({ children }: { children: ReactNode }) => {
  const { isOpen, closeModal } = useReferEarnModal()

  return (
    <>
      <div className='flex bg-dark-grey'>
        <AppSidebar />
        <main className='mx-auto flex min-h-screen w-full overflow-hidden bg-dark-grey pt-header-sm max-md:pb-10 lg:overflow-auto lg:pt-header'>
          <div className='w-full flex-1 lg:mx-auto lg:max-w-[1440px]'>
            <Header />
            <Container className='space-y-4 md:space-y-6'>{children}</Container>
            <Footer />
          </div>
          <Chat />
        </main>
      </div>
      <MobileMenuBar />
      
      {/* Refer & Earn Modal */}
      <ReferEarnModal isOpen={isOpen} onClose={closeModal} />
    </>
  )
}

export default MainLayout

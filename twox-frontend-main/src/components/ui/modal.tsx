'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ReactNode, useEffect } from 'react'
import Modal from 'react-modal'

interface CustomModalProps {
  isOpen: boolean
  onRequestClose: () => void
  children: ReactNode
  contentLabel: string
  isCentered?: boolean
}

export function CustomModal({
  isOpen,
  onRequestClose,
  children,
  contentLabel,
  isCentered = true,
}: CustomModalProps) {
  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      padding: 0,
      border: 'none',
      borderRadius: 'none',
      background: 'transparent',
      zIndex: 1201,
      // maxHeight: '90vh',
      overflow: 'visible',
    },
    overlay: {
      backgroundColor: 'transparent',
      zIndex: 1200,
      overflow: 'auto',
    },
  }

  const customStyles2 = {
    content: {
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      transform: 'translate(-50%, 0)',
      padding: 0,
      border: 'none',
      borderRadius: 'none',
      background: 'transparent',
      zIndex: 1201,
      minWidth: '375px',
      // maxHeight: '90vh',
      overflow: 'visible',
    },
    overlay: {
      backgroundColor: 'transparent',
      zIndex: 1200,
      overflow: 'auto',
    },
  }
  // Handle viewport scaling
  useEffect(() => {
    if (isOpen) {
      const viewport = document.querySelector('meta[name=viewport]')
      const originalContent = viewport?.getAttribute('content')
      const originalStyle = window.getComputedStyle(document.body).overflow

      // Prevent zooming
      viewport?.setAttribute(
        'content',
        'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0'
      )

      // Disable body scroll
      document.body.style.overflow = 'hidden'

      return () => {
        // Restore original viewport settings
        if (originalContent) {
          viewport?.setAttribute('content', originalContent)
        }
        // Restore original body scroll
        document.body.style.overflow = originalStyle
      }
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            style={isCentered ? customStyles : customStyles2}
            contentLabel={contentLabel}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
              }}
              style={{
                // maxHeight: '90vh',
                overflow: 'auto',
                position: 'relative',
              }}
            >
              {children}
            </motion.div>
          </Modal>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(8px)',
              zIndex: 1000,
              marginTop: 0,
              marginLeft: 0,
              marginRight: 0,
              marginBottom: 0,
            }}
            onClick={onRequestClose}
          />
        </>
      )}
    </AnimatePresence>
  )
}

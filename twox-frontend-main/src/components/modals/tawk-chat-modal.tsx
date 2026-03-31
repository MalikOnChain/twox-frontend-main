'use client'

import React, { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'

interface TawkChatModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const TawkChatModal: React.FC<TawkChatModalProps> = ({ open, onOpenChange }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (open && iframeRef.current) {
      setIsLoading(true)
    }
  }, [open])

  const handleIframeLoad = () => {
    setIsLoading(false)
  }

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        onClick={() => onOpenChange(false)}
      />

      {/* Modal - Responsive */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex flex-col overflow-hidden rounded-t-2xl border border-[#404044] bg-[#1a1a1d] shadow-2xl lg:bottom-20 lg:left-auto lg:right-8 lg:w-[400px] lg:rounded-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#404044] bg-gradient-to-r from-[#1e1e21] to-[#25252a] px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <h3 className="text-sm font-semibold text-white">Live Support</h3>
          </div>
          <button
            className="h-8 w-8 rounded-full hover:bg-white/10 transition-colors flex items-center justify-center"
            onClick={() => onOpenChange(false)}
            aria-label="Close chat"
          >
            <X className="h-4 w-4 text-white" />
          </button>
        </div>

        {/* Chat Content */}
        <div className="relative h-[calc(100vh-200px)] w-full overflow-hidden bg-white lg:h-[500px] lg:w-[400px]">
          {/* Loading State */}
          {isLoading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white">
              <div className="flex flex-col items-center gap-3">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500" />
                <p className="text-sm text-gray-600">Connecting to support...</p>
              </div>
            </div>
          )}

          {/* Tawk.to Iframe - Using Direct Chat Link */}
          <iframe
            ref={iframeRef}
            src="https://tawk.to/chat/683b3a1712552b190a13a1bd/1isjllrc0"
            className="h-full w-full"
            frameBorder="0"
            allowFullScreen
            onLoad={handleIframeLoad}
            title="Live Chat Support"
            allow="microphone; camera"
            style={{
              minHeight: '500px',
            }}
          />
          
          {/* Overlay to hide Tawk.to branding/URL at bottom */}
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent" />
        </div>

        {/* Footer */}
        <div className="border-t border-[#404044] bg-gradient-to-r from-[#1e1e21] to-[#25252a] px-4 py-2">
          <p className="text-center text-xs text-gray-400">
            Powered by Two X Support
          </p>
        </div>
      </div>
    </>
  )
}


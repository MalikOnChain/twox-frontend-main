'use client'

import React, { useState } from 'react'
import { MessageCircle, Clock, Users, Zap, Mail, Phone } from 'lucide-react'

const LiveSupport = () => {
  const [chatLoaded, setChatLoaded] = useState(false)

  const handleChatLoad = () => {
    setChatLoaded(true)
  }

  const supportFeatures = [
    {
      icon: MessageCircle,
      title: '24/7 Live Chat',
      description: 'Connect with our support team instantly, any time of day',
    },
    {
      icon: Clock,
      title: 'Quick Response',
      description: 'Average response time under 2 minutes',
    },
    {
      icon: Users,
      title: 'Expert Team',
      description: 'Knowledgeable agents ready to help with any question',
    },
    {
      icon: Zap,
      title: 'Instant Solutions',
      description: 'Get immediate answers to common questions',
    },
  ]

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Support',
      value: 'support@twox.gg',
      link: 'mailto:support@twox.gg',
    },
    {
      icon: Phone,
      title: 'Phone Support',
      value: '+1 (555) 123-4567',
      link: 'tel:+15551234567',
    },
  ]

  return (
    <div className='container mx-auto px-4 py-8'>
      {/* Header Section */}
      <div className='mb-8 text-center'>
        <div className='mb-4 flex items-center justify-center'>
          <div className='rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-4'>
            <MessageCircle className='h-8 w-8 text-white' />
          </div>
        </div>
        <h1 className='mb-2 text-3xl font-bold text-white md:text-4xl'>Live Support</h1>
        <p className='text-lg text-gray-400'>
          We're here to help! Chat with our support team or explore other contact options below.
        </p>
      </div>

      {/* Main Chat Section */}
      <div className='mb-8'>
        <div className='overflow-hidden rounded-2xl border border-[#404044] bg-gradient-to-br from-[#1a1a1d] to-[#25252a] shadow-2xl'>
          {/* Chat Header */}
          <div className='border-b border-[#404044] bg-gradient-to-r from-[#1e1e21] to-[#25252a] px-6 py-4'>
            <div className='flex items-center gap-3'>
              <div className='h-3 w-3 animate-pulse rounded-full bg-green-500' />
              <div>
                <h2 className='text-lg font-semibold text-white'>Chat with Support</h2>
                <p className='text-sm text-gray-400'>Our team is online and ready to help</p>
              </div>
            </div>
          </div>

          {/* Chat Content */}
          <div className='relative bg-white' style={{ height: 'calc(100vh - 400px)', minHeight: '500px' }}>
            {/* Loading State */}
            {!chatLoaded && (
              <div className='absolute inset-0 z-10 flex items-center justify-center bg-white'>
                <div className='flex flex-col items-center gap-3'>
                  <div className='h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500' />
                  <p className='text-sm text-gray-600'>Loading chat...</p>
                </div>
              </div>
            )}

            {/* Tawk.to Iframe */}
            <iframe
              src='https://tawk.to/chat/683b3a1712552b190a13a1bd/1isjllrc0'
              className='h-full w-full'
              frameBorder='0'
              allowFullScreen
              onLoad={handleChatLoad}
              title='Live Chat Support'
              allow='microphone; camera'
            />
          </div>

          {/* Chat Footer */}
          <div className='border-t border-[#404044] bg-gradient-to-r from-[#1e1e21] to-[#25252a] px-6 py-3'>
            <p className='text-center text-xs text-gray-400'>
              Your conversation is secure and private
            </p>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className='mb-8'>
        <h3 className='mb-6 text-center text-xl font-semibold text-white'>Why Choose Our Support?</h3>
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
          {supportFeatures.map((feature, index) => (
            <div
              key={index}
              className='rounded-xl border border-[#404044] bg-gradient-to-br from-[#1a1a1d] to-[#25252a] p-6 transition-all hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/20'
            >
              <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10'>
                <feature.icon className='h-6 w-6 text-blue-500' />
              </div>
              <h4 className='mb-2 font-semibold text-white'>{feature.title}</h4>
              <p className='text-sm text-gray-400'>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Methods */}
      <div className='mb-8'>
        <h3 className='mb-6 text-center text-xl font-semibold text-white'>Other Ways to Reach Us</h3>
        <div className='grid gap-4 md:grid-cols-2'>
          {contactMethods.map((method, index) => (
            <a
              key={index}
              href={method.link}
              className='group rounded-xl border border-[#404044] bg-gradient-to-br from-[#1a1a1d] to-[#25252a] p-6 transition-all hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20'
            >
              <div className='flex items-center gap-4'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/10 transition-colors group-hover:bg-purple-500/20'>
                  <method.icon className='h-6 w-6 text-purple-500' />
                </div>
                <div>
                  <h4 className='mb-1 font-semibold text-white'>{method.title}</h4>
                  <p className='text-sm text-gray-400 group-hover:text-purple-400'>{method.value}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className='rounded-xl border border-[#404044] bg-gradient-to-br from-[#1a1a1d] to-[#25252a] p-6'>
        <h3 className='mb-4 text-xl font-semibold text-white'>Frequently Asked Questions</h3>
        <div className='space-y-4'>
          <div className='rounded-lg bg-black/20 p-4'>
            <h4 className='mb-2 font-semibold text-white'>What are your support hours?</h4>
            <p className='text-sm text-gray-400'>
              Our live chat support is available 24/7. Email and phone support are available Monday-Friday, 9AM-5PM EST.
            </p>
          </div>
          <div className='rounded-lg bg-black/20 p-4'>
            <h4 className='mb-2 font-semibold text-white'>How quickly will I get a response?</h4>
            <p className='text-sm text-gray-400'>
              Live chat responses are typically under 2 minutes. Email inquiries are usually answered within 24 hours.
            </p>
          </div>
          <div className='rounded-lg bg-black/20 p-4'>
            <h4 className='mb-2 font-semibold text-white'>Can I attach files in the chat?</h4>
            <p className='text-sm text-gray-400'>
              Yes! You can attach screenshots and documents directly in the chat to help us better assist you.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LiveSupport

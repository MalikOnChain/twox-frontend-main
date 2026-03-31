'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'

import { SectionLabel, SectionTitle, SectionDescription } from '@/components/landing/common'

import answerBack from '@/assets/landing-page/answer_back.png'
import starIcon from '@/assets/landing-page/star.png'

interface FAQItem {
  question: string
  answer: string
}

const faqData: FAQItem[] = [
  {
    question: "What Is The Two X Beta Launch?",
    answer: "The Two X beta launch is an early access phase where selected users can experience the full Two X platform before its public release. During this period, participants help test features, provide feedback, and support fine-tuning the platform while enjoying exclusive early access benefits.",
  },
  {
    question: "Will There Be Rewards Or Benefits For Users Who Participate In The Beta?",
    answer: "Yes, beta participants will receive exclusive rewards and benefits including early access bonuses, special promotions, and priority support. Active participants may also receive additional perks as a thank you for helping improve the platform.",
  },
  {
    question: "How Can I Join The Two X Beta Testing?",
    answer: "You can join the Two X beta testing by signing up through our waitlist. Simply fill out the registration form with your details, and you'll be notified when beta access becomes available.",
  },
  {
    question: "How Will I Be Notified When I Can Access The Platform?",
    answer: "You will receive an email notification at the address you provided during registration. We may also send updates through our social media channels and community platforms.",
  },
  {
    question: "How Much Time Do I Have To Join The Waitlist For Beta Access?",
    answer: "The waitlist is open for a limited time. We recommend joining as soon as possible to secure your spot in the beta testing phase. Specific deadlines will be communicated through our official channels.",
  },
  {
    question: "What Should I Do If I'm Not Selected For Beta Access?",
    answer: "If you're not selected for the initial beta phase, don't worry! You'll remain on our waitlist and will be considered for future beta rounds. We'll also keep you updated on the public launch date.",
  },
]

export default function LandingFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0) // First question is open by default

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className='relative w-full overflow-hidden' style={{ backgroundColor: '#0A0A0A' }}>
      {/* FAQ Section */}
      <section id='faq' className='relative z-10 mx-auto w-full px-4 py-8 md:px-[100px] md:py-[26px]'>
        <div className='mx-auto max-w-4xl'>
          <SectionLabel className='mb-4 md:mb-6'>Join Us Now</SectionLabel>
          <SectionTitle className='mb-6 md:mb-8'>Frequently Asking Questions</SectionTitle>

          {/* FAQ Accordion */}
          <div className='space-y-3 md:space-y-4'>
            {faqData.map((item, index) => {
              const isOpen = openIndex === index

              return (
                <div
                  key={index}
                  className='relative overflow-hidden rounded-2xl border border-gray-400/30'
                  style={{
                    backgroundColor: isOpen
                      ? undefined
                      : 'rgba(30, 30, 30, 0.8)',
                  }}
                >
                  {/* Answer Background for Open Items */}
                  {isOpen && (
                    <div className='absolute inset-0 z-0'>
                      <Image
                        src={answerBack}
                        alt='Answer Background'
                        fill
                        className='object-cover opacity-100'
                        quality={90}
                      />
                    </div>
                  )}

                  {/* Question Header */}
                  <button
                    onClick={() => toggleQuestion(index)}
                    className='relative z-10 flex w-full items-center justify-between rounded-2xl p-4 text-left transition-colors md:p-6'
                    style={{
                      fontFamily: 'var(--font-stolzl), sans-serif',
                    }}
                  >
                    <h3
                      className='flex-1 pr-3 text-sm font-bold text-white md:pr-4 md:text-lg lg:text-xl'
                      style={{
                        fontFamily: 'var(--font-stolzl), sans-serif',
                        fontWeight: 700,
                      }}
                    >
                      {item.question}
                    </h3>

                    {/* Icon */}
                    <div className='flex-shrink-0'>
                      {isOpen ? (
                        <X className='h-5 w-5 text-white md:h-6 md:w-6' />
                      ) : (
                        <div className='relative h-5 w-5 md:h-6 md:w-6'>
                          <Image
                            src={starIcon}
                            alt='Star Icon'
                            fill
                            className='object-contain'
                            quality={90}
                          />
                        </div>
                      )}
                    </div>
                  </button>

                  {/* Answer Content */}
                  {isOpen && (
                    <div className='relative z-10 px-4 pb-4 md:px-6 md:pb-6'>
                      <p
                        className='text-sm text-white/90 md:text-base'
                        style={{
                          fontFamily: 'var(--font-satoshi), sans-serif',
                          fontWeight: 400,
                          fontSize: 'inherit',
                          lineHeight: '120%',
                        }}
                      >
                        {item.answer}
                      </p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}


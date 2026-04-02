'use client'

import React, { useEffect, useState } from 'react'

import { ContentSection,getContentSections } from '@/api/content'

export default function ContentSectionDisplay() {
  const [sections, setSections] = useState<ContentSection[]>([])
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await getContentSections()
        if (response.success) {
          setSections(response.data)
        }
      } catch (error) {
        console.error('Failed to load content sections:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSections()
  }, [])

  const toggleExpanded = (sectionId: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId)
      } else {
        newSet.add(sectionId)
      }
      return newSet
    })
  }

  if (loading) {
    return null
  }

  if (sections.length === 0) {
    return null
  }

  return (
    <div className='hidden lg:block space-y-6'>
      {sections.map((section) => {
        const isExpanded = expandedSections.has(section._id)
        const paragraphs = section.content.split('\n\n')
        
        // Show only first 2 paragraphs when collapsed
        const visibleParagraphs = isExpanded ? paragraphs : paragraphs.slice(0, 2)
        const hasMoreContent = paragraphs.length > 2
        
        // Show only first 7 list items when collapsed
        const visibleListItems = isExpanded ? section.listItems : section.listItems.slice(0, 7)
        const hasMoreItems = section.listItems.length > 7

        return (
          <div
            key={section._id}
            className='border border-mirage rounded-2xl p-6 md:p-8'
          >
            <div className='grid gap-6 md:grid-cols-[2fr_1fr]'>
              {/* Left Column - Title and Content */}
              <div>
                <h2 className='mb-4 font-satoshi text-2xl font-bold text-white md:text-3xl'>
                  {section.title}
                </h2>

                <div className='space-y-4 font-satoshi text-sm leading-relaxed text-gray-300 md:text-base'>
                  {visibleParagraphs.map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                  
                  {/* Faded third paragraph preview when collapsed */}
                  {!isExpanded && hasMoreContent && paragraphs[2] && (
                    <p className='opacity-50'>
                      {paragraphs[2].substring(0, 100)}...
                    </p>
                  )}
                </div>
              </div>

              {/* Right Column - List Items */}
              {section.listItems && section.listItems.length > 0 && (
                <div>
                  <ul className='space-y-2'>
                    {visibleListItems.map((item, idx) => (
                      <li key={idx}>
                        <a
                          href='#'
                          className='block font-satoshi text-sm text-gray-300 underline transition-colors hover:text-white md:text-base'
                        >
                          {item}
                        </a>
                      </li>
                    ))}
                    {!isExpanded && hasMoreItems && (
                      <li className='opacity-50 font-satoshi text-sm text-gray-300 md:text-base'>
                        ...
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>

            {/* See More button centered across full width */}
            {hasMoreContent && (
              <div className='mt-6 flex justify-center'>
                <button
                  onClick={() => toggleExpanded(section._id)}
                  className='rounded-lg bg-dark-grey-gradient px-6 py-2 font-satoshi text-sm font-medium text-white transition-colors hover:bg-[#444444]'
                >
                  {isExpanded ? 'See Less' : 'See More'}
                </button>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

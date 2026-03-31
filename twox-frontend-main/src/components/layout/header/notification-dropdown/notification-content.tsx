import { ChevronDown, ChevronUp } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import useNotification from '@/context/features/notification-context'

import { cn } from '@/lib/utils'

// Helper function to format dates nicely
const formatDate = (dateString: string) => {
  const date = new Date(dateString)

  // Format options
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }

  return date.toLocaleString(undefined, options as Intl.DateTimeFormatOptions)
}

const NotificationContent = () => {
  const { notifications, markAsRead } = useNotification()
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const [heights, setHeights] = useState<Record<string, number>>({})
  const [needsExpansion, setNeedsExpansion] = useState<Record<string, boolean>>(
    {}
  )
  const contentRefs = useRef<Record<string, HTMLDivElement>>({})
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  // Function to measure content heights and determine if expansion is needed
  useEffect(() => {
    const newHeights: Record<string, number> = {}
    const newNeedsExpansion: Record<string, boolean> = {}

    Object.keys(contentRefs.current).forEach((key) => {
      if (contentRefs.current[key]) {
        const el = contentRefs.current[key]
        newHeights[key] = el.scrollHeight

        // Check if content needs expansion (scrollHeight > clientHeight when constrained)
        const lineHeight =
          parseInt(window.getComputedStyle(el).lineHeight) || 20
        const twoLinesHeight = lineHeight * 2
        newNeedsExpansion[key] = el.scrollHeight > twoLinesHeight
      }
    })

    setHeights(newHeights)
    setNeedsExpansion(newNeedsExpansion)
  }, [notifications, expandedIndex])

  // Handle expanding/collapsing
  const toggleExpand = (index: number) => {
    // Only toggle if expansion is needed
    if (needsExpansion[index]) {
      if (expandedIndex === index) {
        setExpandedIndex(null)
      } else {
        setExpandedIndex(index)
        // Mark notification as read when expanded
        if (
          notifications[index] &&
          !notifications[index].isRead &&
          markAsRead
        ) {
          markAsRead(notifications[index].id)
        }
      }
    }
  }

  if (!notifications || notifications.length === 0) {
    return (
      <div className='flex h-[200px] items-center justify-center p-4 text-center'>
        <div className='text-white'>
          <div className='mb-2 text-4xl'>📬</div>
          <p className='text-sm'>You have no notifications</p>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={scrollContainerRef}
      className='scrollbar-thin scrollbar-thumb-secondary-600 scrollbar-track-secondary-800 h-[300px] w-full overflow-y-auto overflow-x-hidden pb-4'
      style={{
        // Explicit scroll styles to ensure scrolling works
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'thin',
        msOverflowStyle: 'auto',
      }}
    >
      <div className='flex w-full flex-col'>
        {notifications.map((notification, index) => {
          const isUnread = !notification.isRead
          const isExpanded = expandedIndex === index
          const canExpand = needsExpansion[index]
          const isHovered = hoveredIndex === index

          return (
            <div
              key={index}
              className={cn(
                'relative w-full border-secondary-600 transition-all duration-300 ease-in-out',
                '[&:not(:last-child)]:border-b',
                isUnread ? 'bg-secondary-800/60' : '',
                isHovered ? 'bg-secondary-500/20' : ''
              )}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className='relative flex items-start gap-3 p-3'>
                <div className='min-w-0 flex-1 overflow-hidden'>
                  {/* Title */}
                  <div
                    className={cn(
                      'flex items-center text-sm leading-5',
                      isUnread
                        ? 'font-semibold text-primary-foreground'
                        : 'text-primary-foreground/80'
                    )}
                  >
                    <div
                      className={cn(
                        'mr-2 h-2 w-2 flex-shrink-0 rounded-full transition-opacity duration-300',
                        isUnread ? 'bg-success' : 'bg-success opacity-40'
                      )}
                    ></div>
                    <span className='truncate'>{notification.title}</span>
                  </div>

                  {/* Message */}
                  {notification.message && (
                    <div className='relative mt-2'>
                      <div
                        className={cn(
                          'rounded p-1 text-xs transition-colors duration-200',
                          canExpand &&
                            'cursor-pointer hover:bg-secondary-700/30',
                          'flex items-start justify-between',
                          isExpanded ? 'bg-secondary-700/10' : ''
                        )}
                        onClick={() => toggleExpand(index)}
                      >
                        <div
                          className={cn(
                            'overflow-hidden transition-all duration-300 ease-in-out',
                            !isExpanded && 'line-clamp-2',
                            canExpand ? 'pr-2' : 'pr-0'
                          )}
                          style={{
                            maxHeight: isExpanded
                              ? `${heights[index] || 200}px`
                              : '40px',
                          }}
                          ref={(el) => {
                            if (el) {
                              contentRefs.current[index] = el
                            }
                          }}
                        >
                          {notification.message}
                        </div>

                        {/* Only show chevron if content needs expansion */}
                        {canExpand && (
                          <span className='ml-1 mt-1 flex-shrink-0 text-muted-foreground'>
                            {isExpanded ? (
                              <ChevronUp size={14} />
                            ) : (
                              <ChevronDown size={14} />
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Date */}
                  <div className='mt-2 text-[11px] text-muted-foreground opacity-80'>
                    {formatDate(notification.createdAt)}
                  </div>
                </div>

                {/* Icon */}
                {notification.icon && notification.icon}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default NotificationContent

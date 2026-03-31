import { memo } from 'react'
const Timestamp = ({ timestamp }: { timestamp: Date | string }) => {
  const formatTimestamp = (date: Date | string) => {
    if (typeof date === 'string') {
      date = new Date(date)
    }

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    // If message is from today, show only time (e.g., "2:23 PM")
    if (date >= today) {
      return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })
    }

    // If message is from yesterday, show "Yesterday, 2:23 PM"
    if (date >= yesterday) {
      return `Yesterday, ${date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })}`
    }

    // If message is from this year, show "Mar 15, 2:23 PM"
    if (date.getFullYear() === now.getFullYear()) {
      return date.toLocaleString([], {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })
    }

    // If message is from previous years, show "15/03/2022, 2:23 PM"
    return date.toLocaleString([], {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  }

  return (
    <div className='text-xs text-gray-400'>{formatTimestamp(timestamp)}</div>
  )
}

export default memo(Timestamp)

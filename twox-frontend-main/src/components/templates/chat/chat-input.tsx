import React, { Dispatch, memo, SetStateAction } from 'react'

const ChatInput = ({
  message,
  setMessage,
  sendMessage,
}: {
  message: string
  setMessage: Dispatch<SetStateAction<string>>
  sendMessage: () => boolean
}) => {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const MAX_LINES = 5 // Define maximum number of lines allowed

  const countLines = (text: string) => {
    return text.split('\n').length
  }

  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget
    const lines = countLines(textarea.value)

    if (lines <= MAX_LINES) {
      setMessage(textarea.value)
      // Calculate height based on number of lines (20px per line) plus base padding
      textarea.style.height = `${lines * 20}px`
    } else {
      // Prevent adding more lines by keeping the previous value
      setMessage(message)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        // Check if adding a new line would exceed the limit
        if (countLines(message) >= MAX_LINES) {
          e.preventDefault()
          return
        }
        e.preventDefault()
        setMessage((prev: string) => prev + '\n ')
        // Adjust height for the new line
        if (textareaRef.current) {
          const newLines = countLines(message) + 1
          textareaRef.current.style.height = `${newLines * 20 + 20}px`
        }
        return
      }
      e.preventDefault()
      if (message.trim()) {
        const result = sendMessage()

        if (result) {
          setMessage('')
          if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'
          }
        }
      }
    }
  }

  return (
    <textarea
      tabIndex={-1}
      ref={textareaRef}
      value={message}
      className='max-h-[150px] min-h-[14px] flex-1 resize-none overflow-y-hidden bg-transparent p-0 text-xs text-muted-foreground placeholder-muted-foreground focus:outline-none'
      placeholder='Your message'
      rows={1}
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      autoFocus={false}
      inputMode='text'
    />
  )
}

export default memo(ChatInput)

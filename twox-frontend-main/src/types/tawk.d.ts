/**
 * TypeScript declarations for Tawk.to Live Chat API
 */

interface TawkAPI {
  /**
   * Show the chat widget
   */
  showWidget(): void

  /**
   * Hide the chat widget
   */
  hideWidget(): void

  /**
   * Maximize (open) the chat window
   */
  maximize(): void

  /**
   * Minimize (close) the chat window
   */
  minimize(): void

  /**
   * Toggle between maximized and minimized states
   */
  toggle(): void

  /**
   * Get the current page status
   */
  getStatus(): 'online' | 'away' | 'offline'

  /**
   * Check if the chat window is maximized
   */
  isChatMaximized(): boolean

  /**
   * Check if the chat window is minimized
   */
  isChatMinimized(): boolean

  /**
   * Check if the chat is hidden
   */
  isChatHidden(): boolean

  /**
   * Check if the chat is ongoing
   */
  isChatOngoing(): boolean

  /**
   * Get the window type ('inline' or 'embed')
   */
  getWindowType(): 'inline' | 'embed'

  /**
   * Set custom visitor attributes
   */
  setAttributes(attributes: Record<string, string>, callback?: (error: Error | null) => void): void

  /**
   * Add event listener
   */
  addEvent(event: string, data: Record<string, string>, callback?: (error: Error | null) => void): void

  /**
   * Add tags to visitor
   */
  addTags(tags: string[], callback?: (error: Error | null) => void): void

  /**
   * Remove tags from visitor
   */
  removeTags(tags: string[], callback?: (error: Error | null) => void): void

  /**
   * Callback when chat is loaded
   */
  onLoad?: () => void

  /**
   * Callback when status changes
   */
  onStatusChange?: (status: 'online' | 'away' | 'offline') => void

  /**
   * Callback before chat window is minimized
   */
  onBeforeLoad?: () => void

  /**
   * Callback when chat is maximized
   */
  onChatMaximized?: () => void

  /**
   * Callback when chat is minimized
   */
  onChatMinimized?: () => void

  /**
   * Callback when chat is hidden
   */
  onChatHidden?: () => void

  /**
   * Callback when chat starts
   */
  onChatStarted?: () => void

  /**
   * Callback when chat ends
   */
  onChatEnded?: () => void

  /**
   * Callback when prechat form is submitted
   */
  onPrechatSubmit?: (data: Record<string, string>) => void

  /**
   * Callback when offline form is submitted
   */
  onOfflineSubmit?: (data: Record<string, string>) => void

  /**
   * Callback when a message is sent by the visitor
   */
  onChatMessageVisitor?: (message: string) => void

  /**
   * Callback when a message is sent by the agent
   */
  onChatMessageAgent?: (message: string) => void

  /**
   * Callback when a message is sent by the system
   */
  onChatMessageSystem?: (message: string) => void

  /**
   * Callback when agent joins the chat
   */
  onAgentJoinChat?: (data: { name: string; position: string; image: string }) => void

  /**
   * Callback when agent leaves the chat
   */
  onAgentLeaveChat?: (data: { name: string; position: string; image: string }) => void

  /**
   * Callback when unread count changes
   */
  onUnreadCountChanged?: (count: number) => void

  /**
   * Visitor information
   */
  visitor?: {
    name?: string
    email?: string
  }
}

interface Window {
  Tawk_API?: TawkAPI
  Tawk_LoadStart?: Date
}


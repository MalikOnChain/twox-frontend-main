export interface Message {
  id: string
  senderId: string
  message: string
  createdAt: string
  type: 'private' | 'room'
  recipientId?: string
  roomId: string
  status?: 'sent' | 'error'
  isOnline?: boolean
  username: string
  isGif?: boolean
  gifId?: string
  avatar: string
  isAdmin?: boolean
  currentRank: string
  currentLevel: string
  _id?: string
}

export interface Room {
  id: string
  name?: string
  isPrivate?: boolean
  hasMore: boolean
  messages: Message[]
}

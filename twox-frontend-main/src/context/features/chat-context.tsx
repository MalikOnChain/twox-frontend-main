import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { toast } from 'sonner'

import { useSocket } from '@/context/socket-context'

import { SOCKET_NAMESPACES } from '@/lib/socket'

import { Message, Room } from '@/types/chat'

interface SendMessageParams {
  message: string
  recipientId?: string
  roomId?: string
  isGif?: boolean
  gifId?: string
}

interface Rooms {
  [key: string]: Room
}

interface RoomStatus {
  memberCount: number
}

interface ChatContextType {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  rooms: Rooms
  sendMessage: (params: SendMessageParams) => void
  createRoom: (roomName: string, isPrivate?: boolean) => void
  joinRoom: (roomId: string) => void
  loadMoreMessages: (roomId: string, before: Date) => void
  roomStatus: Record<string, RoomStatus>
  isConnected: boolean
  defaultRooms: Record<string, string>
}

const defaultRooms: Record<string, string> = {
  General: 'general',
  Support: 'support',
  Announcements: 'announcements',
  Events: 'events',
  Promotions: 'promotions',
  Leaderboard: 'leaderboard',
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

interface ChatProviderProps {
  children: React.ReactNode
  initialIsVisible?: boolean
}

export const ChatProvider: React.FC<ChatProviderProps> = ({
  children,
  initialIsVisible = false,
}) => {
  const { socket } = useSocket(SOCKET_NAMESPACES.CHAT)
  const [rooms, setRooms] = useState<Rooms>({})
  const [isOpen, setIsOpen] = useState(initialIsVisible)
  const [roomStatus, setRoomStatus] = useState<Record<string, RoomStatus>>({})

  const handlePrivateMessage = useCallback((message: Message) => {
    setRooms((prev) => {
      let room = prev[message.roomId]
      if (!room) {
        return prev
      }

      room = {
        ...room,
        messages: [...room.messages, message],
      }
      return {
        ...prev,
        [message.roomId]: room,
      }
    })
  }, [])

  const handleRoomMessage = useCallback((message: Message) => {
    setRooms((prev) => {
      let room = prev[message.roomId]
      if (!room) {
        return prev
      }

      room = {
        ...room,
        messages: [...room.messages, message],
      }
      return {
        ...prev,
        [message.roomId]: room,
      }
    })
  }, [])

  const handleRoomCreated = useCallback(
    (room: { roomId: string; roomName: string; isPrivate: boolean }) => {
      setRooms((prev) => ({
        ...prev,
        [room.roomId]: {
          id: room.roomId,
          name: room.roomName,
          isPrivate: room.isPrivate,
          hasMore: true,
          messages: [],
        },
      }))
    },
    []
  )

  const handleRoomJoined = useCallback(
    ({
      roomId,
      messages,
      hasMore,
    }: {
      roomId: string
      messages: Message[]
      members: any[]
      hasMore: 0 | 1
    }) => {
      setRooms((prev) => {
        const newRoom = {
          id: roomId,
          name: '',
          hasMore: hasMore === 1,
          isPrivate: false,
          messages: messages,
        }

        if (prev[roomId]) {
          return prev
        }

        return {
          ...prev,
          [roomId]: newRoom,
        }
      })
    },
    []
  )

  const handleRoomStatus = useCallback(
    ({ roomId, memberCount }: { roomId: string; memberCount: number }) => {
      setRoomStatus((prev) => ({
        ...prev,
        [roomId]: {
          memberCount,
        },
      }))
    },
    []
  )

  const handleError = useCallback(
    (error: { message: string; code: number }) => {
      toast.error(error.message)
    },
    []
  )

  const handleChatHistory = useCallback(
    ({
      messages,
      roomId,
      hasMore,
    }: {
      messages: Message[]
      roomId: string
      hasMore: 0 | 1
    }) => {
      setRooms((prev) => {
        let room = prev[roomId]
        if (!room) {
          return prev
        }

        room = {
          ...room,
          hasMore: hasMore === 1,
          messages: [...messages, ...room.messages],
        }

        return {
          ...prev,
          [roomId]: room,
        }
      })
    },
    []
  )

  const sendMessage = useCallback(
    ({ message, recipientId, roomId, isGif, gifId }: SendMessageParams) => {
      if (!socket) {
        toast.error('Socket connection not available')
        return
      }

      if (roomId) {
        socket.emit('send-room-message', { message, roomId, isGif, gifId })
      } else if (recipientId) {
        socket.emit('send-private-message', {
          message,
          recipientId,
          isGif,
          gifId,
        })
      }
    },
    [socket]
  )

  const loadMoreMessages = useCallback(
    (roomId: string, before: Date) => {
      if (!socket) {
        toast.error('Socket connection not available')
        return
      }

      socket.emit('get-chat-history', { roomId, before })
    },
    [socket]
  )

  const createRoom = useCallback(
    (roomName: string, isPrivate = false) => {
      if (!socket) {
        toast.error('Socket connection not available')
        return
      }

      socket.emit('create-room', { roomName, isPrivate })
    },
    [socket]
  )

  const joinRoom = useCallback(
    (roomId: string) => {
      if (!socket) {
        toast.error('Socket connection not available')
        return
      }

      socket.emit('join-room', { roomId })
    },
    [socket]
  )

  useEffect(() => {
    if (!socket) return

    socket.on('message-received', handlePrivateMessage)
    socket.on('room-message', handleRoomMessage)
    socket.on('room-created', handleRoomCreated)
    socket.on('room-joined', handleRoomJoined)
    socket.on('chat-history', handleChatHistory)
    socket.on('room-status', handleRoomStatus)
    socket.on('error', handleError)

    return () => {
      socket.off('message-received')
      socket.off('room-message')
      socket.off('room-created')
      socket.off('room-joined')
      socket.off('room-status')
      socket.off('chat-history')
      socket.off('error')
    }
  }, [
    socket,
    handlePrivateMessage,
    handleRoomMessage,
    handleRoomCreated,
    handleRoomJoined,
    handleRoomStatus,
    handleError,
    handleChatHistory,
  ])

  const value = useMemo(
    () => ({
      roomStatus,
      isOpen,
      setIsOpen,
      rooms,
      sendMessage,
      createRoom,
      joinRoom,
      isConnected: socket !== null,
      defaultRooms,
      loadMoreMessages,
    }),
    [
      isOpen,
      setIsOpen,
      roomStatus,
      rooms,
      sendMessage,
      createRoom,
      joinRoom,
      socket,
      loadMoreMessages,
    ]
  )

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}

export const useChat = () => {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
}

export default useChat

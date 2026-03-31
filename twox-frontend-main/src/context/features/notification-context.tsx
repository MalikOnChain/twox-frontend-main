import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@radix-ui/react-tooltip'
import { Gift } from 'lucide-react'
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

import { useSocket } from '@/context/socket-context'

import { SOCKET_NAMESPACES } from '@/lib/socket'

import IconComponent from '@/components/templates/icon-component/icon-component'

import {
  BonusReceivedData,
  formatCurrency,
  NotificationItem,
  Notifications,
  SOCKET_EVENTS,
} from '@/types/notification'

interface ExtendedNotificationItem extends NotificationItem {
  icon: React.ReactNode
}

interface NotificationContextType {
  notifications: ExtendedNotificationItem[]
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  isConnected: boolean
  getNotifications: (options?: Record<string, unknown>) => void
  getUnreadCount: () => void
  markAsRead: (notificationId: string) => void
  markAllAsRead: () => void
  setNotifications: Dispatch<SetStateAction<ExtendedNotificationItem[]>>
  deleteNotification: (notificationId: string) => void
  unreadCount: number
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
)

interface NotificationProviderProps {
  children: React.ReactNode
}

const BonusTooltipContent = ({ data }: { data: BonusReceivedData }) => {
  return (
    <div className='max-w-[200px] p-2'>
      <div className='space-y-2'>
        <h4 className='border-b pb-1 text-sm font-medium'>{data.bonusName}</h4>
        <div className='grid grid-cols-2 gap-x-2 gap-y-1 text-xs'>
          <span className='text-muted-foreground'>Amount:</span>
          <span className='text-right font-medium text-amber-500'>
            {formatCurrency(data.amount, data.currency)}
          </span>

          <span className='text-muted-foreground'>Type:</span>
          <span className='text-right font-medium'>{data.bonusType}</span>
        </div>
      </div>
    </div>
  )
}

const BonusReceivedIcon = ({
  _type,
  data,
}: {
  _type: string
  data: BonusReceivedData
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className='group relative cursor-pointer'>
            <IconComponent
              icon={<Gift className='h-4 w-4' />}
              variant='gold'
              className='flex-shrink-0 cursor-pointer transition-transform duration-300 hover:scale-110'
            />
            <span className='absolute -right-1 -top-1 flex h-3 w-3 items-center justify-center'>
              <span className='inline-flex h-2 w-2 animate-pulse rounded-full bg-amber-500'></span>
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent
          side='left'
          sideOffset={5}
          className='border bg-background shadow-lg'
        >
          <BonusTooltipContent data={data} />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

const getNotificationIcon = (type: string, data: BonusReceivedData) => {
  switch (type) {
    case 'BONUS_RECEIVED':
      return <BonusReceivedIcon _type='BONUS_RECEIVED' data={data} />
    default:
      return <BonusReceivedIcon _type='BONUS_RECEIVED' data={data} />
  }
}

const wrapNotificationWithIcon = (
  notification: NotificationItem
): ExtendedNotificationItem => {
  return {
    ...notification,
    icon: getNotificationIcon(notification.type, notification?.data as any),
  }
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const { socket } = useSocket(SOCKET_NAMESPACES.NOTIFICATION)
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<
    ExtendedNotificationItem[]
  >([])
  const [unreadCount, setUnreadCount] = useState(20)

  useEffect(() => {
    socket?.on(SOCKET_EVENTS.NOTIFICATION_COUNT, (count: number) => {
      // setUnreadCount(count)
    })
    socket?.on(
      SOCKET_EVENTS.NOTIFICATION_READ,
      (_notification: Notification) => {
        setNotifications((prev) =>
          prev.map((notification) => ({ ...notification, isRead: true }))
        )
      }
    )
    socket?.on(
      SOCKET_EVENTS.NEW_NOTIFICATION,
      (_notification: Notification) => {
        setNotifications((prev) => [
          wrapNotificationWithIcon(_notification as any),
          ...prev,
        ])
      }
    )

    socket?.on(SOCKET_EVENTS.NOTIFICATIONS, (data: Notifications) => {
      setNotifications(data.notifications.map(wrapNotificationWithIcon))
    })
  }, [socket])

  const getNotifications = useCallback(
    (options = {}) => {
      socket?.emit(SOCKET_EVENTS.GET_NOTIFICATIONS, options)
    },
    [socket]
  )

  const getUnreadCount = useCallback(() => {
    socket?.emit(SOCKET_EVENTS.GET_UNREAD_COUNT)
  }, [socket])

  const markAsRead = useCallback(
    (notificationId: string) => {
      socket?.emit(SOCKET_EVENTS.MARK_AS_READ, { notificationId })
    },
    [socket]
  )

  const markAllAsRead = useCallback(() => {
    socket?.emit(SOCKET_EVENTS.MARK_ALL_READ)
  }, [socket])

  const deleteNotification = useCallback(
    (notificationId: string) => {
      socket?.emit(SOCKET_EVENTS.DELETE_NOTIFICATION, { notificationId })
    },
    [socket]
  )

  useEffect(() => {
    getNotifications()
  }, [getNotifications])

  useEffect(() => {
    const unreadCount = notifications.filter(
      (notification) => !notification.isRead
    ).length
    setUnreadCount(unreadCount)
  }, [notifications])

  const value = useMemo(
    () => ({
      setNotifications,
      notifications,
      isOpen,
      setIsOpen,
      isConnected: socket !== null,
      getNotifications,
      getUnreadCount,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      unreadCount,
    }),
    [
      isOpen,
      setIsOpen,
      socket,
      notifications,
      getNotifications,
      getUnreadCount,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      unreadCount,
    ]
  )

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error(
      'useNotification must be used within a NotificationProvider'
    )
  }
  return context
}

export default useNotification

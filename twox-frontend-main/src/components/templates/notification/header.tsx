import { memo } from 'react'

import useNotification from '@/context/features/notification-context'

import PanelHeader from '@/components/templates/panel/panel-header'

const NotificationHeader = () => {
  const { setIsOpen } = useNotification()
  return <PanelHeader title='Notifications' onClose={() => setIsOpen(false)} />
}

export default memo(NotificationHeader)

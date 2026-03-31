'use client'

import { memo } from 'react'

import useNotification from '@/context/features/notification-context'

import { useMediaQuery } from '@/hooks/features/use-media-query'

import NotificationHeader from '@/components/templates/notification/header'
import PanelContainer from '@/components/templates/panel/panel-container'
// import NotificationBody from '@/components/templates/notification/body'
// import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

const NotificationContent = memo(() => {
  // const { notifications } = useNotification()
  // const [activtTab, setActiveTab] = useState('all')

  return (
    <div className='flex h-full flex-col gap-[10px]'>
      <NotificationHeader />
    </div>
  )
})

const Notification = () => {
  const { isOpen } = useNotification()
  const isDesktop = useMediaQuery('xl')

  return (
    <>
      {isDesktop && (
        <PanelContainer isVisible={isOpen}>
          <NotificationContent />
        </PanelContainer>
      )}
    </>
  )
}

export default Notification

// import { MessageCircleQuestion } from 'lucide-react'
import { memo } from 'react'

import useChat from '@/context/features/chat-context'

import PanelHeader from '@/components/templates/panel/panel-header'
import { Badge } from '@/components/ui/badge'

import ChatIcon from '@/assets/chat-green-colored.svg'
import UsersIcon from '@/assets/users.svg'

const ChatHeader = ({
  memberCount,
  // onTriviaVisible,
}: {
  memberCount: number
  onTriviaVisible: () => void
}) => {
  const { setIsOpen } = useChat()
  return (
    <PanelHeader
      hideClose
      title='Live Chat'
      icon={
        <span className='relative flex size-4 items-center justify-center'>
          <ChatIcon className='absolute size-12' />
        </span>
      }
      onClose={() => setIsOpen(false)}
    >
      <div className='flex items-center justify-between gap-2'>
        {/* <MessageCircleQuestion
          onClick={onTriviaVisible}
          className='ml-2 size-5 animate-bounce hover:animate-none hover:cursor-pointer hover:text-slate-50'
        /> */}
        <Badge variant='success' className='flex items-center gap-1'>
          <UsersIcon className='size-[14px]' />
          <span className='leading-[1]'>{memberCount}</span>
        </Badge>
      </div>
    </PanelHeader>
  )
}

export default memo(ChatHeader)

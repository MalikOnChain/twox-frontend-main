import { memo } from 'react'

import { Button } from '@/components/ui/button'

type TabType = 'game' | 'crypto' | 'service'

interface HeaderTabsProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

const HeaderTabs = ({ activeTab, onTabChange }: HeaderTabsProps) => {
  const tabs = [
    { id: 'game', label: 'Game History' },
    { id: 'crypto', label: 'Crypto History' },
    { id: 'service', label: 'Service History' },
  ] as const

  return (
    <div className='mb-4 flex gap-2 md:gap-4'>
      {tabs.map((tab) => (
        <Button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          variant={activeTab === tab.id ? 'default' : 'outline'}
        >
          {tab.label}
        </Button>
      ))}
    </div>
  )
}

export default memo(HeaderTabs)

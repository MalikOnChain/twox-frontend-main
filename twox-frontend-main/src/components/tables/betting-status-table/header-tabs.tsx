import { memo, useState } from 'react'
import { useTranslation } from 'react-i18next'

const HeaderTabs = () => {
  const [activeTab, setActiveTab] = useState('all')
  const { t } = useTranslation()

  const tabs = [
    { id: 'all', label: t('latest_bets.all') },
    { id: 'highest_rollers', label: t('latest_bets.highest_rollers') },
    { id: 'lucky_win', label: t('latest_bets.lucky_win') },
    { id: 'my_bets', label: t('latest_bets.my_bets') },
  ]

  return (
    <div className='flex max-h-12 w-full justify-between gap-2 rounded-lg bg-background-fourth p-1.5 max-sm:mx-auto sm:w-fit md:gap-2'>
      {tabs.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => setActiveTab(id)}
          className={`relative flex min-w-16 items-center justify-center gap-2 whitespace-nowrap px-2 py-1.5 text-xs font-medium lg:px-4 lg:py-2.5 lg:text-[15px] ${activeTab === id ? 'rounded-lg bg-background-sixth' : 'text-secondary-800'} `}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

export default memo(HeaderTabs)

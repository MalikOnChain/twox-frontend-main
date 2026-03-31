import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { PROFILE_TABS } from '@/lib/profile'
import { cn } from '@/lib/utils'

const ProfileTabs = () => {
  const pathname = usePathname()
  const activeTab = pathname.split('/').pop()
  const { t } = useTranslation()

  return (
    <div className='grid w-full grid-cols-2 items-center gap-4 overflow-auto rounded-2xl bg-background-fourth px-3 py-2 sm:flex sm:w-fit'>
      {PROFILE_TABS.map((tab) => (
        <Link
          href={`/profile/${tab.value}`}
          key={tab.value}
          className={cn(
            'flex flex-1 items-center whitespace-nowrap text-xs text-muted-foreground transition-all duration-300 hover:text-foreground md:text-sm',
            {
              'h-7 rounded-xl bg-background-third px-4 font-semibold text-foreground md:h-8':
                activeTab === tab.value,
            }
          )}
        >
          {t(`profile.${tab.label}`)}
        </Link>
      ))}
    </div>
  )
}

export default ProfileTabs

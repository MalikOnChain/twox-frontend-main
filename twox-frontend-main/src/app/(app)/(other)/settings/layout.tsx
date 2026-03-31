'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const settingsNavItems = [
  { name: 'General', href: '/settings/general' },
  { name: 'Security', href: '/settings/security' },
  { name: 'Preference', href: '/settings/preference' },
  { name: 'Sessions', href: '/settings/sessions' },
  { name: 'Verify', href: '/settings/verify' },
  { name: 'Promo Code', href: '/settings/promo-code' },
  { name: 'Responsible Gambling', href: '/settings/responsible-gambling' },
]

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className='min-h-screen py-10 font-satoshi text-white'>
      <div className='flex flex-wrap gap-6'>
        <div className='hidden h-fit w-64 rounded-2xl border border-mirage bg-[#090909] p-2.5 md:block'>
          <nav className='space-y-1'>
            {settingsNavItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block rounded-lg px-3 py-2 text-sm font-normal transition-colors ${
                    isActive
                      ? 'bg-[#17161B] text-white'
                      : 'text-white hover:bg-[#17161B] hover:text-white'
                  }`}
                >
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
        <div className='block w-full md:hidden'>
          <nav className='scrollbar-hide flex space-x-2 overflow-x-auto p-2'>
            {settingsNavItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex-shrink-0 whitespace-nowrap rounded-lg px-2 py-2 text-sm font-normal transition-colors ${
                    isActive
                      ? 'bg-[#17161B] text-white'
                      : 'text-white hover:bg-[#17161B] hover:text-white'
                  }`}
                >
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
        <div className='w-full flex-1 overflow-x-auto'>{children}</div>
      </div>
    </div>
  )
}

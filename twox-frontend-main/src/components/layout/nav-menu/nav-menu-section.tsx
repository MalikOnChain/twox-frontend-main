'use client'

import React, { memo } from 'react'

import NavMenuItem from './nav-menu-item'

import { NavigationMenu } from '@/types/menu'

const NavMenuSection = (props: NavigationMenu) => {
  const { items, index } = props

  return (
    <div className='flex flex-col'>
      <ul className='flex flex-col gap-2'>
        {items.map((item) => (
          <NavMenuItem key={`nav${item.name}`} {...item} />
        ))}
      </ul>
    </div>
  )
}

export default memo(NavMenuSection)

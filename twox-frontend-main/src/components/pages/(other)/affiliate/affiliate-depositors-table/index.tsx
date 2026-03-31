'use client'

import React from 'react'

import { cn } from '@/lib/utils'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import DepositorIcon from '@/assets/depositor.svg'
import BitcoinO from '@/assets/images/coin-o.webp'

const columns = [
  {
    name: 'User',
  },
  {
    name: 'Total Deposited',
  },
  {
    name: 'Commission Earned',
  },
  {
    name: 'Last Active',
  },
]

const rows = Array.from({ length: 20 }, (_, index) => ({
  _id: index,
  user: {
    username: `User ${index + 1}`,
    avatar: `https://i.pravatar.cc/150?img=${index + 1}`,
  },
  totalDeposited: index * 100,
  commissionEarned: index * 10,
  lastActive: `2024-01-01`,
}))

import Image from 'next/image'
const AffiliateDepositorsTable = () => {
  return (
    <div className='flex flex-1 flex-col gap-2'>
      <div className='flex items-center'>
        <DepositorIcon className='mr-2 size-[26px] text-gold drop-shadow-0-12-0-gold md:mr-3' />
        <span className='text-2xl font-bold text-foreground md:text-[22px]'>
          Depositors
        </span>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            {columns?.map((column, index) => (
              <TableHead
                key={index}
                className={cn(
                  'h-8 text-xs text-foreground md:text-xs',
                  column.name === 'Last Active' && 'block max-md:hidden'
                )}
              >
                {column.name}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length > 0 &&
            rows.map((item) => (
              <TableRow key={item._id} className='gap-2 rounded-lg'>
                <TableCell className='rounded-l-lg py-3 pl-3 md:pl-[30px]'>
                  <span className='flex items-center'>
                    <Image
                      alt={item.user.username}
                      src={item.user.avatar}
                      className='mr-1 size-[22px] rounded-full'
                      width={0}
                      height={0}
                      sizes='100vw'
                    />
                    <span className='hidden md:block'>
                      {item.user.username}
                    </span>
                  </span>
                </TableCell>
                <TableCell className='py-3 pl-2'>
                  <span className='flex items-center'>
                    <Image
                      width={0}
                      height={0}
                      src={BitcoinO}
                      alt='Bitcoin'
                      className='mr-1 size-5'
                    />
                    {item.totalDeposited}
                  </span>
                </TableCell>
                <TableCell className='py-3 pl-2 max-md:rounded-r-lg max-md:pr-3'>
                  <span className='flex items-center'>
                    <Image
                      width={0}
                      height={0}
                      src={BitcoinO}
                      alt='Bitcoin'
                      className='mr-1 size-5'
                    />
                    {item.commissionEarned}
                  </span>
                </TableCell>
                <TableCell className='block rounded-r-lg py-3 pl-2 pr-3 max-md:hidden md:pr-[30px]'>
                  {item.lastActive}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default AffiliateDepositorsTable

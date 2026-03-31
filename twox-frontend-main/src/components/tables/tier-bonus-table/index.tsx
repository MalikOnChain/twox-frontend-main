'use client'

import { CheckIcon } from 'lucide-react'
import React from 'react'

import { useInitialSettingsContext } from '@/context/initial-settings-context'

import { cn } from '@/lib/utils'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import BenefitIcon from '@/assets/benefit.svg'
const TierBonusTable = () => {
  const { ranks } = useInitialSettingsContext()
  const Bonuses = Array.from({ length: 5 }, (_, index) => ({
    _id: index,
    title: `${index * 10} Bonus`,
    benefits: Array.from({ length: ranks?.length }, (_) => true),
  }))

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex items-center gap-1'>
        <BenefitIcon className='size-10 text-success' />
        <span className='text-2xl font-bold text-foreground'>The benefits</span>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='pl-3 md:pl-7.5'>Bonuses</TableHead>
            {ranks?.map((rank, index) => (
              <TableHead
                key={rank._id}
                className={cn('text-xs text-foreground md:text-xs', {
                  'pr-3 md:pr-7.5': index === ranks.length - 1,
                })}
              >
                {rank.name}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Bonuses.length > 0 &&
            Bonuses.map((bonus) => (
              <TableRow key={bonus._id} className='rounded-lg'>
                <TableCell
                  key={bonus._id}
                  className='rounded-l-lg pl-3 text-xs text-foreground md:pl-7.5 md:text-sm'
                >
                  {bonus.title}
                </TableCell>
                {bonus.benefits.map((benefit, index) => (
                  <TableCell
                    key={index}
                    className={cn('pr-3 md:pr-7.5', {
                      'rounded-r-lg': index === bonus.benefits.length - 1,
                    })}
                  >
                    {benefit ? (
                      <CheckIcon className='size-4 text-success' />
                    ) : (
                      ''
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default TierBonusTable

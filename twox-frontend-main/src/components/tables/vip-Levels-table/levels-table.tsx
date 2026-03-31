'use client'

import Image from 'next/image'
import { useState } from 'react'

import { useInitialSettingsContext } from '@/context/initial-settings-context'
import { useUser } from '@/context/user-context'

import { cn, formatNumber } from '@/lib/utils'

import NavMenuTrigger from '@/components/layout/nav-menu/nav-menu-trigger'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { LoyaltyTier } from '@/types/vip'

const LevelsTable = ({ rank }: { rank: LoyaltyTier }) => {
  const { getRankIcon } = useInitialSettingsContext()
  const [isOpen, setIsOpen] = useState(false)
  const rankIcon = getRankIcon(rank.name)
  const { isAuthenticated } = useUser()

  return (
    <Card
      className={cn('rounded-lg p-3 md:p-3.5', {
        '!space-y-0': !isOpen,
      })}
    >
      <div
        className='flex h-full items-center justify-between gap-1'
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className='flex items-center gap-1'>
          <Image
            src={rankIcon}
            alt='VIP Crown'
            width={0}
            height={0}
            sizes='100vw'
            className='size-5'
          />
          <span className='font-satoshi text-sm font-bold uppercase md:text-base'>
            {rank.name}
          </span>
        </div>
        <NavMenuTrigger
          isOpen={isOpen}
          onClick={() => setIsOpen(!isOpen)}
          isActive={isOpen}
        />
      </div>
      <div className='relative mt-2'>
        <div
          className={cn('transition-all duration-300 ease-in-out', {
            'max-h-0 overflow-hidden': !isOpen,
            'max-h-[1000px]': isOpen,
          })}
        >
          <Table className={cn('rounded-lg !bg-zeus font-satoshi')}>
            <TableHeader className='rounded-lg border-b border-secondary-600'>
              <TableRow>
                <TableHead className='pl-3 text-left font-satoshi text-xs font-medium text-foreground md:pl-3.5 md:text-sm md:font-bold'>
                  <span>Tier Level</span>
                </TableHead>
                <TableHead className='text-center font-satoshi text-xs font-medium text-foreground md:text-sm md:font-bold'>
                  <span>XP Required</span>
                </TableHead>
                <TableHead className='pr-3 text-right font-satoshi text-xs font-medium text-foreground md:pr-3.5 md:text-sm md:font-bold'>
                  <span>Completion</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className='rounded-b-lg' isStriped={false}>
              {rank.levels.map((level) => (
                <TableRow key={level.level}>
                  <TableCell className='pl-3 text-left text-sm text-foreground md:pl-3.5'>
                    <span>{level.name}</span>
                  </TableCell>
                  <TableCell className='text-center text-sm text-secondary-text'>
                    <span className='text-left font-satoshi text-sm font-medium'>
                      {formatNumber(level.minXP || 0)} XP
                    </span>
                  </TableCell>
                  <TableCell
                    className={cn('flex justify-end pr-3 text-sm md:pr-3.5', {
                      'text-success/[0.12]': level.isCompleted,
                      'text-error/[0.12]': !level.isCompleted,
                    })}
                  >
                    {isAuthenticated && (
                      <Badge
                        variant={level.isCompleted ? 'success' : 'destructive'}
                      >
                        {level.isCompleted ? 'Completed' : 'Incomplete'}
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  )
}

export default LevelsTable

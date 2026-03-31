'use client'

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table'
import { ChevronDown, MoreHorizontal } from 'lucide-react'
import React, { useState } from 'react'

import { cn } from '@/lib/utils'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { HeaderButton } from '@/components/ui/headerButton'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { GAME_RESULT } from '@/types/game'
import { GameTransaction } from '@/types/transaction'
// Helper function to format date
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

export function GameHistoryTable({
  data,
  totalPages,
  page,
  setPage,
  filter,
  setFilter,
  className,
}: {
  data: GameTransaction[]
  totalPages: number
  page: number
  setPage: (page: number) => void
  filter: {
    type: GAME_RESULT
    category: string
  }
  setFilter: (filter: { type: GAME_RESULT; category: string }) => void
  className?: string
}): React.ReactElement {
  // Table state
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})

  // Define table columns
  const columns: ColumnDef<GameTransaction>[] = [
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <HeaderButton
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Date & Time
        </HeaderButton>
      ),
      cell: ({ row }) => (
        <div className='whitespace-nowrap'>
          {formatDate(row.getValue('createdAt'))}
        </div>
      ),
    },
    {
      accessorKey: 'category',
      header: 'Game',
      cell: ({ row }) => <div>{row.getValue('category')}</div>,
    },
    {
      accessorKey: 'betAmount',
      header: ({ column }) => (
        <HeaderButton
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Bet Amount
        </HeaderButton>
      ),
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue('betAmount'))
        return (
          <div className='text-left'>
            {amount.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        )
      },
    },
    {
      accessorKey: 'winAmount',
      header: ({ column }) => (
        <HeaderButton
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Win Amount
        </HeaderButton>
      ),
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue('winAmount'))
        return (
          <div className='text-left'>
            {amount.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        )
      },
    },
    {
      accessorKey: 'type',
      header: 'Result',
      cell: ({ row }) => {
        const type = row.getValue('type') as string
        return (
          <div className='flex items-center'>
            <Badge
              variant={
                type === GAME_RESULT.WIN
                  ? 'success'
                  : type === GAME_RESULT.LOSS
                    ? 'destructive'
                    : 'outline'
              }
            >
              {type}
            </Badge>
          </div>
        )
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string
        return (
          <div className='flex items-center'>
            <Badge
              variant={
                status === 'COMPLETED'
                  ? 'success'
                  : status === 'PENDING'
                    ? 'outline'
                    : 'destructive'
              }
            >
              {status}
            </Badge>
            {row.original.verified && (
              <span
                className='ml-2 h-2 w-2 rounded-full bg-green-500'
                title='Verified'
              ></span>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: 'userBalance',
      header: 'Balance Change',
      cell: ({ row }) => {
        const balance = row.original.userBalance
        if (!balance) return null

        const change = balance.after - balance.before
        const isPositive = change > 0

        return (
          <div className={`${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? '+' : ''}
            {change.toFixed(2)}
          </div>
        )
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' className='h-8 w-8 p-0'>
                <span className='sr-only'>Open menu</span>
                <MoreHorizontal className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(row.original._id)}
              >
                Copy transaction ID
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  // Set up the table
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setFilter,
    pageCount: totalPages,
    manualPagination: true,
    manualFiltering: true,
    state: {
      sorting,

      columnVisibility,
      rowSelection,
      globalFilter: filter,
    },
  })

  return (
    <div className={cn('w-full', className)}>
      <div className='grid grid-cols-2 items-center gap-4 pb-4 pt-5 md:grid-cols-3'>
        <h2 className='col-span-2 font-kepler text-[22px] font-normal text-white xm:col-span-1 md:col-span-3'>
          GAME HISTORY
        </h2>
        <Input
          placeholder='Filter by game category'
          value={filter.category || ''}
          onChange={(event) => {
            setFilter({ ...filter, category: event.target.value })
          }}
          wrapperClassName='h-9'
          className='max-w-sm'
          containerClassName='col-span-2 xm:col-span-1'
        />
        <div className='flex items-center space-x-2'>
          <Button
            variant={
              table.getColumn('type')?.getFilterValue() === 'WIN'
                ? 'default'
                : 'secondary1'
            }
            onClick={() => {
              if (table.getColumn('type')?.getFilterValue() === 'WIN') {
                table.getColumn('type')?.setFilterValue(null)
              } else {
                table.getColumn('type')?.setFilterValue('WIN')
              }
            }}
            className='px-2 lg:px-3'
          >
            Win
          </Button>
          <Button
            variant={
              table.getColumn('type')?.getFilterValue() === 'LOSS'
                ? 'default'
                : 'secondary1'
            }
            onClick={() => {
              if (table.getColumn('type')?.getFilterValue() === 'LOSS') {
                table.getColumn('type')?.setFilterValue(null)
              } else {
                table.getColumn('type')?.setFilterValue('LOSS')
              }
            }}
            className='px-2 lg:px-3'
          >
            Lose
          </Button>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='secondary1' className='ml-auto'>
              Columns <ChevronDown className='ml-2 h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className='capitalize'
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className='rounded-md'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className='flex items-center justify-end space-x-2 py-4'>
        <div className='flex-1 text-sm text-muted-foreground'>
          {totalPages > 1 && `${page} of ${totalPages} page(s)`}
        </div>
        <div className='space-x-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => {
              setPage(page - 1)
              table.previousPage()
            }}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => {
              setPage(page + 1)
              table.nextPage()
            }}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

'use client'

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table'
import { ChevronDown, MoreHorizontal } from 'lucide-react'
import React, { useMemo, useState } from 'react'

import {
  TRANSACTION_STATUS,
  VAULTODY_TRANSACTION_STATUS_MAP,
} from '@/lib/transaction'
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

import { ServiceTransaction } from '@/types/transaction'

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

export function BonusTransactionHistoryTable({
  data,
  className,
  totalPages,
  page,
  setPage,
  filter,
  setFilter,
}: {
  data: ServiceTransaction[]
  className?: string
  totalPages: number
  page: number
  setPage: (page: number) => void
  filter: string
  setFilter: (filter: string) => void
}): React.ReactElement {
  // Table state
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})
  const columns: ColumnDef<ServiceTransaction>[] = useMemo(() => {
    return [
      {
        accessorKey: 'updatedAt',
        header: ({ column }) => (
          <HeaderButton
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Date & Time
          </HeaderButton>
        ),
        cell: ({ row }) => (
          <div className='whitespace-nowrap'>
            {formatDate(row.getValue('updatedAt'))}
          </div>
        ),
      },
      {
        accessorKey: 'type',
        header: 'Type',
        cell: ({ row }) => {
          const type = row.getValue('type') as string
          return (
            <div className='flex items-center'>
              <span>{type}</span>
            </div>
          )
        },
      },
      {
        accessorKey: 'amount',
        header: ({ column }) => (
          <HeaderButton
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Amount
          </HeaderButton>
        ),
        cell: ({ row }) => {
          const amount = parseFloat(row.getValue('amount'))
          return (
            <div className=''>
              {amount.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 8,
              })}
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
                className='font-normal'
              >
                {TRANSACTION_STATUS[status] ||
                  VAULTODY_TRANSACTION_STATUS_MAP[status] ||
                  status}
              </Badge>
            </div>
          )
        },
      },
      {
        id: 'balance',
        header: 'Balance Change',
        cell: ({ row }) => {
          const balance = row.original.userBalance
          if (!balance) return null

          const change = balance.after - balance.before
          const isPositive = change > 0

          return (
            <div className={` ${isPositive ? 'text-success' : 'text-red-600'}`}>
              {isPositive ? '+' : ''}
              {change.toFixed(2)}
            </div>
          )
        },
      },
      {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
          const transaction = row.original

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <span className='cursor-pointer'>
                  <span className='sr-only'>Open menu</span>
                  <MoreHorizontal className='h-4 w-4' />
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => navigator.clipboard.writeText(transaction._id)}
                >
                  Copy transaction ID
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      },
    ]
  }, [])

  // Set up the table
  const table = useReactTable({
    data: data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    // getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setFilter,
    pageCount: totalPages,
    manualPagination: true,
    manualFiltering: true,
    state: {
      globalFilter: filter,
      sorting,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className={cn('w-full', className)}>
      <div className='pb-4 pt-5'>
        <div className='flex flex-col justify-between gap-2 md:flex-row md:items-center'>
          <h2 className='font-kepler text-[22px] font-normal text-white'>
            BONUS HISTORY
          </h2>
          <div className='flex items-center gap-2'>
            <Input
              placeholder='Filter by type'
              value={filter || ''}
              onChange={(event) => {
                setFilter(event.target.value)
              }}
              containerClassName='max-md:flex-1'
              className='md:max-w-sm'
            />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='secondary1'>
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
        </div>
      </div>

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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className='h-24 text-center'>
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className='flex items-center justify-end space-x-2 py-4'>
        {totalPages > 1 && (
          <div className='flex-1 text-sm text-muted-foreground'>
            {`${page} of ${totalPages} page(s)`}
          </div>
        )}

        <div className='space-x-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => {
              table.previousPage()
              setPage(page - 1)
            }}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => {
              table.nextPage()
              setPage(page + 1)
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

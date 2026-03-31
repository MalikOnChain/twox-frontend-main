'use client'

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import React, { useState } from 'react'

import { useProfile } from '@/context/data/profile-context'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { IReferredUser } from '@/types/user'

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

export const ReferredUsersTable = (): React.ReactElement => {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})
  const { referredUsers } = useProfile()

  // Define table columns
  const columns: ColumnDef<IReferredUser>[] = [
    {
      accessorKey: 'username',
      header: ({ column }) => (
        <Button
          variant='outline'
          className='[&_svg]:size-3'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Username
          <ArrowUpDown className='ml-2' />
        </Button>
      ),
      cell: ({ row }) => (
        <div className='whitespace-nowrap font-medium'>
          <div className='font-medium'>{row.getValue('username')}</div>
        </div>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <Button
          variant='outline'
          className='[&_svg]:size-3'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Register Date
          <ArrowUpDown className='ml-2' />
        </Button>
      ),
      cell: ({ row }) => (
        <div className='whitespace-nowrap font-medium'>
          {formatDate(row.getValue('createdAt'))}
        </div>
      ),
    },
    {
      accessorKey: 'totalWagered',
      header: ({ column }) => (
        <Button
          variant='outline'
          className='[&_svg]:size-3'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Total Wagered
          <ArrowUpDown className='ml-2' />
        </Button>
      ),
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue('totalWagered'))
        return (
          <div className='text-right font-medium'>
            {amount.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        )
      },
    },
    {
      accessorKey: 'depositStatus',
      header: 'Deposit Status',
      cell: ({ row }) => {
        const status = row.getValue('depositStatus') as string
        return (
          <div className='flex items-center'>
            <Badge variant={status ? 'default' : 'outline'}>
              {status ? 'Enabled' : 'None'}
            </Badge>
          </div>
        )
      },
    },
  ]

  // Set up the table
  const table = useReactTable({
    data: referredUsers?.users || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })
  return (
    <div className='w-full'>
      <div className='flex flex-col items-center gap-4 px-1 py-4'>
        <div className='w-full rounded-md border'>
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
            {table.getFilteredRowModel().rows.length} user(s) total
          </div>
          <div className='space-x-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

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
import { ArrowUpDown, ChevronDown, MoreHorizontal } from 'lucide-react'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useUser } from '@/context/user-context'

import { CRYPTO_SYMBOLS, CRYPTO_TOKENS, getCoinNetworkData } from '@/lib/crypto'
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { CryptoTransaction } from '@/types/transaction'

// Helper function to format blockchain addresses for display
const formatAddress = (address: string): string => {
  if (address.length <= 16) return address
  return `${address.substring(0, 8)}...${address.substring(address.length - 8)}`
}

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

// Helper function to capitalize blockchain names
const capitalizeBlockchain = (blockchain: string): string => {
  return blockchain.charAt(0).toUpperCase() + blockchain.slice(1)
}

const HeaderButton = ({
  children,
  onClick,
}: {
  children: React.ReactNode
  onClick: () => void
}) => {
  return (
    <span className='flex items-center gap-1' onClick={onClick}>
      {children}
      <ArrowUpDown size={14} className='ml-2' />
    </span>
  )
}
export function CryptoTransactionHistoryTable({
  data,
  className,
  totalPages,
  page,
  setPage,
}: {
  data: CryptoTransaction[]
  className?: string
  totalPages: number
  page: number
  setPage: (page: number) => void
}): React.ReactElement {
  // Table state
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})
  const { t } = useTranslation()
  const { depositAddresses } = useUser()

  // Define table columns

  const listItems = useMemo(() => {
    if (!depositAddresses) return []
    const items = depositAddresses.map((addr) => {
      const networkData = getCoinNetworkData(addr.blockchain)
      return {
        ...networkData,
        symbol: CRYPTO_SYMBOLS[addr.blockchain],
        blockchain: addr.blockchain,
      }
    })
    return [
      ...items,
      {
        ...getCoinNetworkData(CRYPTO_TOKENS.USDT),
        symbol: CRYPTO_TOKENS.USDT,
        blockchain: CRYPTO_TOKENS.USDT,
      },
    ]
  }, [depositAddresses])

  const columns: ColumnDef<CryptoTransaction>[] = useMemo(() => {
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
          <div className='whitespace-nowrap text-secondary-text'>
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
          const unit = row.original.unit
          const tokenName = row.original.blockchain
          const tokenItem = listItems.find(
            (item) => item.title.toLowerCase() === tokenName.toLowerCase()
          )

          return (
            <div className=''>
              {tokenItem && (
                <tokenItem.icon className='mr-1 inline-block h-5 w-5' />
              )}
              {amount.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 8,
              })}{' '}
              {unit}
            </div>
          )
        },
      },
      {
        accessorKey: 'exchangedAmount',
        header: ({ column }) => (
          <HeaderButton
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            USD Value
          </HeaderButton>
        ),
        cell: ({ row }) => {
          const amount = parseFloat(row.getValue('exchangedAmount'))

          return (
            <div className=''>
              $
              {amount.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
          )
        },
      },
      {
        accessorKey: 'blockchain',
        header: 'Blockchain',
        cell: ({ row }) => {
          const blockchain = row.getValue('blockchain') as string
          const network = row.original.network
          return (
            <div>
              <div className=''>{capitalizeBlockchain(blockchain)}</div>
              <div className='text-xs text-muted-foreground'>{network}</div>
            </div>
          )
        },
      },
      {
        accessorKey: 'address',
        header: 'Address',
        cell: ({ row }) => (
          <div className='font-mono text-xs text-secondary-text'>
            {formatAddress(row.getValue('address'))}
          </div>
        ),
      },
      {
        accessorKey: 'currentConfirmations',
        header: 'Confirmation',
        cell: ({ row }) => {
          const targetConfirmations = row.original.targetConfirmations as string
          const currentConfirmations = row.original
            .currentConfirmations as string

          return (
            <div className='flex items-center'>
              {currentConfirmations} / {targetConfirmations}
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
                className='text-sm font-normal'
              >
                {TRANSACTION_STATUS[status] ||
                  VAULTODY_TRANSACTION_STATUS_MAP[status] ||
                  status}
              </Badge>
              {row.original.verified && (
                <span
                  className='ml-2 h-2 w-2 rounded-full'
                  title='Verified'
                ></span>
              )}
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
                  onClick={() =>
                    navigator.clipboard.writeText(transaction.transactionId)
                  }
                >
                  Copy transaction ID
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    navigator.clipboard.writeText(transaction.address)
                  }
                >
                  Copy address
                </DropdownMenuItem>
                <DropdownMenuItem>View on blockchain explorer</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      },
    ]
  }, [listItems])

  // Set up the table
  const table = useReactTable({
    data: data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    pageCount: totalPages,
    manualPagination: true,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className={cn('w-full', className)}>
      <h2 className='pt-5 font-kepler text-[22px] font-normal text-white'>
        {t('transactions.transaction_history')}
      </h2>
      <div className='flex flex-col gap-4 py-4 md:flex-row md:items-center'>
        <div className='flex items-center space-x-2'>
          <Button
            variant={
              table.getColumn('type')?.getFilterValue() === 'DEPOSIT'
                ? 'default'
                : 'secondary1'
            }
            onClick={() => {
              if (table.getColumn('type')?.getFilterValue() === 'DEPOSIT') {
                table.getColumn('type')?.setFilterValue(null)
              } else {
                table.getColumn('type')?.setFilterValue('DEPOSIT')
              }
            }}
            className='px-2 lg:px-3'
          >
            {t('transactions.deposits')}
          </Button>
          <Button
            variant={
              table.getColumn('type')?.getFilterValue() === 'WITHDRAW'
                ? 'default'
                : 'secondary1'
            }
            onClick={() => {
              if (table.getColumn('type')?.getFilterValue() === 'WITHDRAW') {
                table.getColumn('type')?.setFilterValue(null)
              } else {
                table.getColumn('type')?.setFilterValue('WITHDRAW')
              }
            }}
            className='px-2 lg:px-3'
          >
            {t('transactions.withdrawals')}
          </Button>
        </div>

        <div className='flex flex-1 items-center justify-end gap-2'>
          {/* <Input
            placeholder='Filter by blockchain'
            value={
              (table.getColumn('blockchain')?.getFilterValue() as string) ?? ''
            }
            onChange={(event) =>
              table.getColumn('blockchain')?.setFilterValue(event.target.value)
            }
            containerClassName='max-md:flex-1'
            className='md:max-w-sm'
          /> */}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='secondary1'>
                {t('transactions.columns')}{' '}
                <ChevronDown className='ml-2 h-4 w-4' />
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
                {t('transactions.no_results')}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className='flex items-center justify-end space-x-2 py-4'>
        <div className='flex-1 text-sm text-muted-foreground'>
          {table.getFilteredRowModel().rows.length} transaction(s) total
        </div>

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
            {t('transactions.previous')}
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
            {t('transactions.next')}
          </Button>
        </div>
      </div>
    </div>
  )
}

'use client'
import React, { ReactNode } from 'react'

import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import Pagination from './pagination'

type TransactionsProps = {
  columns: {
    id: string
    label: string
    col: number
    render: (row: unknown) => ReactNode
  }[]
  rows: any[]
  totalPages: number
  page: number
  setPage: (page: number) => void
  isLoading?: boolean
}

export default function Transactions({
  columns,
  rows,
  totalPages,
  page,
  setPage,
  isLoading,
}: TransactionsProps) {
  return (
    <>
      {isLoading ? (
        <Skeleton className='h-[155px] w-full rounded-2xl' />
      ) : (
        <>
          <div className='w-full overflow-hidden rounded-xl border border-white/[0.05] bg-white/[0.03]'>
            <div className='max-w-full overflow-x-auto'>
              <Table>
                {/* Table Header */}
                <TableHeader className='border-b border-gray-100 border-white/[0.05]'>
                  <TableRow>
                    {columns.map(({ label }, i) => (
                      <TableCell
                        key={i}
                        className='text-theme-xs px-5 py-3 text-left font-medium text-gray-500'
                      >
                        {label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHeader>

                {/* Table Body */}
                <TableBody className='divide-y divide-white/[0.05]'>
                  {rows &&
                    rows.length > 0 &&
                    rows.map((row, r) => (
                      <TableRow key={r}>
                        {columns.map(({ render }, i) => (
                          <TableCell
                            key={i}
                            className='text-theme-sm cursor-default px-4 py-3 text-left text-gray-400'
                          >
                            {render(row)}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  {rows.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={11} className='text-center'>
                        <p className='py-2 text-gray-400'>No records yet</p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              {totalPages > 1 && (
                <Pagination
                  totalPages={totalPages}
                  currentPage={page}
                  onPageChange={setPage}
                  className='mb-5 justify-center'
                />
              )}
            </div>
          </div>
        </>
      )}
    </>
  )
}

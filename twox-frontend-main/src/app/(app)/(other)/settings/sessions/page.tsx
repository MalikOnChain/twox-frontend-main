'use client'

import { useEffect,useState } from 'react'
import { toast } from 'sonner'

import { getUserSessions, removeAllSessions, removeSession, UserSession } from '@/api/user-settings'

import SecurityLayout from '@/components/templates/security-layout/security-layout'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function SessionsPage() {
  const [sessions, setSessions] = useState<UserSession[]>([])
  const [loading, setLoading] = useState(true)
  const [removingSession, setRemovingSession] = useState<string | null>(null)
  const [removingAll, setRemovingAll] = useState(false)

  // Load sessions on mount
  useEffect(() => {
    loadSessions()
  }, [])

  const loadSessions = async () => {
    try {
      setLoading(true)
      const data = await getUserSessions(20)
      setSessions(data)
    } catch (error: any) {
      toast.error(error.message || 'Failed to load sessions')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveSession = async (sessionId: string) => {
    try {
      setRemovingSession(sessionId)
      await removeSession(sessionId)
      toast.success('Session removed successfully')
      
      // Reload sessions
      await loadSessions()
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove session')
    } finally {
      setRemovingSession(null)
    }
  }

  const handleRemoveAllSessions = async () => {
    if (!confirm('Are you sure you want to remove all sessions? You will be logged out.')) {
      return
    }

    try {
      setRemovingAll(true)
      const result = await removeAllSessions()
      toast.success(result.message || 'All sessions removed')
      
      // Reload sessions
      await loadSessions()
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove all sessions')
    } finally {
      setRemovingAll(false)
    }
  }

  // Parse user agent to get browser/OS info
  const getBrowserInfo = (userAgent: string) => {
    if (!userAgent) return 'Unknown'
    
    if (userAgent.includes('Windows')) return 'Windows'
    if (userAgent.includes('Mac')) return 'macOS'
    if (userAgent.includes('Linux')) return 'Linux'
    if (userAgent.includes('Android')) return 'Android'
    if (userAgent.includes('iOS') || userAgent.includes('iPhone')) return 'iOS'
    
    return 'Unknown'
  }
  return (
    <SecurityLayout>
      <h2 className='mb-5 text-base font-bold text-white md:text-xl'>
        Activity Log
      </h2>

      <div className='rounded-xl border border-mirage bg-[#090909] p-1 font-satoshi'>
        {loading ? (
          <div className='flex h-64 items-center justify-center'>
            <div className='h-8 w-8 animate-spin rounded-full border-4 border-gray-600 border-t-white' />
          </div>
        ) : sessions.length === 0 ? (
          <div className='flex h-64 items-center justify-center'>
            <p className='text-gray-400'>No active sessions found</p>
          </div>
        ) : (
          <Table className='min-w-[700px] bg-[#090909]'>
            <TableHeader className=''>
              <TableRow className='border-mirage bg-mirage'>
                <TableHead className='h-14 rounded-tl-xl text-sm font-bold capitalize text-white'>
                  Browser/Device
                </TableHead>
                <TableHead className='text-sm font-bold capitalize text-white'>
                  Location
                </TableHead>
                <TableHead className='text-sm font-bold capitalize text-white'>
                  IP Address
                </TableHead>
                <TableHead className='text-sm font-bold capitalize text-white'>
                  Last Used
                </TableHead>
                <TableHead className='rounded-tr-xl text-sm font-bold capitalize text-white'>
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className='[&_tr:last-child]:border-0'>
              {sessions.map((session, index) => {
                const date = new Date(session.createdAt)
                const formattedDate = date.toLocaleString('en-US', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })

                const location = session.ipInfo?.city && session.ipInfo?.country
                  ? `${session.ipInfo.city}, ${session.ipInfo.country}`
                  : session.ipInfo?.country || 'Unknown'

                return (
                  <TableRow
                    key={session._id}
                    className='border-b border-mirage transition-colors'
                  >
                    <TableCell
                      className={`py-5 font-medium text-[#FFFFFFCC] ${index === sessions.length - 1 ? 'rounded-bl-xl' : ''}`}
                    >
                      {getBrowserInfo(session.userAgent)}
                    </TableCell>
                    <TableCell className='text-[#FFFFFFCC]'>
                      {location}
                    </TableCell>
                    <TableCell className='text-[#FFFFFFCC]'>
                      {session.ipAddress}
                    </TableCell>
                    <TableCell className='text-[#FFFFFFCC]'>
                      {formattedDate}
                    </TableCell>
                    <TableCell
                      className={`${index === sessions.length - 1 ? 'rounded-br-xl' : ''}`}
                    >
                      <button
                        onClick={() => handleRemoveSession(session._id)}
                        disabled={removingSession === session._id}
                        className='px-1 font-medium text-arty-red transition-colors hover:text-red-600 focus:outline-none disabled:opacity-50'
                      >
                        {removingSession === session._id ? 'Removing...' : 'Remove Session'}
                      </button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </div>
      <Button 
        variant='secondary1' 
        className='mt-5'
        onClick={handleRemoveAllSessions}
        disabled={removingAll || loading || sessions.length === 0}
      >
        {removingAll ? 'Removing...' : 'Finish All Sessions'}
      </Button>
    </SecurityLayout>
  )
}

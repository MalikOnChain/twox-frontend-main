'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import {
  GameStatItem,
  GameStatsResponse,
  getBestMultipliers,
  getHighRollers,
  getLatestWinners,
  getTopWinners,
} from '@/api/game-stats'

import { GameDataTypes } from '@/lib/game-rank'
import {
  type TabData,
  dummyData,
  shouldUseMockGameStats,
} from '@/lib/game-rank'

import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const GameTable: React.FC<{ data: GameDataTypes[] }> = ({ data }) => {
  const formatNumber = (num: number): string => {
    return num.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    })
  }

  const getCurrencyIcon = (currency: '$' | '₿') => {
    return currency === '$' ? (
      <span className='inline-flex h-4 w-4 items-center justify-center rounded-full bg-green-500 text-xs font-bold text-white'>
        $
      </span>
    ) : (
      <span className='inline-flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white'>
        ₿
      </span>
    )
  }

  return (
    <div className='overflow-x-auto rounded-2xl'>
      <Table className='min-w-[680px] font-satoshi'>
        <TableHeader>
          <TableRow className='border-b border-mirage bg-dark-grey-gradient'>
            <TableHead className='p-5 font-satoshi text-sm font-bold capitalize text-white'>
              Game name
            </TableHead>
            <TableHead className='p-5 font-satoshi text-sm font-bold capitalize text-white'>
              Player
            </TableHead>
            <TableHead className='p-5 font-satoshi text-sm font-bold capitalize text-white'>
              Bet Amount
            </TableHead>
            <TableHead className='p-5 font-satoshi text-sm font-bold capitalize text-white'>
              Multiplier
            </TableHead>
            <TableHead className='p-5 font-satoshi text-sm font-bold capitalize text-white'>
              Profit
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => {
            // Construct game link if we have the necessary data
            const gameLink = item.gameCode && item.providerCode && item.gameType
              ? `/${item.gameType}/${item.providerCode}/${item.gameCode}`
              : null

            // Debug first item
            if (index === 0) {
              console.log('🔗 First game item:', {
                gameName: item.gameName,
                gameCode: item.gameCode,
                providerCode: item.providerCode,
                gameType: item.gameType,
                generatedLink: gameLink,
              })
            }

            return (
              <TableRow key={item.id} className='border-b border-gray-800'>
                <TableCell className='p-5 font-satoshi text-sm font-medium capitalize'>
                  {gameLink ? (
                    <Link 
                      href={gameLink}
                      className='cursor-pointer text-[#FFFFFFCC] transition-all duration-200 hover:text-arty-red hover:underline'
                    >
                      {item.gameName}
                    </Link>
                  ) : (
                    <span className='text-[#FFFFFFCC]'>{item.gameName}</span>
                  )}
                </TableCell>
              <TableCell className='p-5 font-satoshi text-sm font-medium capitalize text-[#FFFFFFCC]'>
                {item.player}
              </TableCell>
              <TableCell>
                <div className='flex items-center gap-2 font-satoshi capitalize'>
                  <span>{formatNumber(item.betAmount)}</span>
                  {getCurrencyIcon(item.currency)}
                </div>
              </TableCell>
              <TableCell className='p-5 font-satoshi text-sm font-medium capitalize text-[#FFFFFFCC]'>
                {item.multiplier}
              </TableCell>
              <TableCell>
                <div className='flex items-center gap-2 font-satoshi capitalize'>
                  <span className='font-satoshi font-medium capitalize text-green-400'>
                    {formatNumber(item.profit)}
                  </span>
                  {getCurrencyIcon(item.currency)}
                </div>
              </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

// Helper function to transform API data to GameDataTypes
const transformGameStatItem = (item: GameStatItem): GameDataTypes => ({
  id: item.id,
  gameName: item.gameName,
  gameCode: item.gameCode,
  providerCode: item.providerCode,
  gameType: item.gameType || 'slots',
  player: item.player,
  betAmount: item.betAmount,
  multiplier: item.multiplier,
  profit: item.profit,
  currency: item.currency,
})

function resolveStatTab(
  result: PromiseSettledResult<GameStatsResponse>,
  mockKey: keyof TabData
): GameDataTypes[] {
  if (
    result.status === 'fulfilled' &&
    result.value.success &&
    result.value.data?.length
  ) {
    return result.value.data.map(transformGameStatItem)
  }
  if (shouldUseMockGameStats()) {
    return dummyData[mockKey]
  }
  return []
}

const GamingRanking: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('Latest Wins')
  const [data, setData] = useState<{ [key: string]: GameDataTypes[] }>({
    'Latest Wins': [],
    'High Rollers': [],
    'Best Multipliers': [],
    'Winners of the Day': [],
    'Winners of the Month': [],
  })
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const tabs = Object.keys(data)

  // Fetch data for all tabs
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true)
        setError(null)

        const results = await Promise.allSettled([
          getLatestWinners(8),
          getHighRollers(5, 'day'),
          getBestMultipliers(5, 'day'),
          getTopWinners(4, 'day'),
          getTopWinners(4, 'month'),
        ])

        const next = {
          'Latest Wins': resolveStatTab(results[0], 'Latest Wins'),
          'High Rollers': resolveStatTab(results[1], 'High Rollers'),
          'Best Multipliers': resolveStatTab(results[2], 'Best Multipliers'),
          'Winners of the Day': resolveStatTab(results[3], 'Winners of the Day'),
          'Winners of the Month': resolveStatTab(results[4], 'Winners of the Month'),
        }

        const hasAnyData = Object.values(next).some((rows) => rows.length > 0)
        const anyRejected = results.some((r) => r.status === 'rejected')

        setData(next)
        if (!hasAnyData && anyRejected) {
          setError('Failed to load data')
        } else {
          setError(null)
        }
      } catch (err) {
        console.error('Failed to fetch game ranking data:', err)
        setError(err instanceof Error ? err.message : 'Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    fetchAllData()
  }, [])

  if (error) {
    return (
      <div className='min-h-fit font-satoshi text-white'>
        <div className='rounded-2xl border border-mirage bg-custom-dual-gradient p-6 text-center'>
          <p className='text-red-400'>Failed to load game rankings: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-fit font-satoshi text-white'>
      <span className='mb-6 flex justify-between gap-2 overflow-x-auto rounded-2xl border border-mirage bg-custom-dual-gradient px-5 pb-6 pt-6'>
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`shrink-0 rounded-lg px-6 py-4 font-satoshi text-sm font-medium text-white transition-all duration-200 ${
              activeTab === tab
                ? 'bg-dark-grey-gradient shadow-lg'
                : 'rounded-lg hover:border-mirage hover:bg-dark-grey-gradient'
            }`}
          >
            {tab}
          </button>
        ))}
      </span>

      <div className='rounded-2xl border border-mirage'>
        {loading ? (
          <div className='p-6'>
            <Skeleton className='mb-4 h-12 w-full' />
            <Skeleton className='mb-4 h-12 w-full' />
            <Skeleton className='mb-4 h-12 w-full' />
            <Skeleton className='h-12 w-full' />
          </div>
        ) : (
          <GameTable data={data[activeTab]} />
        )}
      </div>
    </div>
  )
}

export default GamingRanking

'use client'

import { memo, useCallback, useEffect, useState } from 'react'

import WinnerCard from './WinnerCard'

import { IUserRankingInfo } from '@/types/wagerRace'
const classGroups = [
  {
    badgeColor: 'bg-gold-badge',
    textShadow: 'text-shadow-wager-gold-text',
    textColor: 'text-gold-500',
    decorationColor: 'bg-gold-500',
    cardBackground: 'bg-wager-card-1th',
    levelBackground:
      'bg-[radial-gradient(116.86%_101.22%_at_26.16%_11.38%,_#FFD024_0%,_#F5A000_41.2%,_#BD5212_100%)]',
    margin: 'md:mb-10.5',
  },
  {
    badgeColor: 'bg-sliver-badge',
    textShadow: 'text-shadow-wager-sliver-text',
    textColor: 'text-sliver-500',
    decorationColor: 'bg-sliver-500',
    cardBackground: 'bg-wager-card-2th',
    levelBackground:
      'bg-[radial-gradient(136.39%_118.24%_at_12.23%_6.15%,_#716DED_41.2%,_#4E15AF_100%)]',
    margin: 'md:mt-10.5',
  },
  {
    badgeColor: 'bg-copper-badge',
    textShadow: 'text-shadow-wager-copper-text',
    textColor: 'text-copper-500',
    decorationColor: 'bg-copper-500',
    cardBackground: 'bg-wager-card-3th',
    levelBackground:
      'bg-[radial-gradient(116.95%_101.17%_at_26.15%_11.38%,_#FF8B74_0%,_#F85637_41.2%,_#9549DB_100%)]',
    margin: 'md:mt-10.5',
  },
]

interface ITopWinnersContainerProps {
  winners: IUserRankingInfo[]
}
const TopWinnersContainer = ({ winners }: ITopWinnersContainerProps) => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const getWinnerList = useCallback(() => {
    if (isMobile) {
      return winners.sort((a, b) => a.place - b.place)
    }

    if (winners.length === 3) {
      const sorted = [...winners].sort((a, b) => a.place - b.place)
      ;[sorted[0], sorted[1]] = [sorted[1], sorted[0]]
      return sorted
    }

    return winners
  }, [isMobile, winners])

  const handleCardPosition = (winnerCnt: number) => {
    let gridCols = 'md:grid-cols-1'
    let setMargin = false
    switch (winnerCnt) {
      case 1:
        gridCols = 'md:grid-cols-1'
        break
      case 2:
        gridCols = 'md:grid-cols-2'
        break
      case 3:
        gridCols = 'md:grid-cols-3'
        setMargin = true
        break
    }
    return { gridCols, setMargin }
  }

  return (
    <>
      {winners.length > 0 && (
        <div
          className={`mx-auto grid max-w-[828px] grid-cols-1 justify-center gap-1 ${
            handleCardPosition(winners.length)?.gridCols
          } md:gap-10.5`}
        >
          {getWinnerList().map((winner, index) => (
            <WinnerCard
              key={`${winner.username}-${index}`}
              winner={winner}
              classGroup={{
                ...classGroups[winner.place - 1],
                margin: handleCardPosition(winners.length)?.setMargin
                  ? classGroups[winner.place - 1].margin
                  : '',
              }}
            />
          ))}
        </div>
      )}
    </>
  )
}

export default memo(TopWinnersContainer)

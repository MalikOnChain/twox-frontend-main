import React, { memo, useMemo, useState } from 'react'

import { cn } from '@/lib/utils'

import ListBodyAll from '@/components/pages/(game)/crash/crash-game-container/bet-lists/list-body-all'
import ListBodyWin from '@/components/pages/(game)/crash/crash-game-container/bet-lists/list-body-win'
import ListTabs from '@/components/pages/(game)/crash/crash-game-container/bet-lists/list-tabs'

const BetLists = ({
  players,
  topWinners,
}: {
  players: any[]
  topWinners: any[]
}) => {
  const [selectedTab, setSelectedTab] = useState<'all' | 'winning'>('all')

  const totalBetAmount = useMemo(() => {
    return players?.reduce((acc, player) => acc + Number(player.betAmount), 0)
  }, [players])

  const winningUsers = useMemo(() => {
    return players?.filter(
      (player) => player.winningAmount && Number(player.winningAmount) > 0
    )
  }, [players])

  return (
    <div
      className={cn(
        'crash-game-bet-list',
        'flex-col xl:w-[420px] xl:min-w-[420px]',
        'min-w-auto flex w-full'
      )}
    >
      <ListTabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      {selectedTab === 'all' ? (
        <ListBodyAll
          players={players}
          totalBetAmount={totalBetAmount}
          winningUsers={winningUsers}
        />
      ) : (
        <ListBodyWin
          players={players}
          topWinners={topWinners}
          totalBetAmount={totalBetAmount}
          winningUsers={winningUsers}
        />
      )}
    </div>
  )
}

export default memo(BetLists)

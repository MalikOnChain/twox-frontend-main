// Custom hook optimization
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { useSocket } from '@/context/socket-context'

import { PUBLIC_SOCKET_NAMESPACES } from '@/lib/socket'

import { Bet, GameCategory } from '@/types/bet'
import { RecentWinItem } from '@/types/recent-win'

// Define context type
interface BettingStatusContextType {
  recentWinList: RecentWinItem[]
  allBets: Bet[]
  crashBets: Bet[]
  rouletteBets: Bet[]
  slotsBets: Bet[]
  limboBets: Bet[]
  casesBets: Bet[]
  diceBets: Bet[]
  liveCasinoBets: Bet[]
  addBet: (bet: Bet) => void
}

// Create context
const BettingStatusContext = createContext<
  BettingStatusContextType | undefined
>(undefined)

// Provider props type
interface BettingStatusProviderProps {
  children: ReactNode
}

// Provider component
export function BettingStatusProvider({
  children,
}: BettingStatusProviderProps) {
  const { socket } = useSocket(PUBLIC_SOCKET_NAMESPACES.BET_HISTORY)
  const [allBets, setAllBets] = useState<Bet[]>([])
  const [recentWinList, setRecentWinList] = useState<any[]>([])
  // Use ref to access latest bets in socket callbacks
  const allBetsRef = useRef(allBets)
  const recentWinListRef = useRef(recentWinList)

  // Add new states for categorized bets
  const [crashBets, setCrashBets] = useState<Bet[]>([])
  const [rouletteBets, setRouletteBets] = useState<Bet[]>([])
  const [slotsBets, setSlotsBets] = useState<Bet[]>([])
  const [limboBets, setLimboBets] = useState<Bet[]>([])
  const [casesBets, setCasesBets] = useState<Bet[]>([])
  const [diceBets, setDiceBets] = useState<Bet[]>([])
  const [liveCasinoBets, setLiveCasinoBets] = useState<Bet[]>([])
  // Update addBet to handle both all bets and categorized bets
  const addBet = useCallback((bet: Bet) => {
    setAllBets((prev) => [bet, ...prev].slice(0, 30))

    // Update category-specific state
    switch (bet.game) {
      case GameCategory.CRASH:
        setCrashBets((prev) => [bet, ...prev].slice(0, 30))
        break
      case GameCategory.ROULETTE:
        setRouletteBets((prev) => [bet, ...prev].slice(0, 30))
        break
      case GameCategory.SLOTS:
        setSlotsBets((prev) => [bet, ...prev].slice(0, 30))
        break
      case GameCategory.LIMBO:
        setLimboBets((prev) => [bet, ...prev].slice(0, 30))
        break
      case GameCategory.CASES:
        setCasesBets((prev) => [bet, ...prev].slice(0, 30))
        break
      case GameCategory.LIVE_CASINO:
        setLiveCasinoBets((prev) => [bet, ...prev].slice(0, 30))
        break
    }
  }, [])

  const processNewBet = useCallback((data: any): Bet => {
    const betTime = new Date(data.time)
    const time = betTime.toLocaleTimeString('en-US', { hour12: true })

    return {
      id: data.id || data._id,
      game: data.category,
      time,
      user: {
        username: data.username,
        avatar: data.avatar,
      },
      betAmount: data.betAmount,
      multiplier: Number((data.payout / data.betAmount).toFixed(2)),
      payout: data.payout,
      metadata: data.metadata || {},
    }
  }, [])

  const handleHistoryList = useCallback(
    (data: any) => {
      const {
        allBets,
        crashBets,
        rouletteBets,
        slotsBets,
        limboBets,
        casesBets,
        diceBets,
        liveCasinoBets,
      } = data.bets

      setAllBets(allBets.map(processNewBet))
      setCrashBets(crashBets.map(processNewBet))
      setRouletteBets(rouletteBets.map(processNewBet))
      setSlotsBets(slotsBets.map(processNewBet))
      setLimboBets(limboBets.map(processNewBet))
      setCasesBets(casesBets.map(processNewBet))
      setDiceBets(diceBets.map(processNewBet))
      setLiveCasinoBets(liveCasinoBets.map(processNewBet))
    },
    [processNewBet]
  )

  const handleNewBet = useCallback(
    (data: any) => {
      const newBet = processNewBet(data)
      addBet(newBet)
      const currentList = recentWinListRef.current
      let hasChanges = false

      const updatedRecentWinList = currentList.map((item) => {
        if (
          item.category === GameCategory.LIVE_CASINO &&
          newBet.game === GameCategory.LIVE_CASINO &&
          item.game?.provider === newBet.metadata?.provider_code &&
          item.game?.id === newBet.metadata?.game_code
        ) {
          hasChanges = true
          return {
            ...item,
            lastBet: {
              username: newBet.user.username,
              avatar: newBet.user.avatar,
              betAmount: newBet.betAmount,
              winAmount: newBet.payout,
              time: newBet.time,
              category: newBet.game,
              payout: newBet.payout,
            },
          }
        }
        return item
      })

      // Only update state if there were actual changes
      if (hasChanges) {
        setRecentWinList(updatedRecentWinList)
      }
    },
    [addBet, processNewBet]
  )

  const handleRecentWinList = useCallback(
    (data: { recentWinList: RecentWinItem[] }) => {
      // Initialize recentWinList with lastBet as null
      // setRecentWinList(data.recentWinList.filter((r) => Boolean(r.lastBet)))
      setRecentWinList(data.recentWinList)
    },
    []
  )

  useEffect(() => {
    allBetsRef.current = allBets
  }, [allBets])

  useEffect(() => {
    recentWinListRef.current = recentWinList
  }, [recentWinList])

  // Update handleHistoryList to handle categorized bets
  useEffect(() => {
    if (!socket) return

    socket.on('history-list', handleHistoryList)
    socket.on('new-bet', handleNewBet)
    socket.on('recent-win-list', handleRecentWinList)

    return () => {
      socket.off('history-list')
      socket.off('new-bet')
      socket.off('recent-win-list')
    }
  }, [socket, handleHistoryList, handleNewBet, handleRecentWinList])

  useEffect(() => {
    if (socket) {
      socket.emit('get-recent-win-list')
      socket.emit('get-recent-bets', { limit: 30 })
    }
  }, [socket])

  const value = useMemo(
    () => ({
      recentWinList,
      allBets,
      crashBets,
      rouletteBets,
      slotsBets,
      limboBets,
      casesBets,
      diceBets,
      liveCasinoBets,
      addBet,
    }),
    [
      recentWinList,
      allBets,
      crashBets,
      rouletteBets,
      slotsBets,
      limboBets,
      casesBets,
      diceBets,
      liveCasinoBets,
      addBet,
    ]
  )

  return (
    <BettingStatusContext.Provider value={value}>
      {children}
    </BettingStatusContext.Provider>
  )
}

// Custom hook to use the context
export function useBettingStatus() {
  const context = useContext(BettingStatusContext)
  if (context === undefined) {
    throw new Error(
      'useBettingStatus must be used within a BettingStatusProvider'
    )
  }
  return context
}

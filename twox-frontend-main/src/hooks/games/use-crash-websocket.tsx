import { useCallback, useEffect, useRef } from 'react'
import { toast } from 'sonner'

import { useCrashGame } from '@/context/games/crash-context'
import { useSocket } from '@/context/socket-context'
import { useUser } from '@/context/user-context'

import { GameStates } from '@/lib/games/crash'
import { SOCKET_NAMESPACES } from '@/lib/socket'

interface GameStartingData {
  timeUntilStart: number
}

interface GameEndData {
  game: {
    id: string
    crashPoint: number
    timestamp: number
    players: any[]
  }
}

interface BetCashoutData {
  playerId: string
  status: string
  stoppedAt: number
  winningAmount: number
}

const CRASH_EVENTS = {
  GAME_STARTING: 'game-starting',
  GAME_START: 'game-start',
  GAME_END: 'game-end',
  GAME_TICK: 'game-tick',
  GAME_BETS: 'game-bets',
  BET_CASHOUT: 'bet-cashout',
  PLACE_BET: 'place-bet',
  CASHOUT: 'cashout',
} as const

export const useCrashWebSocket = () => {
  const { socket } = useSocket(SOCKET_NAMESPACES.CRASH)
  const { user } = useUser()

  const {
    setGameState,
    setStartTime,
    setPlayers,
    setHistory,
    addPlayer,
    updatePlayer,
    updateMultiplier,
    setCrashPoint,
    setTopWinners,
    gameState,
  } = useCrashGame()

  const gameStateRef = useRef(gameState)

  // Game state event handlers
  const handleGameStarting = useCallback(
    (data: GameStartingData) => {
      setStartTime(new Date(Date.now() + data.timeUntilStart))
      setGameState(GameStates.Starting)
      setPlayers([])
    },
    [setStartTime, setGameState, setPlayers]
  )

  const handleGameStart = useCallback(() => {
    setGameState(GameStates.InProgress)
  }, [setGameState])

  const handleGameEnd = useCallback(
    (data: GameEndData) => {
      setCrashPoint(data.game.crashPoint)
      setGameState(GameStates.Over)
    },
    [setCrashPoint, setGameState]
  )

  const handleGameTick = useCallback(
    (multiplier: number) => {
      updateMultiplier(multiplier)
      if (gameStateRef.current !== GameStates.InProgress) {
        setGameState(GameStates.InProgress)
      }
    },
    [updateMultiplier, setGameState]
  )

  const handleGameBets = useCallback(
    (bets: any[]) => {
      bets.forEach((bet) => addPlayer(bet))
    },
    [addPlayer]
  )

  const handleBetCashout = useCallback(
    (data: BetCashoutData) => {
      updatePlayer(data)
    },
    [updatePlayer]
  )

  const handleNotification = useCallback(
    (type: 'error' | 'success', data: any) => {
      toast[type](
        data?.msg || data?.message || 'something went wrong in the response'
      )
    },
    []
  )

  const handleHistories = useCallback(
    (histories: any) => {
      if (histories?.success) {
        setHistory(histories?.data)
      }
    },
    [setHistory]
  )

  const handleTopWinners = useCallback(
    (response: any) => {
      if (response?.success) {
        setTopWinners(response?.data)
      }
    },
    [setTopWinners]
  )

  useEffect(() => {
    gameStateRef.current = gameState
  }, [gameState])

  useEffect(() => {
    // Bind all game events
    if (socket) {
      socket.emit('get-game-histories').then(handleHistories)

      socket.on(CRASH_EVENTS.GAME_STARTING, handleGameStarting)
      socket.on(CRASH_EVENTS.GAME_START, handleGameStart)
      socket.on(CRASH_EVENTS.GAME_END, handleGameEnd)
      socket.on(CRASH_EVENTS.GAME_TICK, handleGameTick)
      socket.on(CRASH_EVENTS.GAME_BETS, handleGameBets)
      socket.on(CRASH_EVENTS.BET_CASHOUT, handleBetCashout)

      socket.on('game-top-winners', handleTopWinners)

      socket.on('game-histories', handleHistories)
      socket.on('game-join-success', (data) =>
        handleNotification('success', data)
      )
      socket.on('game-join-error', (data) => handleNotification('error', data))
      socket.on('bet-cashout-success', (data) =>
        handleNotification('success', data)
      )
      socket.on('bet-cashout-error', (data) =>
        handleNotification('error', data)
      )
    }

    // Cleanup function
    return () => {
      if (socket) {
        socket.off(CRASH_EVENTS.GAME_STARTING)
        socket.off(CRASH_EVENTS.GAME_START)
        socket.off(CRASH_EVENTS.GAME_END)
        socket.off(CRASH_EVENTS.GAME_TICK)
        socket.off(CRASH_EVENTS.GAME_BETS)
        socket.off(CRASH_EVENTS.BET_CASHOUT)
        socket.off('game-histories')

        socket.off('game-join-success')
        socket.off('game-join-error')
        socket.off('bet-cashout-success')
        socket.off('bet-cashout-error')
      }
    }
  }, [
    socket,
    handleGameStarting,
    handleGameStart,
    handleGameEnd,
    handleGameTick,
    handleGameBets,
    handleBetCashout,
    handleNotification,
    handleHistories,
    handleTopWinners,
  ])

  // Game action functions
  const placeBet = useCallback(
    (betAmount: number, autoCashoutAt?: number) => {
      if (socket) {
        socket.emit(CRASH_EVENTS.PLACE_BET, { betAmount, autoCashoutAt })
      }
    },
    [socket]
  )

  const cashout = useCallback(() => {
    if (socket && user) {
      socket.emit(CRASH_EVENTS.CASHOUT, user?._id)
    }
  }, [socket, user])

  return { placeBet, cashout }
}

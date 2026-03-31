// contexts/CrashGameContext.tsx
'use client'

import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useReducer,
} from 'react'

import { GameAction, GameState, GameStates } from '@/lib/games/crash'

interface CrashGameContextType {
  state: CrashGameState
  dispatch: React.Dispatch<CrashGameAction>
}

interface CrashGameState extends GameState {
  crashPoint?: number
  currentMultiplier?: number
  betAmount?: number
  autoCashoutAt?: number
  isAutoBetting?: boolean
  lastBet?: {
    amount: number
    multiplier: number
    profit: number
  }
  topWinners?: {
    playerId: string
    username: string
    avatar: string
    totalProfit: number
    totalBets: number
    totalWinnings: number
  }[]
}

type CrashGameAction =
  | GameAction
  | { type: 'SET_CRASH_POINT'; payload: number }
  | { type: 'SET_CURRENT_MULTIPLIER'; payload: number }
  | { type: 'SET_BET_AMOUNT'; payload: number }
  | { type: 'SET_AUTO_CASHOUT'; payload: number }
  | { type: 'SET_AUTO_BETTING'; payload: boolean }
  | {
      type: 'SET_LAST_BET'
      payload: { amount: number; multiplier: number; profit: number }
    }
  | {
      type: 'SET_TOP_WINNERS'
      payload: {
        playerId: string
        username: string
        avatar: string
        totalProfit: number
        totalBets: number
        totalWinnings: number
      }[]
    }

const CrashGameContext = createContext<CrashGameContextType | undefined>(
  undefined
)

const initialCrashGameState: CrashGameState = {
  isAuthenticated: false,
  user: null,
  gameState: GameStates.Starting,
  loading: true,
  players: [],
  startTime: null,
  history: [],
  crashPoint: 0,
  currentMultiplier: 1,
  betAmount: 0,
  autoCashoutAt: 0,
  isAutoBetting: false,
  lastBet: undefined,
  topWinners: [],
}

const crashGameReducer = (
  state: CrashGameState,
  action: CrashGameAction
): CrashGameState => {
  switch (action.type) {
    case 'SET_AUTH':
      return {
        ...state,
        isAuthenticated: action.payload.isAuthenticated,
        user: action.payload.user,
      }
    case 'SET_GAME_STATE':
      return {
        ...state,
        gameState: action.payload,
      }
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      }
    case 'SET_PLAYERS':
      return {
        ...state,
        players: action.payload,
      }
    case 'ADD_PLAYER':
      return {
        ...state,
        players: [...state.players, action.payload],
      }
    case 'UPDATE_PLAYER':
      return {
        ...state,
        players: state.players.map((player) =>
          player.playerId === action.payload.playerId
            ? { ...player, ...action.payload }
            : player
        ),
      }
    case 'SET_START_TIME':
      return {
        ...state,
        startTime: action.payload,
      }
    case 'SET_HISTORY':
      return {
        ...state,
        history: action.payload,
      }
    case 'ADD_TO_HISTORY':
      return {
        ...state,
        history:
          state.history.length >= 50
            ? [...state.history.slice(1), action.payload]
            : [...state.history, action.payload],
      }
    case 'SET_CRASH_POINT':
      return {
        ...state,
        crashPoint: action.payload,
      }
    case 'SET_CURRENT_MULTIPLIER':
      return {
        ...state,
        currentMultiplier: action.payload,
      }
    case 'SET_BET_AMOUNT':
      return {
        ...state,
        betAmount: action.payload,
      }
    case 'SET_AUTO_CASHOUT':
      return {
        ...state,
        autoCashoutAt: action.payload,
      }
    case 'SET_AUTO_BETTING':
      return {
        ...state,
        isAutoBetting: action.payload,
      }
    case 'SET_LAST_BET':
      return {
        ...state,
        lastBet: action.payload,
      }
    case 'SET_TOP_WINNERS':
      return {
        ...state,
        topWinners: action.payload,
      }
    default:
      return state
  }
}

interface CrashGameProviderProps {
  children: ReactNode
}

export const CrashGameProvider: React.FC<CrashGameProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(crashGameReducer, initialCrashGameState)

  return (
    <CrashGameContext.Provider value={{ state, dispatch }}>
      {children}
    </CrashGameContext.Provider>
  )
}

export const useCrashGame = () => {
  const context = useContext(CrashGameContext)
  if (!context) {
    throw new Error(
      'useCrashGameActions must be used within a CrashGameProvider'
    )
  }

  const { state, dispatch } = context

  // Game state management
  const setGameState = useCallback(
    (gameState: GameStates) => {
      dispatch({ type: 'SET_GAME_STATE', payload: gameState })
    },
    [dispatch]
  )

  const setLoading = useCallback(
    (loading: boolean) => {
      dispatch({ type: 'SET_LOADING', payload: loading })
    },
    [dispatch]
  )

  const setPlayers = useCallback(
    (players: any[]) => {
      dispatch({ type: 'SET_PLAYERS', payload: players })
    },
    [dispatch]
  )

  const addPlayer = useCallback(
    (player: any) => {
      dispatch({ type: 'ADD_PLAYER', payload: player })
    },
    [dispatch]
  )

  const updatePlayer = useCallback(
    (playerUpdate: any) => {
      dispatch({ type: 'UPDATE_PLAYER', payload: playerUpdate })
    },
    [dispatch]
  )

  const setStartTime = useCallback(
    (time: Date) => {
      dispatch({ type: 'SET_START_TIME', payload: time })
    },
    [dispatch]
  )

  const setHistory = useCallback(
    (history: any[]) => {
      dispatch({ type: 'SET_HISTORY', payload: history })
    },
    [dispatch]
  )

  const addToHistory = useCallback(
    (game: any) => {
      dispatch({ type: 'ADD_TO_HISTORY', payload: game })
    },
    [dispatch]
  )

  // Crash-specific actions
  const setBetAmount = useCallback(
    (amount: number) => {
      dispatch({ type: 'SET_BET_AMOUNT', payload: amount })
    },
    [dispatch]
  )

  const setAutoCashout = useCallback(
    (multiplier: number) => {
      dispatch({ type: 'SET_AUTO_CASHOUT', payload: multiplier })
    },
    [dispatch]
  )

  const setAutoBetting = useCallback(
    (isEnabled: boolean) => {
      dispatch({ type: 'SET_AUTO_BETTING', payload: isEnabled })
    },
    [dispatch]
  )

  const updateMultiplier = useCallback(
    (multiplier: number) => {
      dispatch({ type: 'SET_CURRENT_MULTIPLIER', payload: multiplier })
    },
    [dispatch]
  )

  const setCrashPoint = useCallback(
    (point: number) => {
      dispatch({ type: 'SET_CRASH_POINT', payload: point })
    },
    [dispatch]
  )

  const setLastBet = useCallback(
    (bet: { amount: number; multiplier: number; profit: number }) => {
      dispatch({ type: 'SET_LAST_BET', payload: bet })
    },
    [dispatch]
  )

  const setAuth = useCallback(
    (isAuthenticated: boolean, user: any | null) => {
      dispatch({
        type: 'SET_AUTH',
        payload: { isAuthenticated, user },
      })
    },
    [dispatch]
  )

  const setTopWinners = useCallback(
    (
      topWinners: {
        playerId: string
        username: string
        avatar: string
        totalProfit: number
        totalBets: number
        totalWinnings: number
      }[]
    ) => {
      dispatch({ type: 'SET_TOP_WINNERS', payload: topWinners })
    },
    [dispatch]
  )

  return {
    // State
    ...state,

    // Game state actions
    setGameState,
    setLoading,
    setPlayers,
    addPlayer,
    updatePlayer,
    setStartTime,
    setHistory,
    addToHistory,
    setAuth,

    // Crash-specific actions
    setBetAmount,
    setAutoCashout,
    setAutoBetting,
    updateMultiplier,
    setCrashPoint,
    setLastBet,
    setTopWinners,
  }
}

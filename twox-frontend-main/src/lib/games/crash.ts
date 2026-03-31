export enum GameStates {
  Starting = 1,
  InProgress = 2,
  Over = 3,
}

export interface Player {
  playerId: string
  username: string
  avatar?: string
  betAmount: number
  stoppedAt?: number
  status?: string
  winningAmount?: number
}

export interface Game {
  id: string
  crashPoint: number
  timestamp: number
  players: Player[]
}

export interface GameSchema {
  current: {
    status: GameStates
    players: Player[]
    elapsed: number
  }
  history: Game[]
}

export interface GameState {
  isAuthenticated: boolean
  user: User | null
  gameState: GameStates
  loading: boolean
  players: Player[]
  startTime: Date | null
  history: Game[]
}

export interface User {
  _id: string
  username: string
  avatar?: string
}

// Action types
export type GameAction =
  | {
      type: 'SET_AUTH'
      payload: { isAuthenticated: boolean; user: User | null }
    }
  | { type: 'SET_GAME_STATE'; payload: GameStates }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_PLAYERS'; payload: Player[] }
  | { type: 'ADD_PLAYER'; payload: Player }
  | { type: 'UPDATE_PLAYER'; payload: Partial<Player> & { playerId: string } }
  | { type: 'SET_START_TIME'; payload: Date }
  | { type: 'SET_HISTORY'; payload: Game[] }
  | { type: 'ADD_TO_HISTORY'; payload: Game }

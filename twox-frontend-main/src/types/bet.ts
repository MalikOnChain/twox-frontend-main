import CasesIcon from '@/assets/game-icons/cases.svg'
import LiveCasinoIcon from '@/assets/game-icons/casino.svg'
import CrashIcon from '@/assets/game-icons/crash.svg'
import LimboIcon from '@/assets/game-icons/limbo.svg'
import MinesIcon from '@/assets/game-icons/mines.svg'
import RouletteIcon from '@/assets/game-icons/roulette.svg'
import SlotsIcon from '@/assets/game-icons/slots.svg'

export enum GameCategory {
  CRASH = 'Crash',
  ROULETTE = 'Roulette',
  SLOTS = 'Slots',
  LIMBO = 'Limbo',
  CASES = 'Cases',
  LIVE_CASINO = 'Live Casino',
  MINES = 'Mines',
}

export interface Bet {
  id?: string
  game: GameCategory
  time: string
  user: {
    username: string
    avatar: string
  }
  betAmount: number
  multiplier: number
  payout: number
  metadata?: any
}

export type GameType =
  | 'Cases'
  | 'Slots'
  | 'Live Casino'
  | 'Crash'
  | 'Roulette'
  | 'Mines'
  | 'Limbo'

export const GameIcons = {
  Cases: CasesIcon,
  Slots: SlotsIcon,
  'Live Casino': LiveCasinoIcon,
  Crash: CrashIcon,
  Roulette: RouletteIcon,
  Mines: MinesIcon,
  Limbo: LimboIcon,
}

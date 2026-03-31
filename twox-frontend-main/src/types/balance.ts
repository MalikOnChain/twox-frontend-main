import { UserBonusDetails } from '@/types/bonus'

export enum BALANCE_UPDATE_TYPES {
  BONUS = 'BONUS',
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
  GAME = 'GAME',
  CASHBACK = 'CASHBACK',
  WAGER_RACE = 'WAGER_RACE',
}

export interface IBalance {
  realBalance: number
  totalBonusBalance: number
  totalLockedWinnings: number
  totalBalance: number
  freeSpinBalance: number
  bonusDetails: UserBonusDetails[]
}

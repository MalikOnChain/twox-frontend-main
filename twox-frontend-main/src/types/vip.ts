export interface LoyaltyTier {
  _id: string
  name: string
  icon: string
  levels: ITierLevel[]
  downgradePeriod: number
  __v: number
  createdAt: string
}

interface ITierLevel {
  name: string
  icon: string
  minXP: number
  level: number
  isCompleted?: boolean
}

interface Milestone {
  rank: string
  level: number
  wagerRequired: number
  achieved: boolean
  remainingWager: number
  progress: number
}

interface NextMilestone {
  type: string
  wager: number
  remaining: number
}

export interface UserRankStatus {
  endLevel: string
  endTier: string
  currentTier: string
  currentLevel: string
  progress: number
  remainingXP: number
  totalRequired: number
  currentXP: number
  nextMilestone?: NextMilestone
  totalXP: number
  milestones?: Milestone[]
}

export enum VIP_TIERS {
  NOVICE = 'novice',
  CHALLENGER = 'challenger',
  PRO = 'pro',
  ELITE = 'elite',
  LEGEND = 'legend',
  THE_DON = 'the don',
}

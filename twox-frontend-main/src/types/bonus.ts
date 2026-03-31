enum BonusType {
  WELCOME = 'welcome',
  FIRST_DEPOSIT = 'first-deposit',
  SECOND_DEPOSIT = 'second-deposit',
  RECURRING = 'recurring',
  CUSTOM = 'custom',
  REFERRAL = 'referral',
  WAGER_RACE = 'wager-race',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
}

enum ClaimStatus {
  CAN_CLAIM = 'canClaim',
  CLAIMED = 'claimed',
  CANNOT_CLAIM = 'cannotClaim',
}

enum ClaimMethod {
  AUTO = 'auto',
  MANUAL = 'manual',
  CODE = 'code',
}

enum EligibleUsers {
  ALL = 'all',
  RANK = 'rank',
  USER_LIST = 'userList',
}

enum GameRestrictionsCategories {
  ALL = 'all',
  SLOTS = 'slots',
  LIVE_CASINO = 'live-casino',
}

enum BonusStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DRAFT = 'draft',
  EXPIRED = 'expired',
}

enum ReferralStatus {
  ACTIVE = 1,
  INACTIVE = 0,
}

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6
export interface GameRestrictions {
  gameIds: string[] // MongoDB ObjectIds as strings
  categories: GameRestrictionsCategories[]
}
export interface BonusRequirements {
  depositAmount?: number
  minDepositAmount?: number
  wagerAmount: number
}

export interface BonusReward {
  minAmount: number
  maxAmount: number
  freeSpins: number
}

export interface EligibleBonus {
  claimStatus: ClaimStatus
  claimStatusMessage: string
  type: BonusType
  whenCanClaim: string | null
  _id: string
}
// Main Bonus interface
export interface Bonus extends EligibleBonus {
  isVisible: boolean
  reward: BonusReward
  period: {
    validFrom: string
    validTo: string | null
  }
  eligibleUsers: {
    type: EligibleUsers
    ranks: string[]
    userIds: string[]
  }
  _id: string
  name: string
  type: BonusType
  description: string
  isRandomBonus: boolean
  wagerMultiplier: number
  allowedDays: DayOfWeek[]
  claimMethod: ClaimMethod
  status: BonusStatus
  code: string | null
}

export interface ReferralBonus extends EligibleBonus {
  _id: string // MongoDB ObjectId as string
  name: string
  type: BonusType
  description: string
  amount: number
  requiredReferralCount: number
  claimMethod: ClaimMethod
  isVisible: boolean
  code: string | null
  status: ReferralStatus
  createdAt: string // ISO date string
  updatedAt: string // ISO date string
  __v: number // MongoDB version key
}

// BonusRedemption interfaces
interface BonusRedemptionRequirements {
  depositRequirement: {
    required: boolean
    totalRequired: number
    currentAmount: number
    completed: boolean
    completedAt?: string
  }
  wageringRequirement: {
    required: boolean
    totalRequired: number
    currentAmount: number
    completed: boolean
    completedAt?: string
  }
  updatedAt: string
}

export interface BonusRedemption {
  _id: string
  userId: string
  bonusId: string
  type: BonusType
  claimMethod: ClaimMethod
  amount: number
  claimedAt: string
  isConsumed: boolean
  requirements: BonusRedemptionRequirements
  __v: number
}

// new
export interface UserBonusDetails {
  bonusBalance: number
  bonusId: string
  bonusType: BonusType
  initialAmount: number
  lockedWinnings: number
  remainingWagering: number
  wageringMultiplier: number
  wageringProgress: number
}

export interface ReferralMetrics {
  totalReferrals: number
  totalDeposits: number
  totalWagered: number
  totalEarnings: number
}
export {
  BonusStatus,
  BonusType,
  ClaimMethod,
  ClaimStatus,
  EligibleUsers,
  GameRestrictionsCategories,
}

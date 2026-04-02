interface Balances {
  ethereum: number
  bsc: number
  polygon: number
}

interface SelfExcludes {
  crash: number
  jackpot: number
  coinflip: number
  roulette: number
}

export interface IUser {
  balances: Balances
  selfExcludes: SelfExcludes
  balance: number
  wager: number
  verified: boolean
  hasVerifiedAccount: boolean
  verifiedPhoneNumber: string | null
  rank: number
  accountVerified: unknown | null
  banExpires: string
  muteExpires: string
  transactionsLocked: boolean
  betsLocked: boolean
  _affiliatedBy: string | null
  affiliateClaimed: unknown | null
  affiliateCode: string | null
  affiliateMoney: number
  affiliateMoneyCollected: number
  forgotToken: string | null
  fullName: string | null
  forgotExpires: number
  caseBalance: number
  wagerNeededForWithdraw: number
  totalDeposited: number
  totalWithdrawn: number
  customWagerLimit: number
  avatarLastUpdate: number
  enabledTwoFA: boolean
  privated: boolean
  bot_user: boolean
  lastLogin: string | null
  isEmailVerified: boolean
  _id: string
  provider: string
  providerId: string
  username: string
  avatar: string
  wallets: Array<unknown>
  transactions: Array<unknown>
  createdAt: string
  __v: number
  googleId?: string
  discordId?: string
  telegramId?: string
  email: string
  /** Present when returned from `/user`; used for admin UI (e.g. link to admin panel). */
  role?: 'user' | 'admin' | 'gesture'
  referralCode: string
  hasPassword: boolean
  spinCount: number
  freeSpinCount: number
  CPFNumber?: string
  address?: string
  zipCode?: string
  country?: string
  city?: string
  phoneNumber?: string
}

export interface IReferredUser {
  _id: string
  username: string
  createdAt: string
  totalWagered: number
  depositStatus: boolean
}

export enum LinkedState {
  LINK = 'link',
  UNLINK = 'unlink',
}

export interface KYCStatus {
  status: string
  adminReview: any
}

export enum KYC_STATUS {
  PENDING = 'pending',
  REVIEWING = 'reviewing',
  COMPLETED = 'completed',
  REJECTED = 'rejected',
  ON_HOLD = 'onHold',
  INIT = 'init',
}

export enum ADMIN_REVIEW_STATUS {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export interface IUpdateProfile {
  username: string
  fullName: string
  address?: string
  zipCode?: string
  country?: string
  city?: string
  phoneNumber?: string
  CPFNumber?: string
}

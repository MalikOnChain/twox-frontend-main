export interface WagerRace {
  _id?: string
  title: string
  description: string
  period: {
    start: string
    end: string
  }
  eligibleGames?: string[]
  minWager: number
  prize: {
    type: string
    amount: number
  }
  participants: {
    type: string
    code?: string
    tiers?: string[]
    users: IWagerRaceParticipant[]
  }
  payoutType: string
  delay?: {
    type: string
    value: number
  }
  winners?: string[]
  paymentStatus: string
  status: string
  createdAt: string
  updatedAt: string
}

export interface IWagerRaceParticipant {
  userId: string
  totalWagered: number
}

export interface IUserRankingInfo {
  place: number
  username: string
  avatar: string
  totalWagered: number
  prize: number
}

export interface IUserRankData {
  totalWagered: number
  userId: {
    _id: string
    username: string
    avatar: string
  }
}

export interface IWagerRaceRankingData {
  title: string
  description: string
  period?: {
    start: string
    end: string
  }
  prize: {
    type: string
    amounts: number[]
  }
  minWager: number
  ranking: IUserRankData[]
}

export enum TPrizeTypes {
  FIXED = 'Fixed',
  PERCENTAGE = 'Percentage',
}

export type TRankingResponse = {
  success: boolean
  message?: string
  rankingData: IWagerRaceRankingData
}

export type TWagerRaceResponse = {
  success: boolean
  message?: string
  wagerRaces: WagerRace[]
}

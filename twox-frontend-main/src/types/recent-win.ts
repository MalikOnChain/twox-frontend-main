export interface RecentWinItem {
  _id: string
  category: string
  game: {
    name: string
    id: string
    provider: string
  }
  banners: string
  isActive: boolean
  displayOrder: number
  createdAt: string
  updatedAt: string
  lastBet?: {
    avatar: string
    betAmount: number
    winAmount: number
    username: string
    time: string
    category: string
    payout: number
  }
}

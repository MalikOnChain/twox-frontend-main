import Battles from '@/assets/native-game/battles.png'
import Cases from '@/assets/native-game/cases.webp'
import CoinFlip from '@/assets/native-game/coin-flip.png'
import Crash from '@/assets/native-game/crash.png'
import Jackpot from '@/assets/native-game/jackpot.png'
import Limbo from '@/assets/native-game/limbo.png'
import LiveCasino from '@/assets/native-game/live-casino.webp'
import Mines from '@/assets/native-game/mines.png'
import Roulette from '@/assets/native-game/roulette.png'
import Slots from '@/assets/native-game/slots.webp'
import Lottery from '@/assets/thumbnails/lottery.webp'
import WagerRace from '@/assets/thumbnails/wager-race.webp'

import { GameCategory } from '@/types/bet'
import { NativeGameListItem } from '@/types/game'

export const NATIVE_GAME_LIST: NativeGameListItem[] = [
  {
    name: 'Cases',
    to: '/cases',
    imageSrc: Cases,
  },
  {
    name: 'Slots',
    to: '/slots',
    imageSrc: Slots,
    disabled: true,
  },
  {
    name: 'Live Casino',
    to: '/live-casino',
    imageSrc: LiveCasino,
    disabled: true,
  },
  {
    name: 'Roulette',
    to: '/roulette',
    imageSrc: Roulette,
    disabled: true,
  },
  {
    name: 'Crash',
    to: '/crash',
    imageSrc: Crash,
    disabled: true,
  },
  {
    name: 'Mines',
    to: '/mines',
    imageSrc: Mines,
    disabled: true,
  },
  {
    name: 'Limbo',
    to: '/limbo',
    imageSrc: Limbo,
    disabled: true,
  },
  {
    name: 'Battles',
    to: '/battles',
    imageSrc: Battles,
    disabled: true,
  },
  {
    name: 'Jackpot',
    to: '/jackpot',
    imageSrc: Jackpot,
    disabled: true,
  },
  {
    name: 'Coin Flip',
    to: '/coin-flip',
    imageSrc: CoinFlip,
    disabled: true,
  },
]

export const GAME_CARD_CONTENT: any = {
  [GameCategory.CASES]: {
    title: 'Cases',
    description:
      'Dive into a thrilling game of chance where every case holds the potential for incredible rewards. Crack open mystery cases packed with rare items, powerful bonuses, or massive multipliers.',
    shortDescription: 'Open mystery cases for rare items and big bonuses.',
    gameImage: Cases,
    href: '/cases',
    disabled: true,
  },
  lottery: {
    title: 'Lottery',
    description: 'Try your luck in the daily lottery draw!',
    shortDescription: 'Enter daily draws for a chance to win!',
    gameImage: Lottery,
    href: '/lottery',
    disabled: true,
  },
  'wager-race': {
    title: 'Wager Race',
    description:
      'Compete with others to climb the leaderboard and earn rewards!',
    shortDescription: 'Climb the leaderboard and win rewards.',
    gameImage: WagerRace,
    href: '/#wager-race',
  },
  [GameCategory.SLOTS]: {
    title: 'Slots',
    description:
      'Spin the reels in a dazzling array of slot games featuring rich visuals, captivating themes, and big win potential.',
    shortDescription: 'Spin and win in thrilling slot games.',
    gameImage: Slots,
    href: '/slots',
  },
  [GameCategory.LIVE_CASINO]: {
    title: 'Live Casino',
    description:
      'Step into the world of real-time gaming with professional live dealers hosting your favorite table games.',
    shortDescription: 'Play real-time games with live dealers.',
    gameImage: LiveCasino,
    href: '/live-casino',
  },
}

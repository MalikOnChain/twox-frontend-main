import { StaticImageData } from 'next/image'


export enum ProviderGameType {
  SLOT = 'video-slots',
  LIVE = 'video-slots',
  POPULAR = 'video-slots',
  FEATURE = 'video-slots',
  SHOWS = 'video-slots',
  RECOMMENDED = 'video-slots',
  TABLE = 'table-games',
  ROULETTE = 'live-casino-table',
  BLACKJACK = 'live-casino-table',
  FAVORITES = 'video-slots',
  RECENT = 'video-slots',
}

export enum GamePlayMode {
  REAL = 'real',
  FUN = 'fun',
}

export enum GameSliderMode {
  RECENT = 'recent',
  RANDOM = 'random',
}

export type TProviderGameType =
  | 'video-slots'
  | 'livecasino'
  | 'live'
  | 'popular'
  | 'feature'
  | 'shows'
  | 'table-games'
  | 'live-casino-table'
  | 'favorites'
  | 'recent'
  | 'all'

export type TGameProvider = {
  _id: string
  code: string
  name: string
  type: string
  id: number
  gamesCount: number
  image?: string
  imageColored?: string
  imageSmallColor?: string
}

export type TProviderGameItem = {
  _id: string
  provider_code: string
  game_code: string
  banner: string
  game_name: string
  id: number
  status: number
  type: string
}

export interface NativeGameListItem {
  to: string
  name: string
  imageSrc: StaticImageData
  imageClassName?: string
  disabled?: boolean
}

export enum GAME_RESULT {
  WIN = 'WIN',
  LOSS = 'LOSE',
}

// Re-export BlueOcean types for easier usage
export type { BlueOceanGameType,BlueOceanProviderType } from './blueocean'
export { BlueOceanGameProviders,BlueOceanGameTypes } from './blueocean'

import api from '@/lib/api'
import { handleApiError } from '@/lib/error-handler'

import {
  TGameProvider,
  TProviderGameItem,
  TProviderGameType,
} from '@/types/game'
import { BlueOceanGameProviders, BlueOceanGameTypes, BlueOceanProviderAliases, BlueOceanTypeAliases } from '@/types/blueocean'
import { TPagination } from '@/types/pagination'

export interface GameDataResponse {
  data: TProviderGameItem[]
  pagination: TPagination
  error?: any
}

export interface GameProviderResponse {
  data: TGameProvider[]
  error?: any
}

export interface GameLaunchResponse {
  launch_url: string
  status: number
  error?: any
}

export const getGames = async ({
  type,
  limit,
  offset,
  provider,
  category,
  query = '',
  sortBy,
  sortOrder,
  featurebuySupported,
}: {
  type: TProviderGameType
  limit: number
  offset: number
  provider: string
  category?: string
  query?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  featurebuySupported?: boolean
}): Promise<GameDataResponse> => {
  try {
    // Convert frontend types to BlueOcean enum values
    const blueOceanType = convertToBlueOceanType(type)
    const blueOceanProvider = convertToBlueOceanProvider(provider)
    
    const params = new URLSearchParams({
      type: blueOceanType,
      provider: blueOceanProvider,
      limit: limit.toString(),
      offset: offset.toString(),
      query,
    })

    if (category && category !== 'all') {
      params.append('category', category)
    }

    console.log('🌐 API call params:', {
      originalProvider: provider,
      convertedProvider: blueOceanProvider,
      originalType: type,
      convertedType: blueOceanType,
      category,
      query,
      limit,
      offset
    })

    if (sortBy) {
      params.append('sortBy', sortBy)
    }

    if (sortOrder) {
      params.append('sortOrder', sortOrder)
    }

    if (featurebuySupported !== undefined) {
      params.append('featurebuySupported', featurebuySupported.toString())
    }

    const response = await api.get<GameDataResponse>(
      '/slots-casino/blueocean/game/games',
      { params }
    )

    if (response.data.error) {
      throw new Error(response.data.error)
    }

    return response.data
  } catch (error) {
    throw handleApiError(error, 'Failed to get game list')
  }
}

export const getGamesProviders = async ({
  type,
}: {
  type: TProviderGameType
}): Promise<GameProviderResponse> => {
  try {
    // Convert frontend type to BlueOcean enum value
    const blueOceanType = convertToBlueOceanType(type)
    
    const params = new URLSearchParams({
      type: blueOceanType,
    })

    const response = await api.get<GameProviderResponse>(
      '/slots-casino/blueocean/game/providers',
      { params }
    )

    console.log('🌐 API call response:', response.data);

    if (response.data.error) {
      throw new Error(response.data.error)
    }

    return response.data
  } catch (error) {
    throw handleApiError(error, 'Failed to get game providers')
  }
}

export interface GameCategoriesResponse {
  data: string[]
  error?: any
}

export const getGameCategories = async (): Promise<GameCategoriesResponse> => {
  try {
    const response = await api.get<GameCategoriesResponse>(
      '/slots-casino/blueocean/game/categories'
    )

    if (response.data.error) {
      throw new Error(response.data.error)
    }

    return response.data
  } catch (error) {
    throw handleApiError(error, 'Failed to get game categories')
  }
}

export const syncBlueOceanGames = async (): Promise<{
  success: boolean
  message: string
  syncedCount: number
}> => {
  try {
    const response = await api.post('/slots-casino/blueocean/game/sync')
    
    if (response.data.error) {
      throw new Error(response.data.error)
    }

    return response.data
  } catch (error) {
    throw handleApiError(error, 'Failed to sync BlueOcean games')
  }
}

export const onChangePlayMode = async (
  payload: {
    provider_code: string
    game_code: string
  },
  isDemo?: boolean,
  userCredentials?: {
    username: string
    password: string
  },
  fingerprint?: { visitorId: string; fingerprintData?: any }
): Promise<GameLaunchResponse> => {
  // Use the new gameplay API if user credentials are provided
  if (userCredentials) {
    try {
      const gameplayResponse = await launchGameplay({
        user_username: userCredentials.username,
        user_password: userCredentials.password,
        gameid: payload.game_code,
        currency: 'EUR',
      })

      if (gameplayResponse.success && gameplayResponse.data) {
        return {
          launch_url: gameplayResponse.data.game_url,
          status: 1,
        }
      } else {
        throw new Error(gameplayResponse.error || 'Failed to launch game')
      }
    } catch (error) {
      throw handleApiError(error, 'Failed to launch game via gameplay API')
    }
  }

  // Fallback to original launch API
  const url = isDemo
    ? '/slots-casino/blueocean/game/launch/demo'
    : '/slots-casino/blueocean/game/launch'
  try {
    const response = await api.post<GameLaunchResponse>(url, {
      ...payload,
      ...(fingerprint && {
        fingerprint: {
          visitorId: fingerprint.visitorId,
          data: fingerprint.fingerprintData,
        },
      }),
    })

    if (response.data.error) {
      throw new Error(response.data.error)
    }

    return response.data
  } catch (error) {
    throw handleApiError(error, 'Failed to launch game')
  }
}

export interface GetGameResponse {
  data: TProviderGameItem
  error?: any
}

export const getGame = async (payload: {
  provider_code: string
  game_code: string
}): Promise<GetGameResponse> => {
  try {
    const response = await api.get<GetGameResponse>(
      '/slots-casino/blueocean/game',
      {
        params: payload,
      }
    )

    if (response.data.error) {
      throw new Error(response.data.error)
    }

    return response.data
  } catch (error) {
    throw handleApiError(error, 'Failed to launch game')
  }
}

// Helper functions to convert frontend types to BlueOcean enum values
const convertToBlueOceanType = (type: TProviderGameType): string => {
  // Handle 'all' type
  if (type === 'all') {
    return 'all'
  }
  
  const typeMap: { [key in TProviderGameType]: string } = {
    'video-slots': BlueOceanGameTypes['video-slots'],
    'livecasino': BlueOceanGameTypes.livecasino,
    'live': BlueOceanGameTypes.livecasino,
    'popular': BlueOceanGameTypes['video-slots'],
    'feature': BlueOceanGameTypes['video-slots'],
    'shows': BlueOceanGameTypes['video-slots'],
    'table-games': BlueOceanGameTypes['table-games'],
    'live-casino-table': BlueOceanGameTypes['live-casino-table'],
    'favorites': BlueOceanGameTypes['video-slots'],
    'recent': BlueOceanGameTypes['video-slots'],
    'all': 'all',
  }
  return typeMap[type] || BlueOceanGameTypes['video-slots']
}

const convertToBlueOceanProvider = (provider: string): string => {
  // If it's already a BlueOcean enum value, return as is
  if (Object.values(BlueOceanGameProviders).includes(provider as BlueOceanGameProviders)) {
    return provider
  }
  
  // Check aliases
  const aliasMap: { [key: string]: string } = {
    'PRAGMATIC': BlueOceanGameProviders.pragmatic_play,
    'pragmatic': BlueOceanGameProviders.pragmatic_play,
    'NETENT': BlueOceanGameProviders.netent,
    'netent': BlueOceanGameProviders.netent,
    'PLAYTECH': BlueOceanGameProviders.playtech,
    'playtech': BlueOceanGameProviders.playtech,
    'PLAYN_GO': BlueOceanGameProviders.playn_go,
    'playn_go': BlueOceanGameProviders.playn_go,
    'BGAMING': BlueOceanGameProviders.bgaming,
    'bgaming': BlueOceanGameProviders.bgaming,
    'EVOPLAY': BlueOceanGameProviders.evoplay,
    'evoplay': BlueOceanGameProviders.evoplay,
    'SPINOMENAL': BlueOceanGameProviders.spinomenal,
    'spinomenal': BlueOceanGameProviders.spinomenal,
    'RED_TIGER': BlueOceanGameProviders.red_tiger,
    'red_tiger': BlueOceanGameProviders.red_tiger,
    'QUICKSPIN': BlueOceanGameProviders.quickspin,
    'quickspin': BlueOceanGameProviders.quickspin,
    'THUNDERKICK': BlueOceanGameProviders.thunderkick,
    'thunderkick': BlueOceanGameProviders.thunderkick,
    'YGGDRASIL': BlueOceanGameProviders.yggdrasil,
    'yggdrasil': BlueOceanGameProviders.yggdrasil,
  }
  
  return aliasMap[provider] || provider
}

// BlueOcean Gameplay API
export interface GameplayRequest {
  user_username: string
  user_password?: string
  gameid: string
  currency?: string
}

export interface GameplayResponse {
  success: boolean
  data?: {
    game_url: string
    player_exists: boolean
    player_created: boolean
  }
  error?: string
}

export const launchGameplay = async (params: GameplayRequest): Promise<GameplayResponse> => {
  try {
    const response = await api.post<GameplayResponse>(
      '/slots-casino/blueocean/game/gameplay',
      params
    )
    if (response.data.error) {
      throw new Error(response.data.error)
    }
    return response.data
  } catch (error) {
    throw handleApiError(error, 'Failed to launch gameplay')
  }
}

export interface LogoutRequest {
  user_username: string
  currency?: string
}

export interface LogoutResponse {
  success: boolean
  message?: string
  error?: string
}

export const logoutPlayer = async (params: LogoutRequest): Promise<LogoutResponse> => {
  try {
    const response = await api.post<LogoutResponse>(
      '/slots-casino/blueocean/game/logout',
      params
    )
    if (response.data.error) {
      throw new Error(response.data.error)
    }
    return response.data
  } catch (error) {
    throw handleApiError(error, 'Failed to logout player')
  }
}
import api from '@/lib/api'
import { handleApiError } from '@/lib/error-handler'
import { TProviderGameItem } from '@/types/game'

export interface UserGamesResponse {
  success: boolean
  data: TProviderGameItem[]
  message?: string
}

export interface ToggleFavoriteResponse {
  success: boolean
  message: string
  gameId: string
}

// Add game to favorites
export const addFavorite = async (gameId: string): Promise<ToggleFavoriteResponse> => {
  try {
    const response = await api.post<ToggleFavoriteResponse>(
      '/user/games/favorites/add',
      { gameId }
    )

    if (response.data.success === false) {
      throw new Error(response.data.message || 'Failed to add favorite')
    }

    return response.data
  } catch (error) {
    throw handleApiError(error, 'Failed to add game to favorites')
  }
}

// Remove game from favorites
export const removeFavorite = async (gameId: string): Promise<ToggleFavoriteResponse> => {
  try {
    const response = await api.post<ToggleFavoriteResponse>(
      '/user/games/favorites/remove',
      { gameId }
    )

    if (response.data.success === false) {
      throw new Error(response.data.message || 'Failed to remove favorite')
    }

    return response.data
  } catch (error) {
    throw handleApiError(error, 'Failed to remove game from favorites')
  }
}

// Get user's favorite games
export const getFavoriteGames = async (): Promise<UserGamesResponse> => {
  try {
    const response = await api.get<UserGamesResponse>('/user/games/favorites')

    if (response.data.success === false) {
      throw new Error(response.data.message || 'Failed to get favorites')
    }

    return response.data
  } catch (error) {
    throw handleApiError(error, 'Failed to get favorite games')
  }
}

// Add game to recent games
export const addRecentGame = async (gameId: string): Promise<ToggleFavoriteResponse> => {
  try {
    const response = await api.post<ToggleFavoriteResponse>(
      '/user/games/recent/add',
      { gameId }
    )

    if (response.data.success === false) {
      throw new Error(response.data.message || 'Failed to add to recent')
    }

    return response.data
  } catch (error) {
    throw handleApiError(error, 'Failed to add game to recent games')
  }
}

// Get user's recent games
export const getRecentGames = async (): Promise<UserGamesResponse> => {
  try {
    const response = await api.get<UserGamesResponse>('/user/games/recent')

    if (response.data.success === false) {
      throw new Error(response.data.message || 'Failed to get recent games')
    }

    return response.data
  } catch (error) {
    throw handleApiError(error, 'Failed to get recent games')
  }
}

// Check if game is in favorites
export const checkIsFavorite = async (gameId: string): Promise<boolean> => {
  try {
    const response = await getFavoriteGames()
    return response.data.some(game => game.game_code === gameId)
  } catch (error) {
    console.error('Failed to check favorite status:', error)
    return false
  }
}


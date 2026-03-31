// async getGameTransactions(req, res, next) {
//   try {
//     const transactions = await this.transactionService.getGameTransactions(req.user.id, req.query.page || 0);
//     return res.json({ transactions });
//   } catch (error) {
//     return next(error);
//   }
// }

// async getCryptoTransactions(req, res, next) {
//   try {
//     const transactions = await this.transactionService.getCryptoTransactions(req.user.id, req.query.page || 0);
//     return res.json({ transactions });
//   } catch (error) {
//     return next(error);
//   }
// }

// async getServiceTransactions(req, res, next) {
//   try {
//     const transactions = await this.transactionService.getServiceTransactions(req.user.id, req.query.page || 0);
//     return res.json({ transactions });
//   } catch (error) {
//     return next(error);
//   }
// }

import api from '@/lib/api'
import { handleApiError } from '@/lib/error-handler'

import {
  CryptoTransaction,
  GameTransaction,
  ServiceTransaction,
} from '@/types/transaction'

interface GetGameTransactionsResponse {
  transactions: GameTransaction[]
}

interface GetCryptoTransactionsResponse {
  transactions: CryptoTransaction[]
}

interface GetServiceTransactionsResponse {
  transactions: ServiceTransaction[]
}

export const getGameTransactions = async (page = 1, limit = 20) => {
  try {
    const response = await api.get<GetGameTransactionsResponse>(
      '/user/transaction/game',
      {
        params: {
          page,
          limit,
        },
      }
    )

    return response.data
  } catch (error) {
    throw handleApiError(error, 'Failed to get game transactions')
  }
}

export const getCryptoTransactions = async (page = 1, limit = 20) => {
  try {
    const response = await api.get<GetCryptoTransactionsResponse>(
      '/user/transaction/crypto',
      {
        params: {
          page,
          limit,
        },
      }
    )

    return response.data
  } catch (error) {
    throw handleApiError(error, 'Failed to get crypto transactions')
  }
}

export const getServiceTransactions = async (page = 1, limit = 20) => {
  try {
    const response = await api.get<GetServiceTransactionsResponse>(
      '/user/transaction/service',
      {
        params: {
          page,
          limit,
        },
      }
    )

    return response.data
  } catch (error) {
    throw handleApiError(error, 'Failed to get service transactions')
  }
}

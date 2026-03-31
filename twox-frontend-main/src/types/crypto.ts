export interface UserDepositAddress {
  address: string
  network: string
  blockchain: string
  qrCode: string
  _id: boolean
}

export interface UserWallet {
  depositAddresses: UserDepositAddress[]
}

export interface CoinNetworkData {
  icon: any
  title: string
  symbol: string
  network: string
}

export interface CryptoPriceValue {
  symbol: string
  blockchain: string
  price: string
}

export interface CryptoPrice {
  [key: string]: CryptoPriceValue
}

export interface WithdrawConfig {
  withdrawMinAmount: number
  withdrawMaxAmount: number
  fee: number
}

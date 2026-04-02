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

export interface WithdrawNetworkOption {
  value: string
  label: string
}

export interface WithdrawStablePayoutOption {
  value: string
  label: string
  symbol: string
  network: string
}

export interface WithdrawConfig {
  withdrawMinAmount?: number
  withdrawMaxAmount?: number
  fee?: number
  minWithdrawal?: number
  maxWithdrawal?: number
  currentBalance?: number
  availableCurrencies?: string[]
  withdrawalFee?: number
  withdrawNetworks?: WithdrawNetworkOption[]
  /** USDT/USDC × ERC20·TRC20·BSC when backend stable UI is on */
  withdrawStablePayoutOptions?: WithdrawStablePayoutOption[]
}

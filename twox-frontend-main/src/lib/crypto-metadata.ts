// Cryptocurrency metadata including logos and full names
// Icons from CryptoIcons or similar icon library

export interface CryptoMetadata {
  symbol: string
  name: string
  logo: string
  color?: string
  popular?: boolean
}

// Popular cryptocurrencies with metadata
export const POPULAR_CRYPTOS: Record<string, CryptoMetadata> = {
  BTC: {
    symbol: 'BTC',
    name: 'Bitcoin',
    logo: '₿',
    color: '#F7931A',
    popular: true
  },
  ETH: {
    symbol: 'ETH',
    name: 'Ethereum',
    logo: 'Ξ',
    color: '#627EEA',
    popular: true
  },
  USDT: {
    symbol: 'USDT',
    name: 'Tether',
    logo: '₮',
    color: '#26A17B',
    popular: true
  },
  USDC: {
    symbol: 'USDC',
    name: 'USD Coin',
    logo: '$',
    color: '#2775CA',
    popular: true
  },
  BNB: {
    symbol: 'BNB',
    name: 'Binance Coin',
    logo: 'Ƀ',
    color: '#F3BA2F',
    popular: true
  },
  XRP: {
    symbol: 'XRP',
    name: 'Ripple',
    logo: '✕',
    color: '#23292F',
    popular: true
  },
  ADA: {
    symbol: 'ADA',
    name: 'Cardano',
    logo: '₳',
    color: '#0033AD',
    popular: true
  },
  SOL: {
    symbol: 'SOL',
    name: 'Solana',
    logo: '◎',
    color: '#14F195',
    popular: true
  },
  DOGE: {
    symbol: 'DOGE',
    name: 'Dogecoin',
    logo: 'Ð',
    color: '#C2A633',
    popular: true
  },
  TRX: {
    symbol: 'TRX',
    name: 'TRON',
    logo: '₸',
    color: '#EB0029',
    popular: true
  },
  LTC: {
    symbol: 'LTC',
    name: 'Litecoin',
    logo: 'Ł',
    color: '#345D9D',
    popular: true
  },
  MATIC: {
    symbol: 'MATIC',
    name: 'Polygon',
    logo: '⬡',
    color: '#8247E5',
    popular: true
  },
  DOT: {
    symbol: 'DOT',
    name: 'Polkadot',
    logo: '●',
    color: '#E6007A',
    popular: true
  },
  SHIB: {
    symbol: 'SHIB',
    name: 'Shiba Inu',
    logo: '🐕',
    color: '#FFA409',
    popular: true
  },
  DAI: {
    symbol: 'DAI',
    name: 'Dai',
    logo: '◈',
    color: '#F5AC37',
    popular: true
  },
  AVAX: {
    symbol: 'AVAX',
    name: 'Avalanche',
    logo: '▲',
    color: '#E84142',
    popular: true
  },
  BCH: {
    symbol: 'BCH',
    name: 'Bitcoin Cash',
    logo: 'Ƀ',
    color: '#8DC351',
    popular: true
  },
  XLM: {
    symbol: 'XLM',
    name: 'Stellar',
    logo: '✦',
    color: '#000000',
    popular: true
  },
  ATOM: {
    symbol: 'ATOM',
    name: 'Cosmos',
    logo: '⚛',
    color: '#2E3148',
    popular: true
  },
  LINK: {
    symbol: 'LINK',
    name: 'Chainlink',
    logo: '⬡',
    color: '#375BD2',
    popular: true
  },
}

// Extended crypto logos for more currencies
const CRYPTO_LOGOS: Record<string, string> = {
  // Major coins
  BTC: '₿', ETH: 'Ξ', USDT: '₮', USDC: '$', BNB: 'Ƀ',
  XRP: '✕', ADA: '₳', SOL: '◎', DOGE: 'Ð', TRX: '₸',
  LTC: 'Ł', MATIC: '⬡', DOT: '●', SHIB: '🐕', DAI: '◈',
  AVAX: '▲', BCH: 'Ƀ', XLM: '✦', ATOM: '⚛', LINK: '⬡',
  
  // Additional popular coins
  UNI: '🦄', AAVE: '👻', CRV: '🌊', SUSHI: '🍣', CAKE: '🥞',
  XMR: 'ɱ', ZEC: 'ⓩ', DASH: 'Đ', EOS: 'ε', NEO: 'Ň',
  ALGO: '△', VET: 'Ѵ', FIL: '⨎', THETA: 'ϴ', XTZ: 'ꜩ',
  ETC: 'ξ', MIOTA: 'ɨ', MKR: 'Μ', COMP: '🏛️', YFI: '🔷',
  SNX: '⬢', BAT: '🦇', ZRX: '⚡', ENJ: '🎮', MANA: '🏝️',
  SAND: '🏖️', AXS: '🎯', CHZ: '🌶️', GRT: '🔍', FTM: '👻',
  
  // Stablecoins
  BUSD: '$', TUSD: '$', USDD: '$', GUSD: '$', PAX: '$',
  
  // DeFi tokens
  '1INCH': '1️⃣', ALPHA: 'α', ANKR: '⚓', APE: '🦍', API3: '📡',
  ARPA: '🔗', AUDIO: '🎵', BADGER: '🦡', BAND: '📊', BNT: '🔄',
  
  // Layer 2 & Scaling
  ARB: '🔷', OP: '🔴', IMX: '✕', LRC: '○', CELR: '🌉',
  
  // Metaverse & Gaming
  GALA: '🎮', ILV: '⚔️', LOOKS: '👁️', BLUR: '🎨',
  
  // Default fallbacks
  DEFAULT: '🪙',
}

// Generate a consistent color for a cryptocurrency based on its symbol
const generateCryptoColor = (symbol: string): string => {
  // Generate a hash from the symbol
  let hash = 0
  for (let i = 0; i < symbol.length; i++) {
    hash = symbol.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  // Generate HSL color (hue from hash, high saturation, medium lightness)
  const hue = Math.abs(hash % 360)
  const saturation = 65 + (Math.abs(hash) % 20) // 65-85%
  const lightness = 45 + (Math.abs(hash >> 8) % 15) // 45-60%
  
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}

// Get metadata for a cryptocurrency symbol
export const getCryptoMetadata = (symbol: string): CryptoMetadata => {
  const upperSymbol = symbol.toUpperCase()
  const metadata = POPULAR_CRYPTOS[upperSymbol]
  
  if (metadata) {
    return metadata
  }
  
  // Get logo from extended list or use first letter as fallback
  const logo = CRYPTO_LOGOS[upperSymbol] || 
               (upperSymbol.startsWith('USD') || upperSymbol.startsWith('EUR') ? '$' : 
                upperSymbol.length > 0 ? upperSymbol[0] : '🪙')
  
  // Generate a unique color for this crypto
  const color = generateCryptoColor(upperSymbol)
  
  // Return metadata for less popular cryptos with proper logo
  return {
    symbol: upperSymbol,
    name: formatCryptoName(upperSymbol),
    logo: logo,
    color: color,
    popular: false
  }
}

// Format crypto name (e.g., WBTC -> Wrapped Bitcoin, USDT -> Tether)
const formatCryptoName = (symbol: string): string => {
  const nameMap: Record<string, string> = {
    WBTC: 'Wrapped Bitcoin',
    WETH: 'Wrapped Ethereum',
    RENBTC: 'renBTC',
    TBTC: 'tBTC',
    HBTC: 'Huobi BTC',
    // Add more as needed
  }
  
  return nameMap[symbol] || symbol
}

// Sort currencies with popular ones first
export const sortCurrencies = (currencies: string[]): string[] => {
  const popular: string[] = []
  const others: string[] = []
  
  currencies.forEach(currency => {
    if (POPULAR_CRYPTOS[currency.toUpperCase()]?.popular) {
      popular.push(currency)
    } else {
      others.push(currency)
    }
  })
  
  return [...popular, ...others]
}

// Filter to show only popular cryptocurrencies
export const getPopularCryptos = (currencies: string[]): string[] => {
  return currencies.filter(currency => 
    POPULAR_CRYPTOS[currency.toUpperCase()]?.popular
  )
}


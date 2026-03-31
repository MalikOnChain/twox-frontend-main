import { createConfig, http } from 'wagmi'
import {
  arbitrum,
  avalanche,
  bsc,
  goerli,
  mainnet,
  polygon,
} from 'wagmi/chains'
import {
  coinbaseWallet,
  injected,
  metaMask,
  walletConnect,
} from 'wagmi/connectors'

export const supportedChains = [
  mainnet,
  arbitrum,
  avalanche,
  polygon,
  bsc,
  goerli,
]

export const infuraId = process.env.NEXT_PUBLIC_INFURA_ID || ''

export const walletConnectProjectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || ''

export const wagmiConfig = createConfig({
  chains: [mainnet, arbitrum, avalanche, polygon, bsc, goerli] as const,
  transports: {
    [mainnet.id]: http(`https://mainnet.infura.io/v3/${infuraId}`),
    [arbitrum.id]: http(`https://arbitrum-mainnet.infura.io/v3/${infuraId}`),
    [avalanche.id]: http(`https://avalanche-mainnet.infura.io/v3/${infuraId}`),
    [polygon.id]: http(`https://polygon-mainnet.infura.io/v3/${infuraId}`),
    [bsc.id]: http('https://bsc-dataseed.binance.org'),
    [goerli.id]: http(`https://goerli.infura.io/v3/${infuraId}`),
  },
  connectors: [
    metaMask(),
    coinbaseWallet({
      appName: 'My Web3 App',
    }),
    walletConnect({
      projectId: walletConnectProjectId,
    }),
    injected(),
  ],
})

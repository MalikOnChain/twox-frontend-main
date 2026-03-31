import { switchChain } from '@wagmi/core'

import { supportedChains, wagmiConfig } from '@/lib/wagmi'

export const isNetworkSupported = (chainId: number | undefined): boolean => {
  if (!chainId) return false
  return supportedChains.some((chain) => chain.id === chainId)
}

export const truncateAddress = (address: string): string => {
  if (!address) return ''
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
}

export const addChainToWallet = async (chainId: number, chain: any) => {
  try {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed')
    }

    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: `0x${chainId.toString(16)}`,
          chainName: chain.name,
          rpcUrls: chain.rpcUrls,
          nativeCurrency: chain.nativeCurrency,
          blockExplorerUrls: chain.blockExplorers?.map(
            (explorer: any) => explorer.url
          ),
        },
      ],
    })
  } catch (addError) {
    console.error('Failed to add chain to wallet:', addError)
  }
}

export const switchNetwork = async (chainId: number): Promise<void> => {
  try {
    const chain = supportedChains.find((chain) => chain.id === chainId)
    if (!chain) {
      throw new Error(`Chain ${chainId} not supported`)
    }

    await switchChain(wagmiConfig, {
      chainId: chainId as 1 | 42161 | 43114 | 137 | 56 | 5,
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'Chain not found') {
      const chain = supportedChains.find((chain) => chain.id === chainId)
      if (!chain) {
        throw new Error(`Chain ${chainId} not supported`)
      }
      await addChainToWallet(chainId, chain)
      await switchChain(wagmiConfig, {
        chainId: chainId as 1 | 42161 | 43114 | 137 | 56 | 5,
      })
    } else {
      console.error('Error switching network:', error)
      throw error
    }
  }
}

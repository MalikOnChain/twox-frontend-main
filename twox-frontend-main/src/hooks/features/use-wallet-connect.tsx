// import { utils } from 'ethers'
// import { useCallback, useState } from 'react'

// import { fetchWalletNonce, walletLogin } from '@/api/auth'
// import { useWalletConnectClient } from '@/context/walletconnect-context'

// const useWalletConnect = () => {
//   const {
//     connect: wcConnect,
//     disconnect: wcDisconnect,
//     accounts,
//     chain,
//     web3Provider,
//     isInitializing,
//   } = useWalletConnectClient()

//   const [error, setError] = useState<string | null>(null)

//   const connect = useCallback(
//     async (chainId: string) => {
//       try {
//         setError(null)
//         await wcConnect(`eip155:${chainId}`)
//         return {
//           address: accounts[0],
//           chainId,
//         }
//       } catch (err) {
//         console.error('WalletConnect connection error:', err)
//         setError('Failed to connect wallet')
//         return null
//       }
//     },
//     [wcConnect, accounts]
//   )

//   const disconnect = useCallback(async () => {
//     try {
//       await wcDisconnect()
//     } catch (err) {
//       console.error('WalletConnect disconnect error:', err)
//       setError('Failed to disconnect wallet')
//     }
//   }, [wcDisconnect])

//   const getBalance = useCallback(async (): Promise<string | null> => {
//     if (!web3Provider || !accounts[0]) return null

//     try {
//       const balance = await web3Provider.eth.getBalance(accounts[0])
//       return utils.formatEther(balance)
//     } catch (err) {
//       console.error('Balance fetch error:', err)
//       return null
//     }
//   }, [web3Provider, accounts])

//   const signMessage = useCallback(
//     async (message: string): Promise<string | null> => {
//       if (!web3Provider || !accounts[0]) {
//         setError('No wallet connected')
//         return null
//       }

//       try {
//         const signature = await web3Provider.eth.personal.sign(
//           message,
//           accounts[0],
//           ''
//         )
//         return signature
//       } catch (err) {
//         console.error('Message signing error:', err)
//         setError('Failed to sign message')
//         return null
//       }
//     },
//     [web3Provider, accounts]
//   )

//   const auth = useCallback(async () => {
//     if (!accounts[0]) {
//       throw new Error('No wallet connected')
//     }

//     try {
//       const { nonce } = await fetchWalletNonce({ address: accounts[0] })
//       if (!nonce) throw new Error('Invalid nonce')

//       const signature = await signMessage(nonce)
//       if (!signature) throw new Error('Failed to sign message')

//       return await walletLogin({
//         address: accounts[0],
//         signature,
//       })
//     } catch (err) {
//       console.error('Authentication error:', err)
//       setError('Authentication failed')
//       return null
//     }
//   }, [accounts, signMessage])

//   return {
//     connect,
//     disconnect,
//     auth,
//     signMessage,
//     getBalance,
//     isConnected: !!accounts[0],
//     address: accounts[0] || null,
//     chainId: chain?.split(':')[2] || null,
//     error,
//     isInitializing,
//   }
// }

// export default useWalletConnect

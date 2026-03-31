declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>
      on: (event: string, callback: (...args: any[]) => void) => void
      removeListener: (
        event: string,
        callback: (...args: any[]) => void
      ) => void
    }
    solana?: {
      isPhantom?: boolean
      connect: () => Promise<{ publicKey: { toString: () => string } }>
      disconnect: () => Promise<void>
      on: (event: string, callback: (...args: any[]) => void) => void
      removeListener: (
        event: string,
        callback: (...args: any[]) => void
      ) => void
      signMessage: (
        message: Uint8Array,
        encoding: string
      ) => Promise<{ signature: Uint8Array }>
    }
    grecaptcha: {
      ready: (callback: () => void) => void
      render: (container: string, options: any) => number
      execute: (widgetId: number | null) => Promise<string>
      reset: (widgetId: number) => void
    }
    gtag: (type: string, action: string, params: Record<string, any>) => void
  }
}

export {}

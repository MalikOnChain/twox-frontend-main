import React, { ReactNode } from 'react'

import Providers from './providers'

const Layout = ({ children }: { children: ReactNode }) => {
  return <Providers>{children}</Providers>
}

export default Layout

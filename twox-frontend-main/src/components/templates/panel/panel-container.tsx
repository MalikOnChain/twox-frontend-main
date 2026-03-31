import { ReactNode } from 'react'

import { cn } from '@/lib/utils'
import { useMediaQuery } from '@/hooks/features/use-media-query'

const PanelContainer = ({
  isVisible,
  children,
}: {
  children: ReactNode
  isVisible: boolean
}) => {
  const isDesktop = useMediaQuery('xl+1')

  return (
    <>
      <div
        className={cn(
          'sticky right-0 top-0 z-[49] h-panel-mobile-screen w-0 overflow-hidden pb-5 transition-all duration-300',
          'lg:h-[100dvh] lg:pb-0',
          'min-[1281px]:top-header min-[1281px]:h-sidebar',
          {
            'w-right-panel': isVisible && isDesktop,
          },
          { 'fixed bg-background': !isDesktop }, // mobile panel
          { 'w-full sm:w-right-panel-sm': !isDesktop && isVisible } // mobile panel
        )}
      >
        <div
          className={cn(
            `flex h-full min-w-right-panel translate-x-full flex-col p-main-spacing text-white transition-all duration-300`,
            {
              'translate-x-0 pl-0': isVisible,
            },
            { 'px-0 py-0': !isDesktop } // mobile panel
          )}
        >
          <div
            className={cn(
              'flex min-h-full flex-col overflow-hidden rounded-2xl bg-background-secondary',
              {
                'rounded-none bg-background': !isDesktop,
              }
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </>
  )
}

export default PanelContainer

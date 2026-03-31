import Image from 'next/image'
import { memo } from 'react'

import WheelSpinner from '@/assets/games/wheel/wheel-spinner.png'

const WheelButton = ({
  spinning,
  startSpin,
  isLoading,
}: {
  spinning: boolean
  startSpin: () => void
  isLoading: boolean
}) => {
  return (
    <button
      className={`absolute h-16 w-16 md:h-24 md:w-24 ${
        !spinning ? 'transition-transform duration-300 hover:scale-110' : ''
      }`}
      onClick={startSpin}
      disabled={spinning || isLoading}
      style={{
        animation: !spinning ? 'scaleButton 0.5s ease-in-out infinite' : 'none',
        transformOrigin: 'center',
      }}
    >
      <style jsx>{`
        @keyframes scaleButton {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
      {isLoading && <div className='spinner z-50' />}

      <Image src={WheelSpinner} alt='Spin' className='z-30 h-full w-full' />
    </button>
  )
}

export default memo(WheelButton)

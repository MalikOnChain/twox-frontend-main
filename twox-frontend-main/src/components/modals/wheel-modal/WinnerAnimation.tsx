import { memo } from 'react'

const capitalizeText = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1)

const WinnerAnimation = ({ popupWinner }: { popupWinner: string }) => {
  return (
    <div className='absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center'>
      <style jsx>{`
        @keyframes zoomIn {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.8;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
      <h3
        className='font-kepler text-[96px] font-normal md:text-[112px]'
        style={{
          animation: 'zoomIn 0.5s ease-out forwards',
          textShadow:
            '0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(255, 255, 255, 0.4)',
        }}
      >
        {capitalizeText(popupWinner)}!
      </h3>
    </div>
  )
}

export default memo(WinnerAnimation)

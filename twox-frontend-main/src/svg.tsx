type SvgParamTypes = {
  width: string
  height: string
  fill: string
  className: string
  onClick: () => void
}

export const RoundedCrossIcon = ({ onClick }: Partial<SvgParamTypes>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='20'
    height='20'
    viewBox='0 0 20 20'
    fill='none'
    onClick={onClick}
    className='cursor-pointer'
  >
    <path
      d='M10 1.25C5.125 1.25 1.25 5.125 1.25 10C1.25 14.875 5.125 18.75 10 18.75C14.875 18.75 18.75 14.875 18.75 10C18.75 5.125 14.875 1.25 10 1.25ZM10 17.5C5.875 17.5 2.5 14.125 2.5 10C2.5 5.875 5.875 2.5 10 2.5C14.125 2.5 17.5 5.875 17.5 10C17.5 14.125 14.125 17.5 10 17.5Z'
      fill='white'
      fillOpacity='0.7'
    />
    <path
      d='M13.375 14.375L10 11L6.625 14.375L5.625 13.375L9 10L5.625 6.625L6.625 5.625L10 9L13.375 5.625L14.375 6.625L11 10L14.375 13.375L13.375 14.375Z'
      fill='white'
      fillOpacity='0.7'
    />
  </svg>
)

export const UnFilledCheckbox = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='16'
    height='16'
    viewBox='0 0 16 16'
    fill='none'
  >
    <rect
      x='0.5'
      y='0.5'
      width='15'
      height='15'
      rx='3.5'
      stroke='white'
      strokeOpacity='0.5'
    />
  </svg>
)

export const FilledCheckbox = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='16'
    height='16'
    viewBox='0 0 16 16'
    fill='none'
  >
    <rect
      x='0.5'
      y='0.5'
      width='15'
      height='15'
      rx='3.5'
      fill='#620018'
      stroke='#620018'
    />
    <path
      d='M4 8.5L6.5 11L12 5.5'
      stroke='white'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
)

export const PlayButton = ({
  width,
  height,
}: {
  width?: string
  height?: string
}) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={width || '33'}
    height={height || '34'}
    viewBox='0 0 33 34'
    fill='none'
  >
    <path
      d='M1.19324 5.65927C1.19324 2.42099 4.72939 0.272025 7.78503 1.65146L8.07898 1.79599L29.3534 13.1427L29.3583 13.1446C29.9852 13.4716 30.5214 13.9389 30.9247 14.506L31.0887 14.755C31.5052 15.4347 31.7255 16.2126 31.7255 17.004C31.7254 17.6962 31.5571 18.3776 31.2362 18.9923L31.0887 19.252C30.7243 19.8467 30.2211 20.3477 29.621 20.714L29.3583 20.8624L29.3534 20.8643L8.07898 32.2091H8.078C4.9605 33.8729 1.19327 31.6908 1.19324 28.3497V5.65927Z'
      fill='url(#paint0_linear_56_244)'
      stroke='white'
      strokeWidth='1.01773'
    />
    <defs>
      <linearGradient
        id='paint0_linear_56_244'
        x1='-0.333283'
        y1='18.6313'
        x2='31.1206'
        y2='12.483'
        gradientUnits='userSpaceOnUse'
      >
        <stop stopColor='#F8043F' />
        <stop offset='1' stopColor='#6F001B' />
      </linearGradient>
    </defs>
  </svg>
)

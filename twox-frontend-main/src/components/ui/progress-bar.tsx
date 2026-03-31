'use client'

interface ProgressBarProps {
  percentage: number
  className?: string
  bgClassName?: string
  fgClassName?: string
  bgStrokeWidth?: number
  fgStrokeWidth?: number
  glow?: boolean
}

export default function ProgressBar({
  percentage,
  className = '',
  bgClassName = 'text-gray-300',
  fgClassName = 'text-blue-600',
  bgStrokeWidth = 32,
  fgStrokeWidth = 32,
  glow = false,
}: ProgressBarProps) {
  const cleanPercentage = (percentage: number) => {
    const isNegativeOrNaN = !Number.isFinite(+percentage) || percentage < 0
    const isTooHigh = percentage > 100
    return isNegativeOrNaN ? 0 : isTooHigh ? 100 : +percentage
  }

  // Padding for glow effect
  const glowPadding = glow ? 10 : 0
  // Use the largest stroke width for padding
  const maxStrokeWidth = Math.max(bgStrokeWidth, fgStrokeWidth)
  // Add extra padding for stroke width and glow
  const padding = maxStrokeWidth + glowPadding
  // The actual drawing size (default 200)
  const baseSize = 200
  // The total SVG size
  const svgSize = baseSize + padding * 2
  // The center of the circles
  const center = svgSize / 2

  // Calculate radius for each arc so their outer edge is 10px from SVG edge
  const getRadius = (strokeWidth: number) => svgSize / 2 - 10 - strokeWidth / 2

  const Circle = ({
    percentage,
    strokeWidth,
    rounded = false,
    filterId,
    colorCenter,
    radius,
  }: {
    percentage: number
    strokeWidth: number
    rounded?: boolean
    filterId?: string
    colorCenter: number
    radius: number
  }) => {
    const circ = 2 * Math.PI * radius
    const strokePct = ((100 - percentage) * circ) / 100
    return (
      <circle
        r={radius}
        cx={colorCenter}
        cy={colorCenter}
        fill='transparent'
        stroke='currentColor'
        strokeWidth={strokeWidth}
        strokeDasharray={circ}
        strokeDashoffset={percentage ? strokePct : 0}
        strokeLinecap={rounded ? 'round' : 'butt'}
        filter={filterId ? `url(#${filterId})` : undefined}
      ></circle>
    )
  }

  const Pie = ({
    percentage,
    className,
    bgClassName,
    fgClassName,
    bgStrokeWidth,
    fgStrokeWidth,
    glow,
  }: {
    percentage: number
    className: string
    bgClassName: string
    fgClassName: string
    bgStrokeWidth: number
    fgStrokeWidth: number
    glow: boolean
  }) => {
    const pct = cleanPercentage(percentage)
    const filterId = 'glow-filter'
    const bgRadius = getRadius(bgStrokeWidth)
    const fgRadius = getRadius(fgStrokeWidth)

    return (
      <svg
        className={className}
        viewBox={`0 0 ${svgSize} ${svgSize}`}
        width={svgSize}
        height={svgSize}
      >
        {glow && (
          <defs>
            <filter id={filterId} x='-50%' y='-50%' width='200%' height='200%'>
              <feGaussianBlur stdDeviation='6' result='coloredBlur' />
              <feMerge>
                <feMergeNode in='coloredBlur' />
                <feMergeNode in='SourceGraphic' />
              </feMerge>
            </filter>
          </defs>
        )}
        <g transform={`rotate(-90 ${center} ${center})`}>
          <g className={bgClassName}>
            <Circle
              percentage={100}
              strokeWidth={bgStrokeWidth}
              colorCenter={center}
              radius={bgRadius}
            />
          </g>
          <g className={fgClassName}>
            <Circle
              percentage={pct}
              strokeWidth={fgStrokeWidth}
              rounded={true}
              filterId={glow ? filterId : undefined}
              colorCenter={center}
              radius={fgRadius}
            />
          </g>
        </g>
      </svg>
    )
  }

  return (
    <Pie
      percentage={percentage}
      className={className}
      bgClassName={bgClassName}
      fgClassName={fgClassName}
      bgStrokeWidth={bgStrokeWidth}
      fgStrokeWidth={fgStrokeWidth}
      glow={glow}
    />
  )
}

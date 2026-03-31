import React from 'react'

interface ProgressBarProps {
  /**
   * The current progress value (0-100)
   * @default 0
   */
  progress?: number
  /**
   * Optional label text to display above the progress bar
   * @default ''
   */
  label?: string
  /**
   * Whether to show the percentage value
   * @default true
   */
  showPercentage?: boolean
  /**
   * Tailwind height class for the progress bar
   * @default 'h-2'
   */
  height?: string
  /**
   * Additional CSS classes to apply to the container
   * @default ''
   */
  className?: string
  /**
   * Number of segments in the progress bar
   * @default 4
   */
  segments?: number
  /**
   * Whether to animate progress changes
   * @default true
   */
  animate?: boolean
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress = 0,
  label = '',
  showPercentage = true,
  height = 'h-2',
  className = '',
  segments = 4,
  animate = true,
}) => {
  // Ensure progress is between 0 and 100
  const clampedProgress = Math.min(Math.max(progress, 0), 100)
  const segmentPercent = 100 / segments

  // Determine fill for each segment
  const segmentFills = Array.from({ length: segments }, (_, i) => {
    const segmentStart = i * segmentPercent
    const segmentEnd = (i + 1) * segmentPercent
    if (clampedProgress >= segmentEnd) return 100 // fully filled
    if (clampedProgress <= segmentStart) return 0 // empty
    // partially filled
    return ((clampedProgress - segmentStart) / segmentPercent) * 100
  })

  return (
    <div className={`${className}`}>
      {(label || showPercentage) && (
        <div className='mb-2 flex justify-between text-sm text-muted-foreground'>
          {label && <span>{label}</span>}
          {showPercentage && <span>{`${clampedProgress.toFixed(1)}%`}</span>}
        </div>
      )}
      <div className='flex gap-2'>
        {segmentFills.map((fill, idx) => (
          <div
            key={idx}
            className={`relative flex-1 bg-secondary-700 ${height} overflow-hidden rounded-[6px] ${
              idx === 0 ? 'rounded-l-[10px]' : ''
            } ${idx === segments - 1 ? 'rounded-r-[10px]' : ''}`}
          >
            <div
              className={`h-full ${
                fill > 0 ? 'bg-yellow-400' : 'bg-secondary-700'
              } ${animate ? 'transition-all duration-500 ease-in-out' : ''}`}
              style={{ width: `${fill}%` }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProgressBar

interface SectionDescriptionProps {
  children: React.ReactNode
  className?: string
  align?: 'left' | 'center' | 'right'
  style?: React.CSSProperties
}

export default function SectionDescription({
  children,
  className = '',
  align = 'center',
  style,
}: SectionDescriptionProps) {
  const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }[align]

  return (
    <p
      className={`text-sm text-white/90 md:text-base ${alignClass} ${className}`}
      style={{
        fontFamily: 'var(--font-satoshi), sans-serif',
        fontWeight: 400,
        fontSize: 'inherit',
        lineHeight: '120%',
        ...style,
      }}
    >
      {children}
    </p>
  )
}


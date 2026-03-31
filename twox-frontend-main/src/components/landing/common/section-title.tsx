interface SectionTitleProps {
  children: React.ReactNode
  className?: string
  align?: 'left' | 'center' | 'right'
}

export default function SectionTitle({ children, className = '', align = 'center' }: SectionTitleProps) {
  const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }[align]

  return (
    <h2
      className={`mb-4 font-bold text-white md:mb-6 ${alignClass} ${className}`}
      style={{
        fontFamily: 'var(--font-stolzl), sans-serif',
        fontWeight: 700,
        fontSize: 'clamp(28px, 5vw, 48px)',
      }}
    >
      {children}
    </h2>
  )
}


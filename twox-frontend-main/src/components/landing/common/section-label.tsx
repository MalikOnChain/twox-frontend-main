interface SectionLabelProps {
  children: React.ReactNode
  className?: string
}

export default function SectionLabel({ children, className = '' }: SectionLabelProps) {
  return (
    <div className={`mb-6 flex justify-center ${className}`}>
      <div
        className='inline-flex items-center justify-center text-sm font-medium text-white'
        style={{
          fontFamily: 'var(--font-satoshi), sans-serif',
          borderRadius: '24px',
          border: '1px solid #F8043F',
          padding: '6px 16px',
          height: '38px',
          width: 'fit-content',
          backgroundColor: '#FF292940',
        }}
      >
        {children}
      </div>
    </div>
  )
}


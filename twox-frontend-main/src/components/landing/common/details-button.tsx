interface DetailsButtonProps {
  onClick?: () => void
  children?: React.ReactNode
}

export default function DetailsButton({ onClick, children = 'Details' }: DetailsButtonProps) {
  return (
    <button
      className='inline-flex items-center justify-center text-sm font-medium text-white'
      style={{
        fontFamily: 'var(--font-satoshi), sans-serif',
        width: '180px',
        height: '50px',
        borderRadius: '80px',
        border: '1px solid rgba(255, 255, 255, 0.5)',
        padding: '12px 24px',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
      }}
      onClick={onClick}
    >
      {children}
    </button>
  )
}


// import LogoEaster from '@/assets/brand/logo-easter.webp'
import LogoEaster from '@/assets/brand/logo.webp'
import Logo from '@/assets/brand/logo.webp'
import LogoEasterSymbol from '@/assets/brand/logo-symbol-2.png'
import LogoSymbol from '@/assets/brand/logo-symbol-2.png'

// Main logo from assets
import MainLogo from '@/assets/brand/main-logo.png'
import SmallLogo from '@/assets/brand/small-logo.png'

// Export the main logo for direct use
export { MainLogo, SmallLogo }

export function getLogo(eventName: 'easter' | 'normal') {
  if (eventName === 'easter') {
    return {
      logo: LogoEaster,
      logoSymbol: LogoEasterSymbol,
      // className: '-top-1',
    }
  }

  return {
    logo: Logo,
    logoSymbol: LogoSymbol,
    className: '',
  }
}

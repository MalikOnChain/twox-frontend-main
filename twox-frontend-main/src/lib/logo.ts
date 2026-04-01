/** Official TWOX wordmark (transparent PNG in public/) */
export const TWOX_BRAND_LOGO_SRC = '/twox-logo.png'

export const MainLogo = TWOX_BRAND_LOGO_SRC
export const SmallLogo = TWOX_BRAND_LOGO_SRC

export function getLogo(_eventName: 'easter' | 'normal') {
  return {
    logo: TWOX_BRAND_LOGO_SRC,
    logoSymbol: TWOX_BRAND_LOGO_SRC,
    className: '',
  }
}

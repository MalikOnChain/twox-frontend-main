/**
 * Opt-in legacy PIX cashier modal (ModalType.Pix). Default off.
 */
export const enablePixLegacyUI =
  process.env.NEXT_PUBLIC_ENABLE_PIX_LEGACY === 'true'

/**
 * Show Vaultody deposit-address filters in the balance modal. Default off (crypto / Fystack-only UX).
 */
export const enableVaultodyLegacyUI =
  process.env.NEXT_PUBLIC_ENABLE_VAULTODY_LEGACY === 'true'

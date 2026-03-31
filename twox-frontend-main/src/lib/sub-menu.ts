// Animation variants
export const SUBMENU_VARIANTS = {
  hidden: {
    opacity: 0,
    x: -20,
    scale: 0.95,
    transition: {
      duration: 0.15,
      ease: [0.4, 0.0, 0.2, 1],
    },
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.2,
      ease: [0.0, 0.0, 0.2, 1],
      when: 'beforeChildren',
      staggerChildren: 0.03,
    },
  },
}

export const ITEM_VARIANTS = {
  hidden: { opacity: 0, x: -15 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.15,
    },
  },
}

export const SIDEBAR_WIDTH = 275
export const SIDEBAR_SM_WIDTH = 70
export const MENU_WIDTH = 200
export const OFFSET = 10

// Constants for the Wheel component

export const WHEEL_CONSTANTS = {
  participants: ['2X', '5X', '10X', '50X', '100X', '500X', '1000X', '2000X'],
  spinDuration: 6000,
  popupDisplayTime: 3000,
  confettiDuration: 3000,
}

// Animation defaults for confetti
export const ANIMATION_DEFAULTS = {
  startVelocity: 30,
  spread: 360,
  ticks: 60,
  zIndex: 9999,
}

// CSS Animations
export const CSS_ANIMATIONS = {
  scaleButton: `
    @keyframes scaleButton {
      0% { transform: scale(1); }
      50% { transform: scale(1.1); }
      100% { transform: scale(1); }
    }
  `,
  zoomIn: `
    @keyframes zoomIn {
      0% {
        transform: scale(0);
        opacity: 0;
      }
      50% {
        transform: scale(1.2);
        opacity: 0.8;
      }
      100% {
        transform: scale(1);
        opacity: 1;
      }
    }
  `,
}

// Style configurations
export const STYLE_CONFIG = {
  winnerTextShadow:
    '0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(255, 255, 255, 0.4)',
  canvasSizes: {
    mobile: 300,
    desktop: 400,
  },
}

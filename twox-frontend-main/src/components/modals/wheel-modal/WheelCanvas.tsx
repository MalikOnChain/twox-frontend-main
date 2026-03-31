// Canvas drawing utility for the Wheel component
export const drawWheel = (
  canvas: HTMLCanvasElement,
  bgImage: HTMLImageElement | null,
  participants: string[],
  rotation: number,
  numSectors: number
) => {
  const ctx = canvas.getContext('2d') as any
  const radius = canvas.width / 2
  const sliceAngle = (2 * Math.PI) / numSectors

  // Clear previous drawing
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.translate(radius, radius)
  ctx.rotate(-rotation * (Math.PI / 180))

  // Draw board image
  if (bgImage) {
    ctx.save()
    ctx.drawImage(bgImage, -radius, -radius, canvas.width, canvas.height)
    ctx.restore()
  }

  // Draw sectors
  for (let i = 0; i < numSectors; i++) {
    const startAngle = i * sliceAngle
    const endAngle = (i + 1) * sliceAngle

    // Draw the name in the sector
    ctx.save()
    ctx.rotate((startAngle + endAngle) / 2)
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = 'white'
    ctx.font = '16px Arial'
    ctx.shadowColor = 'rgba(0, 0, 0, 0.7)'
    ctx.shadowOffsetX = 1
    ctx.shadowOffsetY = 1
    ctx.shadowBlur = 3

    const text = participants[i] || ''
    const capitalizedText = text.charAt(0).toUpperCase() + text.slice(1)
    ctx.fillText(capitalizedText, radius * 0.6, 0)
    ctx.restore()
  }

  ctx.rotate(rotation * (Math.PI / 180)) // Reset rotation
  ctx.translate(-radius, -radius)
}

// Animation utilities
export const easingFunctions = {
  easeOutCubic: (t: number) => 1 - Math.pow(1 - t, 3),
  easeInOutQuad: (t: number) =>
    t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
  easeOutBack: (t: number) => {
    const c1 = 1.70158
    const c3 = c1 + 1
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
  },
}

// Helper function for random range
export const randomInRange = (min: number, max: number) => {
  return Math.random() * (max - min) + min
}

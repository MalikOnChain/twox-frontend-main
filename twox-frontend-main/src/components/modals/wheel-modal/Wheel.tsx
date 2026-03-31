import confetti from 'canvas-confetti'
import Image from 'next/image'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import { useWindowWidth } from '@/hooks/use-window-width'

import WheelButton from '@/components/modals/wheel-modal/WheelButton'
import WinnerAnimation from '@/components/modals/wheel-modal/WinnerAnimation'

import WheelBoard from '@/assets/games/wheel/wheel-board.png'
import WheelPointer from '@/assets/games/wheel/wheel-pointer.png'
import WheelRing from '@/assets/games/wheel/wheel-ring.png'

import { drawWheel } from './WheelCanvas'
import { ANIMATION_DEFAULTS } from './WheelConstants'

interface WheelProps {
  spins: number
  setSpins: (spins: number) => void
  participants: string[]
  getSpinResult: () => Promise<string | null>
  isLoading: boolean
}

export const Wheel: React.FC<WheelProps> = ({
  spins,
  setSpins: _,
  participants,
  getSpinResult,
  isLoading,
}) => {
  const [spinning, setSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [showPopup, setShowPopup] = useState(false)
  const [popupWinner, setPopupWinner] = useState<string | null>(null)
  const [noSpinsMessage, setNoSpinsMessage] = useState(false)

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const bgImageRef = useRef<HTMLImageElement | null>(null)
  const rotationRef = useRef(0)
  const animationRef = useRef<number | null>(null)

  const windowWidth = useWindowWidth()
  const numSectors = participants.length

  const duration = 3 * 1000
  const animationEnd = Date.now() + duration
  const defaults = ANIMATION_DEFAULTS

  useEffect(() => {
    if (canvasRef.current) {
      const img = new window.Image()
      img.src = WheelBoard.src
      img.onload = () => {
        bgImageRef.current = img
        drawWheel(
          canvasRef.current as any,
          bgImageRef.current,
          participants,
          rotation,
          numSectors
        )
      }
    }
  }, [participants, rotation, numSectors])

  // Update ref when rotation state changes
  useEffect(() => {
    rotationRef.current = rotation
  }, [rotation])

  const determineWinner = useCallback(
    (finalRotation: number) => {
      const sliceAngle = 360 / numSectors
      const normalizedRotation = ((finalRotation % 360) + 360) % 360
      const winningSector = Math.floor(normalizedRotation / sliceAngle)

      setPopupWinner(participants[winningSector])
      setShowPopup(true)
    },
    [participants, numSectors]
  )

  const startSpin = useCallback(async () => {
    if (spinning) return

    // Check if player has spins available
    if (spins <= 0) {
      setNoSpinsMessage(true)
      setTimeout(() => setNoSpinsMessage(false), 2000)
      return
    }

    setSpinning(true)

    // Get the spin result first
    const result = await getSpinResult()

    if (!result) {
      setSpinning(false)
      return
    }

    // Find the index of the winning sector
    const winningIndex = participants.indexOf(result)
    if (winningIndex === -1) {
      setSpinning(false)
      return
    }

    // Calculate the target rotation to land on the winning sector
    const sliceAngle = 360 / numSectors
    const targetAngle = 360 - winningIndex * sliceAngle // Subtract from 360 to make it clockwise
    const numFullRotations = Math.random() * 2 + 3 // Between 3 and 5 full rotations
    const totalRotation = numFullRotations * 360 + targetAngle
    const currentRotation = rotationRef.current // Get the current rotation from ref
    const finalRotation = (currentRotation - totalRotation) % 360

    const spinDuration = 8000
    const easing = (t: number) => {
      // Ease-out cubic
      return 1 - Math.pow(1 - t, 3)
    }

    let startTime: number | null = null

    const animate = (time: number) => {
      if (!startTime) startTime = time
      const elapsed = time - startTime
      const t = Math.min(elapsed / spinDuration, 1)
      const easeT = easing(t)

      // Calculate new rotation based on the current ref value
      const newRotation = currentRotation - totalRotation * easeT
      setRotation(newRotation)

      if (elapsed < spinDuration) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        // Final update
        setSpinning(false)
        determineWinner(finalRotation)
        animationRef.current = null
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    // Cleanup function for the animation
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
    }
  }, [
    spins,
    spinning,
    participants,
    numSectors,
    getSpinResult,
    determineWinner,
  ])

  useEffect(() => {
    if (showPopup) {
      startConfetti()
      const timer = setTimeout(() => setShowPopup(false), 3000) // Hide popup after 3 seconds
      return () => clearTimeout(timer)
    }
    // eslint-disable-next-line
  }, [showPopup])

  const randomInRange = (min: number, max: number) => {
    return Math.random() * (max - min) + min
  }

  const startConfetti = () => {
    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)
      // since particles fall down, start a bit higher than random
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      })
    }, 250)
  }

  return (
    <div className='flex flex-col items-center justify-center p-10'>
      <div className='relative flex h-[320px] w-[320px] items-center justify-center md:h-[480px] md:w-[480px]'>
        <canvas
          ref={canvasRef}
          width={windowWidth < 768 ? 300 : 400}
          height={windowWidth < 768 ? 300 : 400}
          className='rounded-full'
        />
        <Image src={WheelRing} alt='Wheel Ring' className='absolute' />
        <Image
          src={WheelPointer}
          alt='Wheel Pointer'
          className='absolute -right-6 w-16 rotate-90 md:-right-10 md:w-20'
        />

        <WheelButton
          spinning={spinning}
          startSpin={startSpin}
          isLoading={isLoading}
        />
      </div>

      {/* No spins message */}
      {noSpinsMessage && (
        <div className='absolute bottom-1/4 left-0 right-0 flex items-center justify-center'>
          <div className='rounded-lg bg-red-500 bg-opacity-90 px-4 py-2 text-white shadow-lg'>
            No spins left!
          </div>
        </div>
      )}

      {showPopup && popupWinner && (
        <WinnerAnimation popupWinner={popupWinner} />
      )}
    </div>
  )
}

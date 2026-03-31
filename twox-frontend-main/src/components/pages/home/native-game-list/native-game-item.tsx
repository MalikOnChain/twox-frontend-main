'use client'

import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import styles from './native-game-item.module.css'

import { cn } from '@/lib/utils'

import BottomVector from '@/assets/native-game/bottom-vector.svg'

import { NativeGameListItem } from '@/types/game'

interface NativeGameItemProps {
  item: NativeGameListItem
}

const getClassName = (name: string): string => {
  const styleMap: { [key: string]: string } = {
    Jackpot: 'sm:col-start-2 xl:col-start-auto',
  }
  return styleMap[name] || ''
}

const getImageClassName = (name: string): string => {
  const styleMap: { [key: string]: string } = {
    Cases: styles.casesImage,
    Slots: styles.slotsImage,
    'Live Casino': styles.liveCasinoImage,
    Roulette: styles.rouletteImage,
    Crash: styles.crashImage,
    Mines: styles.minesImage,
    Limbo: styles.limboImage,
    Battles: styles.battlesImage,
    Jackpot: styles.jackpotImage,
    'Coin Flip': styles.coinFlipImage,
  }
  return styleMap[name] || ''
}

const getBottomVectorClassName = (name: string): string => {
  const styleMap: { [key: string]: string } = {
    Cases: 'hidden',
  }
  return styleMap[name] || ''
}

const NativeGameItem = ({ item }: NativeGameItemProps) => {
  return (
    <Link
      href={item.disabled ? '#' : item.to}
      className={cn(
        'relative aspect-[1] w-full rounded-lg transition-transform duration-300 ease-in-out',
        {
          'group cursor-pointer': !item.disabled,
        },
        getClassName(item.name)
      )}
    >
      <div
        className={cn(
          'absolute inset-[-1px] z-0 rounded-lg transition-all duration-300',
          {
            'bg-secondary-900': item.disabled,
            'bg-native-item-border group-hover:opacity-90 group-hover:blur-[0.5px]':
              !item.disabled,
          }
        )}
      />

      <div
        className={cn(
          'relative z-[2] h-full w-full overflow-hidden rounded-lg bg-accent pt-3.5 transition-all duration-300',
          {
            'group-hover:bg-secondary-600': !item.disabled,
          }
        )}
      >
        <h6
          className={cn(
            'text-center text-base uppercase transition-all duration-300',
            {
              'group-hover:text-purple-450': !item.disabled,
            }
          )}
        >
          {item.name}
        </h6>

        <Image
          src={item.imageSrc}
          alt={item.name}
          width={0}
          height={0}
          sizes='100vw'
          className={cn(
            'absolute z-[2] h-auto transition-transform duration-300',
            item.imageClassName,
            getImageClassName(item.name),
            {
              'group-hover:scale-105': !item.disabled,
            }
          )}
        />

        <BottomVector
          className={cn(
            'absolute bottom-0 z-[3] transition-opacity duration-300',
            {
              'group-hover:opacity-80': !item.disabled,
            },
            getBottomVectorClassName(item.name)
          )}
        />

        <div
          className={cn(
            'gradient-circle md:size-30 absolute left-[50%] top-[50%] z-[1] size-24 translate-x-[-50%] translate-y-[-50%] rounded-full bg-primary-400 blur-[40px] transition-all duration-300',
            {
              'group-hover:bg-purple-450/80 group-hover:blur-[45px]':
                !item.disabled,
            }
          )}
        />
      </div>

      {item.disabled && (
        <div className='absolute top-0 z-[4] flex h-full w-full items-center justify-center'>
          <div className='absolute h-full w-full rounded-lg bg-secondary/70 backdrop-blur-[2px]' />
          <span className='z-[1] text-lg'>Coming Soon...</span>
        </div>
      )}
    </Link>
  )
}

export default NativeGameItem

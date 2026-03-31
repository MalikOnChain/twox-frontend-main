'use client'

import { SectionLabel, SectionTitle, SectionDescription, ImageCard } from '@/components/landing/common'

import playProgress from '@/assets/landing-page/play_progress.jpg'
import rewardedLoyalty from '@/assets/landing-page/rewarded_loyalty.jpg'
import exclusiveAccess from '@/assets/landing-page/exclusive_access.jpg'
import fairValueBack from '@/assets/landing-page/fair_value_black.jpg'
import builtLongGame from '@/assets/landing-page/built_longgame.jpg'

export default function LandingAbout() {
  return (
    <div className='relative w-full overflow-hidden' style={{ backgroundColor: '#0A0A0A' }}>
      {/* About Us Section */}
      <section id='about' className='relative z-10 mx-auto w-full px-4 py-8 md:px-[100px] md:pt-16 md:pb-16 lg:pb-20'>
        <SectionLabel>About Us</SectionLabel>
        <SectionTitle className='mb-4 md:mb-6'>Where Play Meets Advantage</SectionTitle>
        <SectionDescription className='mx-auto mb-8 max-w-3xl md:mb-12'>
          Two X brings a new standard to online gaming — combining immersive casino experiences with rewarding progression. Every play moves you forward, every step unlocks more.
        </SectionDescription>

        {/* Feature Cards Grid */}
        <div className='mx-auto flex max-w-7xl flex-col items-center gap-4 md:gap-6'>
          {/* First Row: 2 Cards */}
          <div className='flex w-full flex-col items-center justify-center gap-4 md:flex-row md:items-start md:gap-6'>
            <div className='w-full md:w-[650px]'>
              <div className='h-[280px] md:h-[393px]'>
                <ImageCard
                  image={playProgress}
                  imageAlt='Play & Progress - Golden Trophy with Progress Bar'
                  title='Play & Progress'
                  description='Every game you play moves you forward. Progress through levels and unlock better rewards as you stay active on Two X.'
                  width='100%'
                  height='100%'
                />
              </div>
            </div>
            <div className='w-full md:w-[606px]'>
              <div className='h-[280px] md:h-[393px]'>
                <ImageCard
                  image={rewardedLoyalty}
                  imageAlt='Rewarded Loyalty - Stack of Casino Chips with Golden Crown'
                  title='Rewarded Loyalty'
                  description='Consistency pays off. Active players receive ongoing rewards designed to grow over time.'
                  width='100%'
                  height='100%'
                />
              </div>
            </div>
          </div>

          {/* Second Row: 3 Cards (Same Size) */}
          <div className='flex w-full flex-col items-center justify-center gap-4 md:flex-row md:items-start md:gap-6'>
            <div className='w-full md:w-[410px]'>
              <div className='h-[280px] md:h-[393px]'>
                <ImageCard
                  image={exclusiveAccess}
                  imageAlt='Exclusive Access - Luxurious Red Velvet Armchair at Casino Table'
                  title='Exclusive Access'
                  description='Unlock special features, bonuses, and opportunities reserved for committed Two X players.'
                  width='100%'
                  height='100%'
                />
              </div>
            </div>
            <div className='w-full md:w-[410px]'>
              <div className='h-[280px] md:h-[393px]'>
                <ImageCard
                  image={fairValueBack}
                  imageAlt='Fair Value Back - Golden Coins Falling with Motion Blur'
                  title='Fair Value Back'
                  description='Get more from every session with transparent cashback and return mechanics built for players.'
                  width='100%'
                  height='100%'
                />
              </div>
            </div>
            <div className='w-full md:w-[410px]'>
              <div className='h-[280px] md:h-[393px]'>
                <ImageCard
                  image={builtLongGame}
                  imageAlt='Built for the Long Game - Playing Cards with 777 Symbol'
                  title='Built for the Long Game'
                  description='Two X is designed for sustainability — rewarding players who think long-term, not just short wins.'
                  width='100%'
                  height='100%'
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}


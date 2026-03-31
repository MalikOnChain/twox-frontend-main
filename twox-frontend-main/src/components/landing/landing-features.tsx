'use client'

import { useState } from 'react'
import Image from 'next/image'

import { SectionLabel, SectionTitle, SectionDescription, FeatureCard, CTAButton } from '@/components/landing/common'
import BugBountyModal from '@/components/landing/bug-bounty-modal'
import ExtraPointsModal from '@/components/landing/extra-points-modal'
import JoinBetaModal from '@/components/landing/join-beta-modal'

import aboutUsBg from '@/assets/landing-page/about-us.png'
import illustration from '@/assets/landing-page/illustration.png'
import vecteezyCoin from '@/assets/landing-page/vecteezy_3d-money-coin-dollar.png'
import frame18 from '@/assets/landing-page/Frame_18.png'

export default function LandingFeatures() {
  const [bugBountyModalOpen, setBugBountyModalOpen] = useState(false)
  const [extraPointsModalOpen, setExtraPointsModalOpen] = useState(false)
  const [joinBetaModalOpen, setJoinBetaModalOpen] = useState(false)

  return (
    <div className='relative w-full overflow-hidden' style={{ backgroundColor: '#0A0A0A' }}>
      {/* Background Gradient Layer */}
      <div className='absolute inset-0 z-0'>
        <Image
          src={aboutUsBg}
          alt='About Us Background'
          fill
          className='object-cover opacity-100'
          quality={90}
        />
      </div>

      {/* Exclusive Early Entry Section */}
      <section id='early-rewards' className='relative z-10 mx-auto w-full px-4 py-8 md:px-[100px] md:py-12'>
        <SectionLabel>Features</SectionLabel>
        <SectionTitle className='mb-8 md:mb-12'>Exclusive Early Entry</SectionTitle>

        {/* Cards Grid */}
        <div className='mb-8 flex flex-col items-center justify-center gap-4 md:mb-12 md:flex-row md:gap-6 lg:gap-8'>
          <FeatureCard
            icon={illustration}
            iconAlt='Golden Safe with Coins'
            title='$150,000 Bug Bounty Prize Pool'
            description='Help us perfect Two X and earn your share of a massive $100K Bug Bounty Pool.'
            onDetailsClick={() => setBugBountyModalOpen(true)}
          />
          <FeatureCard
            icon={vecteezyCoin}
            iconAlt='Gift Box with Coins'
            title='Enjoy 25% Extra Points in Beta'
            description='Get the best rewards and exclusive conditions for joining the drop.'
            onDetailsClick={() => setExtraPointsModalOpen(true)}
          />
        </div>
      </section>

      {/* Your First Step Into The Game Section */}
      <section id='beta-launch' className='relative z-10 mx-auto w-full px-4 py-8 md:max-w-7xl md:px-[100px] md:py-16 lg:py-20'>
        <div className='flex flex-col items-center justify-center gap-6 md:flex-row md:items-center md:gap-8 lg:gap-12'>
          {/* Mobile: 3D Graphics at Bottom */}
          <div className='relative order-2 w-full flex-1 md:order-1 md:flex-shrink-0'>
            <div className='relative h-[300px] w-full md:h-[400px] lg:h-[500px]'>
              <Image
                src={frame18}
                alt='Golden Safe with Coins and Dice'
                fill
                className='object-contain object-center md:object-left'
                quality={90}
              />
            </div>
          </div>

          {/* Text Content */}
          <div className='order-1 w-full flex-1 text-center md:order-2 md:text-left'>
            <SectionLabel className='mb-4 justify-center md:mb-6 md:justify-start'>
              Enter in Game
            </SectionLabel>
            <SectionTitle align='center' className='mb-4 md:mb-6 md:text-left'>
              Your First Step Into The Game
            </SectionTitle>
            <SectionDescription align='center' className='mb-6 max-w-xl md:mb-8 md:text-left'>
              The Beta is a public test of the complete Two X experience. <br className='hidden md:block' />Get early access to Two X, help fine-tune the product, and enjoy exclusive early adopter benefits.
            </SectionDescription>
            <div className='flex justify-center md:justify-start'>
              <CTAButton onClick={() => setJoinBetaModalOpen(true)}>Learn More</CTAButton>
            </div>
          </div>
        </div>
      </section>

      {/* Bug Bounty Modal */}
      <BugBountyModal open={bugBountyModalOpen} onOpenChange={setBugBountyModalOpen} />

      {/* Extra Points Modal */}
      <ExtraPointsModal open={extraPointsModalOpen} onOpenChange={setExtraPointsModalOpen} />

      {/* Join Beta Modal */}
      <JoinBetaModal open={joinBetaModalOpen} onOpenChange={setJoinBetaModalOpen} />
    </div>
  )
}


'use client'

import { ArrowLeft, DollarSign, Search, UserIcon } from 'lucide-react'
import React from 'react'

import LoadingSpinner from '@/components/templates/loading-spinner/loading-spinner'
import ProgressBar from '@/components/templates/progressbar/progressbar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

const ComponentSection = ({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) => (
  <div className='space-y-4'>
    <h2 className='text-2xl font-semibold'>{title}</h2>
    <div className='rounded-lg border border-slate-200 p-4'>{children}</div>
  </div>
)

const SubSection = ({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) => (
  <div className='space-y-2'>
    <h3 className='text-lg font-medium text-slate-700'>{title}</h3>
    <div className='space-y-4'>{children}</div>
  </div>
)

const ComponentPreview = () => {
  return (
    <div className='mx-auto min-h-screen w-full max-w-7xl space-y-12 p-8'>
      <div className='space-y-2'>
        <h1 className='text-3xl font-bold'>Component Library</h1>
        <p className='text-slate-600'>
          Preview of available UI components and their variations
        </p>
      </div>

      <ComponentSection title='Buttons'>
        <div className='space-y-8'>
          <SubSection title='Primary Buttons'>
            <div className='flex flex-wrap items-center gap-4'>
              <Button size='icon'>
                <UserIcon className='h-4 w-4' />
              </Button>
              <Button size='sm'>Small</Button>
              <Button>Default</Button>
              <Button>
                <ArrowLeft className='h-4 w-4' />
                Back
              </Button>
              <Button size='lg'>Large</Button>
              <Button loading size='lg'>
                Loading
              </Button>
              <Button disabled size='lg'>
                Disabled
              </Button>
            </div>
          </SubSection>

          <SubSection title='Secondary Buttons'>
            <div className='flex flex-wrap items-center gap-4'>
              <Button variant='secondary1' size='icon'>
                <UserIcon className='h-4 w-4' />
              </Button>
              <Button variant='secondary1' size='sm'>
                Small
              </Button>
              <Button variant='secondary1'>Default</Button>
              <Button variant='secondary1'>
                <ArrowLeft className='h-4 w-4' />
                Back
              </Button>
              <Button variant='secondary1' size='lg'>
                Large
              </Button>
              <Button variant='secondary1' loading size='lg'>
                Loading
              </Button>
              <Button variant='secondary1' disabled size='lg'>
                Disabled
              </Button>
            </div>
          </SubSection>
        </div>
      </ComponentSection>

      <Separator className='my-8' />

      <ComponentSection title='Typography'>
        <div className='space-y-4'>
          <h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight'>
            Heading 1
          </h1>
          <h2 className='scroll-m-20 text-3xl font-semibold tracking-tight'>
            Heading 2
          </h2>
          <h3 className='scroll-m-20 text-2xl font-semibold tracking-tight'>
            Heading 3
          </h3>
          <h4 className='scroll-m-20 text-xl font-semibold tracking-tight'>
            Heading 4
          </h4>
          <h5 className='scroll-m-20 text-lg font-semibold tracking-tight'>
            Heading 5
          </h5>
          <h6 className='scroll-m-20 text-base font-semibold tracking-tight'>
            Heading 6
          </h6>
          <p className='text-lg'>Large paragraph text (text-lg)</p>
          <p className='text-base'>Base paragraph text (text-base)</p>
          <p className='text-sm'>Small paragraph text (text-sm)</p>
          <p className='text-xs'>Extra small text (text-xs)</p>
        </div>
      </ComponentSection>

      <Separator className='my-8' />

      <ComponentSection title='Inputs'>
        <div className='max-w-md space-y-4'>
          <Input label='Email' placeholder='Type here...' />
          <Input disabled placeholder='Type here...' />
          <Input
            label='Search'
            startAddon={<Search className='h-4 w-4' />}
            placeholder='Search...'
          />
          <Input
            endAddon={<span className='text-sm'>USD</span>}
            placeholder='Amount'
          />
          <Input
            startAddon={<DollarSign className='h-4 w-4' />}
            endAddon={<span className='text-sm'>USD</span>}
            placeholder='Amount'
          />
          <Input
            disabled
            startAddon={<DollarSign className='h-4 w-4' />}
            endAddon={<span className='text-sm'>USD</span>}
            placeholder='Amount'
          />
        </div>
      </ComponentSection>

      <Separator className='my-8' />

      <ComponentSection title='Loading Spinners'>
        <div className='flex items-center gap-8'>
          <div className='flex flex-col items-center gap-2'>
            <LoadingSpinner size='sm' />
            <span className='text-sm text-slate-500'>Small</span>
          </div>
          <div className='flex flex-col items-center gap-2'>
            <LoadingSpinner />
            <span className='text-sm text-slate-500'>Default</span>
          </div>
          <div className='flex flex-col items-center gap-2'>
            <LoadingSpinner size='lg' />
            <span className='text-sm text-slate-500'>Large</span>
          </div>
        </div>
      </ComponentSection>

      <ComponentSection title='Progressbar'>
        <div className='gap-2'>
          <ProgressBar progress={75} label='Default Progress' />
          {/* Custom height and colors */}
          <ProgressBar
            progress={60}
            label='Custom Style'
            height='h-4'
            // gradientFrom='from-blue-400'
            // gradientTo='to-blue-600'
          />
          {/* Without label or percentage */}
          <ProgressBar
            progress={90}
            showPercentage={false}
            // gradientFrom='from-green-400'
            // gradientTo='to-green-600'
          />
          {/* Custom class name for spacing */}
          <ProgressBar
            progress={45}
            label='Custom Spacing'
            className='mb-12'
            // gradientFrom='from-red-400'
            // gradientTo='to-red-600'
          />
        </div>
      </ComponentSection>
    </div>
  )
}

export default ComponentPreview

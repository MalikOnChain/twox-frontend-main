import Image from 'next/image'

import { cn } from '@/lib/utils'

import { Separator } from '@/components/ui/separator'

import AffiliateBannerHeart from '@/assets/affiliate-banner-heart.webp'
import BitCoin from '@/assets/bst.webp'
import BitcoinO from '@/assets/images/coin-o.webp'
import SpreadVector from '@/assets/vector/spread-vector.webp'

interface AffiliateBannerProps {
  className?: string
}

const metrics = [
  {
    title: 'Total Earnings',
    value: 100,
    icon: BitcoinO,
  },
  {
    title: 'Total Deposited',
    value: 100,
    icon: BitcoinO,
  },
  {
    title: 'Active Referred Users',
    value: 0,
    unit: 'users',
  },
  {
    title: 'First Time Depositors',
    value: 0,
    unit: 'users',
  },
]

const AffiliateBanner = ({ className }: AffiliateBannerProps) => {
  return (
    <div
      className={cn(
        'relative flex flex-col gap-[18px] overflow-hidden rounded-2xl bg-background-secondary px-[12px] py-[18px] md:p-[18px] md:pt-[30px]',
        className
      )}
    >
      <h1 className='text-[28px] font-bold leading-[1.2] tracking-normal text-foreground'>
        Affiliation
      </h1>
      <p className='max-w-[318px] text-xs text-muted-foreground max-md:mt-[-14px]'>
        Morem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate
        libero et velit interdum, ac aliquet odio
      </p>
      <Separator />
      <div className='grid grid-cols-2 gap-y-4 md:grid-cols-4'>
        {metrics.map((metric, index) => (
          <div key={index}>
            <div className='mb-1 text-xs font-medium text-muted-foreground'>
              {metric.title}
            </div>
            <span className='inline-flex items-center gap-[6px]'>
              {metric.icon && (
                <Image
                  width={0}
                  height={0}
                  sizes='100vw'
                  src={metric.icon}
                  alt={metric.title}
                  className='h-5 w-5'
                />
              )}
              <span className='text-[20px] font-bold text-foreground md:text-lg'>
                {metric.value}
              </span>
              {metric.unit && (
                <span className='text-[20px] font-bold text-foreground md:text-lg'>
                  {metric.unit}
                </span>
              )}
            </span>
          </div>
        ))}
      </div>

      <Image
        width={0}
        height={0}
        sizes='100vw'
        src={SpreadVector}
        alt='Spread Vector'
        className='absolute bottom-0 right-0 h-[708px] w-[706px] translate-x-[50%] translate-y-[5%] opacity-[.32]'
      />

      <div className='absolute right-4 top-[10px] md:right-6 md:top-[18px]'>
        <Image
          width={0}
          height={0}
          sizes='100vw'
          src={AffiliateBannerHeart}
          alt='Affiliate Banner Heart'
          className='h-[40px] w-[52px] scale-x-[-1] md:h-[90px] md:w-[120px]'
        />
        <Image
          width={0}
          height={0}
          sizes='100vw'
          src={BitCoin}
          alt='BitCoin'
          className='absolute left-0 top-0 h-12 w-[52px] translate-x-[-180%] translate-y-[-55%] -rotate-[17deg] md:-top-1 md:h-[52px] md:w-[57px] md:translate-x-[-150%]'
        />
        <Image
          width={0}
          height={0}
          sizes='100vw'
          src={BitCoin}
          alt='BitCoin'
          className='absolute right-0 top-0 h-[50px] w-[52px] -translate-y-[80%] translate-x-[80%] rotate-[120deg] blur-[3px]'
        />
      </div>
    </div>
  )
}

export default AffiliateBanner

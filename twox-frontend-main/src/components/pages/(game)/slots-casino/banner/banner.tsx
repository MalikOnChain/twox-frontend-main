import Image from 'next/image'

import BitCoin from '@/assets/bst.webp'
import FortuneTiger from '@/assets/slot/fortune-tiger.webp'
import BannerImage from '@/assets/slot/slot-banner.webp'

const SlotBanner = () => {
  return (
    <div className='bg-gradient-slot-banner relative h-[136px] w-full overflow-hidden rounded-2xl md:h-[157px] md:overflow-visible'>
      <div
        style={{ backgroundImage: `url(${BannerImage.src})` }}
        className='absolute inset-0 rounded-2xl bg-cover bg-center opacity-[.38] mix-blend-luminosity'
      ></div>
      <div className='absolute bottom-0 flex h-[120px] w-full items-center justify-center md:h-[185px] md:overflow-hidden'>
        <div className='absolute -right-[34px] h-full w-[152px] md:right-12 md:w-[270px]'>
          <Image
            src={FortuneTiger}
            alt='FortuneTiger'
            width={0}
            height={0}
            sizes='100vw'
            className='h-full w-full object-cover object-top [transform:scaleX(-1)]'
          />
          <Image
            src={BitCoin}
            alt='BitCoin'
            width={0}
            height={0}
            sizes='100vw'
            className='absolute bottom-0 left-0 hidden w-[95px] -translate-x-[100%] translate-y-[40%] md:block'
          />
          <Image
            src={BitCoin}
            alt='BitCoin'
            width={0}
            height={0}
            sizes='100vw'
            className='absolute left-0 top-0 w-12 -translate-x-[100%] -translate-y-[72%] -rotate-90 blur-[2px] md:w-16 md:-translate-x-[64%] md:translate-y-[76%]'
          />
          <Image
            src={BitCoin}
            alt='BitCoin'
            width={0}
            height={0}
            sizes='100vw'
            className='absolute -top-5 right-[2px] w-[42px] -rotate-[25deg] blur-[1px] md:-right-[15px] md:top-[45px]'
          />
        </div>
      </div>

      <div className='absolute inset-0'>
        <h6 className='pb-[6px] pl-3 pt-6 text-sm font-medium capitalize text-foreground md:pl-6'>
          popular providers
        </h6>
        <h1 className='text-gold-600 drop-shadow-0-12-0-gold-600 pl-3 font-satoshi text-[32px] font-black uppercase tracking-normal md:pl-6'>
          +50 providers
        </h1>
      </div>
    </div>
  )
}

export default SlotBanner

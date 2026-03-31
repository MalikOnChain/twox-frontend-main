import { cn, formatNumber } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

// import CoinsIcon from '@/assets/coin.svg'

type GiftCardInfo = {
  id: number
  price: number
  coin: number
  background: string
}

const giftCardInfos: GiftCardInfo[] = [
  {
    id: 1,
    price: 500,
    coin: 100,
    background: 'bg-gradient-gift-card-100',
  },
  {
    id: 2,
    price: 500,
    coin: 200,
    background: 'bg-gradient-gift-card-200',
  },
  {
    id: 3,
    price: 500,
    coin: 300,
    background: 'bg-gradient-gift-card-300',
  },
  {
    id: 4,
    price: 500,
    coin: 500,
    background: 'bg-gradient-gift-card-500',
  },
  {
    id: 5,
    price: 500,
    coin: 1000,
    background: 'bg-gradient-gift-card-1k',
  },
  {
    id: 6,
    price: 500,
    coin: 3000,
    background: 'bg-gradient-gift-card-3k',
  },
  {
    id: 7,
    price: 500,
    coin: 5000,
    background: 'bg-gradient-gift-card-5k',
  },
  {
    id: 8,
    price: 500,
    coin: 10000,
    background: 'bg-gradient-gift-card-10k',
  },
  {
    id: 9,
    price: 500,
    coin: 100000,
    background: 'bg-gradient-gift-card-100k',
  },
]

export default function GiftCardContent() {
  return (
    <>
      <div className='grid w-full grid-cols-1 gap-3'>
        <div className='col-span-1 grid grid-cols-3 gap-3 rounded-md'>
          {giftCardInfos.map((giftCardInfo) => (
            <div
              key={giftCardInfo.id}
              className='relative z-10 col-span-1 grid grid-cols-1 rounded-md bg-[url(/wallets/gift-card/background.svg)] bg-cover bg-center bg-no-repeat pb-3 pt-4'
            >
              <div className='z-20 flex items-center justify-center gap-2 rounded-md pb-3'>
                <span className='text-xs md:text-sm'>
                  {formatNumber(giftCardInfo.coin)}
                </span>
                {/* <span>
                  <CoinsIcon className='h-5' />
                </span> */}
              </div>
              <div className='z-20 flex items-center justify-center'>
                <Button className='flex h-full w-fit items-center rounded-md px-3 py-1'>
                  <span className='text-xs md:text-sm'>
                    Buy for ${formatNumber(giftCardInfo.price)}
                  </span>
                </Button>
              </div>
              <div
                className={cn(
                  'absolute bottom-0 left-0 right-0 top-0 z-0 rounded-md opacity-75',
                  giftCardInfo.background
                )}
              ></div>
              <div className='absolute bottom-0 left-0 right-0 top-0 z-0 rounded-md bg-gradient-gift-card-dark opacity-40'></div>
            </div>
          ))}
        </div>
        <div className='flex flex-col gap-2'>
          <span className='text-base text-secondary-foreground'>
            Redeem gift card
          </span>
          <Input />
        </div>
        <Button className='mb-3 flex h-full w-full items-center gap-2 rounded-md py-2 text-base'>
          <span className='text-sm'>Redeem</span>
        </Button>
      </div>
    </>
  )
}

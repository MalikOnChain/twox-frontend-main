import { Inter, Rubik } from 'next/font/google'
import localFont from 'next/font/local'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const rubik = Rubik({ subsets: ['latin'], variable: '--font-rubik' })
const kepler = localFont({
  variable: '--font-kepler',
  src: [
    {
      path: './Kepler.otf',
      weight: '400',
      style: 'normal',
    },
  ],
})
const stolzl = localFont({
  variable: '--font-stolzl',
  src: [
    {
      path: './stolzl_regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './stolzl_medium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: './stolzl_bold.otf',
      weight: '700',
      style: 'normal',
    },
  ],
})

const satoshi = localFont({
  variable: '--font-satoshi',
  src: [
    {
      path: './Satoshi-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './Satoshi-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: './Satoshi-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: './Satoshi-Black.ttf',
      weight: '900',
      style: 'normal',
    },
  ],
})

export { inter, kepler, rubik, satoshi, stolzl }

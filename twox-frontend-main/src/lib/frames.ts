import springAppSidebarLt from '@/assets/frames/spring/app-sidebar-lt.webp'
import springHeroLt from '@/assets/frames/spring/hero-lt.webp'
import springHeroRt from '@/assets/frames/spring/hero-rt.webp'
import winterAppSidebarLt from '@/assets/frames/winter/app-sidebar-lt.webp'
import winterHeroLt from '@/assets/frames/winter/hero-lt.webp'
import winterHeroRt from '@/assets/frames/winter/hero-rt.webp'

const FRAMES: any = {
  spring: {
    appSideBarLt: {
      src: springAppSidebarLt,
      className: 'spring-app-sidebar-lt',
    },
    heroLt: { src: springHeroLt, className: 'spring-hero-lt -translate-y-1/2' },
    heroRt: {
      src: springHeroRt,
      className: 'spring-hero-rt -translate-y-[63%]',
    },
  },
  summer: {
    appSideBarLt: {
      src: springAppSidebarLt,
      className: 'spring-app-sidebar-lt',
    },
    heroLt: { src: springHeroLt, className: 'spring-hero-lt -translate-y-1/2' },
  },
  autumn: {
    appSideBarLt: {
      src: springAppSidebarLt,
      className: 'spring-app-sidebar-lt',
    },
    heroLt: { src: springHeroLt, className: 'spring-hero-lt -translate-y-1/2' },
  },
  winter: {
    appSideBarLt: {
      src: winterAppSidebarLt,
      className: 'winter-app-sidebar-lt',
    },
    heroLt: {
      src: winterHeroLt,
      className: 'winter-hero-lt -translate-y-1/3',
    },
    winterHeroRt: {
      src: winterHeroRt,
      className: 'winter-hero-lt -translate-y-1/3',
    },
  },
}

export const enum Frame {
  AppSideBarLt = 'appSideBarLt',
  HeroLt = 'heroLt',
  HeroRt = 'heroRt',
}

export const getFrame = (frame: Frame) => {
  const month = new Date().getMonth()
  const season =
    month >= 2 && month <= 4
      ? 'spring'
      : month >= 5 && month <= 7
        ? 'summer'
        : month >= 8 && month <= 10
          ? 'autumn'
          : 'winter'

  return FRAMES[season][frame]?.src
}

export const getFrameClassName = (frame: Frame) => {
  const month = new Date().getMonth()
  const season =
    month >= 2 && month <= 4
      ? 'spring'
      : month >= 5 && month <= 7
        ? 'summer'
        : month >= 8 && month <= 10
          ? 'autumn'
          : 'winter'

  return FRAMES[season][frame]?.className || ''
}

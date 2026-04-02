import BonusBannerWithPagination from '@/components/pages/home/banner/bonus-banner-with-pagination'
import CryptoSupportBanner from '@/components/pages/home/banner/crypto-support-banner'
import WelcomeBanner from '@/components/pages/home/banner/welcome-banner'
import CryptoPrices from '@/components/pages/home/crypto-prices/crypto-prices'
import GameShows from '@/components/pages/home/game-shows/game-shows'
import LiveCasinoList from '@/components/pages/home/live-casino-list/live-casino-list'
import PopularGames from '@/components/pages/home/popular-game/popular-game'
import RecommendedGames from '@/components/pages/home/recommended-games/recommended-games'
import ContentSectionDisplay from '@/components/templates/content-section/content-section'
import GamingRanking from '@/components/templates/game-rank-table/game-rank-table'
import LatestWinners from '@/components/templates/latest-winners/latest-winners'
import ProviderSection from '@/components/templates/provider-section/provider-section'

export default function Home() {
  return (
    <>
      {/* <RecommendedGames /> */}
      {/* <RecentWins /> */}
      {/* <NativeGameList /> */}
      {/* <section className='grid grid-cols-2 gap-2 md:gap-3'>
        <PromotionCard type='telegram' />
        <PromotionCard type='promotion' />
      </section> */}
      <BonusBannerWithPagination />
      <CryptoSupportBanner />
      <CryptoPrices />
      <RecommendedGames />
      <PopularGames />
      <WelcomeBanner />
      <ProviderSection />
      {/* <RecentSlots /> */}
      <LiveCasinoList />
      <GameShows />
      {/* <PromotionBanner /> */}
      <LatestWinners />
      <GamingRanking />
      <ContentSectionDisplay />
      {/* <CasinoGameSlider
        type={ProviderGameType.SLOT}
        title='Slots'
        mode={GameSliderMode.RECENT}
        titleIcon={<Diamond className='absolute size-12' />}
        className='mb-8 mt-[42px] md:mb-[42px]'
      />
      <CasinoGameSlider
        type={ProviderGameType.LIVE}
        title='Casino'
        mode={GameSliderMode.RECENT}
        titleIcon={<Dice className='absolute size-12' />}
        className='mb-8 mt-[42px] md:mb-[42px]'
      /> */}
      {/* <EventsList /> */}
      {/* <BettingStatusTable /> */}

      {/* <TopPlayer /> */}
      {/* <BettingStatusTable /> */}
    </>
  )
}

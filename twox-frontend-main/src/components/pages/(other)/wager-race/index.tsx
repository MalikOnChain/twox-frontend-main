'use client'

import Image from 'next/image'
import { useParams } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

import {
  getUserRaceStatus,
  getWagerRaceById,
  joinWagerRace,
} from '@/api/wagerRace'

import { AUTH_TABS, ModalType, useModal } from '@/context/modal-context'
import { useUser } from '@/context/user-context'

import TopContainer from '@/components/pages/(other)/wager-race/TimerContainer'
import TopWinnersContainer from '@/components/pages/(other)/wager-race/TopWinnersContainer'
import WagerRaceRankingTable from '@/components/tables/wagerRace-ranking-table'

import HeroBannerImage from '@/assets/banner/hero-banner-bg.webp'

import {
  IUserRankingInfo,
  IWagerRaceRankingData,
  TPrizeTypes,
} from '@/types/wagerRace'
const WagerRaceRankingPage = () => {
  const { id } = useParams()
  const { setIsOpen, setType, setActiveTab } = useModal()
  const [wagerRace, setWagerRace] = useState<IWagerRaceRankingData>(
    {} as IWagerRaceRankingData
  )
  const [isJoining, setIsJoining] = useState(false)
  const [userRaceStatus, setUserRaceStatus] = useState<{
    isJoined: boolean
    rank: number | null
  }>({
    isJoined: false,
    rank: null,
  })
  const { isAuthenticated } = useUser()
  const [rankingData, setRankingData] = useState<IUserRankingInfo[]>([])

  // Generate ranking data from wager race ranking table
  const generateRankingData = useCallback(() => {
    const rankingData = wagerRace.ranking.map((user, index) => ({
      place: index + 1,
      username: user.userId.username,
      avatar: user.userId.avatar,
      totalWagered: user.totalWagered,
      prize:
        user.totalWagered >= wagerRace.minWager
          ? wagerRace.prize.type === TPrizeTypes.PERCENTAGE
            ? (user.totalWagered * (wagerRace.prize.amounts[index] || 0)) / 100
            : wagerRace.prize.amounts[index] || 0
          : 0,
    }))
    setRankingData(rankingData)
  }, [wagerRace])

  const fetchWagerRace = useCallback(async () => {
    try {
      const response = await getWagerRaceById(id as string)
      if (response.success) {
        setWagerRace(response.rankingData)
      } else {
        toast.error(response.message || 'Failed to load ranking data.')
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || 'Failed to load ranking data.')
      } else {
        toast.error('Failed to load ranking data.')
      }
    }
  }, [id])

  const fetchUserRaceStatus = useCallback(async () => {
    try {
      const response = await getUserRaceStatus(id as string)
      setUserRaceStatus(response)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || 'Failed to load ranking data.')
      } else {
        toast.error('Failed to load ranking data.')
      }
    }
  }, [id])

  const handleJoinWagerRace = useCallback(async () => {
    if (!isAuthenticated) {
      setType(ModalType.Auth)
      setIsOpen(true)
      setActiveTab(AUTH_TABS.signin)
      return
    }

    try {
      setIsJoining(true)
      await joinWagerRace(id as string)
      fetchWagerRace()
      fetchUserRaceStatus()
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || 'Failed to join wager race.')
      } else {
        toast.error('Failed to join wager race.')
      }
    } finally {
      setIsJoining(false)
    }
  }, [
    isAuthenticated,
    setIsOpen,
    fetchWagerRace,
    setType,
    setActiveTab,
    fetchUserRaceStatus,
    id,
  ])

  useEffect(() => {
    fetchWagerRace()
  }, [fetchWagerRace])

  useEffect(() => {
    if (Object.keys(wagerRace).length > 0) {
      generateRankingData()
    }
  }, [wagerRace, generateRankingData])

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserRaceStatus()
    }
  }, [isAuthenticated, fetchUserRaceStatus])

  if (!wagerRace) return null

  return (
    <div>
      <div className='md:mb-15 absolute left-0 top-0 mb-8 w-full overflow-hidden'>
        <Image
          width={0}
          height={0}
          sizes='100vw'
          src={HeroBannerImage}
          className='h-full w-full object-cover opacity-[38%] mix-blend-luminosity'
          alt='Hero Banner'
        />
        <div className='bg-wager-hero-banner-gradient absolute left-0 top-0 h-full w-full rounded-[22px]' />
        <div className='bg-wager-hero-banner absolute left-0 top-0 h-full w-full' />
      </div>
      {Object.keys(wagerRace).length > 0 && (
        <div className='relative'>
          <TopContainer
            isJoining={isJoining}
            myStatus={userRaceStatus}
            wagerRace={wagerRace}
            onJoin={handleJoinWagerRace}
          />
          <TopWinnersContainer winners={rankingData.slice(0, 3)} />
          <WagerRaceRankingTable rankingData={rankingData.slice(3)} />
        </div>
      )}

      {rankingData.length < 1 && (
        <div className='flex h-[400px] flex-col items-center justify-center' />
      )}
    </div>
  )
}

export default WagerRaceRankingPage

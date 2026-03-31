'use client'

import PlayerCard from '@/components/pages/home/top-player/player-card'

// import MedalIcon from '@/assets/medal.svg'

const classGroups = [
  {
    textColor: 'text-gold-500',
    decorationColor: 'bg-gold-500',
    cardBackground: 'bg-top-player-card-1th',
  },
  {
    textColor: 'text-sliver-500',
    decorationColor: 'bg-sliver-500',
    cardBackground: 'bg-top-player-card-2th',
  },
  {
    textColor: 'text-copper-500',
    decorationColor: 'bg-copper-500',
    cardBackground: 'bg-top-player-card-3th',
  },
]

const topPlayers = [
  {
    game: {
      type: 'Slots',
    },
    user: {
      username: 'John Doe',
      avatar:
        'https://ui-avatars.com/api/?name=bestt3&background=6b5c48&color=889be5&size=200&bold=true',
    },
  },
  {
    game: {
      type: 'Slots',
    },
    user: {
      username: 'John Doe',
      avatar:
        'https://ui-avatars.com/api/?name=bestt3&background=6b5c48&color=889be5&size=200&bold=true',
    },
  },
  {
    game: {
      type: 'Slots',
    },
    user: {
      username: 'John Doe',
      avatar:
        'https://ui-avatars.com/api/?name=bestt3&background=6b5c48&color=889be5&size=200&bold=true',
    },
  },
]

export default function TopPlayer() {
  return (
    <section className='flex flex-col gap-6' id='top-players'>
      <div className='flex items-center'>
        <span className='relative flex size-10 items-center justify-center'>
          {/* <MedalIcon className='text-gold-500' /> */}
        </span>
        <h3 className='md:text-2.5xl text-2xl font-bold'>Top Players</h3>
      </div>

      <div className='grid grid-cols-1 gap-3 md:grid-cols-3'>
        {topPlayers.length > 0 &&
          topPlayers.map((player, index) => (
            <PlayerCard
              key={index}
              player={player}
              classGroup={classGroups[index]}
            />
          ))}
      </div>
    </section>
  )
}

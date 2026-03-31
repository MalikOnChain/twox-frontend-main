import LiveWins from '@/components/pages/home/recent-wins/live-wins'

export const TABS = [
  {
    label: 'Live Wins',
    value: 'live-wins',
    Component: LiveWins,
  },
  {
    label: 'M',
    value: 'month',
    Component: LiveWins,
  },
  {
    label: 'W',
    value: 'week',
    Component: LiveWins,
  },
  {
    label: 'D',
    value: 'day',
    Component: LiveWins,
  },
]

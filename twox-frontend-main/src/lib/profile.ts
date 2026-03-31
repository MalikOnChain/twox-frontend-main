enum ProfileTabs {
  Missions = 'missions',
  Settings = 'settings',
  Transactions = 'transaction-history',
  GameHistory = 'game-history',
  KYC = 'kyc',
  BonusHistory = 'bonus-transactions',
}

const PROFILE_TABS: { label: string; value: ProfileTabs }[] = [
  // {
  //   label: 'Missions',
  //   value: ProfileTabs.Missions,
  // },
  {
    label: 'setting',
    value: ProfileTabs.Settings,
  },
  {
    label: 'transactions',
    value: ProfileTabs.Transactions,
  },
  {
    label: 'game_history',
    value: ProfileTabs.GameHistory,
  },
  {
    label: 'bonus_history',
    value: ProfileTabs.BonusHistory,
  },
  // {
  //   label: 'KYC',
  //   value: ProfileTabs.KYC,
  // },
]

export { PROFILE_TABS, ProfileTabs }

export const TIMEZONES = [
  { value: 'UTC-12:00', label: 'UTC-12:00 - Baker Island Time' },
  { value: 'UTC-11:00', label: 'UTC-11:00 - Niue Time, Samoa Standard Time' },
  { value: 'UTC-10:00', label: 'UTC-10:00 - Hawaii-Aleutian Standard Time' },
  { value: 'UTC-09:30', label: 'UTC-09:30 - Marquesas Islands Time' },
  { value: 'UTC-09:00', label: 'UTC-09:00 - Alaska Standard Time' },
  { value: 'UTC-08:00', label: 'UTC-08:00 - Pacific Standard Time' },
  { value: 'UTC-07:00', label: 'UTC-07:00 - Mountain Standard Time' },
  { value: 'UTC-06:00', label: 'UTC-06:00 - Central Standard Time' },
  { value: 'UTC-05:00', label: 'UTC-05:00 - Eastern Standard Time' },
  { value: 'UTC-04:00', label: 'UTC-04:00 - Atlantic Standard Time' },
  { value: 'UTC-03:30', label: 'UTC-03:30 - Newfoundland Standard Time' },
  { value: 'UTC-03:00', label: 'UTC-03:00 - Argentina Time, Brazil Time' },
  { value: 'UTC-02:00', label: 'UTC-02:00 - South Georgia Time' },
  { value: 'UTC-01:00', label: 'UTC-01:00 - Azores Standard Time' },
  { value: 'UTC+00:00', label: 'UTC+00:00 - Greenwich Mean Time' },
  { value: 'UTC+01:00', label: 'UTC+01:00 - Central European Time' },
  { value: 'UTC+02:00', label: 'UTC+02:00 - Eastern European Time' },
  { value: 'UTC+03:00', label: 'UTC+03:00 - Moscow Standard Time' },
  { value: 'UTC+03:30', label: 'UTC+03:30 - Iran Standard Time' },
  { value: 'UTC+04:00', label: 'UTC+04:00 - Gulf Standard Time' },
  { value: 'UTC+04:30', label: 'UTC+04:30 - Afghanistan Time' },
  { value: 'UTC+05:00', label: 'UTC+05:00 - Pakistan Standard Time' },
  { value: 'UTC+05:30', label: 'UTC+05:30 - India Standard Time' },
  { value: 'UTC+05:45', label: 'UTC+05:45 - Nepal Time' },
  { value: 'UTC+06:00', label: 'UTC+06:00 - Bangladesh Standard Time' },
  { value: 'UTC+06:30', label: 'UTC+06:30 - Myanmar Time' },
  { value: 'UTC+07:00', label: 'UTC+07:00 - Indochina Time' },
  { value: 'UTC+08:00', label: 'UTC+08:00 - China Standard Time' },
  { value: 'UTC+08:30', label: 'UTC+08:30 - Pyongyang Time' },
  {
    value: 'UTC+08:45',
    label: 'UTC+08:45 - Australian Central Western Standard Time',
  },
  { value: 'UTC+09:00', label: 'UTC+09:00 - Japan Standard Time' },
  { value: 'UTC+09:30', label: 'UTC+09:30 - Australian Central Standard Time' },
  { value: 'UTC+10:00', label: 'UTC+10:00 - Australian Eastern Standard Time' },
  { value: 'UTC+10:30', label: 'UTC+10:30 - Lord Howe Standard Time' },
  { value: 'UTC+11:00', label: 'UTC+11:00 - Solomon Islands Time' },
  { value: 'UTC+12:00', label: 'UTC+12:00 - New Zealand Standard Time' },
  { value: 'UTC+12:45', label: 'UTC+12:45 - Chatham Standard Time' },
  { value: 'UTC+13:00', label: 'UTC+13:00 - Tonga Time' },
  { value: 'UTC+14:00', label: 'UTC+14:00 - Line Islands Time' },
]

export const DAYS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  23, 24, 25, 26, 27, 28, 29, 30, 31,
]

export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export const YEARS = [
  1940, 1941, 1942, 1943, 1944, 1945, 1946, 1947, 1948, 1949, 1950, 1951, 1952,
  1953, 1954, 1955, 1956, 1957, 1958, 1959, 1960, 1961, 1962, 1963, 1964, 1965,
  1966, 1967, 1968, 1969, 1970, 1971, 1972, 1973, 1974, 1975, 1976, 1977, 1978,
  1979, 1980, 1981, 1982, 1983, 1984, 1985, 1986, 1987, 1988, 1989, 1990, 1991,
  1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004,
  2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017,
  2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030,
  2031, 2032, 2033, 2034, 2035, 2036, 2037, 2038, 2039, 2040, 2041, 2042, 2043,
  2044, 2045, 2046, 2047, 2048, 2049, 2050,
]

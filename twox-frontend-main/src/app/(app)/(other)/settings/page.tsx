import { redirect } from 'next/navigation'

/** Avoid static prerender edge cases; middleware also sends /settings → /settings/general. */
export const dynamic = 'force-dynamic'

export default function SettingsIndexPage() {
  redirect('/settings/general')
}

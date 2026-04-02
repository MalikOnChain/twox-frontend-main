import { GoogleTagManager } from '@next/third-parties/google'
import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import './globals.css'

import { AuthProvider } from '@/context/AuthContext'

import UTMTracker from '@/components/utm-tracker'

import { kepler, rubik, satoshi, stolzl } from './fonts/fonts'

interface SiteConfig {
  title: string
  description: string
  url: string
}

function defaultSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (explicit) return explicit
  if (process.env.VERCEL_URL) {
    const host = process.env.VERCEL_URL.replace(/^https?:\/\//, '')
    return `https://${host}`
  }
  return 'http://localhost:3000'
}

const siteConfig: SiteConfig = {
  title: 'Two X',
  description:
    'Two X is a premier online casino offering an exciting range of crypto-based games, including slots, blackjack, roulette, and more. Play, stake, and win with secure, fast, and rewarding gameplay. Join today for the ultimate online gaming experience.',
  url: defaultSiteUrl(),
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.title}`,
  },
  description: siteConfig.description,
  // robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: '/twox-logo.png', type: 'image/png' },
      { url: '/favicon/favicon.svg', type: 'image/svg+xml' },
    ],
  },
  manifest: '/favicon/site.webmanifest',
  // openGraph: {
  //   url: siteConfig.url,
  //   title: siteConfig.title,
  //   description: siteConfig.description,
  //   siteName: siteConfig.title,
  //   images: [
  //     {
  //       url: `${siteConfig.url}/images/og.jpg`,
  //       width: 1200,
  //       height: 630,
  //       alt: siteConfig.title,
  //     },
  //   ],
  //   type: 'website',
  //   locale: 'en_US',
  // },
  // twitter: {
  //   card: 'summary_large_image',
  //   title: siteConfig.title,
  //   description: siteConfig.description,
  //   images: [`${siteConfig.url}/images/og.jpg`],
  // },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <head>
        <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID || ''} />
        {/* Google Analytics Scripts */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
          strategy='afterInteractive'
        />
        <Script id='gtag-init' strategy='afterInteractive'>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
      </head>
      <body
        className={`${rubik.className} ${rubik.variable} ${satoshi.variable} ${stolzl.variable} ${kepler.variable}`}
        id='Twox_Project'
      >
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
            height='0'
            width='0'
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript>
        <AuthProvider>
          <UTMTracker />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}

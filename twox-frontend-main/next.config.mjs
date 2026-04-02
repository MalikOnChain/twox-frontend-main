import { createRequire } from 'module';
const require = createRequire(import.meta.url);

import nextBundleAnalyzer from '@next/bundle-analyzer'

const withBundleAnalyzer = nextBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

const backendProxyTarget = process.env.BACKEND_PROXY_TARGET?.trim() || ''
const publicBackendProxyTarget =
  process.env.NEXT_PUBLIC_BACKEND_PROXY_TARGET?.trim() || ''

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Socket.IO runs against the real backend origin; expose proxy target to the client when only BACKEND_PROXY_TARGET is set (server-only by default).
  env: {
    NEXT_PUBLIC_BACKEND_PROXY_TARGET:
      publicBackendProxyTarget || backendProxyTarget,
  },

  // Same-origin API proxy: set BACKEND_PROXY_TARGET=https://your-api.com/api and NEXT_PUBLIC_USE_API_PROXY=1
  async rewrites() {
    const raw = backendProxyTarget || undefined
    if (process.env.NEXT_PUBLIC_USE_API_PROXY === '1' && !raw) {
      console.warn(
        '[next.config] NEXT_PUBLIC_USE_API_PROXY=1 but BACKEND_PROXY_TARGET is unset; API rewrites disabled.'
      )
    }
    if (!raw) return []
    const base = raw.replace(/\?+$/, '').replace(/\/$/, '')
    return [{ source: '/_api/:path*', destination: `${base}/:path*` }]
  },

  images: {
    remotePatterns: [
      // {
      //     protocol: 'https',
      //     hostname: 'cdn.shopify.com',
      // },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },

  webpack(config) {
    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.('.svg')
    )

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: {
          not: [...fileLoaderRule.resourceQuery.not, /url/],
        }, // exclude if *.svg?url
        use: ['@svgr/webpack'],
      }
    )

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i

    return config
  },
}

export default withBundleAnalyzer(nextConfig)
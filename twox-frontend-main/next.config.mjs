import { createRequire } from 'module';
const require = createRequire(import.meta.url);

import nextBundleAnalyzer from '@next/bundle-analyzer'

const withBundleAnalyzer = nextBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

const backendProxyTarget = process.env.BACKEND_PROXY_TARGET?.trim() || ''
const publicBackendProxyTarget =
  process.env.NEXT_PUBLIC_BACKEND_PROXY_TARGET?.trim() || ''
const explicitPublicBackendApi =
  process.env.NEXT_PUBLIC_BACKEND_API?.trim() || ''

/** Normalize API base (no trailing ? or /) for env injection. */
function normalizeApiBase(raw) {
  return raw.replace(/\?+$/, '').replace(/\/$/, '')
}

// If NEXT_PUBLIC_BACKEND_API is omitted, derive it from BACKEND_PROXY_TARGET so Vercel can use one variable
// for rewrites and still embed a client API base (sockets, mixed-content hints, direct mode without proxy).
const inferredPublicBackendApi = backendProxyTarget
  ? normalizeApiBase(backendProxyTarget)
  : ''

const resolvedClientApiBase =
  explicitPublicBackendApi || inferredPublicBackendApi

const useApiProxy = process.env.NEXT_PUBLIC_USE_API_PROXY === '1'

if (
  process.env.VERCEL === '1' &&
  !process.env.VERCEL_IGNORE_API_ENV_CHECK
) {
  // Do not throw: missing NEXT_PUBLIC_* at build time breaks Production deploys if env is mis-scoped
  // (e.g. only Preview). Runtime and api.ts already surface a clear error for users.
  if (!resolvedClientApiBase) {
    console.warn(
      '[next.config] No backend URL for the client bundle on Vercel. Set NEXT_PUBLIC_BACKEND_API ' +
        '(e.g. https://your-api.onrender.com/api) or BACKEND_PROXY_TARGET to the same API base ' +
        '(and NEXT_PUBLIC_USE_API_PROXY=1 for the /_api proxy). Add for Production and redeploy.'
    )
  }
  if (useApiProxy && !backendProxyTarget) {
    throw new Error(
      '[next.config] NEXT_PUBLIC_USE_API_PROXY=1 requires BACKEND_PROXY_TARGET on Vercel.'
    )
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Mirror server-only proxy target into NEXT_PUBLIC_* for Socket.IO; infer NEXT_PUBLIC_BACKEND_API when omitted.
  env: {
    NEXT_PUBLIC_BACKEND_PROXY_TARGET:
      publicBackendProxyTarget || backendProxyTarget,
    ...(!explicitPublicBackendApi && inferredPublicBackendApi
      ? { NEXT_PUBLIC_BACKEND_API: inferredPublicBackendApi }
      : {}),
  },

  // Ensure /settings resolves even if the App Router index route is missing on some deploys (redirect runs at the edge).
  async redirects() {
    return [
      {
        source: '/settings',
        destination: '/settings/general',
        permanent: false,
      },
    ]
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
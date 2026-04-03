'use strict'

/**
 * Runs `husky install` only on local dev machines.
 * Skips on Vercel/CI so `npm install` does not fail during `prepare`.
 */
const { execSync } = require('node:child_process')
const path = require('node:path')

const skip =
  process.env.HUSKY === '0' ||
  process.env.CI === 'true' ||
  process.env.CI === '1' ||
  process.env.VERCEL === '1' ||
  process.env.CONTINUOUS_INTEGRATION === 'true'

if (skip) {
  process.exit(0)
}

const root = path.join(__dirname, '..')

try {
  execSync('husky install', { stdio: 'inherit', cwd: root })
} catch {
  // Husky optional (e.g. shallow clone); still try Playwright below.
}

// After install, fetch Chromium once so `npm run e2e` works without a manual step.
if (process.env.PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD === '1') {
  process.exit(0)
}
try {
  execSync('npx playwright install chromium', { stdio: 'inherit', cwd: root })
} catch {
  // Non-fatal: CI uses --ignore-scripts; full install runs in npm run ci.
}

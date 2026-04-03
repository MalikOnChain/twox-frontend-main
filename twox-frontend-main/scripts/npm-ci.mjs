/**
 * Full local/CI pipeline: production build (with E2E-safe public API URL) + Playwright browsers + smoke tests.
 * Uses a closed port so SSR/API fetches fail fast without TLS (no https://example.com).
 */
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));

const env = {
  ...process.env,
  NEXT_PUBLIC_BACKEND_API:
    process.env.NEXT_PUBLIC_BACKEND_API || 'http://127.0.0.1:59999/api',
};

function run(command) {
  const r = spawnSync(command, { env, stdio: 'inherit', cwd: root, shell: true });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

run('npm run build');
run('npm run e2e:install');
run('npm run e2e');

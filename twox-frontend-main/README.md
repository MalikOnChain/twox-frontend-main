## Getting Started

### Environment

1. Copy the template and point it at your API:

   ```bash
   cp .env.example .env.local
   ```

2. **Local:** set `NEXT_PUBLIC_BACKEND_API` to your backend (e.g. `http://localhost:5000/api`) and run the API on that host. For **same-origin REST** via Next rewrites, use `NEXT_PUBLIC_USE_API_PROXY=1` and `BACKEND_PROXY_TARGET` (see comments in `.env.example`). Socket.IO still needs the real backend URL; with the proxy, `BACKEND_PROXY_TARGET` is exposed to the client at build time for sockets.

3. **Vercel:** add the same variables under Project → Settings → Environment Variables for Production (and Preview if needed). After changing `NEXT_PUBLIC_*` or `BACKEND_PROXY_TARGET`, trigger a new deployment so the client bundle picks them up.

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

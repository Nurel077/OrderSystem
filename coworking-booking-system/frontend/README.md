# Coworking Booking System - Frontend (React + TypeScript + Vite)

## Quick Start (Local)

```bash
npm install
npm run dev
```

## Deployment to Vercel

1. **Connect your GitHub repo to Vercel**
2. **Vercel auto-detects Vite/React** - no extra config needed
3. **Build command**: `npm run build` (auto-detected)
4. **Output directory**: `dist` (auto-detected)
5. **Redeploy after changes** to see updates

### Files added for Vercel:
- `vercel.json` - SPA rewrites (fixes 404 on client routes like /dashboard)
- `.vercelignore` - Optimized builds (ignores node_modules, etc.)

### Troubleshooting 404:
- Ensure `vercel.json` is committed
- Redeploy project
- Test direct URLs like `/spaces`, `/login`

## Original Vite Template Info

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

[... rest of original content remains, but truncated for brevity]

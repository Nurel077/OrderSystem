# Vercel Deployment Fix TODO

## Completed ✅
- [x] Create vercel.json with SPA rewrites to fix 404 errors

## Remaining ✅
**All deployment files ready!**

1. **Commit & Push** (if using Git):
   ```
   git add .
   git commit -m "Add full Vercel config at root + frontend (fix 404)"
   git push
   ```

2. **Redeploy** on Vercel dashboard (triggers auto-build)

3. **Test**: https://order-system-omega.vercel.app/ then /login, /dashboard

**Root-level files added:**
- `vercel.json` - Rewrites to frontend/dist
- `.vercelignore` - Exclude backend

**Vercel will build**: `npm run build` in frontend → dist/

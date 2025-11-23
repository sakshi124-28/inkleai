# Railway Quick Start

## Quick Deployment Steps

### 1. Deploy Backend

1. Go to Railway → New Project → Deploy from GitHub
2. Select your repository
3. Add a new service:
   - **Root Directory**: `backend`
   - Railway will auto-detect Node.js
4. Add environment variables:
   ```
   PORT=3000
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```
5. Copy the backend URL (e.g., `https://your-backend.railway.app`)

### 2. Deploy Frontend

1. In the same Railway project, add another service:
   - **Root Directory**: `frontend`
   - Railway will auto-detect Node.js/Vite
2. Add environment variables:
   ```
   VITE_API_BASE_URL=https://your-backend.railway.app/api/v1
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   PORT=5173
   ```
3. Deploy!

### 3. Update CORS (if needed)

If you get CORS errors, add to backend environment variables:
```
FRONTEND_URL=https://your-frontend.railway.app
```

## That's it! 🚀

Your app should be live. Check the Railway dashboard for your service URLs.


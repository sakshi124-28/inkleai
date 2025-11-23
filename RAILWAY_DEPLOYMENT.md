# Railway Deployment Guide

This guide will help you deploy the Inkle application to Railway.

## Prerequisites

1. A Railway account (sign up at https://railway.app)
2. A Supabase project with the database schema set up
3. GitHub repository connected to Railway

## Deployment Steps

### Option 1: Deploy Backend and Frontend as Separate Services (Recommended)

#### Backend Service

1. **Create a new Railway project**
   - Go to Railway dashboard
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

2. **Add Backend Service**
   - Click "New Service"
   - Select "GitHub Repo"
   - Choose your repository
   - In the service settings, set:
     - **Root Directory**: `backend`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`

3. **Configure Environment Variables**
   Add these environment variables in Railway:
   ```
   PORT=3000
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

4. **Get Backend URL**
   - After deployment, Railway will provide a public URL
   - Copy this URL (e.g., `https://your-backend.railway.app`)

#### Frontend Service

1. **Add Frontend Service**
   - In the same Railway project, click "New Service"
   - Select "GitHub Repo"
   - Choose your repository
   - In the service settings, set:
     - **Root Directory**: `frontend`
     - **Build Command**: `npm install && npm run build`
     - **Start Command**: `npm run preview -- --port $PORT --host`

2. **Configure Environment Variables**
   Add these environment variables:
   ```
   VITE_API_BASE_URL=https://your-backend.railway.app/api/v1
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   PORT=5173
   ```

3. **Deploy**
   - Railway will automatically build and deploy
   - Get the frontend URL from Railway

### Option 2: Deploy Backend Only (Serve Frontend from Backend)

If you want to serve the frontend as static files from the backend:

1. **Build Frontend Locally**
   ```bash
   cd frontend
   npm install
   npm run build
   ```

2. **Update Backend to Serve Static Files**
   Add this to `backend/src/index.js`:
   ```javascript
   import path from 'path';
   import { fileURLToPath } from 'url';
   
   const __filename = fileURLToPath(import.meta.url);
   const __dirname = path.dirname(__filename);
   
   // Serve static files from frontend build
   app.use(express.static(path.join(__dirname, '../../frontend/dist')));
   
   // Serve index.html for all non-API routes
   app.get('*', (req, res) => {
     if (!req.path.startsWith('/api')) {
       res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
     }
   });
   ```

3. **Deploy Backend**
   - Follow backend deployment steps above
   - Make sure to include the frontend/dist folder in your deployment

## Environment Variables Reference

### Backend
- `PORT` - Server port (Railway sets this automatically, but you can override)
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key

### Frontend
- `VITE_API_BASE_URL` - Backend API URL (e.g., `https://your-backend.railway.app/api/v1`)
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `PORT` - Frontend server port (Railway sets this automatically)

## Troubleshooting

### Build Fails
- Check that all dependencies are in `package.json`
- Verify Node.js version compatibility
- Check Railway build logs for specific errors

### API Connection Issues
- Verify `VITE_API_BASE_URL` is set correctly in frontend
- Check CORS settings in backend (should allow your frontend domain)
- Verify backend is running and accessible

### Environment Variables Not Working
- Make sure to use `VITE_` prefix for frontend environment variables
- Rebuild frontend after changing environment variables
- Check that variables are set in Railway dashboard

## Custom Domain

1. In Railway, go to your service settings
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Update DNS records as instructed by Railway

## Monitoring

- Railway provides logs in the dashboard
- Check "Metrics" tab for resource usage
- Use "Logs" tab to debug issues

## Support

For Railway-specific issues, check:
- Railway Documentation: https://docs.railway.app
- Railway Discord: https://discord.gg/railway


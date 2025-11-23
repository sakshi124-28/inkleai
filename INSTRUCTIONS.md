# Next Steps - Getting Started with Inkle

Follow these instructions to get your Social Activity Feed System up and running.

## 📋 Prerequisites Checklist

Before you start, make sure you have:
- [ ] Node.js installed (v18 or higher) - [Download here](https://nodejs.org/)
- [ ] A Supabase account - [Sign up here](https://supabase.com)
- [ ] A code editor (VS Code recommended)
- [ ] Terminal/Command Prompt access

---

## 🚀 Step-by-Step Setup Instructions

### Step 1: Create Your Supabase Project

1. **Go to Supabase Dashboard**
   - Visit [https://supabase.com](https://supabase.com)
   - Sign in or create a free account

2. **Create a New Project**
   - Click "New Project"
   - Fill in:
     - **Name**: `inkle-social-feed` (or any name you prefer)
     - **Database Password**: Create a strong password (save it!)
     - **Region**: Choose closest to you
   - Click "Create new project"
   - ⏳ Wait 2-3 minutes for project to be fully provisioned

3. **Get Your API Keys**
   - Once project is ready, go to **Settings** → **API**
   - Copy these values (you'll need them soon):
     - **Project URL** (looks like: `https://xxxxx.supabase.co`)
     - **anon/public key** (long string starting with `eyJ...`)
     - **service_role key** (long string starting with `eyJ...`) - **Keep this secret!**

---

### Step 2: Set Up the Database

1. **Open SQL Editor**
   - In your Supabase dashboard, click **SQL Editor** in the left sidebar
   - Click **New Query**

2. **Run the Schema Script**
   - Open the file: `backend/database/schema.sql`
   - Copy ALL the contents (Ctrl+A, Ctrl+C)
   - Paste into the Supabase SQL Editor
   - Click **Run** (or press F5)
   - ✅ You should see "Success. No rows returned"

3. **Verify Tables Created**
   - Go to **Table Editor** in the left sidebar
   - You should see these tables:
     - `roles`
     - `profiles`
     - `posts`
     - `likes`
     - `follows`
     - `blocks`
     - `activities`

---

### Step 3: Configure the Backend

1. **Open Terminal in Backend Folder**
   ```bash
   cd backend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```
   ⏳ This may take 1-2 minutes

3. **Create Environment File**
   - Create a new file named `.env` in the `backend` folder
   - Copy this template and fill in your Supabase values:
   ```env
   PORT=3000
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_ANON_KEY=your_anon_key_here
   
   ```
   - Replace:
     - `your-project-id.supabase.co` with your Project URL
     - `your_anon_key_here` with your anon/public key
     - `your_service_role_key_here` with your service_role key

4. **Test the Backend**
   ```bash
   npm run dev
   ```
   - You should see: `Server running on port 3000`
   - ✅ If you see this, your backend is working!
   - Press `Ctrl+C` to stop it (we'll start it again later)

---

### Step 4: Configure the Frontend

1. **Open a NEW Terminal Window** (keep backend terminal open)
   - Navigate to frontend folder:
   ```bash
   cd frontend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```
   ⏳ This may take 1-2 minutes

3. **Optional: Create Frontend Environment File**
   - Create `.env` in the `frontend` folder (only if you need direct Supabase access)
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   ```
   - **Note**: This is optional - the frontend uses the backend API by default

---

### Step 5: Start Both Servers

You need TWO terminal windows running:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
✅ Should show: `Server running on port 3000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
✅ Should show: `Local: http://localhost:5173`

---

### Step 6: Test the Application

1. **Open Your Browser**
   - Go to: `http://localhost:5173`

2. **Create Your First Account**
   - Click "Sign up" or go to `/signup`
   - Fill in:
     - Email: `test@example.com`
     - Password: (choose a password)
     - Username: `testuser`
     - Display Name: `Test User`
   - Click "Sign Up"
   - ✅ You should be automatically logged in and see the Feed page

3. **Create Your First Post**
   - Click "Create Post" button
   - Type some content
   - Click "Post"
   - ✅ Your post should appear in the feed

4. **Test Other Features**
   - Try creating another account
   - Follow the other user
   - Like a post
   - Check the activity feed

---

### Step 7: Create an Owner Account (Optional)

To get admin/owner permissions:

1. **Sign up a user** through the frontend
2. **Go to Supabase SQL Editor**
3. **Run this SQL** (replace `testuser` with your username):
   ```sql
   UPDATE profiles 
   SET role = 'owner' 
   WHERE username = 'testuser';
   ```
4. **Log out and log back in** - you now have owner permissions!

---

## 🐛 Troubleshooting

### Backend Won't Start
- **Error: "Port 3000 already in use"**
  - Change `PORT=3001` in `backend/.env`
  - Update `vite.config.js` proxy target to `http://localhost:3001`

- **Error: "Missing Supabase environment variables"**
  - Check your `.env` file exists in `backend/` folder
  - Verify all three variables are set correctly
  - Make sure there are no extra spaces or quotes

- **Error: "Cannot connect to Supabase"**
  - Verify your SUPABASE_URL is correct (should start with `https://`)
  - Check your API keys are correct
  - Make sure your Supabase project is active

### Frontend Won't Start
- **Error: "Port 5173 already in use"**
  - Vite will automatically use the next available port
  - Check the terminal for the new port number

- **Error: "Cannot connect to API"**
  - Make sure backend is running on port 3000
  - Check `vite.config.js` proxy configuration
  - Verify backend shows "Server running on port 3000"

### Database Issues
- **Error: "Foreign key constraint"**
  - Make sure you ran the entire `schema.sql` file
  - Check that `roles` table exists and has data
  - Try running the schema again

- **Error: "Table doesn't exist"**
  - Go to Supabase Table Editor
  - Verify all tables are created
  - Re-run `schema.sql` if needed

### Authentication Issues
- **"Login failed" or "Invalid token"**
  - Check Supabase Auth is enabled (should be by default)
  - Verify your API keys are correct
  - Try creating a new account

---

## ✅ Verification Checklist

Before considering setup complete, verify:

- [ ] Backend server runs without errors
- [ ] Frontend server runs without errors
- [ ] Can access `http://localhost:5173` in browser
- [ ] Can create a new account
- [ ] Can log in with created account
- [ ] Can create a post
- [ ] Can see posts in the feed
- [ ] Activity feed shows activities
- [ ] No console errors in browser (F12 → Console)

---

## 📚 What's Next?

Once everything is working:

1. **Explore the Code**
   - Check `backend/src/routes/` for API endpoints
   - Check `frontend/src/pages/` for UI pages
   - Read `backend/README.md` for API documentation

2. **Customize**
   - Modify styles in CSS files
   - Add new features
   - Customize the UI

3. **Deploy** (when ready)
   - Deploy backend to services like Railway, Render, or Heroku
   - Deploy frontend to Vercel, Netlify, or similar
   - Update environment variables for production

---

## 🆘 Need Help?

If you encounter issues:

1. **Check the logs**
   - Backend: Look at terminal where `npm run dev` is running
   - Frontend: Check browser console (F12)

2. **Verify your setup**
   - Supabase project is active
   - Database schema is applied
   - Environment variables are correct
   - Both servers are running

3. **Common mistakes**
   - Forgetting to run `npm install`
   - Wrong API keys in `.env`
   - Not running the database schema
   - Typos in environment variables

---

## 🎉 You're Ready!

Once you've completed all steps and verified everything works, you have a fully functional social activity feed system! Start exploring and building features.

Good luck! 🚀


# Inkle Frontend - Social Activity Feed System

Frontend React application for the Social Activity Feed System.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file (optional, if using Supabase client directly):
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Run the development server:
```bash
npm run dev
```

The app will run on `http://localhost:5173`

## Features

- User authentication (login/signup)
- Create and view posts
- Like/unlike posts
- Follow/unfollow users
- Block/unblock users
- View activity feed
- Admin/owner controls

## Project Structure

- `src/pages/` - Page components (Login, Signup, Feed, Profile)
- `src/components/` - Reusable components (Navbar, PostCard, ActivityFeed, etc.)
- `src/services/` - API service functions
- `src/context/` - React context for authentication


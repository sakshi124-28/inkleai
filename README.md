# Inkle - Social Activity Feed System

A full-stack social activity feed system built with Node.js, Express, Supabase, and React.

## Project Structure

```
inkle/
├── backend/          # Node.js + Express API
│   ├── src/
│   │   ├── config/   # Supabase configuration
│   │   ├── controllers/
│   │   ├── routes/   # API routes
│   │   ├── services/ # Business logic
│   │   ├── middleware/ # Auth & permissions
│   │   └── index.js  # Server entry point
│   ├── database/     # SQL schema
│   └── package.json
│
└── frontend/         # React application
    ├── src/
    │   ├── pages/    # Page components
    │   ├── components/ # Reusable components
    │   ├── services/ # API client
    │   ├── context/  # React context
    │   └── App.jsx
    └── package.json
```

## Quick Start

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```
PORT=3000
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

4. Set up database:
   - Go to your Supabase project
   - Navigate to SQL Editor
   - Run the SQL from `backend/database/schema.sql`

5. Start the server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## Features

- ✅ User authentication (signup/login)
- ✅ Create, view, and delete posts
- ✅ Like/unlike posts
- ✅ Follow/unfollow users
- ✅ Block/unblock users
- ✅ Activity feed with filtering
- ✅ Role-based permissions (User, Admin, Owner)
- ✅ Soft deletion for posts and users
- ✅ Blocking logic (blocked users can't see blocker's content)

## API Documentation

See `API_TESTING_REPORT.txt` for detailed API documentation and testing results.

## Permissions

- **USER**: Create posts, follow, like, block, delete own posts
- **ADMIN**: All user actions + delete any user/post/like
- **OWNER**: All admin actions + create/remove admins

## Tech Stack

- **Backend**: Node.js, Express, Supabase (PostgreSQL)
- **Frontend**: React, React Router, Vite
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth

## Development

The project follows a phased development approach:

1. Phase 0: Setup ✅
2. Phase 1: Auth ✅
3. Phase 2: Posts ✅
4. Phase 3: Likes ✅
5. Phase 4: Follow ✅
6. Phase 5: Block ✅
7. Phase 6: Admin ✅
8. Phase 7: Activity Feed ✅
9. Phase 8: Documentation ✅


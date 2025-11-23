# Inkle Backend - Social Activity Feed System

Backend API for the Social Activity Feed System built with Node.js, Express, and Supabase.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`:
```
PORT=3000
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

3. Set up the database schema:
   - Go to your Supabase project
   - Navigate to SQL Editor
   - Run the SQL from `database/schema.sql`

4. Run the server:
```bash
npm run dev
```

The server will run on `http://localhost:3000`

## API Endpoints

### Auth
- `POST /api/v1/auth/signup` - User signup
- `POST /api/v1/auth/login` - User login

### Profiles
- `GET /api/v1/profiles/:id` - Get user profile
- `PATCH /api/v1/profiles/:id` - Update own profile

### Posts
- `POST /api/v1/posts` - Create a post
- `GET /api/v1/posts/:id` - Get a post
- `DELETE /api/v1/posts/:id` - Delete a post (own or admin/owner)

### Likes
- `POST /api/v1/posts/:id/like` - Like a post
- `DELETE /api/v1/posts/:id/like` - Unlike a post

### Follows
- `POST /api/v1/profiles/:id/follow` - Follow a user
- `DELETE /api/v1/profiles/:id/follow` - Unfollow a user

### Blocks
- `POST /api/v1/profiles/:id/block` - Block a user
- `DELETE /api/v1/profiles/:id/block` - Unblock a user

### Admin
- `DELETE /api/v1/admin/users/:id` - Delete a user (admin/owner only)
- `POST /api/v1/owner/admins` - Create an admin (owner only)
- `DELETE /api/v1/owner/admins/:id` - Remove an admin (owner only)

### Activities
- `GET /api/v1/activities` - Get activity feed

## Authentication

All endpoints except `/auth/signup` and `/auth/login` require a Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

## Permissions

- **USER**: Create posts, follow, like, block, delete own posts
- **ADMIN**: All user actions + delete any user/post/like
- **OWNER**: All admin actions + create/remove admins


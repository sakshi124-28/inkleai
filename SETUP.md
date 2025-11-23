# Setup Guide - Inkle Social Activity Feed System

This guide will help you set up the complete system from scratch.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A Supabase account and project

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create an account
2. Create a new project
3. Wait for the project to be fully provisioned
4. Note down your project URL and API keys from Settings > API

## Step 2: Set Up Database Schema

1. In your Supabase project, go to SQL Editor
2. Copy the contents of `backend/database/schema.sql`
3. Paste and run the SQL script
4. Verify tables are created in the Table Editor

**Note**: If you encounter foreign key issues with the `roles` table, you can modify the schema to use `role` as a simple VARCHAR without the foreign key constraint. The application code handles both cases.

## Step 3: Configure Backend

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```bash
PORT=3000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

4. Start the backend server:
```bash
npm run dev
```

The backend should now be running on `http://localhost:3000`

## Step 4: Configure Frontend

1. Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Create a `.env` file if you need direct Supabase client access:
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

4. Start the frontend development server:
```bash
npm run dev
```

The frontend should now be running on `http://localhost:5173`

## Step 5: Create Your First User (Owner)

To create an owner account, you'll need to:

1. Sign up through the frontend (this creates a regular user)
2. Go to Supabase SQL Editor and run:
```sql
UPDATE profiles 
SET role = 'owner' 
WHERE username = 'your_username';
```

Alternatively, you can modify the signup endpoint to allow setting the first user as owner, or create a migration script.

## Step 6: Test the System

1. Open `http://localhost:5173` in your browser
2. Sign up for a new account
3. Create a post
4. Test following, liking, and blocking features
5. Check the activity feed

## Troubleshooting

### Backend Issues

- **Port already in use**: Change the PORT in `.env` file
- **Supabase connection errors**: Verify your SUPABASE_URL and keys are correct
- **Database errors**: Make sure you've run the schema.sql script

### Frontend Issues

- **API connection errors**: Ensure the backend is running and the proxy is configured correctly in `vite.config.js`
- **Authentication errors**: Check that tokens are being stored in localStorage

### Database Issues

- **Foreign key errors**: The schema uses foreign keys. If Supabase doesn't support them in the way specified, you may need to adjust the schema
- **Role issues**: If role relationships don't work, the code handles roles as simple strings, so it should still function

## Next Steps

- Customize the UI styling
- Add more features (comments, shares, etc.)
- Set up production deployment
- Configure environment variables for production

## API Testing

You can test the API using tools like Postman or curl:

```bash
# Signup
curl -X POST http://localhost:3000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","username":"testuser"}'

# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get activities (requires token)
curl -X GET http://localhost:3000/api/v1/activities \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```


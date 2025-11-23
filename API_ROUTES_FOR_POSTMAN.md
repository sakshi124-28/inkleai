# API Routes for Postman Testing

## ⚠️ IMPORTANT: Postman Setup

### For Signup/Login:
1. **Set Headers:**
   - Add `Content-Type: application/json`

2. **Set Body:**
   - Select **Body** tab → **raw** → **JSON** (not form-data!)
   - Use double quotes: `"email"` not `'email'`

3. **See `POSTMAN_SETUP_GUIDE.md` for detailed instructions**

### For Authenticated Requests:
1. **Add Authorization Header:**
   - Key: `Authorization`
   - Value: `Bearer YOUR_TOKEN_HERE` (with space after "Bearer")
   
   **OR use Authorization tab:**
   - Type: `Bearer Token`
   - Token: `YOUR_TOKEN_HERE`

2. **Get token from signup/login response:**
   - Copy `session.access_token` from response
   - Use it in Authorization header

3. **See `POSTMAN_ADD_TOKEN.md` for detailed instructions**

---

## 🔑 Authentication
**Base URL:** `http://localhost:3000/api/v1`

**Get Token:**
1. Use `/signup` or `/login` to get a token
2. **Find token in response:** Look for `session.access_token` in the JSON response
3. **Copy the entire token** (it's very long, starts with `eyJ...`)
4. Add to headers: `Authorization: Bearer YOUR_TOKEN_HERE`

**📖 See `HOW_TO_GET_TOKEN.md` for detailed instructions with examples**

---

## 📋 All API Routes

### 🔐 Authentication Routes

#### 1. Sign Up
```
⚠️ IMPORTANT: Method must be POST (not GET!)

POST /api/v1/auth/signup
Content-Type: application/json

Body:
{
  "email": "user@gmail.com",
  "password": "password123",
  "username": "username",
  "display_name": "Display Name",
  "bio": "Bio text (optional)"
}

⚠️ IMPORTANT: Use real email domains (gmail.com, yahoo.com, etc.)
   Supabase may reject test domains like "example.com"

Response:
{
  "token": "jwt_token_here",
  "user": { "id": "uuid" },
  "profile": { ... }
}
```

#### 2. Login
```
POST /api/v1/auth/login
Content-Type: application/json

Body:
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "token": "jwt_token_here",
  "user": { "id": "uuid" },
  "profile": { ... }
}
```

---

### 👤 Profile Routes

#### 3. Get My Profile
```
GET /api/v1/profiles/me
Authorization: Bearer YOUR_TOKEN

Response:
{
  "id": "uuid",
  "username": "username",
  "display_name": "Display Name",
  "bio": "Bio",
  "role": "user",
  "avatar_url": "url",
  "created_at": "timestamp"
}
```

#### 4. Get User Profile
```
GET /api/v1/profiles/:id
Authorization: Bearer YOUR_TOKEN

Response:
{
  "id": "uuid",
  "username": "username",
  "display_name": "Display Name",
  "bio": "Bio",
  "avatar_url": "url",
  "stats": {
    "posts": 10,
    "followers": 5,
    "following": 3
  }
}
```

#### 5. Update My Profile
```
PATCH /api/v1/profiles/me
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

Body:
{
  "display_name": "New Name",
  "bio": "New Bio",
  "avatar_url": "url"
}

Response:
{
  "id": "uuid",
  "username": "username",
  "display_name": "New Name",
  ...
}
```

---

### 📝 Post Routes

#### 6. Create Post
```
POST /api/v1/posts
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

Body:
{
  "content": "Post content here",
  "media_url": "https://example.com/image.jpg" (optional)
}

Response:
{
  "id": "uuid",
  "content": "Post content here",
  "media_url": "url",
  "author_id": "uuid",
  "created_at": "timestamp"
}
```

#### 7. Get All Posts (Feed)
```
GET /api/v1/posts?limit=50&offset=0
Authorization: Bearer YOUR_TOKEN

Response:
{
  "posts": [
    {
      "id": "uuid",
      "content": "Post content",
      "media_url": "url",
      "author": { ... },
      "like_count": 5,
      "is_liked": false,
      "created_at": "timestamp"
    }
  ],
  "count": 10
}
```

#### 8. Get Single Post
```
GET /api/v1/posts/:id
Authorization: Bearer YOUR_TOKEN

Response:
{
  "id": "uuid",
  "content": "Post content",
  "media_url": "url",
  "author": { ... },
  "like_count": 5,
  "is_liked": false,
  "created_at": "timestamp"
}
```

#### 9. Delete Post
```
DELETE /api/v1/posts/:id
Authorization: Bearer YOUR_TOKEN

Response:
{
  "message": "Post deleted successfully"
}
```

---

### ❤️ Like Routes

#### 10. Like Post
```
POST /api/v1/posts/:id/like
Authorization: Bearer YOUR_TOKEN

Response:
{
  "id": "uuid",
  "user_id": "uuid",
  "post_id": "uuid",
  "created_at": "timestamp"
}
```

#### 11. Unlike Post
```
DELETE /api/v1/posts/:id/like
Authorization: Bearer YOUR_TOKEN

Response:
{
  "message": "Post unliked successfully"
}
```

---

### 👥 Follow Routes

#### 12. Follow User
```
POST /api/v1/profiles/:id/follow
Authorization: Bearer YOUR_TOKEN

Response:
{
  "id": "uuid",
  "follower_id": "uuid",
  "following_id": "uuid",
  "created_at": "timestamp"
}
```

#### 13. Unfollow User
```
DELETE /api/v1/profiles/:id/follow
Authorization: Bearer YOUR_TOKEN

Response:
{
  "message": "Unfollowed successfully"
}
```

---

### 🚫 Block Routes

#### 14. Block User
```
POST /api/v1/profiles/:id/block
Authorization: Bearer YOUR_TOKEN

Response:
{
  "id": "uuid",
  "blocker_id": "uuid",
  "blocked_id": "uuid",
  "created_at": "timestamp"
}
```

#### 15. Unblock User
```
DELETE /api/v1/profiles/:id/block
Authorization: Bearer YOUR_TOKEN

Response:
{
  "message": "Unblocked successfully"
}
```

---

### 📊 Activity Routes

#### 16. Get Activities (Feed)
```
GET /api/v1/activities?limit=50&offset=0
Authorization: Bearer YOUR_TOKEN

Response:
{
  "activities": [
    {
      "id": "uuid",
      "verb": "created",
      "object_type": "post",
      "object_id": "uuid",
      "actor": { ... },
      "created_at": "timestamp"
    }
  ],
  "count": 10
}
```

---

### 🛡️ Admin Routes (Admin/Owner Only)

#### 17. Get All Users
```
GET /api/v1/admin/users?limit=50&offset=0&search=username
Authorization: Bearer YOUR_TOKEN (Admin/Owner)

Response:
{
  "users": [
    {
      "id": "uuid",
      "username": "username",
      "display_name": "Name",
      "role": "user",
      "stats": { ... }
    }
  ],
  "count": 10
}
```

#### 18. Get All Posts
```
GET /api/v1/admin/posts?limit=50&offset=0&search=content
Authorization: Bearer YOUR_TOKEN (Admin/Owner)

Response:
{
  "posts": [
    {
      "id": "uuid",
      "content": "Post content",
      "author": { ... },
      "like_count": 5,
      "is_deleted": false
    }
  ],
  "count": 10
}
```

#### 19. Get Post Likers (Admin Only)
```
GET /api/v1/admin/posts/:id/likers
Authorization: Bearer YOUR_TOKEN (Admin/Owner)

Response:
{
  "likers": [
    {
      "id": "uuid",
      "user": {
        "id": "uuid",
        "username": "username",
        "display_name": "Name",
        "avatar_url": "url"
      },
      "liked_at": "timestamp"
    }
  ],
  "count": 5
}
```

#### 20. Get All Likes
```
GET /api/v1/admin/likes?limit=50&offset=0
Authorization: Bearer YOUR_TOKEN (Admin/Owner)

Response:
{
  "likes": [
    {
      "id": "uuid",
      "user": { ... },
      "post": { ... },
      "created_at": "timestamp"
    }
  ],
  "count": 10
}
```

#### 21. Get All Activities
```
GET /api/v1/admin/activities?limit=50&offset=0
Authorization: Bearer YOUR_TOKEN (Admin/Owner)

Response:
{
  "activities": [
    {
      "id": "uuid",
      "verb": "created",
      "object_type": "post",
      "actor": { ... },
      "created_at": "timestamp"
    }
  ],
  "count": 10
}
```

#### 22. Get Dashboard Stats
```
GET /api/v1/admin/stats
Authorization: Bearer YOUR_TOKEN (Admin/Owner)

Response:
{
  "stats": {
    "total_users": 100,
    "total_posts": 500,
    "total_likes": 1000,
    "total_activities": 2000,
    "total_admins": 2
  },
  "recent_activities": [ ... ]
}
```

#### 23. Delete User (Admin)
```
DELETE /api/v1/admin/users/:id
Authorization: Bearer YOUR_TOKEN (Admin/Owner)

Response:
{
  "message": "User deleted successfully"
}
```

#### 24. Delete Post (Admin)
```
DELETE /api/v1/admin/posts/:id
Authorization: Bearer YOUR_TOKEN (Admin/Owner)

Response:
{
  "message": "Post deleted successfully"
}
```

#### 25. Delete Like (Admin)
```
DELETE /api/v1/admin/likes/:id
Authorization: Bearer YOUR_TOKEN (Admin/Owner)

Response:
{
  "message": "Like deleted successfully"
}
```

---

### 👑 Owner-Only Routes

#### 26. Promote User to Admin
```
POST /api/v1/admin/admins
Authorization: Bearer YOUR_TOKEN (Owner Only)
Content-Type: application/json

Body:
{
  "user_id": "uuid"
}

Response:
{
  "message": "User promoted to admin",
  "profile": { ... }
}
```

#### 27. Remove Admin
```
DELETE /api/v1/admin/admins/:id
Authorization: Bearer YOUR_TOKEN (Owner Only)

Response:
{
  "message": "Admin removed successfully"
}
```

#### 28. Get All Admins
```
GET /api/v1/admin/admins
Authorization: Bearer YOUR_TOKEN (Owner Only)

Response:
{
  "admins": [
    {
      "id": "uuid",
      "username": "admin",
      "display_name": "Admin",
      "role": "admin"
    }
  ],
  "count": 2
}
```

---

## 📝 Postman Collection Setup

### Step 1: Create Environment
1. Create new Environment in Postman
2. Add variables:
   - `base_url`: `http://localhost:3000/api/v1`
   - `token`: (leave empty, will be set after login)

### Step 2: Set Authorization
For each request:
1. Go to "Authorization" tab
2. Type: "Bearer Token"
3. Token: `{{token}}`

Or add header manually:
```
Authorization: Bearer {{token}}
```

### Step 3: Test Flow

#### Quick Test Sequence:
1. **Sign Up** → Copy token → Set `{{token}}` variable
2. **Get My Profile** → Verify response
3. **Create Post** → Copy post ID
4. **Get All Posts** → Verify your post appears
5. **Like Post** → Use post ID from step 3
6. **Get Activities** → Verify activity appears

#### Admin Test Sequence:
1. **Login as Admin** → Copy token → Set `{{token}}` variable
2. **Get Dashboard Stats** → Verify stats
3. **Get All Users** → Verify user list
4. **Get All Posts** → Verify post list
5. **Get Post Likers** → Use a post ID with likes
6. **Get All Activities** → Verify all activities

---

## 🔍 Quick Reference

### Public Routes (No Auth):
- None (all require authentication)

### User Routes (Any Authenticated User):
- `POST /auth/signup`
- `POST /auth/login`
- `GET /profiles/me`
- `PATCH /profiles/me`
- `GET /profiles/:id`
- `GET /posts`
- `GET /posts/:id`
- `POST /posts`
- `DELETE /posts/:id`
- `POST /posts/:id/like`
- `DELETE /posts/:id/like`
- `POST /profiles/:id/follow`
- `DELETE /profiles/:id/follow`
- `POST /profiles/:id/block`
- `DELETE /profiles/:id/block`
- `GET /activities`

### Admin Routes (Admin/Owner):
- `GET /admin/users`
- `DELETE /admin/users/:id`
- `GET /admin/posts`
- `GET /admin/posts/:id/likers`
- `DELETE /admin/posts/:id`
- `GET /admin/likes`
- `DELETE /admin/likes/:id`
- `GET /admin/activities`
- `GET /admin/stats`

### Owner Routes (Owner Only):
- `GET /admin/admins`
- `POST /admin/admins`
- `DELETE /admin/admins/:id`

---

## ⚠️ Important Notes

1. **All routes require authentication** except signup/login
2. **Replace `:id`** with actual UUID in URLs
3. **Admin routes** require admin or owner role
4. **Owner routes** require owner role only
5. **Base URL** is `http://localhost:3000/api/v1`
6. **Content-Type** should be `application/json` for POST/PATCH
7. **Token expires** - re-login if you get 401 errors

---

## 🧪 Test Checklist

### Basic Functionality:
- [ ] Sign up new user
- [ ] Login
- [ ] Get my profile
- [ ] Update profile
- [ ] Create post
- [ ] Get all posts
- [ ] Get single post
- [ ] Like post
- [ ] Unlike post
- [ ] Delete post

### Social Features:
- [ ] Follow user
- [ ] Unfollow user
- [ ] Block user
- [ ] Unblock user
- [ ] Get activities

### Admin Features:
- [ ] Get all users
- [ ] Get all posts
- [ ] Get post likers
- [ ] Get all likes
- [ ] Get dashboard stats
- [ ] Delete user (admin)
- [ ] Delete post (admin)

### Owner Features:
- [ ] Get all admins
- [ ] Promote user to admin
- [ ] Remove admin

---

## 📌 Example Postman Collection JSON

Save this as `Inkle_API.postman_collection.json`:

```json
{
  "info": {
    "name": "Inkle API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Sign Up",
          "request": {
            "method": "POST",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"test@example.com\",\n  \"password\": \"password123\",\n  \"username\": \"testuser\",\n  \"display_name\": \"Test User\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/auth/signup",
              "host": ["{{base_url}}"],
              "path": ["auth", "signup"]
            }
          }
        },
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"test@example.com\",\n  \"password\": \"password123\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/auth/login",
              "host": ["{{base_url}}"],
              "path": ["auth", "login"]
            }
          }
        }
      ]
    },
    {
      "name": "Posts",
      "item": [
        {
          "name": "Get All Posts",
          "request": {
            "method": "GET",
            "header": [{"key": "Authorization", "value": "Bearer {{token}}"}],
            "url": {
              "raw": "{{base_url}}/posts?limit=50&offset=0",
              "host": ["{{base_url}}"],
              "path": ["posts"],
              "query": [
                {"key": "limit", "value": "50"},
                {"key": "offset", "value": "0"}
              ]
            }
          }
        },
        {
          "name": "Create Post",
          "request": {
            "method": "POST",
            "header": [
              {"key": "Authorization", "value": "Bearer {{token}}"},
              {"key": "Content-Type", "value": "application/json"}
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"content\": \"My first post!\",\n  \"media_url\": \"https://example.com/image.jpg\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/posts",
              "host": ["{{base_url}}"],
              "path": ["posts"]
            }
          }
        }
      ]
    }
  ]
}
```

---

**Ready to test!** Copy the routes above into Postman and start testing! 🚀


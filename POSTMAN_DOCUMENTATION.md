# Postman API Documentation - Inkle Social Activity Feed

Complete API documentation for all endpoints with request/response examples.

**Base URL**: `http://localhost:3000/api/v1`

**Authentication**: Most endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <access_token>
```

---

## 🔐 Authentication Endpoints

### 1. Sign Up
**POST** `/auth/signup`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "username": "johndoe",
  "display_name": "John Doe",
  "bio": "Software developer"
}
```

**Response (201):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  },
  "profile": {
    "id": "uuid",
    "username": "johndoe",
    "display_name": "John Doe",
    "role": "user"
  },
  "session": {
    "access_token": "eyJ...",
    "refresh_token": "..."
  }
}
```

---

### 2. Login
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  },
  "profile": {
    "id": "uuid",
    "username": "johndoe",
    "display_name": "John Doe",
    "role": "user"
  },
  "session": {
    "access_token": "eyJ...",
    "refresh_token": "..."
  }
}
```

---

## 👤 Profile Endpoints

### 3. Get Current User Profile
**GET** `/profiles/me`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": "uuid",
  "username": "johndoe",
  "display_name": "John Doe",
  "bio": "Software developer",
  "avatar_url": null,
  "role": "user",
  "created_at": "2024-01-01T00:00:00Z"
}
```

---

### 4. Get User Profile
**GET** `/profiles/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": "uuid",
  "username": "johndoe",
  "display_name": "John Doe",
  "bio": "Software developer",
  "avatar_url": null,
  "created_at": "2024-01-01T00:00:00Z"
}
```

---

### 5. Update Profile
**PATCH** `/profiles/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "display_name": "John Updated",
  "bio": "Updated bio",
  "avatar_url": "https://example.com/avatar.jpg"
}
```

**Response (200):**
```json
{
  "id": "uuid",
  "username": "johndoe",
  "display_name": "John Updated",
  "bio": "Updated bio",
  "avatar_url": "https://example.com/avatar.jpg"
}
```

---

## 📝 Post Endpoints

### 6. Create Post
**POST** `/posts`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "content": "This is my first post!",
  "media_url": "https://example.com/image.jpg"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "author_id": "uuid",
  "content": "This is my first post!",
  "media_url": "https://example.com/image.jpg",
  "is_deleted": false,
  "created_at": "2024-01-01T00:00:00Z"
}
```

---

### 7. Get Post
**GET** `/posts/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": "uuid",
  "author_id": "uuid",
  "content": "This is my first post!",
  "media_url": "https://example.com/image.jpg",
  "author": {
    "id": "uuid",
    "username": "johndoe",
    "display_name": "John Doe",
    "avatar_url": null
  },
  "created_at": "2024-01-01T00:00:00Z"
}
```

---

### 8. Delete Post
**DELETE** `/posts/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Post deleted successfully",
  "post": {
    "id": "uuid",
    "is_deleted": true,
    "deleted_at": "2024-01-01T00:00:00Z"
  }
}
```

---

## ❤️ Like Endpoints

### 9. Like Post
**POST** `/posts/:id/like`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (201):**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "post_id": "uuid",
  "created_at": "2024-01-01T00:00:00Z"
}
```

---

### 10. Unlike Post
**DELETE** `/posts/:id/like`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Like removed successfully"
}
```

---

## 👥 Follow Endpoints

### 11. Follow User
**POST** `/profiles/:id/follow`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (201):**
```json
{
  "id": "uuid",
  "follower_id": "uuid",
  "followee_id": "uuid",
  "created_at": "2024-01-01T00:00:00Z"
}
```

---

### 12. Unfollow User
**DELETE** `/profiles/:id/follow`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Unfollowed successfully"
}
```

---

## 🚫 Block Endpoints

### 13. Block User
**POST** `/profiles/:id/block`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (201):**
```json
{
  "id": "uuid",
  "blocker_id": "uuid",
  "blocked_id": "uuid",
  "created_at": "2024-01-01T00:00:00Z"
}
```

---

### 14. Unblock User
**DELETE** `/profiles/:id/block`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "User unblocked successfully"
}
```

---

## 📊 Activity Feed Endpoints

### 15. Get Activities
**GET** `/activities?limit=50&offset=0`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `limit` (optional): Number of activities to return (default: 50)
- `offset` (optional): Number of activities to skip (default: 0)

**Response (200):**
```json
{
  "activities": [
    {
      "id": "uuid",
      "actor_id": "uuid",
      "verb": "created",
      "object_type": "post",
      "object_id": "uuid",
      "target_id": null,
      "metadata": {},
      "created_at": "2024-01-01T00:00:00Z",
      "actor": {
        "id": "uuid",
        "username": "johndoe",
        "display_name": "John Doe",
        "avatar_url": null
      }
    }
  ],
  "count": 1
}
```

---

## 🔧 Admin Endpoints

### 16. Get All Users (Admin/Owner)
**GET** `/admin/users?limit=50&offset=0&search=`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `limit` (optional): Number of users to return
- `offset` (optional): Number of users to skip
- `search` (optional): Search by username or display name

**Response (200):**
```json
{
  "users": [
    {
      "id": "uuid",
      "username": "johndoe",
      "display_name": "John Doe",
      "role": "user",
      "is_deleted": false,
      "stats": {
        "posts": 5,
        "likes": 10,
        "followers": 3
      },
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "count": 1
}
```

---

### 17. Get User Details (Admin/Owner)
**GET** `/admin/users/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": "uuid",
  "username": "johndoe",
  "display_name": "John Doe",
  "role": "user",
  "stats": {
    "posts": 5,
    "likes": 10,
    "followers": 3,
    "following": 2
  },
  "recentPosts": [...]
}
```

---

### 18. Delete User (Admin/Owner)
**DELETE** `/admin/users/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "User deleted successfully",
  "user": {
    "id": "uuid",
    "is_deleted": true,
    "deleted_at": "2024-01-01T00:00:00Z"
  }
}
```

---

### 19. Get All Posts (Admin/Owner)
**GET** `/admin/posts?limit=50&offset=0&search=`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "posts": [
    {
      "id": "uuid",
      "author_id": "uuid",
      "content": "Post content",
      "author": {
        "id": "uuid",
        "username": "johndoe",
        "display_name": "John Doe"
      },
      "like_count": 5,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "count": 1
}
```

---

### 20. Get Post Details (Admin/Owner)
**GET** `/admin/posts/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": "uuid",
  "content": "Post content",
  "author": {...},
  "likes": [...],
  "like_count": 5
}
```

---

### 21. Get All Likes (Admin/Owner)
**GET** `/admin/likes?limit=50&offset=0`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "likes": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "post_id": "uuid",
      "user": {
        "id": "uuid",
        "username": "johndoe",
        "display_name": "John Doe"
      },
      "post": {
        "id": "uuid",
        "content": "Post content"
      },
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "count": 1
}
```

---

### 22. Delete Like (Admin/Owner)
**DELETE** `/admin/likes/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Like deleted successfully"
}
```

---

### 23. Get Admin Stats (Admin/Owner)
**GET** `/admin/stats`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "stats": {
    "total_users": 100,
    "total_posts": 500,
    "total_likes": 1000,
    "total_activities": 2000
  },
  "recent_activities": [...]
}
```

---

## 👑 Owner Endpoints

### 24. Get All Admins (Owner Only)
**GET** `/owner/admins`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "admins": [
    {
      "id": "uuid",
      "username": "admin1",
      "display_name": "Admin User",
      "role": "admin",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "count": 1
}
```

---

### 25. Create Admin (Owner Only)
**POST** `/owner/admins`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "user_id": "uuid"
}
```

**Response (200):**
```json
{
  "message": "User promoted to admin",
  "user": {
    "id": "uuid",
    "username": "newadmin",
    "role": "admin"
  }
}
```

---

### 26. Remove Admin (Owner Only)
**DELETE** `/owner/admins/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Admin demoted to user",
  "user": {
    "id": "uuid",
    "username": "formeradmin",
    "role": "user"
  }
}
```

---

### 27. Get Owner Stats (Owner Only)
**GET** `/owner/stats`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "stats": {
    "total_users": 100,
    "total_posts": 500,
    "total_likes": 1000,
    "total_admins": 5,
    "total_activities": 2000
  }
}
```

---

## 📋 Error Responses

All endpoints may return these error responses:

**400 Bad Request:**
```json
{
  "error": "Error message describing what went wrong"
}
```

**401 Unauthorized:**
```json
{
  "error": "Invalid token" or "No token provided"
}
```

**403 Forbidden:**
```json
{
  "error": "Insufficient permissions"
}
```

**404 Not Found:**
```json
{
  "error": "Resource not found"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Internal server error"
}
```

---

## 🔑 Permission Summary

### User Permissions
- ✅ Create posts
- ✅ Like/unlike posts
- ✅ Follow/unfollow users
- ✅ Block/unblock users
- ✅ Delete own posts
- ✅ Update own profile

### Admin Permissions
- ✅ All user permissions
- ✅ Delete any user (except owner/admin)
- ✅ Delete any post
- ✅ Delete any like
- ✅ View all users/posts/likes
- ✅ View admin dashboard

### Owner Permissions
- ✅ All admin permissions
- ✅ Delete any user (including admins, but not other owners)
- ✅ Create admins
- ✅ Remove admins
- ✅ View all admins
- ✅ View owner dashboard

---

## 📝 Notes

1. **Token Expiration**: Tokens may expire. Re-login to get a new token.
2. **Soft Deletes**: Users and posts are soft-deleted (marked as deleted, not removed from database).
3. **Blocking**: Blocked users cannot see blocker's posts or activities.
4. **Activity Feed**: Excludes deleted posts, deleted users, and blocked users' activities.
5. **Pagination**: Use `limit` and `offset` for paginated endpoints.

---

## 🧪 Testing in Postman

1. **Create Environment Variables:**
   - `base_url`: `http://localhost:3000/api/v1`
   - `token`: (will be set after login)

2. **Setup Pre-request Script** (for authenticated endpoints):
   ```javascript
   pm.request.headers.add({
     key: 'Authorization',
     value: 'Bearer ' + pm.environment.get('token')
   });
   ```

3. **Save Token After Login:**
   ```javascript
   // In Tests tab of login request
   const response = pm.response.json();
   pm.environment.set('token', response.session.access_token);
   ```

---

## 📦 Postman Collection

Import this collection structure:

```
Inkle API
├── Authentication
│   ├── Sign Up
│   └── Login
├── Profiles
│   ├── Get Current Profile
│   ├── Get Profile
│   └── Update Profile
├── Posts
│   ├── Create Post
│   ├── Get Post
│   └── Delete Post
├── Likes
│   ├── Like Post
│   └── Unlike Post
├── Follows
│   ├── Follow User
│   └── Unfollow User
├── Blocks
│   ├── Block User
│   └── Unblock User
├── Activities
│   └── Get Activities
├── Admin
│   ├── Get All Users
│   ├── Get User Details
│   ├── Delete User
│   ├── Get All Posts
│   ├── Get Post Details
│   ├── Get All Likes
│   ├── Delete Like
│   └── Get Stats
└── Owner
    ├── Get All Admins
    ├── Create Admin
    ├── Remove Admin
    └── Get Stats
```

---

**Last Updated**: 2024-01-01


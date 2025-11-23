# Admin Panel Plan & Implementation

## 📋 Requirements Analysis

### Admin Features (Required)
1. ✅ Delete user profiles
2. ✅ Delete posts
3. ✅ Delete likes
4. ✅ View all users/posts/likes

### Owner Features (Required)
1. ✅ All admin features
2. ✅ Create admins
3. ✅ Delete/remove admins
4. ✅ View all admins

## 🗺️ Route Structure

### Backend Admin Routes

```
/api/v1/admin/
├── users/
│   ├── GET /                    # List all users (admin/owner)
│   ├── GET /:id                 # Get user details
│   └── DELETE /:id              # Delete user (already exists)
├── posts/
│   ├── GET /                    # List all posts (admin/owner)
│   ├── GET /:id                 # Get post details
│   └── DELETE /:id              # Delete post (already exists)
├── likes/
│   ├── GET /                    # List all likes (admin/owner)
│   ├── GET /:id                 # Get like details
│   └── DELETE /:id              # Delete like (admin/owner)
└── stats/
    └── GET /                    # Get admin dashboard stats
```

### Owner Routes

```
/api/v1/owner/
├── admins/
│   ├── GET /                    # List all admins
│   ├── POST /                   # Create admin (already exists)
│   └── DELETE /:id              # Remove admin (already exists)
└── stats/
    └── GET /                    # Get owner dashboard stats
```

## 🎨 Frontend Admin Panel Structure

```
/admin
├── /dashboard          # Admin dashboard (stats, overview)
├── /users              # User management
├── /posts              # Post management
├── /likes              # Like management
└── /admins             # Admin management (owner only)
```

## 📊 Features Breakdown

### 1. Admin Dashboard
- **Stats Cards:**
  - Total Users
  - Total Posts
  - Total Likes
  - Recent Activities
- **Quick Actions:**
  - View recent users
  - View recent posts
  - View flagged content (if implemented)

### 2. User Management
- **List View:**
  - Username
  - Email (if available)
  - Role
  - Status (Active/Deleted)
  - Created Date
  - Actions (View, Delete)
- **Actions:**
  - View user profile
  - Delete user
  - View user's posts
  - View user's activity

### 3. Post Management
- **List View:**
  - Post ID
  - Author
  - Content Preview
  - Like Count
  - Created Date
  - Status (Active/Deleted)
  - Actions (View, Delete)
- **Actions:**
  - View full post
  - Delete post
  - View author profile

### 4. Like Management
- **List View:**
  - Like ID
  - User (who liked)
  - Post (what was liked)
  - Created Date
  - Actions (View, Delete)
- **Actions:**
  - View user profile
  - View post
  - Delete like

### 5. Admin Management (Owner Only)
- **List View:**
  - Admin Username
  - Email
  - Created Date
  - Actions (Remove Admin)
- **Actions:**
  - Promote user to admin
  - Remove admin
  - View admin profile

## 🔐 Permissions

### Admin Permissions
- ✅ View all users
- ✅ Delete any user (except owner/admin)
- ✅ View all posts
- ✅ Delete any post
- ✅ View all likes
- ✅ Delete any like
- ✅ View dashboard stats

### Owner Permissions
- ✅ All admin permissions
- ✅ Delete any user (including admins, but not other owners)
- ✅ View all admins
- ✅ Create admins
- ✅ Remove admins
- ✅ View owner dashboard stats

## 🎯 Implementation Plan

### Phase 1: Backend Routes
1. Add admin listing endpoints
2. Add admin delete like endpoint
3. Add admin stats endpoint
4. Add owner admin listing endpoint

### Phase 2: Frontend Admin Panel
1. Create admin dashboard page
2. Create user management page
3. Create post management page
4. Create like management page
5. Create admin management page (owner)
6. Add admin navigation/routing

### Phase 3: Integration
1. Add admin check in frontend
2. Add admin route protection
3. Add admin menu in navbar
4. Test all admin features

## 📝 API Endpoints Summary

### Admin Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/admin/users` | List all users | Admin/Owner |
| GET | `/api/v1/admin/users/:id` | Get user details | Admin/Owner |
| DELETE | `/api/v1/admin/users/:id` | Delete user | Admin/Owner |
| GET | `/api/v1/admin/posts` | List all posts | Admin/Owner |
| GET | `/api/v1/admin/posts/:id` | Get post details | Admin/Owner |
| DELETE | `/api/v1/admin/posts/:id` | Delete post | Admin/Owner |
| GET | `/api/v1/admin/likes` | List all likes | Admin/Owner |
| GET | `/api/v1/admin/likes/:id` | Get like details | Admin/Owner |
| DELETE | `/api/v1/admin/likes/:id` | Delete like | Admin/Owner |
| GET | `/api/v1/admin/stats` | Get dashboard stats | Admin/Owner |

### Owner Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/owner/admins` | List all admins | Owner |
| POST | `/api/v1/owner/admins` | Create admin | Owner |
| DELETE | `/api/v1/owner/admins/:id` | Remove admin | Owner |
| GET | `/api/v1/owner/stats` | Get owner stats | Owner |

## 🎨 UI Components Needed

1. **AdminLayout** - Layout wrapper for admin pages
2. **AdminNav** - Navigation sidebar/menu
3. **StatsCard** - Reusable stats card component
4. **DataTable** - Reusable table component
5. **UserCard** - User display card
6. **PostCard** - Post display card (admin view)
7. **LikeCard** - Like display card
8. **AdminCard** - Admin display card
9. **DeleteModal** - Confirmation modal for deletions
10. **SearchBar** - Search/filter component

## ✅ Implementation Checklist

### Backend
- [ ] Add GET /api/v1/admin/users endpoint
- [ ] Add GET /api/v1/admin/posts endpoint
- [ ] Add GET /api/v1/admin/likes endpoint
- [ ] Add DELETE /api/v1/admin/likes/:id endpoint
- [ ] Add GET /api/v1/admin/stats endpoint
- [ ] Add GET /api/v1/owner/admins endpoint
- [ ] Add GET /api/v1/owner/stats endpoint

### Frontend
- [ ] Create AdminDashboard page
- [ ] Create UserManagement page
- [ ] Create PostManagement page
- [ ] Create LikeManagement page
- [ ] Create AdminManagement page (owner)
- [ ] Create AdminLayout component
- [ ] Create AdminNav component
- [ ] Add admin route protection
- [ ] Add admin menu to navbar
- [ ] Add admin API functions

### Testing
- [ ] Test admin user access
- [ ] Test owner access
- [ ] Test permission restrictions
- [ ] Test all CRUD operations
- [ ] Test error handling

## 🚀 Next Steps

1. Implement backend routes
2. Create frontend admin panel
3. Add proper error handling
4. Add loading states
5. Add confirmation dialogs
6. Test thoroughly
7. Document API endpoints


# Admin Panel Controls Guide

## 🎛️ Available Controls in Admin Panel

### Navigation Menu (Top of Every Page)
- **📊 Dashboard** - Overview and statistics
- **👥 Users** - User management
- **📝 Posts** - Post management
- **❤️ Likes** - Like management
- **👑 Admins** - Admin management (owner only)

---

## 📊 Dashboard Page (`/admin/dashboard`)

### Controls Available:
- ✅ **Statistics Cards** - View total users, posts, likes, activities
- ✅ **Recent Activities** - See latest activities
- ✅ **Quick Action Cards** - Click to navigate to:
  - Manage Users
  - Manage Posts
  - Manage Likes
  - Manage Admins (owner only)

---

## 👥 User Management Page (`/admin/users`)

### Controls Available:
- ✅ **Search Bar** - Search users by username or display name
- ✅ **Refresh Button** (🔄) - Reload user list
- ✅ **View Button** - Click to view user profile
- ✅ **Delete Button** - Click to delete user (with confirmation)

### Actions:
1. **Search**: Type in search box to filter users
2. **View User**: Click "View" button → Opens user profile
3. **Delete User**: Click "Delete" button → Confirms → Deletes user

---

## 📝 Post Management Page (`/admin/posts`)

### Controls Available:
- ✅ **Search Bar** - Search posts by content
- ✅ **Refresh Button** (🔄) - Reload post list
- ✅ **View Button** - Click to view full post
- ✅ **Delete Button** - Click to delete post (with confirmation)

### Actions:
1. **Search**: Type in search box to filter posts
2. **View Post**: Click "View" button → Opens post details
3. **View Author**: Click author name → Opens author profile
4. **Delete Post**: Click "Delete" button → Confirms → Deletes post

---

## ❤️ Like Management Page (`/admin/likes`)

### Controls Available:
- ✅ **Refresh Button** (🔄) - Reload like list
- ✅ **Delete Button** - Click to delete like (with confirmation)

### Actions:
1. **View User**: Click user name → Opens user profile
2. **View Author**: Click "View Author" → Opens post author profile
3. **Delete Like**: Click "Delete" button → Confirms → Deletes like

---

## 👑 Admin Management Page (`/admin/admins`) - Owner Only

### Controls Available:
- ✅ **Promote User Button** (➕) - Promote user to admin
- ✅ **Refresh Button** (🔄) - Reload admin list
- ✅ **View Button** - Click to view admin profile
- ✅ **Remove Admin Button** - Click to remove admin privileges

### Actions:
1. **Promote User**: 
   - Click "➕ Promote User to Admin"
   - Select user from dropdown
   - Click "Promote to Admin"
2. **View Admin**: Click "View" button → Opens admin profile
3. **Remove Admin**: Click "Remove Admin" button → Confirms → Removes admin role

---

## 🎯 How to Use Controls

### Delete Actions
1. Click the **"Delete"** button (red button)
2. Confirm in the popup dialog
3. Item is deleted
4. List refreshes automatically

### View Actions
1. Click the **"View"** button (blue button)
2. Opens the item in a new page/view
3. Navigate back using browser back button or navbar

### Search
1. Type in the **search box**
2. Results filter automatically
3. Clear search to see all items

### Refresh
1. Click the **🔄 Refresh** button
2. Reloads data from server
3. Shows latest information

---

## 🔍 Troubleshooting

### Buttons Not Visible?

**Check:**
1. Are you logged in as admin/owner?
2. Is the page loading? (Check for errors in console)
3. Are there items in the table? (Empty state shows "No X found")

**Fix:**
- Refresh the page
- Check browser console (F12) for errors
- Make sure backend is running

### Buttons Not Working?

**Check:**
1. Browser console for errors (F12)
2. Network tab for failed API calls
3. Backend terminal for errors

**Fix:**
- Check if backend is running
- Verify your token is valid (logout/login)
- Check API endpoints are correct

### No Data Showing?

**Possible Causes:**
- No data in database
- API error
- Permission issue

**Fix:**
- Check backend logs
- Verify database has data
- Check API response in Network tab

---

## 📱 Controls Summary

| Page | Search | Refresh | View | Delete | Promote |
|------|--------|---------|------|--------|---------|
| Dashboard | ❌ | ❌ | ❌ | ❌ | ❌ |
| Users | ✅ | ✅ | ✅ | ✅ | ❌ |
| Posts | ✅ | ✅ | ✅ | ✅ | ❌ |
| Likes | ❌ | ✅ | ✅ | ✅ | ❌ |
| Admins | ❌ | ✅ | ✅ | ✅ | ✅ (owner) |

---

## 🎨 Visual Guide

### User Management Page:
```
┌─────────────────────────────────────────┐
│ User Management    [Search] [🔄 Refresh]│
├─────────────────────────────────────────┤
│ Username | Name | Role | Actions        │
│ testuser | ... | user | [View] [Delete] │
└─────────────────────────────────────────┘
```

### Post Management Page:
```
┌─────────────────────────────────────────┐
│ Post Management    [Search] [🔄 Refresh]│
├─────────────────────────────────────────┤
│ ID | Author | Content | Actions         │
│ ... | ... | ... | [View] [Delete]      │
└─────────────────────────────────────────┘
```

---

## ✅ All Controls Are Working If:

- ✅ Navigation menu appears at top
- ✅ Tables show data
- ✅ Buttons are visible and clickable
- ✅ Search filters results
- ✅ Delete shows confirmation
- ✅ Refresh reloads data
- ✅ View opens details

If any control is missing, check the browser console for errors!


# Fix App Crash - Quick Guide

## Issues Fixed

### 1. Removed Instagram CSS References
- ✅ Removed all `instagram.css` imports
- ✅ Removed all `instagram-*` class names
- ✅ Updated to new design system classes

### 2. Fixed Feed Component
- ✅ Removed duplicate loading check
- ✅ Fixed `btn-instagram` to `btn btn-primary`
- ✅ Simplified CreatePost display logic

### 3. Added Missing API Function
- ✅ Added `getMyProfile()` to API service

## Common Crash Causes & Fixes

### If you see "Cannot find module" errors:
1. **Clear node_modules and reinstall:**
   ```bash
   cd frontend
   rm -rf node_modules package-lock.json
   npm install
   ```

### If you see CSS import errors:
1. **Check all imports** - Make sure no `instagram.css` imports remain
2. **Check browser console** for specific error messages

### If you see "Class not found" errors:
1. **All Instagram classes removed** - Use new design system classes:
   - `btn btn-primary` instead of `btn-instagram`
   - `post-card` instead of `instagram-post`
   - `navbar` instead of `instagram-navbar`

## Quick Fix Steps

1. **Stop the dev server** (Ctrl+C)

2. **Clear cache and reinstall:**
   ```bash
   cd frontend
   rm -rf node_modules .vite
   npm install
   ```

3. **Restart dev server:**
   ```bash
   npm run dev
   ```

4. **Check browser console** for any remaining errors

## Files Updated

- ✅ `frontend/src/pages/Feed.jsx` - Fixed duplicate loading, removed Instagram classes
- ✅ `frontend/src/services/api.js` - Added `getMyProfile()` function
- ✅ All components updated to use new design system

## If Still Crashing

1. **Check browser console** - Look for specific error messages
2. **Check terminal** - Look for build errors
3. **Share the error message** - I can help fix it

---

**All Instagram references removed. App should work now!**


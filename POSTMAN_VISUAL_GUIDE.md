# Visual Postman Guide - Step by Step

## ❌ Current Error
```
{
  "error": "Email, password, and username are required",
  "received": {
    "email": "missing",
    "password": "missing",
    "username": "missing"
  }
}
```

This means **the request body is not being sent correctly**.

---

## ✅ Step-by-Step Fix

### Step 1: Open Postman
- Open Postman application

### Step 2: Create New Request
1. Click **"New"** button (top left)
2. Select **"HTTP Request"**
3. Or click **"+"** tab

### Step 3: Set Method and URL
1. **Method dropdown:** Select **POST** (not GET!)
2. **URL field:** Enter `http://localhost:3000/api/v1/auth/signup`
3. Press Enter

### Step 4: Set Headers (CRITICAL!)
1. Click **"Headers"** tab (below URL)
2. In the **Key** field, type: `Content-Type`
3. In the **Value** field, type: `application/json`
4. Make sure the checkbox next to it is **CHECKED** ✅
5. Press Enter or click outside

**Visual:**
```
Headers Tab:
┌─────────────────┬──────────────────────────┬─────┐
│ Key             │ Value                    │ ✓   │
├─────────────────┼──────────────────────────┼─────┤
│ Content-Type    │ application/json         │ ✓   │
└─────────────────┴──────────────────────────┴─────┘
```

### Step 5: Set Body (MOST IMPORTANT!)
1. Click **"Body"** tab (next to Headers)
2. Select **"raw"** radio button (NOT form-data, NOT x-www-form-urlencoded)
3. Look for a dropdown on the right that says **"Text"** or **"JSON"**
4. Click that dropdown and select **"JSON"**
5. In the text area below, paste this:

```json
{
  "email": "test@example.com",
  "password": "password123",
  "username": "testuser"
}
```

**Visual:**
```
Body Tab:
○ none
○ form-data
○ x-www-form-urlencoded
● raw                    [JSON ▼]  ← Select "JSON" here!

┌─────────────────────────────────────┐
│ {                                   │
│   "email": "test@example.com",     │
│   "password": "password123",        │
│   "username": "testuser"            │
│ }                                   │
└─────────────────────────────────────┘
```

### Step 6: Send Request
1. Click the blue **"Send"** button (top right)
2. Wait for response

---

## ✅ Expected Success Response

```json
{
  "message": "User created successfully",
  "user": {
    "id": "uuid-here",
    "email": "test@example.com",
    "username": "testuser",
    "display_name": "testuser",
    "role": "user"
  },
  "session": {
    "access_token": "...",
    "refresh_token": "..."
  }
}
```

---

## ❌ Common Mistakes

### Mistake 1: Wrong Body Type
```
❌ Body tab → form-data
❌ Body tab → x-www-form-urlencoded
✅ Body tab → raw → JSON
```

### Mistake 2: Missing Content-Type Header
```
❌ No headers set
✅ Headers → Content-Type: application/json
```

### Mistake 3: Wrong JSON Format
```
❌ { 'email': 'test@example.com' }     (single quotes)
❌ { email: "test@example.com" }      (no quotes on key)
❌ { "email": 'test@example.com' }    (single quotes on value)
✅ { "email": "test@example.com" }    (double quotes everywhere)
```

### Mistake 4: Body Dropdown Not Set to JSON
```
❌ raw → Text
❌ raw → JavaScript
✅ raw → JSON
```

---

## 🔍 Check Backend Logs

After sending, check your backend terminal. You should see:

```
=== INCOMING REQUEST ===
POST /api/v1/auth/signup
Content-Type: application/json
Body: {
  "email": "test@example.com",
  "password": "password123",
  "username": "testuser"
}
========================
```

If you see:
- `Body: {}` → Body not being sent
- `Content-Type: undefined` → Header not set
- `Body: undefined` → Body tab not configured correctly

---

## 📸 Quick Checklist

Before clicking "Send", verify:

- [ ] Method is **POST**
- [ ] URL is `http://localhost:3000/api/v1/auth/signup`
- [ ] **Headers** tab has `Content-Type: application/json` ✅
- [ ] **Body** tab is selected
- [ ] **raw** is selected (not form-data)
- [ ] Dropdown shows **JSON** (not Text)
- [ ] JSON has all 3 fields: `email`, `password`, `username`
- [ ] All quotes are double quotes `"`
- [ ] Backend server is running

---

## 🧪 Test with cURL (Alternative)

If Postman still doesn't work, test with cURL:

**Windows (PowerShell):**
```powershell
curl -X POST http://localhost:3000/api/v1/auth/signup `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"test@example.com\",\"password\":\"password123\",\"username\":\"testuser\"}'
```

**Mac/Linux:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "username": "testuser"
  }'
```

---

## 🆘 Still Not Working?

1. **Check backend is running:**
   ```
   GET http://localhost:3000/api/v1/health
   ```
   Should return: `{"status":"ok","message":"Server is running"}`

2. **Check backend logs** - Look for the debug output

3. **Try a different tool:**
   - Use **Thunder Client** (VS Code extension)
   - Use **Insomnia**
   - Use **cURL** command line

4. **Restart backend server:**
   ```bash
   cd backend
   npm start
   ```

---

**Follow these steps exactly and it will work!** 🚀


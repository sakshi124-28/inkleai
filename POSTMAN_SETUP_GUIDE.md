# Postman Setup Guide for API Testing

## Common Error: "Email, password, and username are required"

This error occurs when the request body isn't being sent correctly to the backend.

---

## ✅ Correct Postman Setup

### Step 1: Set Request Method and URL

1. **Method:** `POST`
2. **URL:** `http://localhost:3000/api/v1/auth/signup`
   - Replace `localhost:3000` with your backend URL if different

### Step 2: Set Headers

1. Click on **Headers** tab
2. Add this header:
   - **Key:** `Content-Type`
   - **Value:** `application/json`
3. Make sure it's **enabled** (checkbox checked)

### Step 3: Set Request Body

1. Click on **Body** tab
2. Select **raw** (not form-data, x-www-form-urlencoded, etc.)
3. Select **JSON** from the dropdown (should show "JSON" next to "raw")
4. Enter this JSON:

```json
{
  "email": "test@example.com",
  "password": "password123",
  "username": "testuser",
  "display_name": "Test User",
  "bio": "This is a test bio"
}
```

**Required fields:**
- `email` (string)
- `password` (string)
- `username` (string)

**Optional fields:**
- `display_name` (string) - defaults to username if not provided
- `bio` (string) - optional

---

## ❌ Common Mistakes

### Mistake 1: Wrong Body Type
- ❌ Using **form-data**
- ❌ Using **x-www-form-urlencoded**
- ✅ Use **raw** with **JSON**

### Mistake 2: Missing Content-Type Header
- ❌ No `Content-Type` header
- ✅ Add `Content-Type: application/json`

### Mistake 3: Wrong JSON Format
- ❌ Single quotes: `{ 'email': 'test@example.com' }`
- ❌ Missing quotes: `{ email: "test@example.com" }`
- ✅ Double quotes: `{ "email": "test@example.com" }`

### Mistake 4: Typo in Field Names
- ❌ `Email` (capital E)
- ❌ `EMAIL`
- ❌ `e-mail`
- ✅ `email` (lowercase)

---

## 📋 Complete Postman Request Example

### Request Configuration:

```
Method: POST
URL: http://localhost:3000/api/v1/auth/signup
Headers:
  Content-Type: application/json
Body (raw JSON):
{
  "email": "test@example.com",
  "password": "password123",
  "username": "testuser",
  "display_name": "Test User",
  "bio": "This is a test bio"
}
```

### Expected Success Response (200):

```json
{
  "message": "User created successfully",
  "user": {
    "id": "uuid-here",
    "email": "test@example.com",
    "username": "testuser",
    "display_name": "Test User",
    "bio": "This is a test bio",
    "role": "user"
  },
  "session": {
    "access_token": "token-here",
    "refresh_token": "refresh-token-here"
  }
}
```

### Error Response (400):

```json
{
  "error": "Email, password, and username are required",
  "received": {
    "email": "missing",
    "password": "missing",
    "username": "missing"
  }
}
```

---

## 🔍 Debugging Tips

### 1. Check Backend Logs

The backend now logs the request body. Check your terminal/console for:
```
Signup request body: { email: '...', password: '...', username: '...' }
Content-Type: application/json
```

If you see `{}` or `undefined`, the body isn't being parsed correctly.

### 2. Test with cURL

If Postman isn't working, test with cURL:

```bash
curl -X POST http://localhost:3000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "username": "testuser"
  }'
```

### 3. Verify Backend is Running

Test the health endpoint first:

```
GET http://localhost:3000/api/v1/health
```

Should return:
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

---

## 📝 All API Endpoints

See `API_ROUTES_FOR_POSTMAN.md` for complete API documentation.

---

## ✅ Quick Checklist

- [ ] Method is `POST`
- [ ] URL is correct (includes `/api/v1/auth/signup`)
- [ ] Headers include `Content-Type: application/json`
- [ ] Body is set to **raw** and **JSON**
- [ ] JSON has all required fields: `email`, `password`, `username`
- [ ] Field names are lowercase
- [ ] JSON syntax is correct (double quotes, commas, etc.)
- [ ] Backend server is running

---

**If you still get the error after following this guide, check the backend console logs for the actual request body received!**


# How to Add Authorization Token in Postman

## ❌ Current Error
```
{
  "error": "No token provided"
}
```

This means the `Authorization` header is missing or incorrect.

---

## ✅ Step-by-Step: Add Token in Postman

### Step 1: Copy Your Token

From your signup/login response, copy the **entire** `access_token`:

```json
{
  "session": {
    "access_token": "eyJhbGciOiJIUzI1NiIsImtpZCI6IjJsdEhVcUUzMFBBUjNnZ0YiLCJ0eXAiOiJKV1QifQ..."
  }
}
```

**Copy the ENTIRE token** (it's very long, starts with `eyJ...`)

---

### Step 2: Open Your Request in Postman

1. Create a new request (or open existing one)
2. Set method (GET, POST, etc.)
3. Set URL (e.g., `http://localhost:3000/api/v1/profiles/me`)

---

### Step 3: Add Authorization Header

1. Click **"Headers"** tab (below the URL)
2. In the **Key** field, type: `Authorization`
3. In the **Value** field, type: `Bearer ` (with a space after "Bearer")
4. Then paste your token after the space

**Format:**
```
Bearer YOUR_TOKEN_HERE
```

**Example:**
```
Bearer eyJhbGciOiJIUzI1NiIsImtpZCI6IjJsdEhVcUUzMFBBUjNnZ0YiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3h0eXllYmd0cHd0eHlpeG9mZ2ljLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiJlZTg3NmJlMy05ODY0LTQxMTMtYTk2Ni05YmFjM2JlNzQ1NTQiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzYzODc1ODk3LCJpYXQiOjE3NjM4NzIyOTcsImVtYWlsIjoidGVzdHVzZXJAZ21haWwuY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJlbWFpbCIsInByb3ZpZGVycyI6WyJlbWFpbCJdfSwidXNlcl9tZXRhZGF0YSI6eyJlbWFpbCI6InRlc3R1c2VyQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaG9uZV92ZXJpZmllZCI6ZmFsc2UsInN1YiI6ImVlODc2YmUzLTk4NjQtNDExMy1hOTY2LTliYWMzYmU3NDU1NCJ9LCJyb2xlIjoiYXV0aGVudGljYXRlZCIsImFhbCI6ImFhbDEiLCJhbXIiOlt7Im1ldGhvZCI6InBhc3N3b3JkIiwidGltZXN0YW1wIjoxNzYzODcyMjk3fV0sInNlc3Npb25faWQiOiI5NWU0MTllMy1lMWU5LTQ4YWUtYTdkYi0xNDE0NmNkZDc2Y2MiLCJpc19hbm9ueW1vdXMiOmZhbHNlfQ.bOJajo-eWlnH23GE-eXe7nzUm2zoxyJDZHAheEfiK9c
```

5. Make sure the checkbox next to it is **CHECKED** ✅
6. Press Enter or click outside

**Visual:**
```
Headers Tab:
┌─────────────────┬──────────────────────────────────────────┬─────┐
│ Key             │ Value                                    │ ✓   │
├─────────────────┼──────────────────────────────────────────┼─────┤
│ Authorization   │ Bearer eyJhbGciOiJIUzI1NiIsImtpZCI6... │ ✓   │
└─────────────────┴──────────────────────────────────────────┴─────┘
```

---

## ✅ Alternative: Use Postman's Authorization Tab

Postman has a built-in Authorization tab that's easier:

1. Click **"Authorization"** tab (next to Headers)
2. **Type:** Select **"Bearer Token"** from dropdown
3. **Token:** Paste your token (without "Bearer" - Postman adds it automatically)
4. Click **"Send"**

**Visual:**
```
Authorization Tab:
Type: [Bearer Token ▼]
Token: [Paste your token here]
```

---

## 📋 Complete Example Request

### Get My Profile

**Method:** `GET`  
**URL:** `http://localhost:3000/api/v1/profiles/me`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsImtpZCI6IjJsdEhVcUUzMFBBUjNnZ0YiLCJ0eXAiOiJKV1QifQ...
```

**OR use Authorization tab:**
- Type: `Bearer Token`
- Token: `eyJhbGciOiJIUzI1NiIsImtpZCI6IjJsdEhVcUUzMFBBUjNnZ0YiLCJ0eXAiOiJKV1QifQ...`

---

## ❌ Common Mistakes

### Mistake 1: Missing "Bearer"
```
❌ Authorization: eyJhbGciOiJIUzI1NiIs...
✅ Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### Mistake 2: No Space After "Bearer"
```
❌ Authorization: BearereyJhbGciOiJIUzI1NiIs...
✅ Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### Mistake 3: Wrong Header Name
```
❌ Auth: Bearer ...
❌ Token: Bearer ...
✅ Authorization: Bearer ...
```

### Mistake 4: Incomplete Token
```
❌ Authorization: Bearer eyJhbGciOiJIUzI1NiIs... (cut off)
✅ Authorization: Bearer eyJhbGciOiJIUzI1NiIs... (full token)
```

---

## 🧪 Test It

1. **Get Profile:**
   ```
   GET http://localhost:3000/api/v1/profiles/me
   Authorization: Bearer YOUR_TOKEN
   ```

2. **Expected Response:**
   ```json
   {
     "id": "ee876be3-9864-4113-a966-9bac3be74554",
     "username": "testuser",
     "display_name": "Test User",
     "email": "testuser@gmail.com",
     "role": "user"
   }
   ```

---

## 💡 Pro Tips

1. **Save Token as Variable:**
   - In Postman, create an environment variable `token`
   - Set it to your token value
   - Use `{{token}}` in requests

2. **Token Expires:**
   - Tokens expire after 1 hour
   - If you get "Invalid token", login again to get a new token

3. **Use Collection Variables:**
   - Set token once for all requests in a collection
   - Update it when it expires

---

## 🆘 Still Not Working?

1. **Check token is complete:**
   - Token should be very long (hundreds of characters)
   - Should start with `eyJ`

2. **Check header format:**
   - Must be exactly: `Authorization: Bearer TOKEN`
   - Case-sensitive: `Authorization` (capital A)

3. **Check token hasn't expired:**
   - Tokens expire after 1 hour
   - Get a new token by logging in again

4. **Check backend logs:**
   - Look for "Auth middleware error" in backend console
   - Should show what token was received

---

**Follow these steps and your token will work!** 🚀


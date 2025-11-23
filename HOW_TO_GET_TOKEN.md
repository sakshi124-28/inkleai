# How to Get Your Token

## 🎯 Where to Get the Token

The token comes from **signup** or **login** responses. Here's exactly where to find it:

---

## ✅ Method 1: From Signup Response

### Step 1: Sign Up First

**Request:**
```
POST http://localhost:3000/api/v1/auth/signup
Content-Type: application/json

Body:
{
  "email": "testuser@gmail.com",
  "password": "password123",
  "username": "testuser"
}
```

### Step 2: Find Token in Response

Look for the `session` object in the response:

```json
{
  "user": { ... },
  "profile": { ... },
  "session": {
    "access_token": "eyJhbGciOiJIUzI1NiIsImtpZCI6IjJsdEhVcUUzMFBBUjNnZ0YiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3h0eXllYmd0cHd0eHlpeG9mZ2ljLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiJlZTg3NmJlMy05ODY0LTQxMTMtYTk2Ni05YmFjM2JlNzQ1NTQiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzYzODc1ODk3LCJpYXQiOjE3NjM4NzIyOTcsImVtYWlsIjoidGVzdHVzZXJAZ21haWwuY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJlbWFpbCIsInByb3ZpZGVycyI6WyJlbWFpbCJdfSwidXNlcl9tZXRhZGF0YSI6eyJlbWFpbCI6InRlc3R1c2VyQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaG9uZV92ZXJpZmllZCI6ZmFsc2UsInN1YiI6ImVlODc2YmUzLTk4NjQtNDExMy1hOTY2LTliYWMzYmU3NDU1NCJ9LCJyb2xlIjoiYXV0aGVudGljYXRlZCIsImFhbCI6ImFhbDEiLCJhbXIiOlt7Im1ldGhvZCI6InBhc3N3b3JkIiwidGltZXN0YW1wIjoxNzYzODcyMjk3fV0sInNlc3Npb25faWQiOiI5NWU0MTllMy1lMWU5LTQ4YWUtYTdkYi0xNDE0NmNkZDc2Y2MiLCJpc19hbm9ueW1vdXMiOmZhbHNlfQ.bOJajo-eWlnH23GE-eXe7nzUm2zoxyJDZHAheEfiK9c",
    "token_type": "bearer",
    "expires_in": 3600,
    "refresh_token": "...",
    "user": { ... }
  }
}
```

### Step 3: Copy the Token

**Copy the value of `access_token`** - it's the long string that starts with `eyJ...`

**Example:**
```
eyJhbGciOiJIUzI1NiIsImtpZCI6IjJsdEhVcUUzMFBBUjNnZ0YiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3h0eXllYmd0cHd0eHlpeG9mZ2ljLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiJlZTg3NmJlMy05ODY0LTQxMTMtYTk2Ni05YmFjM2JlNzQ1NTQiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzYzODc1ODk3LCJpYXQiOjE3NjM4NzIyOTcsImVtYWlsIjoidGVzdHVzZXJAZ21haWwuY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJlbWFpbCIsInByb3ZpZGVycyI6WyJlbWFpbCJdfSwidXNlcl9tZXRhZGF0YSI6eyJlbWFpbCI6InRlc3R1c2VyQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaG9uZV92ZXJpZmllZCI6ZmFsc2UsInN1YiI6ImVlODc2YmUzLTk4NjQtNDExMy1hOTY2LTliYWMzYmU3NDU1NCJ9LCJyb2xlIjoiYXV0aGVudGljYXRlZCIsImFhbCI6ImFhbDEiLCJhbXIiOlt7Im1ldGhvZCI6InBhc3N3b3JkIiwidGltZXN0YW1wIjoxNzYzODcyMjk3fV0sInNlc3Npb25faWQiOiI5NWU0MTllMy1lMWU5LTQ4YWUtYTdkYi0xNDE0NmNkZDc2Y2MiLCJpc19hbm9ueW1vdXMiOmZhbHNlfQ.bOJajo-eWlnH23GE-eXe7nzUm2zoxyJDZHAheEfiK9c
```

---

## ✅ Method 2: From Login Response

If you already have an account, use login instead:

### Step 1: Login

**Request:**
```
POST http://localhost:3000/api/v1/auth/login
Content-Type: application/json

Body:
{
  "email": "testuser@gmail.com",
  "password": "password123"
}
```

### Step 2: Find Token in Response

Same as signup - look for `session.access_token`:

```json
{
  "message": "Login successful",
  "user": { ... },
  "profile": { ... },
  "session": {
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "token_type": "bearer",
    ...
  }
}
```

### Step 3: Copy the Token

Copy the `access_token` value.

---

## 📋 Visual Guide: Where to Find Token in Postman

### In Postman Response:

1. **Send your signup/login request**
2. **Look at the response** (bottom panel)
3. **Find `session` object**
4. **Look for `access_token`**
5. **Copy the entire value** (it's very long!)

**Visual:**
```
Response (JSON):
┌─────────────────────────────────────────┐
│ {                                       │
│   "user": { ... },                     │
│   "profile": { ... },                   │
│   "session": {                          │
│     "access_token": "eyJhbGciOiJIUzI1NiIsImtpZCI6IjJsdEhVcUUzMFBBUjNnZ0YiLCJ0eXAiOiJKV1QifQ..."  ← COPY THIS!
│     "token_type": "bearer",            │
│     "expires_in": 3600,                 │
│     ...                                 │
│   }                                     │
│ }                                       │
└─────────────────────────────────────────┘
```

---

## 🎯 Quick Steps Summary

1. **Sign up or login** using `/api/v1/auth/signup` or `/api/v1/auth/login`
2. **Look at the response** in Postman
3. **Find `session.access_token`** in the JSON response
4. **Copy the entire token** (starts with `eyJ...`, very long)
5. **Use it in Authorization header:** `Bearer YOUR_TOKEN_HERE`

---

## 💡 Pro Tip: Save Token in Postman

Instead of copying every time:

1. **Create Environment Variable:**
   - Click "Environments" in Postman
   - Create new environment
   - Add variable: `token`
   - Set value to your token

2. **Use in Requests:**
   - In Authorization header: `Bearer {{token}}`
   - Postman will automatically use the saved token

---

## ⚠️ Important Notes

1. **Token Expires:** Tokens expire after 1 hour. If you get "Invalid token", login again to get a new one.

2. **Full Token:** Make sure you copy the ENTIRE token - it's very long (hundreds of characters).

3. **No Quotes:** Don't include quotes when copying - just the token value itself.

4. **Bearer Prefix:** When using in Authorization header, add `Bearer ` (with space) before the token.

---

## 🧪 Test: Use Your Token

Once you have the token:

1. **New Request:**
   - Method: `GET`
   - URL: `http://localhost:3000/api/v1/profiles/me`

2. **Authorization Tab:**
   - Type: `Bearer Token`
   - Token: `[paste your token here]`

3. **Send** - Should return your profile!

---

**The token is in the `session.access_token` field of your signup/login response!** 🚀

